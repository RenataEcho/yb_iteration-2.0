---
name: FR-014 一键代发 · PC 剪辑供稿
description: 在已有右豹 PC 创作者中心上增加剪辑手招募与上传。C 端继续用既有橙色；PC 沿用已有桌面壳，本增量不高新品牌。
status: final
updated: 2026-09-10
sources:
  - _bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md
  - demo/iteration/ITERATION-FR-GUIDE.md
  - demo/iteration/fr-opc-yijian-daifa.html
colors:
  primary: '#ff6b1a'
  primary-light: '#fff3eb'
  primary-border: '#ffd4b8'
  pc-nav: '#1a2332'
  pc-bg: '#f4f5f7'
  surface: '#ffffff'
  text: '#1a2332'
  muted: '#8a93a0'
  border: '#e6e8eb'
  exist-muted: '#94a3b8'
  success: '#16a34a'
  danger: '#ef4444'
typography:
  title:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 18px
    fontWeight: '700'
  body:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 13px
    fontWeight: '400'
rounded:
  card: 10px
  button: 8px
spacing:
  page: 20px
  card: 16px
---

# FR-014 · PC 剪辑供稿 — 视觉

> 与 `EXPERIENCE.md` 成对。冲突时两份 spine 优先于任何 mock。

## Brand & Style

右豹已有 PC 创作者中心：顶栏 + 左侧业务导航 + 白底内容。本 FR **不新造一套 PC 品牌**。新增「剪辑供稿」只在现有导航里高亮；「项目中心 / 作品管理 / 收益中心」保持已有入口外观（弱化），表示线上已存在、本增量不改。

C 端视觉不变：`{colors.primary}` 橙色手机壳。PC 顶栏用 `{colors.pc-nav}`，主按钮仍用 `{colors.primary}`，与 C 端同一产品色，不同形态。

## Colors

| Token | 用途 |
|---|---|
| `{colors.primary}` | PC 上传主按钮、看板强调数、招募强调 |
| `{colors.pc-bg}` | PC 内容底 |
| `{colors.exist-muted}` | 已有菜单（非本增量） |
| `{colors.surface}` | 卡片 / 表 |

## Typography

沿用系统中文黑体。看板数字 22px / 700；表 13px；已有菜单 13px 灰色。

## Layout & Spacing

PC 为桌面浏览器框（不是手机）。左栏约 200px；主区卡片网格 4 列看板。上传 list 用表，不是宫格。

## Components

| 组件 | 外观 |
|---|---|
| 已有导航项 | 灰字，无强调条 |
| 本增量导航 | 橙底浅条 + `{colors.primary}` 字 |
| 看板卡 | 白底、上标签、下数字、短说明 |
| 招募海报 | 卖点 / 适合谁 / 底部二维码；无表单 |
| 上传弹窗 | 居中 680px；三步胶囊（选成片 / 填字段 / 确认）；文件夹与压缩包两张选卡 |
| 最近上传表 | 两列：书籍 ID、稿件信息（大小 + 名称） |
| 上传 list 表 | 后台同列，无下载链接；审核 Tag + 驳回原因副文案 |

## Do's and Don'ts

- Do：PC 看起来像「旧壳 + 新模块」
- Don't：把 C 端手机上传搬到 PC 当新 App
- Don't：C 端再放剪辑手上传或招募闭环
- Don't：看板收益做成未定义的结算公式可视化
- Don't：上传弹窗只选单文件或不填后台同款字段
- Don't：PC list 露出稿件下载链接
