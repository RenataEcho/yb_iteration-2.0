---
title: '一键代发 3.0 业务流程拆成三张'
type: 'feature'
created: '2026-10-10'
status: 'done'
route: 'one-shot'
---

# 一键代发 3.0 业务流程拆成三张

## Intent

**Problem:** FR-020 迭代页的「业务流程」还是一张过期总图，筛选项、选词和稿件包都与定稿不一致。帐号运营领取、用户无词领取、分成被画在同一条路上。

**Approach:** 只改 `demo/iteration/fr-yijian-daifa-iter3.html` 的业务流程。按定稿 PRD 拆成三张可切换的图：帐号运营模式领取、用户无词领取、分成模式。不改历史迭代页，不改 2026-10-09 代发运营合作模式。

## Suggested Review Order

**三张图**

- 帐号运营：不选词，扣费后下载，保存成功才下发关键词。中断不退次，已领列表可再下载。
  [`fr-yijian-daifa-iter3.html:364`](../../demo/iteration/fr-yijian-daifa-iter3.html#L364)

- 用户无词领取：只覆盖「暂无关键词,先领稿件稍后申请词」。选了具体关键词的旁路不进这张主路径。
  [`fr-yijian-daifa-iter3.html:428`](../../demo/iteration/fr-yijian-daifa-iter3.html#L428)

- 分成：领取成功写该模式比例快照。已下载且已结算才切一次。
  [`fr-yijian-daifa-iter3.html:499`](../../demo/iteration/fr-yijian-daifa-iter3.html#L499)

**切换**

- 三张用页内 Tab 切换，地址带 `tab=flow&flow=1|2|3`。
  [`fr-yijian-daifa-iter3.html:1135`](../../demo/iteration/fr-yijian-daifa-iter3.html#L1135)

**规则抽屉**

- 业务流程一节改成指向这三张，不再暗示只有一张总图。
  [`fr-yijian-daifa-iter3.html:633`](../../demo/iteration/fr-yijian-daifa-iter3.html#L633)
