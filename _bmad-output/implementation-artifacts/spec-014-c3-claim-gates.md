---
title: 'FR-014 C3：领取门禁 + 兑换'
type: 'feature'
created: '2026-09-11'
status: 'done'
baseline_commit: '4a8332c6bd6f184c7ab2db373305254b4e14a128'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/stories/STORY-014-C3-claim-gates.md'
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 停权仍可能弹层；书 ID 冲突未拦；占用确认未锁「不扣次」；`normalizeKeyword` 丢掉 `bookId`。

**Approach:** 只钉 C 端详情领取链：停权 → 次数 → 选词 → 资格/占用 + 兑换。WHAT 只对 FR-014-11 / 12 / 13 / 16 / 17 / 26。Demo 闭环，不 bump `VER`。

## Boundaries & Constraints

**Always:**
- 门禁顺序不可颠倒。SVG 未画停权菱形，仍先判停权（`impl-prompts.md` L34 / L49）。
- Demo：只调 `YJD.*`，禁止 `fetch`。KEY=`fr014-yjd-v6`（store L3）。
- 0 次只开 `#buySheet`；兑换成功不自动 `openKwSheet`。不真扣积分。
- 词有 `bookId` 且 ≠ 稿件才拦。无 `bookId` 只按项目。不改 seed。
- e2e 只追加不删。跨页 `embed=1`。复用 `.btn-primary` / `.toast` / `.kw-sheet`。
- 不改 FR-001 / 002 / 012 / 013。

**Ask First:** 不改 seed / 不 evaluate 就写不出 e2e、必须 bump `VER` 时再问。本刀不应走到。

**Never:** 不改广场宫格、详情铺陈、回填、超时任务、水印、后台七菜单、H5/PC/api、节点表、`yijian-daifa-impl-prompts.js`。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 停权 | `?screen=banned` 后 `startClaim()` | 按钮「已被停权，无法领取」 | `#kwSheet`/`#buySheet` 无 `show`，次数不变 |
| 0 次 | `free+bought=0` 点领取 | 只开 `#buySheet` | `#kwSheet` 不开，不扣次 |
| 兑换成功 | 选在售档点「兑换」 | `bought+=times`，关兑换，刷新次数 | `#kwSheet` 仍关 |
| 未选词 | 选词浮层直接确定 | toast「请先选择该项目已通过的关键关键词」 | 不扣次、不开 loading |
| 书 ID 不一致 | evaluate 给「掌心宠溺」挂 `bookId:'999'` 后确认 | toast「请选择与该稿件书籍一致的已通过关键词」 | 不扣次。不改 seed |
| 占用中 | `M-01` `occ=占用中` 后选词确认 | toast「稿件已被占用」 | 不扣次、不写 claim |
| 领取成功 | 门禁全过 | 原子写占用+先 free 后 bought+未回填+快照+3d/7d | 失败不 `persistFe`；不拉抖音 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-store.js` — `normalizeKeyword` 188–191 现丢 `bookId`；`claimableKeywords` 196–199 仍返回名字数组；缺则 export `keywordBookConflict`；`applyFreeDay` 44–53；`plazaEligible` 726–735；`YJD` 出口 998–1084。不 bump VER。
- `demo/iteration/yijian-daifa-demo.html` — `startClaim` 1813–1818；`confirmBuy` 1315–1325 禁止再开选词；`confirmKw` 1874–1887；`finishClaim` 1820–1841 失败不 persist；`claimBlockReason` 1804–1811；`#goClaim` 707 / 2028；`#kwSheet` 594–607；`#buySheet` 608–616。
- `tests/e2e/test_yijian_daifa.py` — 未选词/成功 51–61；兑换不自动选词 91–103；停权文案 348–349 须补 `startClaim()`；0 次 1253–1262；资格不扣次 1170–1177。书 ID / 占用中只追加。
- WHAT 行：`impl-prompts.md` L49、L52–L56。故事：`stories/STORY-014-C3-claim-gates.md`。

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/test_yijian_daifa.py` -- 追加停权不弹层、书 ID 拦截、占用中不扣次 -- 红先于绿，不删旧断言
- [x] `demo/iteration/yijian-daifa-store.js` -- `normalizeKeyword` 保留 `bookId`；export `keywordBookConflict` -- 名字数组形状不变
- [x] `demo/iteration/yijian-daifa-demo.html` -- `startClaim`/`confirmKw`/`finishClaim` 按门禁重跑；`confirmBuy` 不自动选词 -- 失败不 persist

**Acceptance Criteria:**
- Given 停权，when `startClaim()`，then 无浮层且次数不变。
- Given 词带不等 `bookId`，when 确认，then 合同书 ID toast 且不扣次。
- Given 占用中，when 选词确认，then「稿件已被占用」且不扣次。
- Given 门禁全过，when loading 结束，then 一次 persist 写占用+扣次+未回填。
- Given 旧领取/兑换/0 次用例，when 跑全文件，then 全绿。

## Spec Change Log

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q` -- expected: 全绿（含新增三行）

**Manual checks (if no CLI):**
- `?screen=banned` 点领取不弹层；`?screen=buy` 兑换后不自动选词；详情领取主路径停在已领。

## Suggested Review Order

**门禁顺序**

- 入口先停权关层，有次才开选词并先关兑换
  [`yijian-daifa-demo.html:1826`](../../demo/iteration/yijian-daifa-demo.html#L1826)

- 确认瞬间仍按停权 → 次数 → 词/书 ID → 占用
  [`yijian-daifa-demo.html:1899`](../../demo/iteration/yijian-daifa-demo.html#L1899)

- 成功才一次 persist；失败不写
  [`yijian-daifa-demo.html:1840`](../../demo/iteration/yijian-daifa-demo.html#L1840)

**书 ID**

- 保留词上 `bookId`，名字数组形状不变
  [`yijian-daifa-store.js:190`](../../demo/iteration/yijian-daifa-store.js#L190)

- 词有 `bookId` 且 ≠ 稿件才冲突
  [`yijian-daifa-store.js:203`](../../demo/iteration/yijian-daifa-store.js#L203)

**测试**

- 停权 `startClaim()` 不弹层
  [`test_yijian_daifa.py:350`](../../tests/e2e/test_yijian_daifa.py#L350)

- 书 ID `999` 拦截不扣次
  [`test_yijian_daifa.py:1564`](../../tests/e2e/test_yijian_daifa.py#L1564)

- 占用中不扣次、不写 claim
  [`test_yijian_daifa.py:1582`](../../tests/e2e/test_yijian_daifa.py#L1582)
