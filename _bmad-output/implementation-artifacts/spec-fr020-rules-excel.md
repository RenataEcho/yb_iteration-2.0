---
title: '一键代发 3.0 需求规则改表格'
type: 'feature'
created: '2026-10-10'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'a9f24d5fe3f1fe75072d92a1bdaae16d3bfee51f'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `fr-yijian-daifa-iter3.html` 的「需求规则」是两段长列表。同一条规则在目标、页面、交互里重复出现，扫不完。

**Approach:** 照 FR-021：新建一张表格式规则页，抽屉加宽后用 iframe 嵌进去，并提供新窗口打开。格子只保留替换前抽屉里已经写过的规则，重复句并成一行。

## Boundaries & Constraints

**Always:**
- 文案只来自替换前 `#rule-fe`、`#rule-be` 的原文。不从 PRD 增补，不改规则含义。
- 同一事实只出现一行。功能索引只做跳转摘要，不把细则再写一遍。
- 抽屉仍由现有 `#toggleRuleDrawer`、`#closeRule`、`#ruleOverlay` 开关。页签切换（前端 / 剪辑手 PC / 管理后台 / 业务流程 / 分成明细）行为不变。
- 表格页可单独打开、可打印。

**Ask First:** 若压缩时两条原文互相矛盾，停下来问，不要自行取舍。

**Never:**
- 不改手机 Demo、管理后台表单、种子数据、业务流程和分成明细。
- 不改 `fr-creator-home-2-opt-rules.html` 和其它已脏文件。
- 不重写 FR-014、FR-017、FR-018。
- 不把规则继续留成抽屉里的长 `<ul>`。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 打开规则 | 点「需求规则」 | 右侧抽屉约 960px，内嵌表格页；顶栏有「新窗口打开 / 打印」和关闭 | N/A |
| 扫规则 | 点表格页 Tab | 只显示该 Tab 的表；一行一条可验收规则 | N/A |
| 关掉 | 点 × 或遮罩 | 抽屉关闭，背后 Demo 仍在当前页签 | N/A |
| 新窗口 | 点「新窗口打开 / 打印」 | 同一张表在新标签打开，打印时各 Tab 分页 | N/A |
| 切 Demo 页签 | 规则抽屉开着时切到管理后台 | 后台页正常出现；不报错，不把规则刷回长列表 | 父页不再按页签改写规则 Tab |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-yijian-daifa-iter3.html` — 规则在 600–656 行。开关在 `toggleRule`（1118–1123）、规则 Tab 点击（1124–1129）。`showPage`（1077–1083）会把规则切到 `rule-fe` / `rule-be`。`#ruleDrawer` 现宽 480px（15、153 行）。其它抽屉（详情）不要跟着加宽。
- `demo/iteration/fr-creator-home-2-opt-rules.html` — 表格真源：`.rule-tab-bar`、`table.tpl`、打印时每个 `.panel` 分页。
- `demo/iteration/fr-creator-home-2-opt.html` — 抽屉嵌法：128–142、235–246 行。`#ruleDrawer` 宽 `min(960px, 100%)`，`.drawer-body` 无内边距，iframe 铺满。头上有「新窗口打开 / 打印」。
- `tests/e2e/test_fr020_admin_mode_works.py` — 只测后台表单，不点需求规则。`test_yijian_daifa.py` 的规则断言打的是 1.0 页，不是本文件。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/fr-yijian-daifa-iter3-rules.html` -- 新建表格式规则页。Tab：功能索引、作品广场、稿件详情、帐号运营、任务协作、已领回填、收益日历、剪辑手 PC、管理后台、边界。样式抄 FR-021 规则页。
- [x] `demo/iteration/fr-yijian-daifa-iter3.html` -- `#ruleDrawer` 加宽到 `min(960px, 100%)`，正文换成 iframe。删掉父页的 `rule-fe` / `rule-be` 切换。保留开关按钮和关闭钮的 id。

**Acceptance Criteria:**
- Given 打开迭代 3.0 页，when 点「需求规则」，then 看到分 Tab 的表格，而不是长段落。
- Given 功能索引，when 扫「本页规则」列，then 每格是一句摘要；细则只在对应 Tab。
- Given 原文里「领走之后不能再领」出现两次，when 看完所有表，then 这句话只剩一行。
- Given 点管理后台页签并打开录入弹窗，when 不选合作模式就保存，then 仍提示「至少选一个合作模式」。

## Spec Change Log

## Design Notes

格子用短句。示例：

| 项 | 规则 | 不做 |
|----|------|------|
| 项目行 | 一行 5 个，超出出滑动条。常用在前，其余按排序值从大到小 | 不在广场列出已领取稿件 |

功能索引的「Demo 锚点」写页面里已有的区域名（作品广场、稿件详情、已领列表、收益日历、剪辑手 PC、剪辑手管理、稿件管理），不新造选择器。

## Verification

**Manual checks (if no CLI):**
- 浏览器打开 `demo/iteration/fr-yijian-daifa-iter3.html`，点「需求规则」，逐个 Tab 看表，关掉再开。
- 新窗口打开规则页，确认不是空壳。
- 管理后台仍能打开录入弹窗；不选模式时保存被拦住。

## Suggested Review Order

**规则表**

- 十个 Tab 把原来的长段落收成一行一条。
  [`fr-yijian-daifa-iter3-rules.html:59`](../../demo/iteration/fr-yijian-daifa-iter3-rules.html#L59)

- 功能索引只留一句摘要，细则留在对应 Tab。
  [`fr-yijian-daifa-iter3-rules.html:73`](../../demo/iteration/fr-yijian-daifa-iter3-rules.html#L73)

- 表头跟着 Tab 栏高度粘住，换 Tab 回到页顶。
  [`fr-yijian-daifa-iter3-rules.html:522`](../../demo/iteration/fr-yijian-daifa-iter3-rules.html#L522)

**抽屉**

- 抽屉加宽，用 iframe 嵌表格页，并可新窗口打开。
  [`fr-yijian-daifa-iter3.html:609`](../../demo/iteration/fr-yijian-daifa-iter3.html#L609)

- 抽屉顶边贴在页签栏下方，滚动和缩放时重算。
  [`fr-yijian-daifa-iter3.html:1081`](../../demo/iteration/fr-yijian-daifa-iter3.html#L1081)

**测试**

- 打开抽屉、切 Tab、打印时每个面板都印出来。
  [`test_fr020_rules_excel.py:29`](../../tests/e2e/test_fr020_rules_excel.py#L29)
