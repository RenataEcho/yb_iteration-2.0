---
name: 一键代发迭代 3.0 · 任务协作先领后填
description: 本轮不改视觉身份。手机稿沿用一键代发迭代页已有橙、白卡片和底部浮层。
status: final
updated: 2026-10-10
topic: 一键代发迭代 3.0 · 任务协作先领后填
sources:
  - ../../prds/prd-YBDD2.0-2026-09-28/prd.md
  - ../../../../demo/iteration/yijian-daifa-iter3-demo.html
colors:
  brand-orange: '#ff6b1a'
  brand-orange-soft: '#fff3eb'
  text-primary: '#1a2332'
  text-secondary: '#8a93a0'
  surface-page: '#f5f6f8'
  surface-card: '#ffffff'
typography:
  font-family-base:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
  title-md:
    fontSize: '16px'
    fontWeight: '700'
  body:
    fontSize: '14px'
    fontWeight: '400'
rounded:
  sheet: '16px'
spacing:
  page-gutter: '12px'
components:
  keyword-sheet:
    backgroundColor: '{colors.surface-card}'
    rounded: '{rounded.sheet}'
  keyword-action:
    textColor: '{colors.brand-orange}'
  keyword-timeout:
    textColor: '{colors.text-secondary}'
---

# DESIGN · 任务协作先领后填

视觉身份不换。颜色、字和浮层都沿用 `demo/iteration/yijian-daifa-iter3-demo.html`。

## Brand & Style

右豹一键代发的手机页。白底、橙色主动作。这一轮只增加状态，不增加新的品牌元素。

## Colors

主动作和可点的「填写关键词」用 `{colors.brand-orange}`。超时文案用 `{colors.text-secondary}`，表示不能再点。

## Typography

浮层标题用 `{typography.title-md}`。关键词选项用 `{typography.body}`。固定项「暂无关键词,先领稿件稍后申请词」允许换行。

## Layout & Spacing

底部浮层从屏幕底边升起，左右贴边，上圆角 `{rounded.sheet}`。领取记录的关键词在卡片最上方，不和封面挤在一行。

## Elevation & Depth

选词浮层和「尽快申请关键词」弹窗盖住当前页，背后是现有的半透明遮罩。

## Shapes

浮层只圆上边。提示气泡用现有深色提示，这句话允许换行。

## Components

**选择关键词。** 底部浮层。任务协作领取时，第一项固定是「暂无关键词,先领稿件稍后申请词」，下面是这本书已有的词。领取记录里打开的同一浮层没有这一固定项。

**填写关键词。** 领取记录卡片顶部的橙色文字按钮。

**超时未填写关键词。** 同一位置的灰色文字，不是按钮。

## Do's and Don'ts

- 文案只用已经定下的句子，不另写鼓励语。
- 帐号运营详情不出现这个选词浮层。
- 不把超时文案做成可点的橙色按钮。
