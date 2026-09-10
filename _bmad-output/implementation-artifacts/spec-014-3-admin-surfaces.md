---
title: 'FR-014 一键代发：后台列表增量与先选词再领取'
type: 'feature'
created: '2026-09-10'
status: 'done'
baseline_commit: '17d3056c8c27fcebc3334e9ab165933ff2a55e13'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/surfaces.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 后台领取/稿件/项目/次数/剪辑手列表与刚锁的 CAP-5/9 不一致：项目还在维护已通过关键词，领取记录缺项目/书/剪辑手与视频链接，操作有多余「详情」，稿件无数量括号，SKU 无购买人数，剪辑手无分账统计。C 端词源仍当项目词库，且选词浮层会预填上次的词。

**Approach:** 后台按合同改列与交互；项目新增改为品牌库点选（全列、已添加拦截、去 `#pjKw`）；`STORE.keywords` 只当作用户申词 mock，C 端先选词再领、不预填。收益用现有订单分账口径做 Demo 统计与按日/月抽屉。徽标升 v8。

## Boundaries & Constraints

**Always:**
- 只改 FR-014 Demo / 规则 / 本 spec / 本 FR e2e。不 bump store `VER`（KEY=`fr014-yjd-v4`）；缺字段在 `syncFlags` 补默认。
- 领取门禁：停权 → 次数 → 选词浮层 → 资格/占用。次数不足只开兑换，不开选词。必须先选词；`openKwSheet` 不得预填 `state.kw`。
- `STORE.keywords[项目名]` = 该用户在该项目已通过申词 mock。项目弹窗不再读写它。空列表文案改为「暂无已通过申词」。
- 品牌库 `BRAND_CATALOG` 在现有 `LOGO_OPTS` 上至少多 1 个未加入项。候选列出全部（含已加入）。保存已加入 → toast「该品牌项目已添加」。编辑仍只改启用/排序，不手改名称/Logo。
- 稿件数量：图集=`imgs`，视频=1。领取回填视频链接：已回填出示 `fillVideo`，未回填为 —。操作栏只留「稿件详情」。
- 购买人数只读。剪辑手：已上传=`worksByEditor`，已被领取=`claimedWorksByEditor`；已结算=`earnByEditor`；待结算=占用中领取的 mock 分账。收益抽屉按日/按月表。
- 跨页 e2e 必须 `embed=1`。壳页 `v8 当前`；C iframe `v=21`；PC iframe `v=6`。

**Ask First:** 若必须改 seed 形状才能写 e2e，先问再 bump `VER`。

**Never:** 不改占用/24h/黑名单/审核三态/PC 三步上传。不改 FR-001/002/012/013。不新建申词产品或收益账本。不重写 `plazaEligible`。不删 `STORE.keywords` 键（只改语义与写入点）。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 领取列表 | 打开领取记录 | 列含项目名称、书籍信息、剪辑手（右豹ID+名称）；回填含视频链接；操作只有稿件详情 | 无「详情」按钮 |
| 稿件数量 | 看 M-01 | 稿件信息含 `18.6 MB (12)` | 视频稿为 `(1)` |
| 品牌新增 | 选未加入品牌 | 名称+Logo 带出并写入项目表 | N/A |
| 已添加 | 再选番茄小说 | 不写入 | toast「该品牌项目已添加」 |
| 去词字段 | 打开项目弹窗 | 无 `#pjKw` | N/A |
| SKU 人数 | 看次数商品 | 出示只读购买人数 | N/A |
| 剪辑手统计 | 看庭宇 | 已上传/已被领取/已结算/待结算有数 | N/A |
| 收益抽屉 | 点庭宇收益 | 抽屉可切按日/按月表 | N/A |
| 先选词 | 次数够后点领取 | 浮层无预选项，须点词再确认 | 未选 toast，不扣次 |
| 无申词 | 该项目 keywords=[] | 浮层空文案，不能领 | 不扣次 |
| 次数不足 | 次数=0 点领取 | 只开兑换 | 不开选词浮层 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-store.js` — KEY=`fr014-yjd-v4`，VER=4。`syncFlags` 补 `sku.buyers`、`claim.fillVideo`、占用中 `pendingEarn`；已回填强制 `pendingEarn=0`。export `pendingEarnByEditor` / `earnSeries` / `workInfoLabel` / `BRAND_CATALOG`。不 bump VER。
- `demo/iteration/fr-opc-yijian-daifa.html` — 领取表项目/书/剪辑手/回填视频，操作只留稿件详情；稿件信息 `大小 (数量)`；项目弹窗品牌库点选、无 `#pjKw`；SKU 只读购买人数；剪辑手四计数 + `openEarnDrawer(id)` 按日/月。徽标 `v8 当前`；C iframe `v=21`；PC iframe `v=6`。
- `demo/iteration/yijian-daifa-demo.html` — `currentKws` 读 `STORE.keywords[project]`；`openKwSheet` 不预填；空文案「暂无已通过申词」；`startClaim`：停权 → 次数 → 选词，资格在确认后。
- `demo/iteration/yijian-daifa-pc.html` — list 稿件信息与后台同口径（大小+数量，无下载链接）。
- `demo/iteration/yijian-daifa-rules.js` — `admin-claims`/`admin-works`/`admin-projects`/`admin-skus`/`admin-editors`/`fe-claim`/`data-main` 与合同对齐。
- `tests/e2e/test_yijian_daifa.py` — 覆盖 I/O 矩阵：领取列、稿件数量、品牌库/已添加、无 `#pjKw`、SKU 人数、庭宇统计与日/月分桶、无预填、空申词、次数不足只开兑换。跨页 `embed=1`。
- `_bmad-output/specs/spec-fr014-yijian-daifa/` — 合同已锁，本轮只在规则/Demo 漂移时回写一句，不重开 CAP。

种子：庭宇 M-06 已完成 `earn=186`；林夏 M-03 占用中可挂待结算；C-01 已回填补 `fillVideo`。`BRAND_CATALOG` 至少多 1 个未加入品牌（如「点众小说」+ logo，可复用已有 logo 文件）。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-store.js` -- `syncFlags` 补 buyers/fillVideo/pendingEarn；export 待结算与日/月序列 -- 统计与 e2e 有稳定口径
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- 五张后台表 + 品牌库弹窗 + 收益抽屉 + v8/iframe -- 运营面按合同可点
- [x] `demo/iteration/yijian-daifa-demo.html` -- 去预填、空申词文案 -- 先选词再领
- [x] `demo/iteration/yijian-daifa-pc.html` -- 稿件信息加数量括号 -- 与后台同字段
- [x] `demo/iteration/yijian-daifa-rules.js` -- 后台/领取规则改写 -- 抽屉不跟 Demo 漂
- [x] `tests/e2e/test_yijian_daifa.py` -- 覆盖 I/O 矩阵，改掉 pjKw/详情旧断言 -- 防回归

**Acceptance Criteria:**
- Given 领取记录，when 看表，then 有项目/书/剪辑手聚合与回填视频链接，操作只有稿件详情。
- Given 稿件管理，when 看图集/视频，then 大小旁为 `(张数)` / `(1)`。
- Given 添加项目，when 选未加入品牌，then 带出名称+Logo；选已加入则 toast 拦截。
- Given 项目弹窗，when 打开，then 无已通过关键词字段。
- Given 次数商品，when 看表，then 有只读购买人数。
- Given 剪辑手管理，when 看行并点收益，then 出示四计数且抽屉可切按日/按月。
- Given 次数足够，when 点领取，then 浮层无预选，必须点词才能成功；次数不足只开兑换。

## Spec Change Log

- 2026-09-10：按本 spec 落地后台五表、品牌库点选、先选词再领与 v8；e2e 覆盖 I/O 矩阵。未 bump `VER`。
- 2026-09-10 审查补丁：壳页故事/前端需求门禁改与冻结合同一致；收益抽屉改按剪辑手 id 打开；已回填清零 `pendingEarn`；领取写入书字段；按月断言 `YYYY-MM` 分桶。KEEP：不 bump VER、品牌库点选、先选词再领、五表字段。

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q` -- expected: 全绿

**Manual checks (if no CLI):**
- 后台七菜单列表字段与规则抽屉一致；C 端领取浮层无预选勾。

## Suggested Review Order

**口径与种子**

- 不 bump VER；缺字段由 syncFlags 补 buyers / fillVideo / pendingEarn
  [`yijian-daifa-store.js:171`](../../demo/iteration/yijian-daifa-store.js#L171)

- 品牌库在 LOGO_OPTS 上多「点众小说」；稿件信息统一大小+(数量)
  [`yijian-daifa-store.js:125`](../../demo/iteration/yijian-daifa-store.js#L125)

- 待结算只计占用中领取；日/月序列按 claimedAt 分桶
  [`yijian-daifa-store.js:281`](../../demo/iteration/yijian-daifa-store.js#L281)

**后台五表**

- 剪辑手行：已上传 / 已被领取 / 已结算 / 待结算，收益按 id 开抽屉
  [`fr-opc-yijian-daifa.html:2029`](../../demo/iteration/fr-opc-yijian-daifa.html#L2029)

- 稿件信息走 workInfoLabel，图集带张数、视频 (1)
  [`fr-opc-yijian-daifa.html:2104`](../../demo/iteration/fr-opc-yijian-daifa.html#L2104)

- 领取列含项目/书/剪辑手与回填视频，操作只留稿件详情
  [`fr-opc-yijian-daifa.html:2151`](../../demo/iteration/fr-opc-yijian-daifa.html#L2151)

- 新增项目从品牌库点选；已加入 toast 拦截，无 #pjKw
  [`fr-opc-yijian-daifa.html:2363`](../../demo/iteration/fr-opc-yijian-daifa.html#L2363)

- SKU 出示只读购买人数
  [`fr-opc-yijian-daifa.html:2188`](../../demo/iteration/fr-opc-yijian-daifa.html#L2188)

- 收益抽屉可切按日 / 按月表
  [`fr-opc-yijian-daifa.html:2406`](../../demo/iteration/fr-opc-yijian-daifa.html#L2406)

**先选词再领**

- 打开浮层清空预选；空列表「暂无已通过申词」
  [`yijian-daifa-demo.html:1208`](../../demo/iteration/yijian-daifa-demo.html#L1208)

- 门禁：停权 → 次数 → 选词，资格/占用在确认后
  [`yijian-daifa-demo.html:1678`](../../demo/iteration/yijian-daifa-demo.html#L1678)

- 未选词 toast 且不扣次
  [`yijian-daifa-demo.html:1735`](../../demo/iteration/yijian-daifa-demo.html#L1735)

**PC / 规则 / 版本**

- PC 列表稿件信息与后台同口径，无下载链接
  [`yijian-daifa-pc.html:509`](../../demo/iteration/yijian-daifa-pc.html#L509)

- 规则抽屉 fe-claim 门禁与合同对齐
  [`yijian-daifa-rules.js:119`](../../demo/iteration/yijian-daifa-rules.js#L119)

- 壳页徽标 v8；C iframe v=21；PC iframe v=6
  [`fr-opc-yijian-daifa.html:493`](../../demo/iteration/fr-opc-yijian-daifa.html#L493)

**测试**

- 后台五表、品牌库、统计抽屉与日/月分桶
  [`test_yijian_daifa.py:417`](../../tests/e2e/test_yijian_daifa.py#L417)

- 无预填、空申词、次数不足只开兑换
  [`test_yijian_daifa.py:753`](../../tests/e2e/test_yijian_daifa.py#L753)
