---
title: 'STORY-014-C3 领取门禁 + 兑换'
status: 'ready'
slice: 'C3'
---

# STORY-014-C3 · 领取门禁 + 兑换

**闭环：** Demo 闭环（store key 以代码为准：`YJD.KEY` = `fr014-yjd-v6`，`yijian-daifa-store.js` L3；`VER=6`，不 bump）  
**端 / 切片：** 只改 C 端这一刀。C3 = 停权 → 次数 → 选词 → 占用 + 积分兑换（次数不足不打开选词）。  
**禁止 fetch。** 拟 HTTP 只对照合同，本切片不实现。

## 粘贴开工（新会话直接用这一段 + 下文 8 块）

你只做 C3。先读本文件，再只打开这些行：`impl-prompts.md` L49、L52–L56；`requirements.md` 的 FR-014-11 / 12 / 13 / 16 / 17 / 26（只对号，不抄全文）。然后打开 Code Map 标行号的函数。按 §6 红→绿。不改业务规则，不改范围外文件，不 `fetch`，不 bump `VER`。做完走 §8。

## 1. 角色

你只实现 C 端 C3：详情页领取门禁 + 兑换浮层。一次这一刀。

**Intent：** 把「停权不弹层 / 0 次只兑换 / 兑完不自动选词 / 未选词与书 ID 拦截 / 占用不扣次 / 领取原子写」钉在现有函数上，不另开规则。

## 2. 指向

WHAT（只列号，不抄全文）：`requirements.md` FR-014-11 / 12 / 13 / 16 / 17 / 26。  
合同节点（名必须一致；页内 SVG 未画停权菱形，以 FR 为准）：

| 节点（与 SVG / 合同一致） | impl-prompts.md | yijian-daifa-impl-prompts.js `c.steps` |
|---------------------------|-----------------|----------------------------------------|
| 停权中?（合同补；图未画） | L49 | L24 |
| 剩余次数>0? | L52 | L27 |
| 积分买在售档 | L53 | L28 |
| 已选通过关键词? | L54 | L29 |
| 稿件空闲未占用? | L55 | L30 |
| 领取成功 · 扣次不退 | L56 | L31 |

判定 / 写 / 回 / 文案只读上表，禁止另写。

## 3. Always / Never / Ask First

**Always**
- 门禁顺序不可颠倒：停权 → 次数 → 选词 → 资格/占用。SVG 未画「停权」菱形，实现仍必须先判停权（合同 L34、js `note` L22）。
- 次数：先 `YJD.applyFreeDay`，`remain = free + bought`。0 次只开 `#buySheet`，不开 `#kwSheet`。
- 兑换成功关浮层、刷新次数，不自动 `openKwSheet`。Demo 不真扣积分。
- 确认瞬间重跑停权 / 次数 / 词仍通过（含书 ID）/ `plazaEligible` / `occ=空闲`；失败不扣次、不占用。
- 成功同一拍写入：`occ=占用中` + 先扣 free 后 bought + claim=未回填 + 分成快照 + `expireAt=+3d` + 首次 `ossExpireAt=+7d`；失败不 `persistFe`。
- Demo：只调 `YJD.*` / 页内函数。不改 FR-001 / 002 / 012 / 013。
- 复用已有 `.btn-primary` / `.btn-ghost` / `.toast` / `.kw-sheet`（§九；C 端浮层沿用 `#kwSheet` `#buySheet`，不新造 modal）。
- e2e 只追加不删。跨页 `embed=1`。
- 书 ID：`normalizeKeyword` 保留已有 `bookId`（无则仍无）。不改 seed、不 bump `VER`。`claimableKeywords` 仍返回名字数组。比对用完整词对象：词有 `bookId` 且 ≠ 稿件 `bookId` 才拦。e2e 用 `page.evaluate` 临时挂字段。

**Never**
- 不停权解禁、不写 `strikes+1`、不跑 24h 超时任务、不改回填/水印/广场宫格/详情铺陈。
- 不拆 C 端另外三刀，不拆后台七菜单，不改 H5/PC/api 切片。
- 不改 `requirements.md` / `impl-prompts.md` 节点表 / `yijian-daifa-impl-prompts.js`。
- 不 `fetch`、不 bump `VER`、不把 localStorage 当接口文档。
- 不重定义 FR-013 申词模型；无 `bookId` 的词只按项目。

**Ask First**
- 仅当不改 seed / 不 evaluate 就写不出 e2e、必须 bump `VER` 时再问。本刀不应走到这里。

## 4. Code Map

| 文件 | 函数 / 锚点 | 行号 | 复用 class | 本切片做什么 |
|------|-------------|------|------------|--------------|
| `yijian-daifa-demo.html` | `#goClaim` 绑定 `startClaim` | L707 / L2028 | `.btn-primary` | 入口；停权文案见 L1164–1169 |
| 同上 | `#kwSheet` / `#confirmKw` | L594–607 | `.kw-sheet` `.btn-primary` | 选词浮层 |
| 同上 | `#buySheet` / `#confirmBuy` | L608–616 | `.kw-sheet` `.btn-primary` | 兑换；按钮文案「兑换」 |
| 同上 | `#toast` | L580 | `.toast` | 全部拦截/成功文案 |
| 同上 | `quota` / `persistFe` | L926 / L916–922 | — | remain；回写 `user.free/bought/banned` |
| 同上 | `claimBlockReason` | L1804–1811 | — | banned → 次数 → `plazaEligible(idle)` → occ |
| 同上 | `startClaim` | L1813–1818 | — | 停权：toast、不打开任何浮层；0 次：`openBuySheet`；否则 `openKwSheet` |
| 同上 | `openBuySheet` / `closeBuySheet` | L1286–1291 / L1280–1284 | `.kw-sheet` | 兑完只关兑换，不连带开选词 |
| 同上 | `skuPriceLine` / `renderBuy` | L1296–1314 | `s.orig` | `origPoints>points` 才划线；在售 `s.on` 后 `slice(0,4)` |
| 同上 | `confirmBuy` | L1315–1325 | `.toast` | `bought+=times`；关浮层刷新次数；**禁止**再 `openKwSheet` |
| 同上 | `openKwSheet` / `currentKws` | L1266–1274 / L1248–1253 | `.kw-row` | `kwPick=''` 无默认带入；只列 `YJD.claimableKeywords` |
| 同上 | `confirmKw` | L1874–1887 | `.toast` | 未选 toast；书 ID 冲突走合同文案；通过才 `runClaimLoading` |
| 同上 | `runClaimLoading` | L1843–1872 | `#loadMask` | 三态文案；不拉 `#dySheet` |
| 同上 | `finishClaim` | L1820–1841 | `.toast` | 重跑门禁；失败 return；成功原子写 |
| 同上 | `makeClaim` / `attachClaim` | L1417–1452 | — | 未回填 + `shareSnapshot` + `bindClaimOss` |
| 同上 | 启动 / `rebindFe` `applyFreeDay` | L817–818 / L896–898 | — | 算次前先跑免费日 |
| 同上 | `applyScene('banned'/'buy')` | L1939–1952 | — | QA 场景；勿改成自动选词 |
| `yijian-daifa-store.js` | `KEY` / `applyFreeDay` | L3 / L44–53 | — | key 以代码为准；跨日重置 free，bought 不重置 |
| 同上 | `user` / `skus` / `claims` | L135 / L95–100 / L101–129 | — | 读停权、档位、领取列表 |
| 同上 | `CLAIMABLE_KW_STATUS` / `claimableKeywords` / `isClaimableKeyword` | L184–203 | — | 仅「审核通过待发布\|已回填」 |
| 同上 | `kw` / `normalizeKeyword` / `projectKeywords` | L185–195 | — | 保留 `bookId`；不改 `claimableKeywords` 名字数组形状。缺 lookup 则 export `YJD.keywordBookConflict(data, project, name, workBookId)` |
| 同上 | `plazaEligible` | L726–735 | — | 确认时资格；缺记录即不合格 |
| 同上 | `editorByName` | L966–968 | — | 分成快照 |
| 同上 | `bindClaimOss` / `clientExpireAt` / `ossExpireAtFrom` | L352–358 / L320–322 / L324–326 | — | +7d / +3d |
| 同上 | `onSaleCount` | L982–984 | — | 在售≤4 对照；兑换读 `STORE.skus` |
| 同上 | `YJD` 出口 | L998–1084 | — | 只调已 export 的函数 |
| `test_yijian_daifa.py` | 未选词 / 领取成功 | L51–61 | — | 只追加不删 |
| 同上 | 兑换成功不自动选词 | L91–103 | — | `#kwSheet` 保持关 |
| 同上 | 停权按钮文案 | L348–349 | — | 须补：点领取不打开浮层 |
| 同上 | 0 次只开兑换 | L1253–1262 / L265–274 | — | 已有 |
| 同上 | 资格失败不扣次 | L1170–1177 | — | 已有；占用中不扣次须补 |
| 同上 | 先扣 free | L255–261 | — | 已有 |

## 5. 接口 I/O（Demo）

调用，禁止 `fetch`：

| 时机 | 调用 | 写 store |
|------|------|----------|
| 算次前 | `YJD.applyFreeDay(STORE)` | `user.free` / `user.freeDate`（跨日） |
| 资格 | `YJD.plazaEligible(STORE, idle副本)` | 不写 |
| 选词列表 / 校验 | `YJD.claimableKeywords` / `YJD.isClaimableKeyword` | 不写 |
| 兑换 | 页内 `confirmBuy`（`STORE.skus` 在售档） | `user.bought += times` → `persistFe` → `YJD.save` |
| 领取成功 | `attachClaim` → `YJD.bindClaimOss`；`YJD.editorByName` 快照；`YJD.clientExpireAt` | `works[].occ=占用中`；`user.free` 然后 `bought`；`claims.unshift` 未回填 |
| 失败 | 无 | 不 `persistFe` |

拟接口（对照合同，不实现）：`POST /api/yjd/skus/:id/redeem`；`POST /api/yjd/claims` + idempotencyKey。

## 6. Tasks（红 → 绿，按序）

- [ ] RED：`test_timeout_and_banned_scenes`（`?screen=banned`）追加 `page.evaluate("startClaim()")` → `#kwSheet`/`#buySheet` 都无 `show`，`#claimQuotaFoot` 不变
- [ ] RED：新用例或追加：详情页 `evaluate` 给「掌心宠溺」挂 `bookId:'999'`（稿件是 `7128491023`）→ 打开选词点该词 `#confirmKw` → toast「请选择与该稿件书籍一致的已通过关键词」，次数不变。不改 seed
- [ ] RED：详情页 `evaluate` `item('M-01').occ='占用中'; item('M-01').occupied=true` 后 `startClaim()` → 选词确认 → toast「稿件已被占用」，`#claimQuotaFoot` 不变
- [ ] GREEN：`normalizeKeyword` 保留 `bookId`；`confirmKw`/`finishClaim` 调 lookup（可新 export `YJD.keywordBookConflict`）
- [ ] GREEN：`startClaim` 先停权（不打开任何浮层）再 0 次 `openBuySheet`，次数够才 `openKwSheet`
- [ ] GREEN：`confirmBuy` 只加 `bought`、关兑换、刷新次数；不调用 `openKwSheet` / `renderClaim`
- [ ] GREEN：`finishClaim` 重跑 `claimBlockReason` + 词/书 ID；失败不 `persistFe`；成功一次 persist
- [ ] 旧 e2e 全绿后再留新断言。不改 §九 以外的 class

## 7. I/O 矩阵

| Given | When | Then | Error |
|-------|------|------|-------|
| `user.banned` 或黑名单停权中 | 点 `#goClaim` / 调 `startClaim` | 按钮「已被停权，无法领取」；停在详情 | 不打开 `#kwSheet` / `#buySheet`；不扣次 |
| `free+bought=0`（已 `applyFreeDay`） | 点领取 | 只开 `#buySheet` | `#kwSheet` 无 `show`；不扣次 |
| 兑换浮层选中在售档 | 点「兑换」 | `bought+=times`；关兑换；刷新 `#claimQuotaFoot` | 关浮层后 `#kwSheet` 仍关（不自动选词）。Demo 不扣积分 |
| 次数>0，选词浮层未点词 | 点 `#confirmKw` | toast「请先选择该项目已通过的关键关键词」 | 不扣次、不占用、不开 loading |
| 已选词且词带 `bookId` ≠ 稿件 `bookId` | 确认领取 | toast「请选择与该稿件书籍一致的已通过关键词」 | 不扣次。词无 `bookId` 只按项目（不重定义 FR-013） |
| 确认瞬间 `occ=占用中` 或 `occupied` | 选词确认 | toast「稿件已被占用」 | 不扣次、不写 claim |
| 确认瞬间 `plazaEligible` 假 | 选词确认 | toast「稿件当前不可领」 | 不扣次（已有 e2e L1170–1177） |
| 门禁全过 | loading 三态结束 | `occ=占用中`；先 free 后 bought；claim 未回填 + 快照 + `expireAt=+3d`；首次 `ossExpireAt=+7d`；停在详情已领 | 任一步失败不 persist；不拉抖音 |

## 8. 验收

- FR-014-11 / 12 / 13 / 16（占用拦截 + 成功占用）/ 17（本刀只消费停权态）/ 26（本刀只消费在售档与划线）。浏览器点通：`?screen=banned`、`?screen=buy`、详情领取主路径。
- e2e：`test_yijian_daifa.py` 上表已有行保持绿；红任务三行只追加。
- 本刀节点以外一律不动（广场宫格、详情铺陈、回填、超时任务、水印、后台、H5、PC）。
