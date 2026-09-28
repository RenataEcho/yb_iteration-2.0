---
name: 一键代发 · 广场收益池增量
description: FR-017 作品广场露出。广场视觉继承 FR-014 原版 C 端；收益池为广场顶部深墨模块。
status: draft
updated: 2026-09-24
sources:
  - {planning_artifacts}/prds/prd-YBDD2.0-2026-09-24/prd.md
  - demo/iteration/yijian-daifa-demo.html
colors:
  orange: '#ff6b1a'
  orange-light: '#fff3eb'
  orange-border: '#ffd4b8'
  bg: '#f5f6f8'
  surface: '#ffffff'
  text: '#1a2332'
  muted: '#8a93a0'
  ink: '#16110e'
  gold: '#e8c9a0'
  banner-scrim: 'rgba(20,12,8,.72)'
typography:
  title:
    fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: 17px
    fontWeight: '700'
  pool-num:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 28px
    fontWeight: '760'
    letterSpacing: '-0.04em'
  card-title:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 12px
    fontWeight: '700'
  meta:
    fontFamily: '-apple-system, "PingFang SC", sans-serif'
    fontSize: 11px
    fontWeight: '400'
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  pool: 14px
  orb: 50%
  box: 10px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
---

## Brand & Style

C 端作品广场沿用 FR-014 最初版本：白底、橙点、项目 Logo 宫格、真实封面。本增量只加一块**深墨收益池**，压在项目条上方，不另开首页，不把金额写进卡片。

池子要像公开账本，不像促销色块。墨底 `{colors.ink}` + 金点 `{colors.gold}` + 右上暖光，数字用 `{typography.pool-num}`。主行动色仍是 `{colors.orange}`，只给限时领次和底栏。

## Colors

- **橙 (`#ff6b1a`)**：原版 C 端主色。选中项目、搜索图标、领次入口、底栏当前项。
- **墨 (`#16110e`)**：收益池底。来自原招募海报深色，不是新造的黑。
- **金 (`#e8c9a0`)**：池内 kicker 与货币符，克制使用。
- **纸白 / 灰底**：广场本体与宫格区，与 FR-014 一致。

避免：整页橙渐变、卡片上写 ¥、把池子做成钱包余额条。

## Typography

标题 17 / 池数字 28 表格式 / 卡片标题 12 两行截断 / 元信息 11。不引入第二套展示字体。

## Layout & Spacing

竖排，375 宽。文档流顺序锁定：状态栏 → 作品广场标题 → **收益池** → 项目条 → 搜索 → 筛选 → 通顶 BN → 三列宫格 → 底栏。页边 12。限次入口**不占文档流**：小盲盒浮标叠在宫格右下、底栏上方，上下微浮。未登录盒上加锁，仍悬浮不占位。

## Elevation & Depth

广场卡片无投影。池子允许一层浅墨影 + 内高光，表示它是顶层营销面，不是又一张稿件卡。

## Shapes

项目 Logo 10、封面 8、BN 12、池 14、盲盒 `{rounded.box}`。圆角跟原广场走，不另起系统。

## Components

- **收益池** — 广场顶部、项目条上方。只出一个展示收益。未登录整块消失。
- **项目条 / 搜索 / 筛选 / BN / 宫格** — 视觉与 mock 数据对齐 `yijian-daifa-demo.html` + `yijian-daifa-store.js`。
- **盲盒浮标** — 广场右下的小礼盒，盒面写 `?`，角标写剩余盒数。未登录灰盒加锁。不替代池子，不占文档流。
- **今日盲盒页** — 舞台正中一只会晃的盒；未开时只露 `?`。旁白写还剩几盒、倒计时。货架 50 格是小盒，下一盒闪。实时名单写谁刚拆走。CTA 写「拆开这一盒」。
- **开盒罩** — 点拆后全屏墨罩：盒盖掀开，开出白色次数牌「×1」。旁白：今日第 N 盒 · 压过 X 人。
- **开出成就** — 盒盖已开、次数牌弹出 + 三格战绩（今日第几盒 / 甩在后面 / 开盒用时）。满员 / 未开盒 / 收官共用同一只盒，态不同。

→ 当前 mock：`demo/iteration/yijian-daifa-pool-demo.html`。脊柱胜于 mock。

## Do's and Don'ts

**Do**

- 用番茄 / 红果 / 知乎真实 Logo 与封面。
- 池子放项目条上面。
- 卡片只写稿名、项目、剪辑师、时间。
- 领次做成盲盒：浮标是小盒，进页先看见会晃的盒，拆开才露次数。
- 领到要看见今日第几盒、压过多少人。

**Don't**

- 单开首页承载池子。
- 改历史广场文件。
- 在宫格上露单稿金额。
- 用「限时秒杀！！！」一类叫卖。
