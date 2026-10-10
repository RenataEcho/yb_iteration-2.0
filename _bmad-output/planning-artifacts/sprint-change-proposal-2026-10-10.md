---
title: Sprint Change Proposal — 撤回代发运营合作模式
date: 2026-10-10
status: approved
mode: batch
change_trigger: 删除需求「代发运营合作模式」（FR-022 / prd-YBDD2.0-2026-10-09）
scope: moderate
---

# Sprint Change Proposal：撤回「代发运营合作模式」

## 1. Issue Summary

2026-10-10，CoCo 要求删掉需求「代发运营合作模式」。

这条需求是 2026-10-09 新开的侧边增量，PRD 仍为草稿，没有独立史诗，也没有冲刺跟踪文件。规格 `spec-fr022-daifa-ops-mode.md` 已标完成，侧栏已挂 FR-022，用户端、剪辑手 PC、管理后台演示页和两份端到端测试都已落地。`deferred-work.md` 里还留着海外快捷题词未做。

这次删除的是这条侧边增量本身。一键代发迭代 3.0（FR-020，`prd-YBDD2.0-2026-09-28`）里已经写过的帐号运营、任务协作、代运营合作模式，不在删除范围内。

## 2. Impact Analysis

### Epic

- 仓库里唯一的史诗文件是 `epics-FR-021-2026-10-07.md`，只覆盖创作者首页 2.0 优化。里面没有 FR-022。
- 没有 `sprint-status.yaml`。清单 6.4 不适用。
- FR-021 的顺序和优先级不变。不需要新史诗来补这个缺口。

### Story

- 已完成并要撤回的实现故事：`spec-fr022-daifa-ops-mode.md`（广场与领取；其后 PC 与后台也接到了同一组页面）。
- 未做、随需求一起取消：海外故事 / 海外短剧的快捷题词跳转。
- FR-020 规格 `spec-fr020-iter3-biz-flows.md` 保持有效，只改掉「不改 2026-10-09 代发运营合作模式」这句过期约束。

### 产物冲突

| 产物 | 影响 |
|---|---|
| PRD `prd-YBDD2.0-2026-10-09` | 整份撤回。状态从 `draft` 改为 `withdrawn`。正文保留作记录。 |
| PRD `prd-YBDD2.0-2026-09-28` | 三处「不改 2026-10-09 代发运营合作模式 PRD」改为「该 PRD 已撤回」。帐号运营条款不动。 |
| 架构 `architecture-fr021-YBDD2.0-2026-10-07` | 无冲突。不改。 |
| UX `ux-YBDD2.0-2026-10-09` | 主题是「一键代发 3.0 · 剪辑手 PC」，不是 FR-022 专属设计。不删文件夹。只去掉对已撤回 PRD、规格和 `yijian-daifa-ops-pc.html` 的来源引用。 |
| 规格 `spec-fr022-daifa-ops-mode.md` | 状态改为 `withdrawn`。 |
| `deferred-work.md` | 删掉 6 条 `source_spec` 指向该规格的条目。 |
| 侧栏 `sidebar-nav.js` | 删掉 FR-022 这一项。 |
| 演示页与测试 | 删掉 FR-022 专属文件。代发 1.0 四个原文件不改。 |

### 技术影响

专属文件：

- `demo/iteration/fr-yijian-daifa-ops.html`
- `demo/iteration/yijian-daifa-ops-demo.html`
- `demo/iteration/yijian-daifa-ops-pc.html`
- `demo/iteration/yijian-daifa-ops-store.js`
- `demo/iteration/fr-opc-yijian-daifa-ops.html`
- `tests/e2e/test_fr022_ops_claim.py`
- `tests/e2e/test_fr022_ops_pc_admin.py`

存储键 `fr022-yjd-ops-v1` 只存在于上述 store，删页后不再被读写。代发 1.0 的 `fr014-yjd-v6` 不动。

明确不改：

- `demo/iteration/yijian-daifa-demo.html`
- `demo/iteration/yijian-daifa-pc.html`
- `demo/iteration/fr-opc-yijian-daifa.html`
- `demo/iteration/yijian-daifa-store.js`
- `demo/iteration/fr-yijian-daifa-iter3.html` 及 FR-020 其它页面
- FR-021 架构与史诗

## 3. Recommended Approach

选定路径：**回滚已完成的 FR-022 实现，并撤回这份草稿 PRD。** 不是在现有故事上改范围。

| 选项 | 结论 | 工作量 | 风险 |
|---|---|---|---|
| 直接调整现有故事 | 不可行。目标是删掉整条需求，不是改验收。 | — | — |
| 回滚已完成实现 | 可行，而且必要。页面、测试、侧栏都要撤。 | 低 | 低。这些文件是复制出来的，不回写 1.0。 |
| 重审 MVP | 可行，而且必要。这份 PRD 的 MVP 整段取消。迭代 3.0 的 MVP 保持。 | 低 | 中。3.0 的剪辑手 PC 体验稿还引用了即将删除的 ops 页，必须同一批改掉来源，否则设计稿指向空文件。 |

理由：PRD 从未定稿，没有史诗，也没有线上合同依赖它。留下侧栏入口会让人以为这条需求还在做。海外题词未做，取消它没有返工。

工作量：低。风险：中，集中在误删迭代 3.0 的帐号运营。时间：批准后一轮实现即可。

## 4. Detailed Change Proposals

### 4.1 PRD `prd-YBDD2.0-2026-10-09/prd.md`

Section: front matter `status`，以及标题下增加撤回说明。正文条款不改写。

OLD:

```yaml
status: draft
```

NEW:

```yaml
status: withdrawn
updated: 2026-10-10
```

在 `# PRD: 代发运营合作模式` 之下增加：

> 2026-10-10 撤回。这条侧边增量不再实施。下文仅保留当时的草稿，不作为构建合同。迭代 3.0（`prd-YBDD2.0-2026-09-28`）里的帐号运营与任务协作继续有效。

`addendum.md` 与 `.memlog.md` 各追加一条同日记录，不改历史条目。

### 4.2 规格 `spec-fr022-daifa-ops-mode.md`

Section: front matter `status`

OLD:

```yaml
status: 'done'
```

NEW:

```yaml
status: 'withdrawn'
```

在 Intent 之前加一句：2026-10-10 随需求撤回。专属演示页、测试和侧栏入口在同一变更里删除。

### 4.3 侧栏 `demo/iteration/sidebar-nav.js`

Section: 进行中需求列表，FR-021 之后的一项。

OLD:

```js
{ id: 'fr-creator-home-2-opt', label: '2.0优化', href: 'fr-creator-home-2-opt.html', fr: 'FR-021', defaultStatus: 'todo' },
{ id: 'fr-yijian-daifa-ops', label: '代发运营合作模式', href: 'fr-yijian-daifa-ops.html', fr: 'FR-022', defaultStatus: 'todo' }
```

NEW:

```js
{ id: 'fr-creator-home-2-opt', label: '2.0优化', href: 'fr-creator-home-2-opt.html', fr: 'FR-021', defaultStatus: 'todo' }
```

### 4.4 删除专属实现

删除第 2 节列出的 5 个演示文件和 2 个测试文件。不改代发 1.0 四个原文件。

### 4.5 `deferred-work.md`

删除 `source_spec` 为 `spec-fr022-daifa-ops-mode.md` 的 6 条（约第 61–83 行）。其中包括已接到页面的上传 / 回填记录，以及仍未做的海外快捷题词。其它规格的延后项保留。

### 4.6 PRD `prd-YBDD2.0-2026-09-28/prd.md`

三处只改「不改那份 PRD」的从句。帐号运营行为不动。

**FR-8**

OLD:

> 只改本迭代页的任务协作前端领取。不改帐号运营，不改 2026-10-09 代发运营合作模式 PRD。

NEW:

> 只改本迭代页的任务协作前端领取。不改帐号运营。2026-10-09 代发运营合作模式已撤回，不再作为合同。

**§9 词的来源**

OLD:

> 这条只改任务协作前端领取，不改帐号运营，不改 2026-10-09 代发运营合作模式 PRD。

NEW:

> 这条只改任务协作前端领取，不改帐号运营。2026-10-09 代发运营合作模式已撤回，不再作为合同。

**§11 末段**

OLD:

> 帐号运营不改。2026-10-09 代发运营合作模式 PRD 不改。

NEW:

> 帐号运营不改。2026-10-09 代发运营合作模式已撤回，不再作为合同。

`.memlog.md` 追加一条 2026-10-10 事件，不改写 2026-10-10 那条历史 override。

### 4.7 规格 `spec-fr020-iter3-biz-flows.md`

Section: Approach

OLD:

> 不改历史迭代页，不改 2026-10-09 代发运营合作模式。

NEW:

> 不改历史迭代页。2026-10-09 代发运营合作模式已撤回，本规格不依赖它。

### 4.8 UX `ux-YBDD2.0-2026-10-09`

`DESIGN.md` 与 `EXPERIENCE.md` 的 `sources` 去掉这三项：

- `demo/iteration/yijian-daifa-ops-pc.html`
- `_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-09/prd.md`
- `_bmad-output/implementation-artifacts/spec-fr022-daifa-ops-mode.md`

`DESIGN.md` Brand & Style 的假设句：

OLD:

> 视觉以 `demo/iteration/yijian-daifa-pc.html` 的 `:root` 和上传弹窗为准；运营模式字段的位置对照 `yijian-daifa-ops-pc.html`。

NEW:

> 视觉以 `demo/iteration/yijian-daifa-pc.html` 的 `:root` 和上传弹窗为准。运营模式字段沿用这份 PC 页已有字段的位置。

体验正文里的运营模式、帐号运营、任务协作是迭代 3.0 剪辑手 PC 的行为，保留。`.memlog.md` 追加撤回来源的记录，不改历史口述。

## 5. Implementation Handoff

**范围：中等。** 需要记下需求撤回，并改文档、删页面。不需要重做架构，也不需要产品经理重开 PRD。

| 角色 | 职责 |
|---|---|
| 产品负责人 | 确认撤回边界：只撤 FR-022，保留迭代 3.0 的帐号运营与任务协作。 |
| 开发（`bmad-build`） | 按第 4 节改状态、删文件、改交叉引用、改侧栏。 |

成功标准：

1. 侧栏不再出现「代发运营合作模式」。
2. 第 4.4 节的 7 个文件不存在。
3. 代发 1.0 四个原文件相对这次变更没有 diff。
4. `prd-YBDD2.0-2026-10-09/prd.md` 与 `spec-fr022-daifa-ops-mode.md` 的状态为 `withdrawn`。
5. `deferred-work.md` 不再引用该规格。
6. 迭代 3.0 PRD 与 `spec-fr020` 不再把 2026-10-09 PRD 写成仍须遵守的合同。
7. UX 2026-10-09 仍在，且不再引用已删除的 `yijian-daifa-ops-pc.html`。

2026-10-10 CoCo 批准后已按第 4 节实施。

## Checklist

- [x] 1.1–1.3 触发、问题、证据
- [x] 2.1–2.5 史诗：FR-022 无史诗；FR-021 不受影响
- [x] 3.1 PRD 整份撤回；3.0 PRD 只改交叉引用
- [x] 3.2 架构不适用
- [x] 3.3 UX 只改来源，不删 3.0 剪辑手 PC 体验
- [x] 3.4 侧栏、测试、延后项
- [x] 4.1 直接调整不可行；4.2 回滚可行；4.3 撤回该 MVP 可行
- [x] 4.4 选定回滚加撤回
- [x] 5.1–5.5 提案各节
- [x] 6.3 2026-10-10 CoCo 批准继续实施
- [N/A] 6.4 无 sprint-status.yaml
