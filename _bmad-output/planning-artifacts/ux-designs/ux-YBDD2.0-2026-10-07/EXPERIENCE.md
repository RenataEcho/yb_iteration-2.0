---
name: 右豹创作者 2.0 · 体验合同
description: FR-021 C 端 IA、状态、交互与关键流；学院后台行为摘要。
status: final
updated: 2026-10-10
topic: 2.0优化
sources:
  - demo/iteration/fr-creator-home-2-opt.html
  - demo/iteration/creator-home-2-opt-demo.html
  - _bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-07/prd.md
prd: _bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-07/prd.md
mock_primary: mockups/creator-home-2-opt-demo.html
---

# EXPERIENCE · 2.0优化

**冲突规则：** 本文件 + [DESIGN.md](DESIGN.md) 优先于 mock。验收对照 [demo/iteration/creator-home-2-opt-demo.html](../../../demo/iteration/creator-home-2-opt-demo.html)（V125）；PRD FR-021 为需求真源。

## Foundation

- **Form-factor:** 移动端 App 主画布（390px 逻辑宽）；桌面为居中手机预览 + Demo 双端切换器。
- **UI system:** 无独立组件库文档；实现须落地 DESIGN.md tokens（橙系 C 端 + `#dataPage` 黑金）。
- **双端:** C 端 App（五 Tab + 全屏子页）| 学院管理后台（四菜单 + 课程编辑子页）。Demo 切换：`Alt+C` / `Alt+B`，`sessionStorage['rb-demo-workspace']`。

## Information Architecture

### C 端 · 一级（底栏）

| Tab | 主页面 | 备注 |
|-----|--------|------|
| 首页 | `home` | Banner 下有金刚区；无路径气泡、无绑定邀请码 |
| 变现 | `monetize` | 赛道 + decision-chips + 列表/宫格 |
| 工具 | `tools` | 场景 + 工具市场 |
| 数据 | `data` | 黑金 Hero；空态 / 示例数据 |
| 我的 | — | Demo toast 占位 |

### C 端 · 全屏子页（隐藏底栏）

- **商学院** — 页标题「商学院」。频道：项目教学 | 案例拆解 | 进阶技巧 | 我的学习
- **课程详情** — 图文（标题 + 正文 + 通栏图，文末推荐课程）| 视频（单视频+进度）

### 首页模块顺序（自上而下）

顶栏 → Banner → 金刚区 → 三格数据 → 商学院/活动中心双卡 → 设置工作台 → 榜单（横滑两榜）→ 找项目（国内/国外 Tab）→ 右豹动态（**首页 2 条**）→ OPC 机构 → 品牌 footer。

首页不出现「有邀请码？」或「绑定邀请码」。

### 学院管理后台

侧栏：**课程管理** | **分类管理** | **新人推荐** | **学习数据** | （占位：项目管理、工具管理）

分类「新建 / 编辑」打开弹窗，保存后列表按排序刷新；已启用分类同步到商学院频道，停用则隐藏该频道。「我的学习」不在此配置。

## Voice and Tone

- **商学院卡：** 可见标题「商学院」，学习导向，🎓 前缀；**活动卡：** 收益/活动，🔥 前缀。
- **金刚区：** 四个标题原样使用：新手学院、收益榜单、社群中心、邀请好友。不另写口号。
- **工具 Sheet：** 必须可读 **「为什么推荐」**（效率、少重复操作）。
- **数据示例：** 明示演示、不计入账户；空态不假装有真实收益。
- **后台学习数据：** 「不建设复杂教务体系」— 克制承诺。

## Component Patterns

### 双卡轮播（商学院 / 活动）

- 各 2 帧；点击切帧；**4.2s** 自动轮播。
- **商学院卡：** 可见标题「商学院」。点击 **capture 优先** → 打开商学院，不触发轮播切帧。
- 活动卡：点击仍切轮播帧，不打开商学院。

### 金刚区

- 位置：Banner 正下方、三格数据之上。四列，从左到右：新手学院、收益榜单、社群中心、邀请好友。
- **社群中心** → 现有机构详情页列表。
- **邀请好友** → 现有邀请落地页。
- **收益榜单** → 现有 OPC 经营榜单。与下方横滑榜里 OPC 卡进入的是同一页。
- **新手学院** → 落点暂定。点击停留在首页，不进入商学院。

### 榜单横滑

- 两榜卡片仍在首页；每榜最多 5 条；TOP3 强、4–5 弱。
- 点 OPC 经营数据榜进入 OPC 经营榜单，与金刚区「收益榜单」同一目的页。
- 点平台项目榜进入该榜自己的完整榜。

### 找项目

- 赛道 Tab 切换列表；行内：图标、标题、副文案（项目数·顶尖月入 + 收益 em）；底部分割行 **project-tool-chips** + 更多。
- Chip / 更多 → **工具 Bottom Sheet**（单工具或全集）；遮罩关；「去使用」关 Sheet 并进入使用流。

### Sheets 族

- 设置工作台 Sheet、工具 Sheet、数据示例 Sheet — 统一：mask 点击关闭、从底滑入、z-index 工具层 ≥900。
- 工具页市场卡片 **没有** 适用项目 / 推荐项目行。变现侧工具详情里的适用项目仍保留。

### 学院列表 / 详情

- 频道 filter；我的学习 → 最近学习 / 收藏。列表里非视频课标为 **图文课程**。
- 图文详情顶部与视频课相同：标题、分类标签、类型、简介。其下用正文替换视频播放器，高度随内容增高，不套播放器的固定高度；正文为段落（约 15px、行高 1.75、色 `#3d4c63`）与 16:9 通栏图（圆角 8px）交替。页面向下滚动阅读全文。
- **推荐课程** 在正文滚动到底之后（同分类优先）。无推荐时显示空态。推荐区不计入完课。
- 图文完课 = 正文最后一块进入阅读；视频 ≥90% = 完课；收藏 toggle。

## State Patterns

| 状态 | 行为 |
|------|------|
| 首页 vs 子页 | 商学院/详情：底栏 hidden |
| 新手学院 | 入口可见；点击不离开首页 |
| 数据 Tab 空态 | `rb123-empty`；分析入口拦截或引导；可开示例数据 Sheet |
| 示例数据模式 | 顶栏「退出演示」回空态 |
| 课程编辑（后台） | 无标题 → 保存拦截 toast |
| 分类「我的学习」 | 后台不可配置（仅 C 端资产入口） |

## Interaction Primitives

- **Tab 切换：** `.app-page` active 切换。路径气泡已退出，任何 Tab 都不显示。
- **金刚区：** 每个入口是一颗按钮。已定的三个入口离开首页；新手学院不离开。
- **Toast：** 短反馈（我的 Tab、去使用等）。
- **列表/宫格（变现）：** 宫格 **隐藏** 推荐工具行（V32）。

## Accessibility Floor

- 金刚区四颗按钮的无障碍名称等于可见标题。
- Sheet 关闭钮带 `aria-label`。
- 收益/数字除颜色外保留字重/字号层级（DESIGN 已定义）；数据 Hero  gold-on-black 对比仅作用于数据页。
- `[ASSUMPTION: 生产包需补全焦点顺序与屏幕阅读器对轮播/chips 的朗读，Demo 未全覆盖。]`

## Key Flows

### Flow 1 · 小周：学院 → 找项目 → 工具 Sheet（UJ-1）

1. 首页识别标题为「商学院」的学习卡 → 进入商学院（底栏消失）。
2. 项目教学 → 打开图文课 → 读正文与通栏图 → 文末看到推荐课程 → 返回。
3. 回首页 → 找项目国内 Tab → 点 tool chip → Sheet 见推荐原因 → 去使用。

**Climax:** 学习与赚钱路径在同一 App 内可串联，工具理由可读。

### Flow 2 · 小周：从金刚区打开已有页（UJ-4）

1. 首页 Banner 下方看到四个入口。
2. 点社群中心 → 机构详情页列表；返回。点邀请好友 → 邀请落地页；返回。点收益榜单 → OPC 经营榜单。
3. 点新手学院 → 仍停在首页。

**Climax:** 三个已定入口打开的是已经在用的页面；新手学院不把人送进商学院。

### Flow 3 · 李姐：后台课 + 完课口径（UJ-3）

1. 课程管理 → 新建视频课 → 保存上架。
2. 学习数据 → 读 analytics 说明：图文正文末块 / 视频 90%。
3. （Demo）预览 → 可选切 C 端。

**Climax:** 运营理解完课定义，且不期待教务级功能。

## Responsive & Platform

- `@media (min-width:700px)`：手机壳圆角、底栏 inset。金刚区跟着手机画布宽度走，仍是四列。
- Demo `rb-admin-mode`：全屏后台，隐藏 `.phone`。

## Mock Coverage

| Surface | 参考 |
|---------|------|
| 首页金刚区 + 商学院卡 | [mockups/home-shortcut-grid.html](mockups/home-shortcut-grid.html) |
| C 端全 Tab + 学院（图文详情、工具页无项目行） | [demo/iteration/creator-home-2-opt-demo.html](../../../demo/iteration/creator-home-2-opt-demo.html) |
| 学院后台 | 同上（Admin 切换） |
| FR 迭代入口 | [demo/iteration/fr-creator-home-2-opt.html](../../../demo/iteration/fr-creator-home-2-opt.html) |

**Spine-only / 延后：** 金刚区与商学院卡标题以 [首页稿](mockups/home-shortcut-grid.html) 为准；Demo V125 全页仍是旧画面。生产登录/session、真实 API 错误态；**新手引导 rb122** 本刀延后（D-3）。动态「查看全部」链 **现网已有完整页**（D-2）。新手学院的目的页未定。
