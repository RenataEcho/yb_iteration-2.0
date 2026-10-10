---
name: 右豹创作者 2.0
description: C 端创作者 App（V125）与学院后台的视觉 token；橙系营销感 + 数据 Tab 克制黑金。
status: final
updated: 2026-10-10
topic: 2.0优化
sources:
  - mockups/creator-home-2-opt-demo.html
  - demo/iteration/creator-home-2-opt-demo.html
  - _bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-07/prd.md
colors:
  brand-orange: '#ff4d22'
  brand-orange-hover: '#ff6c46'
  brand-orange-soft: '#fff1ec'
  accent-red: '#ff3157'
  text-primary: '#252836'
  text-secondary: '#9498a8'
  text-muted: '#9aa0ad'
  line-default: '#eceef3'
  surface-page: '#f6f7fb'
  surface-card: '#ffffff'
  surface-data-page: '#f8f4ee'
  data-hero-gradient-start: '#0b0907'
  data-hero-gradient-mid: '#3b1d0b'
  data-hero-gold: '#e6c08a'
  data-hero-text: '#fff8ed'
  rank-project-tint: '#fff3ef'
  rank-opc-tint: '#fff7e8'
  tool-reason-bg: '#fff8f4'
  tool-reason-text: '#9a6a5e'
typography:
  font-family-base:
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
  title-lg:
    fontSize: '17px'
    fontWeight: '900'
  title-md:
    fontSize: '15px'
    fontWeight: '800'
  body:
    fontSize: '12px'
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontSize: '9px'
    fontWeight: '500'
    lineHeight: '1.45'
  stat-value:
    fontSize: '16px'
    fontWeight: '800'
rounded:
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '20px'
  full: '9999px'
  phone-shell: '24px'
spacing:
  phone-max-width: '390px'
  page-gutter: '12px'
  section-gap: '12px'
  bottom-nav-height: '74px'
  safe-bottom-nav: '86px'
components:
  bottom-nav:
    height: '{spacing.bottom-nav-height}'
    activeColor: '{colors.brand-orange}'
    inactiveColor: '#758096'
  project-tool-chip:
    background: '#fff5f1'
    border: '1px solid #ffe5dc'
    color: '#f06446'
    fontSize: '8.5px'
    borderRadius: '{rounded.full}'
  tool-bottom-sheet:
    maxHeight: '72%'
    borderRadius: '{rounded.xl} {rounded.xl} 0 0'
    dragHandle: '#e4e6eb'
  shortcut-grid:
    columns: 4
    background: '{colors.surface-card}'
    borderRadius: '{rounded.lg}'
    iconSize: '44px'
    iconRadius: '14px'
    labelColor: '{colors.text-primary}'
  rank-card:
    minWidth: 'calc(100% - 34px)'
    borderRadius: '{rounded.lg}'
  data-hero-premium:
    minHeight: '350px'
    borderRadius: '0 0 30px 30px'
    backgroundNote: 'linear black-gold hero; scope #dataPage only'
---

# DESIGN · 2.0优化

**冲突规则：** 本文件与 `EXPERIENCE.md` 优先于 [mockups/creator-home-2-opt-demo.html](mockups/creator-home-2-opt-demo.html) 及仓库 Demo；与 PRD spines 冲突时 **PRD / 本 spine 对优先**。

## Brand & Style

右豹创作者端是 **移动端优先** 的收益 + 学习双叙事产品：首页用 **暖橙渐变顶栏** 与白卡片营造「可赚、可学」；营销信息（收益数字、榜单）允许高饱和 `{colors.brand-orange}`；学习卡标题为「商学院」，与活动卡用 🎓/🔥 图标前缀区分角色。Banner 下的金刚区用同一套白卡片与品牌橙，四字标题是识别主体。数据 Tab 单独使用 **克制黑金**（`#dataPage` 作用域），与首页浅灰底 `{colors.surface-page}` 形成 Tab 级视觉切换，暗示「资产/分析」而非「发现」。

学院管理后台（Demo B 端）沿用迭代框架的 **蓝紫管理风**（见 FR 页 iframe 外壳），与 C 端橙系分离；实现时 C 端 token 以本文件为准，后台可复用现网管理后台 design system。

## Colors

- **brand-orange** — 主 CTA、Tab 选中、找项目 Tab 激活、金刚区图标。不用于数据 Hero 正文（数据页用 gold-on-black）。
- **surface-page / surface-card** — 默认页面底与模块卡片；卡片阴影轻（`0 3px 10px rgba(45,55,85,.025)` 量级）。
- **rank-project-tint / rank-opc-tint** — 两榜卡片顶渐变区分「项目榜」与「OPC 经营榜」。
- **tool-reason-bg / tool-reason-text** — Bottom Sheet 内「为什么推荐」专用，与工具描述灰字分离。
- **data-*** — 仅 `#dataPage`：Hero 深棕黑渐变 + 金色分割线；页面底 `{colors.surface-data-page}`。

## Typography

系统字体栈 `{typography.font-family-base.fontFamily}`。首页项目名 `{typography.title-md}` 级加粗；榜单标题 ~17px/900；辅助说明 `{typography.caption}`（9px）用于项目副文案、工具 chip。金刚区四字标题用 `{typography.body.fontSize}`（12px）、字重 600、色 `{colors.text-primary}`。数据 Hero 年度数字 ~43px/800，仅数据页。

## Layout & Spacing

- 手机画布 **max 390px**，居中；桌面预览圆角 `{rounded.phone-shell}` + 外阴影。
- 内容区左右 `{spacing.page-gutter}`；模块间 `{spacing.section-gap}`。
- 固定底栏 `{spacing.bottom-nav-height}` + safe area。首页不悬浮路径气泡。
- 榜单横滑：卡片 `{components.rank-card.minWidth}`，第二卡露头 ~34px。

## Elevation & Depth

- 卡片：轻阴影 + 白底。金刚区同一张白卡片，不另做浮层。
- Sheet/遮罩：mask `rgba(0,0,0,.32)` ~ `rgba(26,30,40,.38)`，z-index 工具 Sheet ≥900（与通用 sheet 分层见 Demo V17）。
- 数据 Hero：深景 + 金色光带（伪元素），豹子水印 opacity ~0.22。

## Shapes

- 卡片 `{rounded.md}`~`{rounded.lg}`；搜索框 `{rounded.full}`；工具 chip `{rounded.full}`。
- 金刚区外框 `{components.shortcut-grid.borderRadius}`。
- 数据 Hero 底 `{components.data-hero-premium.borderRadius}`。

## Components

### 商学院 / 活动中心双卡

- 左卡可见标题 **「商学院」**，浅暖白底 + 橙粉 cover 渐变；右卡活动中心，黄橙 cover。
- 轮播 dots： inactive `#ffd8cf`，active `{colors.brand-orange}`。

### 金刚区

- Banner 正下方一张白卡片，`{components.shortcut-grid}`：四列等分。
- 每列上图标、下标题。图标底板 `{components.shortcut-grid.iconSize}`、圆角 `{components.shortcut-grid.iconRadius}`，是方圆，不是正圆。
- 底板是暖色毛玻璃：半透明白、顶部高光、底边暖橙内阴影、右下角一团被磨砂压住的橙色光。符号是同色渐变的填色图形，压在玻璃之上。
- 标题从左到右固定为：新手学院、收益榜单、社群中心、邀请好友。

### 榜单行

- 名次 1–3：badge 色 `#ff593a` / `#ff941f` / `#20c989`；4–5 行 opacity 0.72、图标 scale 0.92。

### 找项目行

- 图标 44×44；主标题 13px/800；收益 `{colors.brand-orange}` em 强调；**推荐工具** 为卡片底部分割行（V34/V35），chip 用 `{components.project-tool-chip}`。

### 工具 Bottom Sheet

- 顶 drag bar `{components.tool-bottom-sheet.dragHandle}`；选项行 + 「去使用」橙钮；**tool-reason** 块必填样式。

### 数据 Tab Hero（premium）

- 仅 `#dataPage` 应用 `{components.data-hero-premium}`；空态与示例数据 Sheet 用浅金底 `#fffaf2`。

## Do's and Don'ts

- **Do** 首页找项目让 **项目名+收益** 先于工具；工具用 chip/底行，不用与标题同行抢位。
- **Do** 数据页黑金样式 **scoped 到 #dataPage**，避免污染首页/变现。
- **Do** 商学院卡与活动卡保持 🎓/🔥 与不同 cover 渐变。学习卡标题写「商学院」。
- **Do** 金刚区四字标题完整露出，不截成两字。
- **Don't** 在数据示例态把演示金额当作真实账户样式以外的「默认真值」。
- **Don't** 让变现页 `.project-tools` grid 规则泄漏到 `#projectList`（V26–V27）。
- **Don't** 把图文课做成横滑图集或带步骤蒙层的图片卡；正文与通栏图直接落在白底上，推荐课程只出现在正文之后。
- **Don't** 在工具页市场卡片上放适用项目或推荐项目行。
- **Don't** 把金刚区图标做成正圆细线符号。
- **Don't** 在首页放路径气泡，或把学习卡标题写成「新手学院」。
- **Don't** 在首页放「有邀请码？」或「绑定邀请码」。
