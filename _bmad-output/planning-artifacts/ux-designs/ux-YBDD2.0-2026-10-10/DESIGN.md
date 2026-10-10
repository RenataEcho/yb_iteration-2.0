---
name: 商学院优化
description: 在右豹创作者 2.0 橙系上增加学院搜索、直播课程卡与后台学习数据。不另起品牌。
status: final
updated: 2026-10-10
topic: 商学院优化
sources:
  - ../ux-YBDD2.0-2026-10-07/DESIGN.md
  - ../ux-YBDD2.0-2026-10-07/EXPERIENCE.md
  - ../../prds/prd-YBDD2.0-2026-10-07/prd.md
  - ../../../../demo/iteration/creator-home-2-opt-demo.html
colors:
  brand-orange: '#ff4d22'
  brand-orange-soft: '#fff1ec'
  accent-red: '#ff3157'
  text-primary: '#252836'
  text-secondary: '#9498a8'
  line-default: '#eceef3'
  surface-page: '#f6f7fb'
  surface-card: '#ffffff'
  admin-accent: '#ed693a'
typography:
  font-family-base:
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
  title-md:
    fontSize: '15px'
    fontWeight: '800'
  body:
    fontSize: '12px'
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontSize: '10px'
    fontWeight: '500'
rounded:
  md: '12px'
  full: '9999px'
spacing:
  page-gutter: '12px'
  section-gap: '12px'
components:
  academy-search:
    height: '36px'
    background: '{colors.surface-page}'
    border: '1px solid {colors.line-default}'
    color: '{colors.text-primary}'
    borderRadius: '{rounded.full}'
  course-stats:
    color: '{colors.text-secondary}'
    fontSize: '{typography.caption.fontSize}'
    gap: '10px'
  live-course-card:
    coverRadius: '{rounded.md}'
    actionBackground: '{colors.brand-orange}'
    actionColor: '{colors.surface-card}'
    reservedBackground: '{colors.brand-orange-soft}'
    reservedColor: '{colors.brand-orange}'
    pulse: '{colors.accent-red}'
  leave-sheet:
    background: '{colors.surface-card}'
    borderRadius: '{rounded.md}'
  learning-data-note:
    background: '{colors.brand-orange-soft}'
    color: '#8a6a5c'
---

# DESIGN · 商学院优化

视觉身份沿用 [右豹创作者 2.0](../ux-YBDD2.0-2026-10-07/DESIGN.md)。本文件只补这次新增的搜索、直播卡和后台统计。与 Demo 冲突时，本文件与 `EXPERIENCE.md` 优先。

画面以 [creator-home-2-opt-demo.html](../../../../demo/iteration/creator-home-2-opt-demo.html) 为参照。

## Brand & Style

商学院是创作者手机里的学习页，顶栏标题写「商学院」。暖橙、白卡片、系统中文。直播不是另一套皮肤：进行中只用 `{colors.accent-red}` 做一颗呼吸点，平台名用文字，不给飞书、抖音、企业微信各做一套色。

后台继续用现有学院管理壳：深色侧栏，选中项 `{colors.admin-accent}`。学习数据保持克制，不做教务仪表盘。

## Colors

- **brand-orange** — 直播主按钮（预约、查看、查看回放）。白字叠在 `{colors.brand-orange}` 上，只用于这颗按钮和频道选中，不拿来铺卡片底。
- **brand-orange-soft** — 已预约按钮底、学习数据页顶部说明底。
- **accent-red** — 仅进行中直播的呼吸点。
- **text-secondary** — 观看人数、收藏人数、直播时间。
- **admin-accent** — 只用于后台侧栏当前项，与 C 端 `{colors.brand-orange}` 分开，不把后台改成另一套橙。

## Typography

`{typography.font-family-base.fontFamily}`。课名沿用列表现有加粗。观看、收藏、平台、开播时间用 `{typography.caption}`。

## Layout & Spacing

商学院页左右仍是 `{spacing.page-gutter}`。搜索在标题「商学院」之下、新人条之上，与频道同一列。直播卡沿用现有课程行：左封面、右文案。五个频道同一行：项目教学、案例拆解、进阶技巧、直播课程、我的学习。

## Elevation & Depth

离开应用确认浮在商学院页之上，白底 `{components.leave-sheet.borderRadius}`，遮罩沿用现有层级，不新做一套阴影。

## Shapes

搜索框 `{components.academy-search.borderRadius}`。直播主按钮同样全圆。封面圆角 `{components.live-course-card.coverRadius}`。

## Components

### 学院搜索

高 `{components.academy-search.height}`，底 `{components.academy-search.background}`，描边 `{components.academy-search.border}`，字色 `{components.academy-search.color}`。无搜索图标装饰。

### 课程数据条

观看与收藏同一行，间距 `{components.course-stats.gap}`，字号 `{components.course-stats.fontSize}`，颜色 `{components.course-stats.color}`。列表和详情都用这一条。不做成徽章。

### 直播课程卡

封面结构与普通课程相同。封面右上角是状态：待开始、直播中、直播已结束。直播中用 `{components.live-course-card.pulse}` 的红色底，角标里有一颗白点。列表不再放预约或回放按钮。详情里的预约按钮实心 `{components.live-course-card.actionBackground}` / `{components.live-course-card.actionColor}`。已预约改为 `{components.live-course-card.reservedBackground}` / `{components.live-course-card.reservedColor}`。

### 离开应用确认

白底卡片。标题写即将打开的平台名。两个文字按钮：继续、留下。继续用 `{colors.brand-orange}`。

### 学习数据说明

浅橙底 `{components.learning-data-note.background}`，字色 `{components.learning-data-note.color}`。放在指标表上方一行。

## Do's and Don'ts

- **Do** 平台只写「飞书」「抖音」「企业微信」文字。
- **Do** 进行中只用一颗红点表示直播，封面不再叠加第二套动效。
- **Do** 直播详情复用视频详情的画面。画面下的按钮只写预约、已预约、查看回放，不写平台。平台留在确认层。
- **Don't** 在产品内做播放器充当直播间。
- **Don't** 为这场优化改首页橙或数据页黑金。
