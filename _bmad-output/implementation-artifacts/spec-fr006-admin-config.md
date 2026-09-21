---
title: 'FR-006：活动中心管理后台配置调整'
type: 'feature'
created: '2026-09-17'
status: 'done'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/specs/spec-fr006-activity-center/admin-fields.md'
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 后台编辑字段仍按旧合同（赛道绑项目单选、仅视频案例、跳转含 form/列表外链），与运营要配的基础信息、两条 URL 跳转、详情三块不一致。

**Approach:** 把活动编辑页收成三组：基础信息、活动跳转、活动详情；赛道/项目对接现有 list（项目多选）；跳转仅名称+地址，未配前端不按钮；案例改图+视频附件。

## Boundaries & Constraints

**Always:**
- 编辑页分组顺序：基础信息 → 活动跳转 → 活动详情。
- 赛道下拉 = 现有赛道 list（Demo 用 `ONLINE_TRACKS` 占位）。
- 项目下拉 = 现有项目 list，多选，不依赖先选赛道。
- 跳转 1/2：仅「按钮名称 + 跳转地址」；名称与地址都非空才算已配置；C 端只渲染已配置的按钮。
- 案例：附件可图可视频；≥1 才出案例 Tab。
- 榜单：开/关；关则无榜单 Tab。
- 介绍：富文本；有正文才出介绍 Tab。
- 保留显示/隐藏、置顶（C 端可见池与 Banner 仍需要）。

**Ask First:** 要删掉列表「查看」固定文案、或把跳转改成列表外跳而不是详情底栏时。

**Never:** 不改礼品中心；不建设奖励管理；不把跳转类型做成 form；不为案例发明标题/封面/正文合同字段。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 跳转未配 | 名称或地址空 | C 端不渲染该按钮；两条都空则无底栏 | 不拦保存 |
| 跳转配 1 条 | 仅跳转1 齐全 | 详情底栏 1 个按钮 | 半填不当已配置 |
| 项目多选 | 勾选 2 个项目 | 列表/预览展示多个项目名 | 未选显示 `-` |
| 案例图+视频 | 上传 jpg 与 mp4 | 案例 Tab 出现，按序展示 | 0 附件无 Tab |
| 榜单关 | 开关关 | 无榜单 Tab | 保存成功 |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-activity-center.html` — 管理后台编辑表 `#activityForm`、`ACTIVITY_ROWS`、`collectActivityForm`、预览 `updatePreview`、规则抽屉 `rule-admin`。
- `demo/iteration/activity-center-demo.html` — C 端 `ACTIVITIES`、`existingTabs`、`detailCta`、案例渲染。
- `_bmad-output/specs/spec-fr006-activity-center/admin-fields.md` — 后台字段合同。
- `_bmad-output/specs/spec-fr006-activity-center/visibility-rules.md` — 跳转与案例显隐。
- `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/` — 与 iteration Demo 同步的副本。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/fr-activity-center.html` -- 重排编辑三组字段并改保存/预览 -- 对齐运营配置
- [x] `demo/iteration/activity-center-demo.html` -- 标签、多项目、图+视频案例、URL 跳转显隐 -- C 端合同
- [x] `_bmad-output/specs/spec-fr006-activity-center/admin-fields.md` -- 回写字段表 -- 合同与 Demo 一致
- [x] `_bmad-output/specs/spec-fr006-activity-center/visibility-rules.md` -- 跳转与案例规则 -- 未配不按钮

**Acceptance Criteria:**
- Given 打开新增/编辑，when 看左栏，then 依次为标题/标签/平台/赛道/项目多选/周期/浏览量/参加人数、跳转1-2、介绍富文本/案例附件/榜单开关。
- Given 跳转只填名称或只填地址，when 看预览与 C 端，then 该按钮不出现。
- Given 上传图片与视频，when 预览案例，then 案例 Tab 出现。
- Given 项目多选，when 保存，then 列表项目列展示全部已选。

## Spec Change Log

## Design Notes

跳转落在详情底栏，列表「查看」仍进详情。活动级外链 Mock（`listOutboundUrl`）已由后续增量废止，勿恢复。

## Verification

**Manual checks (if no CLI):**
- `fr-activity-center.html?tab=admin` 新增并编辑一条：多选项目、只配跳转1、上传图+视频、关榜单；预览按钮/Tab 与保存后列表一致。
- `activity-center-demo.html` 详情底栏：未配按钮的活动无 CTA；配了的只出 URL 按钮。
