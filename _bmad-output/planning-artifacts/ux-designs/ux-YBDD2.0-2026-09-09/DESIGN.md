---
name: AI申词 H5
description: 右豹 C 端批量 AI 申词。视觉继承既有移动端橙色体系，不另起品牌。
status: draft
updated: 2026-09-09
sources:
  - _bmad-output/implementation-artifacts/spec-fr-013-ai-keyword.md
  - demo/iteration/ai-keyword-demo.html
  - demo/iteration/fr-ai-keyword.html
  - demo/iteration/ITERATION-FR-GUIDE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/ai-keyword-demo.html
colors:
  primary: '#ff6b1a'
  primary-start: '#ff8a4c'
  primary-light: '#fff3eb'
  primary-border: '#ffd4b8'
  primary-soft: '#fff6ee'
  chip-text: '#c2410c'
  bg: '#f4f5f7'
  surface: '#ffffff'
  text: '#1a2332'
  muted: '#8a93a0'
  text-muted: '#9aa3af'
  border: '#e6e8eb'
  line: '#f0f1f3'
  secondary-cta: '#1a2332'
  danger: '#ef4444'
  unmatched: '#d97706'
typography:
  title:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 17px
    fontWeight: '700'
    lineHeight: '1.3'
  section:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 15px
    fontWeight: '700'
    lineHeight: '1.3'
  label:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1.4'
  body:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 6px
  md: 8px
  lg: 10px
  card: 12px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 14px
  '5': 16px
components:
  apply-cta:
    background: '{colors.primary}'
    color: '#ffffff'
    radius: '{rounded.lg}'
    font: '{typography.section}'
  submit-cta:
    background: '{colors.secondary-cta}'
    color: '#ffffff'
    radius: '{rounded.lg}'
    font: '{typography.section}'
  chip:
    background: '{colors.primary-soft}'
    color: '{colors.chip-text}'
    radius: '{rounded.sm}'
---

## Brand & Style

右豹 C 端 H5：浅灰底、白卡片、单一橙色强调。不引入第二品牌色、不切暗色、不出现底 Tab。

## Colors

页面底 `{colors.bg}`，卡片 `{colors.surface}`，主操作「立即申词」用 `{colors.primary}`，次主操作「立即题词」用 `{colors.secondary-cta}`。词芯片用 `{colors.primary-soft}` / `{colors.chip-text}`。

## Typography

导航标题 `{typography.title}`，分区标题 `{typography.section}`，表单标签 `{typography.label}`，辅助说明 `{typography.caption}`。

## Layout & Spacing

单列滚动。卡片内边距 `{spacing.4}`。申词结果为独立全宽卡片。两个主按钮等宽左右并排。手填书籍 ID 输入高度 40–56px。官方推荐列表单批最多 10 条。

## Components

- 来源 Tab：底部 2px 橙色下划线表示选中。
- 推荐「更换」：橙色文字按钮，不足一批时禁用。
- Toast：底部深色胶囊。
