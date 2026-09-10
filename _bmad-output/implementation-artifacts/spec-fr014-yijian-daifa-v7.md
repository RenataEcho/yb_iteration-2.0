---
title: 'FR-014 一键代发：图集预览 / 分 Tab 流程 / 业务解释 / 数据交互'
type: 'feature'
created: '2026-09-10'
status: 'done'
baseline_commit: '7404a58efe5d6d49bab920d85d4621e0634c5b99'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md'
  - '{project-root}/demo/iteration/fr-agent-cert.html'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 详情图集不能放大；可视化只有一张总流程图；缺业务手册和接口契约。

**Approach:** 图集可点开放大（最多 3 张、不可保存、Demo 级防截屏）。顶层改为「业务解释 / 前端交互 / PC端 / 管理后台 / 前后端数据交互」；前端、PC、后台每个菜单各自带流程图。对齐代理迭代。

## Boundaries & Constraints

**Always:**
- 只改 FR-014 Demo / 规则 / 伴生 SPEC / 本 spec / 本 FR e2e。不改 FR-001/002/012/013。
- 仅图集可预览，最多 3 张；视频仍 5 秒试看。预览不扣次、不占用、不下载。
- 防截屏=禁右键/长按保存 + 用户水印 + 切后台模糊。规则写明真机截屏禁不掉。
- 取消顶层「业务流程」。前端=用户领取闭环；PC=剪辑手上传闭环；后台 7 菜单各一张（剪辑手/稿件/领取/黑名单/项目/素材/次数）。
- 业务解释用 `explain-layout`，给研发和运营。数据交互写将落地契约，Demo 无真实 HTTP。
- 手写 SVG，禁 Mermaid。C 端橙色；Mockup 只 iframe。版本 `v7 当前`。
- 不改门禁/占用/次数/24h/黑名单/审核。列表不展示金额。不改 Sidebar。

**Ask First:** 后台 7 张流程图若线穿框，是否允许某菜单再拆第二张。

**Never:** 系统级截屏拦截、真实接口、改领取门禁、流程图库、第 8 个后台菜单。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 图集放大 | 点详情图集素材 | 浮层最多 3 张可左右切；无保存 | 视频仍 5 秒试看 |
| 禁保存 | 预览中右键/长按 | 无保存菜单；不调下载 | N/A |
| 防截屏 | 预览中切后台再回 | 模糊 + 用户水印 | 规则声明真机不可禁 |
| 张数 | `imgs=12` | 预览 3 张；角标仍 12 | 缺 preview 用封面补齐 |
| 顶层 Tab | 打开可视化页 | 解释/前端/PC/后台/数据交互 | 无顶层「业务流程」 |
| 分端流程 | 前端/PC/某后台菜单 → 业务流程 | 该端/该菜单自己的 SVG | 旧 `?tab=flow` → 前端流程 |
| 解释 | 打开业务解释 | 背景/角色/主路径/边界/FAQ | 不写迭代平台规范 |
| 数据交互 | 打开该 Tab | 契约 + 状态异常 + 字段/接口/状态清单 | 标明 Demo 无请求 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-demo.html` — `renderDetail()` 图集只铺封面+`imgs` 角标（~1035）；仿 `#kwMask` 做 `#previewMask`；禁止预览走 `downloadManuscript()`（~1541）。
- `demo/iteration/yijian-daifa-store.js` — `work()` 无 `preview[]`；图集 M-01/03/04/06；封面 `assets/fr014/cover-m0*.jpg`。
- `demo/iteration/fr-opc-yijian-daifa.html` — 顶层 Tab ~266；`#view-flow` 单 SVG ~432；`currentTabKey`/`tabPageMap` ~1396/1494；后台 7 菜单 ~334；`v6` ~257。
- `demo/iteration/fr-agent-cert.html` — 复用 `.explain-layout` / `.module-tab-bar` / `.sub-view`。
- `tests/e2e/test_yijian_daifa.py` — `test_fr_shell_admin_and_flow` 锁 `view-flow`、五句流程文案、`v6`；改 Tab 必改测。`admin-banners` 仍为 0。
- `_bmad-output/specs/spec-fr014-yijian-daifa/{SPEC,surfaces,flows}.md` — 仍写四 Tab；同步分 Tab 流程与预览，不推翻门禁。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-store.js` -- 图集加最多 3 个本地 `preview` URL（可用现有封面凑）
- [x] `demo/iteration/yijian-daifa-demo.html` -- 图集浮层预览：≤3 张、禁保存、水印、切后台模糊
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- v7；五顶层 Tab；前端/PC/后台七菜单各挂 SVG；解释手册；数据交互契约；规则改指向
- [x] `_bmad-output/specs/spec-fr014-yijian-daifa/{SPEC,surfaces,flows}.md` -- 同步预览与 Tab 结构
- [x] `tests/e2e/test_yijian_daifa.py` -- 预览上限/禁保存；无顶层 `view-flow`；解释与数据交互；前端+一后台流程节点；`v7`

**Acceptance Criteria:**
- Given 图集详情，when 点素材，then 浮层最多 3 张且无保存/下载；视频不进浮层。
- Given 预览打开，when 右键/长按或切后台，then 不能保存；回来时模糊并有水印。
- Given 可视化页，when 看顶层 Tab，then 只有解释/前端/PC/后台/数据交互，且前端、PC、每个后台菜单都有自己的流程图。
- Given 业务解释与数据交互，when 打开，then 能讲清背景与主路径，并看到契约/状态/异常/三份清单，且标明 Demo 无真实请求。

## Spec Change Log

- 2026-09-10：按本 spec 落地 v7。图集 `preview≤3`、浮层禁保存/水印/切后台模糊；顶层改为解释/前端/PC/后台/数据交互；前端+PC+后台七菜单各挂手写 SVG；伴生 SPEC 同步预览与分 Tab 流程；e2e 覆盖矩阵并全绿。未改门禁/占用/次数/24h/黑名单。后台七张图未再拆第二张。

## Design Notes

预览默认用现有 `cover-m*.jpg` 凑 3 张。浮层仿 `#kwMask`，不新开下级页。

顶层顺序：解释 → 前端 → PC → 后台 → 数据交互。前端/PC：`场景 | 业务流程`。后台每个菜单：`列表 | 业务流程`。

数据交互三块：契约（方法/路径/请求/响应）、状态机（审核/占用/领取/黑名单）、异常（次数不足、占用、停权、未审核通过）。字段按现有 store 实体列。

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q --tb=short` -- expected: 全绿

**Manual checks:**
- 图集 3 张预览、无保存、有水印；视频仍试看。
- 五顶层 Tab 可进；前端/PC/七后台菜单流程图可滚、无斜线穿框。
- iframe 只出现在前端/PC 的场景子 Tab。

## Suggested Review Order

**图集预览**

- 详情图集入口：铺满封面，点击进浮层，角标仍是真实张数
  [`yijian-daifa-demo.html:1078`](../../demo/iteration/yijian-daifa-demo.html#L1078)

- 预览浮层：最多 3 张、水印、禁保存
  [`yijian-daifa-demo.html:547`](../../demo/iteration/yijian-daifa-demo.html#L547)

- 打开预览：hidden 时立即模糊；切屏/Esc 关闭
  [`yijian-daifa-demo.html:1170`](../../demo/iteration/yijian-daifa-demo.html#L1170)

- 用现有封面凑 3 张，空 preview 回填
  [`yijian-daifa-store.js:80`](../../demo/iteration/yijian-daifa-store.js#L80)

**可视化五 Tab**

- 顶层改为解释 / 前端 / PC / 后台 / 数据交互
  [`fr-opc-yijian-daifa.html:353`](../../demo/iteration/fr-opc-yijian-daifa.html#L353)

- 业务解释手册：背景、角色、主路径、边界、FAQ
  [`fr-opc-yijian-daifa.html:359`](../../demo/iteration/fr-opc-yijian-daifa.html#L359)

- 前端用户领取闭环
  [`fr-opc-yijian-daifa.html:500`](../../demo/iteration/fr-opc-yijian-daifa.html#L500)

- PC 剪辑手上传闭环
  [`fr-opc-yijian-daifa.html:633`](../../demo/iteration/fr-opc-yijian-daifa.html#L633)

- 后台菜单各自流程图（稿件为例）
  [`fr-opc-yijian-daifa.html:804`](../../demo/iteration/fr-opc-yijian-daifa.html#L804)

- 将落地契约、状态异常、三份清单
  [`fr-opc-yijian-daifa.html:1177`](../../demo/iteration/fr-opc-yijian-daifa.html#L1177)

**合同**

- CAP-4 预览规则与五 Tab 交付约束
  [`SPEC.md:36`](../specs/spec-fr014-yijian-daifa/SPEC.md#L36)

**测试**

- 五 Tab、分端流程、旧 `?tab=flow`
  [`test_yijian_daifa.py:128`](../../tests/e2e/test_yijian_daifa.py#L128)

- 预览上限、禁保存、模糊回来、空 preview 回填
  [`test_yijian_daifa.py:198`](../../tests/e2e/test_yijian_daifa.py#L198)
