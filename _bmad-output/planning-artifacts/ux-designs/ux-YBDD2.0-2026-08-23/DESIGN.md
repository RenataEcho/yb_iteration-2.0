---
name: 右豹迭代需求记录后台
description: 产品侧迭代需求 Demo 与规则交付台；玻璃拟态 B 端风格，继承右豹管理后台原型视觉语言。
status: draft
updated: 2026-08-27
colors:
  primary: '#2563eb'
  primary-hover: '#1d4ed8'
  primary-light: '#eff6ff'
  primary-border: '#bfdbfe'
  accent-rule: '#0891b2'
  accent-version: '#7c3aed'
  accent-fr: '#d97706'
  success: '#16a34a'
  success-bg: '#f0fdf4'
  warning: '#d97706'
  warning-bg: '#fffbeb'
  danger: '#dc2626'
  danger-bg: '#fef2f2'
  bg: '#f0f4f8'
  bg-gradient-start: '#e0e7ff'
  bg-gradient-mid: '#f0f4f8'
  bg-gradient-end: '#e0f2fe'
  surface: '#ffffff'
  surface-glass: 'rgba(255,255,255,0.72)'
  surface-hover: '#f8fafc'
  border: '#e8edf3'
  text-primary: '#18222f'
  text-secondary: '#4a5568'
  text-muted: '#9aa5b4'
  sidebar-bg: 'rgba(240,244,255,0.92)'
  topnav-bg-start: '#dbeafe'
  topnav-bg-mid: '#ede9fe'
  topnav-bg-end: '#e0f2fe'
  drawer-bg: 'rgba(255,255,255,0.96)'
  mockup-frame: '#1e293b'
typography:
  brand:
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 15px
    fontWeight: '700'
    lineHeight: '1.2'
  page-title:
    fontFamily: 'Inter, "PingFang SC", sans-serif'
    fontSize: 19px
    fontWeight: '700'
    lineHeight: '1.3'
  body:
    fontFamily: 'Inter, "PingFang SC", sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.55'
  caption:
    fontFamily: 'Inter, "PingFang SC", sans-serif'
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
  table-header:
    fontFamily: 'Inter, "PingFang SC", sans-serif'
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
  rule-heading:
    fontFamily: 'Inter, "PingFang SC", sans-serif'
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
rounded:
  sm: 7px
  md: 10px
  lg: 14px
  xl: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  topnav-h: 54px
  sidebar-w: 220px
  sidebar-collapsed-w: 56px
  drawer-w: 420px
  drawer-w-wide: 720px
  drawer-section-gap: 20px
  page-gutter: 20px
components:
  topnav:
    height: '{spacing.topnav-h}'
    background: 'linear-gradient(135deg, {colors.topnav-bg-start} 0%, {colors.topnav-bg-mid} 40%, {colors.topnav-bg-end} 100%)'
    blur: 'blur(20px) saturate(180%)'
  sidebar:
    width: '{spacing.sidebar-w}'
    background: '{colors.sidebar-bg}'
    blur: 'blur(20px) saturate(180%)'
  glass-card:
    background: '{colors.surface-glass}'
    border: '1px solid rgba(255,255,255,0.55)'
    radius: '{rounded.lg}'
    blur: 'blur(16px) saturate(180%)'
    shadow: '0 8px 32px rgba(30,40,80,0.10)'
  btn-primary:
    background: '{colors.primary}'
    foreground: '#ffffff'
    radius: '{rounded.sm}'
    height: 34px
    fontSize: 13px
  btn-rule:
    background: '{colors.primary-light}'
    foreground: '{colors.primary}'
    border: '1px solid {colors.primary-border}'
    radius: '{rounded.sm}'
  drawer:
    width: '{spacing.drawer-w}'
    background: '{colors.drawer-bg}'
    shadow: '0 16px 48px rgba(30,40,60,0.14)'
  drawer-wide:
    width: '{spacing.drawer-w-wide}'
    header-padding: '16px 20px'
    body-padding: '0 24px 24px'
    footer-padding: '14px 20px 16px'
    title-size: 15px
    section-title-size: 14px
    form-input-height: 34px
  version-badge:
    background: '#f5f3ff'
    foreground: '{colors.accent-version}'
    border: '1px solid #ddd6fe'
    radius: '{rounded.sm}'
  fr-badge:
    background: '#fffbeb'
    foreground: '{colors.accent-fr}'
    border: '1px solid #fde68a'
    radius: '{rounded.sm}'
  tag-success:
    background: '{colors.success-bg}'
    foreground: '{colors.success}'
  tag-warning:
    background: '{colors.warning-bg}'
    foreground: '{colors.warning}'
  mockup-phone:
    frame: '{colors.mockup-frame}'
    radius: 28px
    width: 320px
---

## Brand & Style

右豹迭代需求记录后台是 **产品写给研发看的 PRD 原型 Demo**，不是运营生产系统。视觉继承 [右豹管理后台原型](https://renataecho.github.io/yb_iteration-2.0/) 与右豹 B 端玻璃拟态规范：简约、克制、信息密度适中。Demo 区与规则区通过 **玻璃卡片 + 右侧抽屉** 分层，避免「文档站」与「后台」两套 UI 割裂。

品牌表达重点：**可读性 > 装饰**；规则抽屉与版本标识使用少量 accent 色，不与业务 Tag 语义色混淆。

## Colors

- `{colors.primary}` — 主操作、Sidebar 选中态、链接。
- `{colors.accent-rule}` — 「需求规则」入口、抽屉标题强调；表达「说明层」。
- `{colors.accent-version}` — FR 版本选择器、版本链；表达「追溯层」。
- `{colors.accent-fr}` — FR-ID 徽章；表达「需求身份」。
- 语义色（success / warning / danger）— **仅用于 Demo 表内业务状态 Tag**，不用于框架 chrome。
- `{colors.surface-glass}` — 卡片、筛选区、表格容器；配合 backdrop-filter 磨砂。
- `{colors.drawer-bg}` — 规则抽屉：略高不透明度，保证长文可读。

## Typography

- `{typography.page-title}` — 页面主标题（Demo 页名）。
- `{typography.body}` — 规则正文、表格单元格、表单标签。
- `{typography.caption}` — 页头描述、面包屑、表格辅助说明。
- `{typography.rule-heading}` — 抽屉内四段式规则标题（业务目标、字段规则…）。
- 代码/事件 ID 使用等宽：`ui-monospace, SFMono-Regular, Menlo, monospace`，12px。

## Layout & Spacing

- **单层左侧导航**：品牌 + Sprint 上下文 + 全部需求入口均在 Sidebar；**不使用 TopNav 一级域 Tab**（该模式保留给 SaaS 多版本/多模块复杂场景，本台不采用）。
- 内容区左边距 = `{spacing.sidebar-w}`；主区从视口顶部起，无顶栏占用高度。
- 页内结构：面包屑 → Page Header（标题 + FR/版本 + 需求规则）→ Filter Card（可选）→ Demo Card。
- 规则抽屉宽 `{spacing.drawer-w}`，从右侧滑入；Demo 区不被永久挤压，抽屉 overlay。
- 模板 B 左规则区 : 右 mockup ≈ **5 : 7**（≥1280px）；<1024px 上下堆叠。

## Elevation & Depth

- TopNav / Sidebar：轻度玻璃 + 浅阴影，z-index 300 / 200。
- Demo 卡片：`{components.glass-card}` 阴影。
- 抽屉 / Modal：`{components.drawer}` 级阴影；Modal z-index 500，抽屉 z-index 400。
- Mockup 手机框：深色实底 `{colors.mockup-frame}`，与玻璃后台形成对比，突出 C 端预览。

## Shapes

- 卡片 / 抽屉 / 表格容器：`{rounded.lg}`（14px）。
- 按钮 / 输入 / Tag：`{rounded.sm}`（7px）。
- Mockup 外框：`{rounded.xl}` 级圆角 + 28px 内屏圆角。

## Components

> **交互组件 live spec**：[`demo/iteration/component-spec-demo.html`](../../../../demo/iteration/component-spec-demo.html) — Button、文字链、确认/编辑弹窗、详情抽屉、Toast、Tag 的可点击 Demo。

### Page Header（框架级）

- 左：标题 + 一行 `{typography.caption}` 描述。
- 中：`{components.fr-badge}` + `{components.version-badge}` 下拉。
- 右：`{components.btn-rule}`「需求规则」。

### 交互组件（全站统一）

- **Button**：`.btn-primary` 主操作；`.btn-ghost` 取消/重置；`.btn-rule` 规则入口；`.btn-danger` 确认删除。
- **文字链**：`.link` 详情/编辑；`.link-muted` 日志；`.link-danger` 删除（须配合确认弹窗）。
- **Confirm Modal**：居中 400px；Footer = Ghost 取消 + Primary/Danger 确认。
- **Edit Modal**：居中 480px；含表单 + Footer 取消/保存。
- **Detail Drawer**：右侧 `{spacing.drawer-w}` overlay；关键词详情、规则抽屉同类模式。
- **Wide Config Drawer**：复杂编辑/详情（多分组 + 内嵌表格）用 `{components.drawer-wide}`，宽 `{spacing.drawer-w-wide}`（720px）；见下节。
- **Toast**：底部深色胶囊，Mock 反馈 2.5s。

### Wide Config Drawer（复杂配置 · FR-005 策略编辑/详情）

→ Live mock：[`demo/iteration/fr-project-order-optimize.html`](../../../../demo/iteration/fr-project-order-optimize.html)（`#strategyEditDrawer` / `#strategyDetailDrawer`）

| 区域 | 规格 |
|------|------|
| 宽度 | `{spacing.drawer-w-wide}` = 720px；类名 `.drawer.wide` |
| Header | padding `{components.drawer-wide.header-padding}`；标题 15px/700；副标题 12px muted |
| Body | padding `{components.drawer-wide.body-padding}`；区内独立滚动 |
| Footer | Ghost 取消 + Primary 保存；padding `{components.drawer-wide.footer-padding}` |
| 顶栏字段 | `.drawer-field-top`：单字段（如策略名称），上下 20px + 底部分割线 |
| 配置分组 | `.config-block`：上下 `{spacing.drawer-section-gap}` + 1px 分割线；`.config-block-head` 用 `{typography.rule-heading}` + caption 说明；head 与控件间距 12px |
| 行内配置 | `.config-block-inline`：白名单勾选、前几名 N 等单行控件，gap 16–24px |
| 说明条 | `.field-ratio-note`：info 浅蓝底，10×12px padding，12px 正文 |
| 内嵌表格 | `.strategy-table`：th/td 10×12px padding，12px 字；表内 input 高 32px，全宽布局 |
| 表格列比 | 结算字段 52% / 24% / 24%；ID 规则 28% / 36% / 24% / 12% |

**Don't**：不要用 10px 区段标题、26px 表单控件、2px 单元格 padding 压缩复杂配置抽屉；宽抽屉内表格应 `width:100%`，勿固定窄宽（如 392px）导致二次拥挤。

### 需求规则抽屉

- 顶：FR-ID + 版本 + 关闭。
- 体：编号列表 1–4（业务目标 / 字段 / 交互 / 边界）+ 5 业务流程（文字 + Mermaid 流程图容器）。
- 滚动独立；不关闭 Demo 区交互。

### Demo 表格（模板 A）

- 表头 `{typography.table-header}`；行 hover `{colors.surface-hover}`。
- 操作列链接色 `{colors.primary}`；危险操作 `{colors.danger}`。
- 「新增」主按钮 `{components.btn-primary}` 位于 Table Header 右。

### 场景切换器（模板 B）

- 胶囊按钮组；选中 = primary 浅底 + 主色字；未选中 = 透明 + 边框。
- 与右侧 mockup 状态联动。

### Sprint 侧栏分组

- 分组标签 11px uppercase muted；与业务模块分组视觉一致，前缀图标区分（迭代 = 紫色小点）。

## Do's and Don'ts

**Do**

- 全站复用 `{spacing.sidebar-w}`；主导航仅在 Sidebar。
- Demo 弹窗只做 Mock 反馈（toast / 列表刷新），不假装真实后端。
- 规则抽屉与 Demo 同屏对照。

**Don't**

- 不要加入 TopNav 一级域 Tab（本台非 SaaS 多模块场景）。
- 不要加入登录、头像菜单、通知铃铛（无权限产品 Demo 台）。
- 不要堆运营向大盘组件作为框架默认（除非该 Sprint 有变更）。
- 不要用角标浮窗替代结构化规则抽屉（角标可作为后续增强层）。
