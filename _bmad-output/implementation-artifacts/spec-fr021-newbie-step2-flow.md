---
title: '新手学院 STEP 2 业务流程 Tab'
type: 'feature'
created: '2026-10-11'
status: 'done'
baseline_commit: 'f2dad0582655192542eab1393d5023032d223f49'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/ITERATION-FR-GUIDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `fr-creator-home-2-opt.html` 只有前端交互和管理后台。新手学院 STEP 2 的选项目、领词、备稿、回填，以及词不够、稿不够和第一次完成，没有一张给研发看的闭环图。

**Approach:** 增加顶层「业务流程」（`?tab=flow`），只手写一张 SVG。节点只用「C端·新手学院」和 PRD D-15 里已有的说法。规则抽屉用一句话指向这个 Tab。

## Boundaries & Constraints

**Always:**
- 一张图。指南 §四 18–22、33、48：正交折线、`flow-edges` 在下、一菱形一问题、是绿否红、独立 marker、底部图例、面板 `max-height: 72vh`。不使用 Mermaid，不挂「流程1」，不加 `&flow=`。
- 完成弹层只有「做得好，第一次发布完成啦！」，副文案「本次回填待审核」。
- 稿件不足只用现有按钮「我知道了」「改用自己的稿件」。次数不足沿用现有领取（toast「次数不足，请先兑换领取次数」）。
- 领词前的「稍后再说」，以及完成后的「稍后再去」，接到「选择项目」顶边。领词之后的重试接到「准备发布稿件」顶边，因为领词后不能更换项目。
- `?tab=flow` 打开本 Tab；`admin` 仍进后台；缺省和其他值进前端。点击三个 Tab 时 `replaceState` 写回 `fe|admin|flow`。

**Ask First:**
- 按上面的回环仍然必然穿框或裁切时，先问再拆第二张。

**Never:**
- 不改场景板、管理后台、`newbie-academy-demo.html`。不把 iframe 画进图。
- 不画 STEP 1、学习进度、无课空态、项目下架、本页上传、学院内回填表单、作品广场。
- 不重写规则里的四步表，不把图贴进抽屉。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 打开 | `?tab=flow` 或点击「业务流程」 | 一张 SVG，地址 `?tab=flow` | 未知 tab 进前端 |
| 主路径 | 有词、官方稿、有稿、次数够、回填成功 | 选择项目 → 领取关键词 → 领取并下载稿件 → 我已发布，立即回填 → 开发规则 → 第一次发布完成 | 稿件未准备则回填不可点 |
| 词不够 | 该项目无可分配的词 | 「去申请关键词」出口到现有申请页；「稍后再说」回「选择项目」顶边 | 不展开申请表单 |
| 自己的稿 | 「使用自己的稿件」 | 不上传，汇入回填；可改回官方 | N/A |
| 稿不够 | 该书无可领官方稿 | 自制说明 + 客服码；「我知道了」回准备稿件；「改用自己的稿件」走自己的稿 | 不新造按钮 |
| 次数不够 | 有稿但次数不足 | 现有次数不足处理，回准备稿件 | 不新开兑换页 |
| 完成 | 回填成功记入 | 「去做项目」到现有变现页；「稍后再去」回「选择项目」顶边，停在 STEP 2 | 不画「已记入」 |
| 规则 | 「C端·新手学院」 | 一节「业务流程」，只写「见页内 Tab「业务流程」。」 | 其余表不动 |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-creator-home-2-opt.html` — 脚注 L164；Tab L187–190；`#view-flow` 插在 L300 之后、`</main>` 前。`showPage` L364 不写 URL；启动 L462 只认 `admin`。本页无 `.flow-*`。
- `demo/iteration/fr-ai-keyword.html` — 只读范本。样式 L162–167；SVG L294–395。色：蓝 `#dbeafe/#2563eb`、绿 `#dcfce7/#16a34a`、橙 `#ffedd5/#ea580c`、黄 `#fef9c3/#ca8a04`、红 `#fecaca/#dc2626`、线 `#94a3b8`，marker `flow-arrow-1`。
- `demo/iteration/fr-creator-home-2-opt-rules.html` — `#p-newbie` L143。指针放在 L202「STEP 2」标题前。完成文案 L241–245；次数不足 L234。
- `demo/iteration/newbie-academy-demo.html` — 只读。词不够 L273；稿不够 L285；次数 L292；开发规则 L316。
- `prd.md`（`prds/prd-YBDD2.0-2026-10-07`）L378 的 D-15 优先于 memlog 早期「不走代发领取」。指南 §四 L51–82。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/fr-creator-home-2-opt.html` -- 加 Tab、`#view-flow`、范本 `.flow-*` 样式，以及 `?tab=` 读写 -- 流程页可深链，刷新后 Tab 与地址一致
- [x] `demo/iteration/fr-creator-home-2-opt.html` -- 在 `#view-flow` 手写一张静态 SVG，节点与回环按冻结区的表和 Boundaries -- 词、稿、回填、完成都在这一张上
- [x] `demo/iteration/fr-creator-home-2-opt-rules.html` -- 在 STEP 2 标题前加「业务流程」，正文只有「见页内 Tab「业务流程」。」 -- 不产生第二份文字流程
- [x] `demo/iteration/fr-creator-home-2-opt.html` -- 用 `?tab=flow` 打开，三个 Tab 来回切，再看规则抽屉 -- 表中每个出口都能在图上对上原文

**Acceptance Criteria:**
- Given 已加载，when 地址为 `?tab=flow`，then 当前 Tab 是「业务流程」，面板只有一张 SVG，没有流程切换条。
- Given 停在业务流程，when 点另外两个 Tab，then 场景板和后台 iframe 仍在，地址变为 `?tab=fe` 或 `?tab=admin`。
- Given 打开「C端·新手学院」，when 看「业务流程」一节，then 只有指向页内 Tab 的一句，STEP 2 表原文还在。

## Spec Change Log

## Design Notes

自上而下：选择项目（副文案：领词前可改选，领词后收成一行）→ 还有可分配的词？ → 领取关键词 → 官方还是自己的？ → 该书还有可领稿件？ → 领取次数够？ → 领取并下载稿件 → 稿件已准备？ → 开发规则（打开项目已有回填页，带入关键词；Demo 只有「模拟回填成功」）→ 第一次发布完成。

「使用自己的稿件」从第二问旁路汇入「稿件已准备？」。官方成功节点副文案：按书随机一份、扣次、不进作品广场。出口只写既有页名。节点不可点。回环走外侧。

## Verification

**Manual checks (if no CLI):**
- 打开 `fr-creator-home-2-opt.html?tab=flow`。一张图、图例在底、回环落在规定节点的顶边、线不穿框、节点不被裁切。
- 图上能读到矩阵里的按钮原文。切回另两个 Tab 后，场景板和后台仍可用。规则抽屉只有那一句指针。

## Suggested Review Order

**深链入口**

- 顶层 Tab 用 `?tab=flow` 打开这一张图
  [`fr-creator-home-2-opt.html:195`](../../demo/iteration/fr-creator-home-2-opt.html#L195)

- 切换时写回地址，刷新后仍停在当前 Tab
  [`fr-creator-home-2-opt.html:525`](../../demo/iteration/fr-creator-home-2-opt.html#L525)

**STEP 2 闭环**

- 只画一张静态 SVG，分支都接在选项目到回填这条路上
  [`fr-creator-home-2-opt.html:311`](../../demo/iteration/fr-creator-home-2-opt.html#L311)

**规则指针**

- 抽屉只留一句，四步表仍是合同
  [`fr-creator-home-2-opt-rules.html:202`](../../demo/iteration/fr-creator-home-2-opt-rules.html#L202)

**测试**

- 地址、出口文案、回环落点和规则那一句都有断言
  [`test_fr021_newbie_step2_flow.py:81`](../../tests/e2e/test_fr021_newbie_step2_flow.py#L81)
