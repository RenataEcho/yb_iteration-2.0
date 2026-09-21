---
title: 'FR-006：去掉活动外链，并按一键代发改前后端交互呈现'
type: 'feature'
created: '2026-09-17'
status: 'done'
review_loop_iteration: 0
baseline_commit: '7c8fad4c03add6d6441cff4948c2bcc13d8f5112'
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr006-activity-center/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-fr006-activity-center/visibility-rules.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 活动级外链仍在 C 端场景、流程图和合同里（点「查看」可外跳并记已参与），与后台已不再配外链冲突。页内「业务流程」仍是顶层 Tab，研发对照面不像一键代发那样挂在各端子 Tab +「前后端数据交互」。

**Approach:** 废止列表/Banner 外链需求与点击效果；「查看」一律进详情。FR Demo 按 FR-014 改呈现：前端/后台各含场景或列表、业务流程、开发提示词；顶层改出「前后端数据交互」。

## Boundaries & Constraints

**Always:**
- 列表与 Banner「查看」只进详情，不外跳、不因该点击记已参与。
- 已参与仅：本活动表单提交成功，或点击详情已配置跳转按钮。去重仍 `(user, 活动)`。
- 详情底栏 0–2 个 URL 按钮合同不变。
- 顶层 Tab：`前端交互` / `管理后台` / `前后端数据交互`。旧顶层「业务流程」取消。
- 前端二级：场景 / 业务流程 / 开发提示词。后台二级：列表 / 业务流程 / 开发提示词。
- 数据交互子页对齐 FR-014 骨架：前端需求、接口契约、状态与异常、交互清单；无真实 HTTP。
- 契约不冻结生产 URL（棕地禁止发明现网路径）；表用能力名 + 入参/出参。
- 合同回写 SPEC / glossary / visibility-rules / memlog；iteration 与 ux mockups 副本同步。
- `?tab=flow` 兼容落到前端「业务流程」。

**Ask First:** 要把详情 URL 按钮也当成外链删掉时。

**Never:** 不改礼品中心、不建设奖励管理、不把「查看」改成可配文案、不新造奖励管理 HTTP、不给活动中心接真实 fetch。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 点列表查看 | 任意显示池活动 | 进详情；不 toast 外跳 | 无 `listOutboundUrl` 分支 |
| 点 Banner 查看 | 置顶活动 | 同上进详情 | 不记已参与 |
| 已参与空/有 | 未点详情跳转且未提交表单 | 空态或仅表单/详情跳转留下的记录 | 不得因「查看」出现 a2 |
| 深链 | `?tab=flow` | 打开前端交互 → 业务流程 | `?tab=data` 打开数据交互 |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-opc-yijian-daifa.html` — 呈现蓝本：`#view-fe` 923–926 行 `module-tab-bar`（场景/业务流程/开发提示词）；`#view-data` 1740 行起 ix 子 Tab；`.sub-view` / `.ix-*` / `.impl-prompt` CSS。
- `demo/iteration/yijian-daifa-impl-prompts.js` — 复制切片：`SLICES` + `mountAll` + `[data-impl-host]`。本 FR 新建精简 `activity-center-impl-prompts.js`（切片 `c` / `admin` / `api`），不要引用 YJD。
- `demo/iteration/fr-activity-center.html` — 改 Tab：删 `#view-flow` 顶层（564 行）与场景 `list-outbound`（516–518）；`tabMap`/`tabPageMap`（1059、1477）；规则文案 666、705；流程图菱形「有跳转链接？」624–631 必须删。后台编辑页保持三组字段，无活动级外链输入。
- `demo/iteration/activity-center-demo.html` — `listOutboundUrl`、`handleListView` 657–662、`NAV`/`applyScene` 的 `list-outbound`、a2 mock 外链字段。
- `_bmad-output/specs/spec-fr006-activity-center/` — `SPEC.md` CAP-4/5、Constraints、Success signal；`glossary.md`「活动级外链」；`visibility-rules.md` §3/§5；`.memlog.md` 追加决策。
- `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/fr-activity-center.html` 与 `activity-center-demo.html` — 与 iteration 同步。
- `demo/iteration/framework-shell.html` — 仅当脚注/链到 `tab=flow` 时改兼容说明；无独立状态列义务。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/activity-center-demo.html` -- 删除外链字段、场景与外跳点击 -- C 端「查看」只进详情
- [x] `demo/iteration/fr-activity-center.html` -- 按 FR-014 重排 Tab/流程图/规则，去掉外链叙述 -- 研发对照面
- [x] `demo/iteration/activity-center-impl-prompts.js` -- 新增 C/后台/契约可复制切片 -- 开发提示词
- [x] `_bmad-output/specs/spec-fr006-activity-center/` -- 回写 CAP-4/5 与显隐 -- 合同与 Demo 一致
- [x] `_bmad-output/planning-artifacts/ux-designs/.../mockups/` 两份副本 -- 同步 iteration
- [x] `tests/e2e/test_activity_center.py` -- 覆盖 I/O 矩阵四行 -- 查看进详情、已参与空态、`?tab=flow`/`?tab=data`

**Acceptance Criteria:**
- Given 打开活动中心列表，when 点卡片或 Banner「查看」，then 进入详情且无外跳 toast。
- Given 从未提交表单、未点详情跳转，when 打开已参与，then 空态，不得因列表查看出现记录。
- Given FR 页，when 看顶层 Tab，then 为前端交互 / 管理后台 / 前后端数据交互；前端与后台均有业务流程与开发提示词。
- Given `?tab=flow`，when 打开页面，then 落在前端交互的业务流程子 Tab。

## Spec Change Log

## Design Notes

已参与场景 seed 可保留 a1（详情跳转/表单）与奖励结束活动，不要再把 a2 当作「外链已参与」。a2 改为普通进行中活动，点查看进详情。

数据交互「接口契约」用能力行（列表、详情、已参与、表单提交、后台保存），响应字段对齐 `admin-fields.md` 下发组装；奖励名单只读占位 `PLACEHOLDER_EXISTING_REWARD_MGMT`。

前端流程图主链：运营保存 → 是否显示 → 列表/Banner → 点查看进详情 → Tab 按配置出现 → 详情跳转或表单记已参与。不要再画「有活动级外链？」菱形。

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH= python3 -m pytest tests/e2e/test_activity_center.py -q` -- expected: 6 passed

**Manual checks (if no CLI):**
- `fr-activity-center.html`：无「列表外链」场景；点查看进详情。
- `?tab=fe` 可切场景/流程/提示词；`?tab=admin` 列表/流程/提示词；`?tab=data` 四个 ix 子页。
- `activity-center-demo.html?embed=1&scene=all` 点 a2 进详情而非 toast「已外跳」。

## Suggested Review Order

**废止列表外链**

- 「查看」只进详情，去掉外跳与记账分支
  [`activity-center-demo.html:653`](../../demo/iteration/activity-center-demo.html#L653)

- 合同：列表/Banner 查看不记已参与
  [`visibility-rules.md:32`](../specs/spec-fr006-activity-center/visibility-rules.md#L32)

**对照面按一键代发重排**

- 顶层改为前端 / 后台 / 前后端数据交互
  [`fr-activity-center.html:628`](../../demo/iteration/fr-activity-center.html#L628)

- 查看后不参与画成「停留详情」，不再当失败结束
  [`fr-activity-center.html:749`](../../demo/iteration/fr-activity-center.html#L749)

- 可复制 C/后台/契约切片，不引用一键代发
  [`activity-center-impl-prompts.js:10`](../../demo/iteration/activity-center-impl-prompts.js#L10)

**验收**

- 查看、已参与空态、详情 CTA、深链与顶层 Tab 禁旧业务流程
  [`test_activity_center.py:6`](../../tests/e2e/test_activity_center.py#L6)

