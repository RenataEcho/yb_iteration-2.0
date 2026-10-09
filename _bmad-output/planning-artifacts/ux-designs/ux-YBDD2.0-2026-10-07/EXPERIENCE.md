---
name: 右豹创作者 2.0 · 体验合同
description: FR-021 C 端 IA、状态、交互与关键流；学院后台行为摘要。
status: final
updated: 2026-10-08
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
| 首页 | `home` | 含今日路径气泡 |
| 变现 | `monetize` | 赛道 + decision-chips + 列表/宫格 |
| 工具 | `tools` | 场景 + 工具市场 |
| 数据 | `data` | 黑金 Hero；空态 / 示例数据 |
| 我的 | — | Demo toast 占位 |

### C 端 · 全屏子页（隐藏底栏）

- **学院中心** — 频道：项目教学 | 案例拆解 | 进阶技巧 | 我的学习
- **课程详情** — 图文（标题 + 正文 + 通栏图，文末推荐课程）| 视频（单视频+进度）

### 首页模块顺序（自上而下）

顶栏 → Banner → 三格数据 → 新手学院/活动中心双卡 → 设置工作台 → 榜单（横滑两榜）→ 找项目（国内/国外 Tab）→ 右豹动态（**首页 2 条**）→ OPC 机构 → 品牌 footer。

### 学院管理后台

侧栏：**课程管理** | **分类管理** | **新人推荐** | **学习数据** | （占位：项目管理、工具管理）

## Voice and Tone

- **学院卡：** 学习导向，🎓 前缀；**活动卡：** 收益/活动，🔥 前缀。
- **今日路径：** 「今日为你规划的路径」— 行动导向，强调 领取→发布→回填→结算。
- **工具 Sheet：** 必须可读 **「为什么推荐」**（效率、少重复操作）。
- **数据示例：** 明示演示、不计入账户；空态不假装有真实收益。
- **后台学习数据：** 「不建设复杂教务体系」— 克制承诺。

## Component Patterns

### 双卡轮播（学院 / 活动）

- 各 2 帧；点击切帧；**4.2s** 自动轮播。
- **学院中心入口卡：** 点击 **capture 优先** → 打开学院中心，不触发轮播切帧。
- 活动卡：点击仍切轮播帧。

### 榜单横滑

- 两榜卡片；每榜最多 5 条；TOP3 强、4–5 弱；整卡可进完整榜（toast/导航）。

### 找项目

- 赛道 Tab 切换列表；行内：图标、标题、副文案（项目数·顶尖月入 + 收益 em）；底部分割行 **project-tool-chips** + 更多。
- Chip / 更多 → **工具 Bottom Sheet**（单工具或全集）；遮罩关；「去使用」关 Sheet 并进入使用流。

### 今日路径

- 仅 **home** Tab 显示 `#pathFloat`。
- 拖拽阈值 **4px**；拖时收起 pop；clamp 在 `.phone` 内，底栏安全区 ~90px。
- 点击 toggle `.open` 展开/收起。

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
| 首页 vs 子页 | 学院/详情：底栏 hidden |
| 数据 Tab 空态 | `rb123-empty`；分析入口拦截或引导；可开示例数据 Sheet |
| 示例数据模式 | 顶栏「退出演示」回空态 |
| 课程编辑（后台） | 无标题 → 保存拦截 toast |
| 分类「我的学习」 | 后台不可配置（仅 C 端资产入口） |

## Interaction Primitives

- **Tab 切换：** `.app-page` active 切换；首页才显示路径气泡。
- **Toast：** 短反馈（我的 Tab、去使用等）。
- **Pointer + touch：** 路径气泡拖拽双支持。
- **列表/宫格（变现）：** 宫格 **隐藏** 推荐工具行（V32）。

## Accessibility Floor

- 路径气泡：`aria-label`（如「展开今日规划路径」）；Sheet 关闭钮带 `aria-label`。
- 拖拽控件除 pointer 外保留 click 展开（阈值区分拖/点）。
- 收益/数字除颜色外保留字重/字号层级（DESIGN 已定义）；数据 Hero  gold-on-black 对比仅作用于数据页。
- `[ASSUMPTION: 生产包需补全焦点顺序与屏幕阅读器对轮播/chips 的朗读，Demo 未全覆盖。]`

## Key Flows

### Flow 1 · 小周：学院 → 找项目 → 工具 Sheet（UJ-1）

1. 首页识别 🎓 学院卡 → 进入学院中心（底栏消失）。
2. 项目教学 → 打开图文课 → 读正文与通栏图 → 文末看到推荐课程 → 返回。
3. 回首页 → 找项目国内 Tab → 点 tool chip → Sheet 见推荐原因 → 去使用。

**Climax:** 学习与赚钱路径在同一 App 内可串联，工具理由可读。

### Flow 2 · 小周：今日路径（UJ-2）

1. 首页点气泡展开 → 看 1/3 与三项目。
2. 拖到不挡找项目 → 收起。
3. 切变现 Tab → 气泡消失。

**Climax:** 路径辅助不霸占首屏，且可让出操作区域。

### Flow 3 · 李姐：后台课 + 完课口径（UJ-3）

1. 课程管理 → 新建视频课 → 保存上架。
2. 学习数据 → 读 analytics 说明：图文正文末块 / 视频 90%。
3. （Demo）预览 → 可选切 C 端。

**Climax:** 运营理解完课定义，且不期待教务级功能。

## Responsive & Platform

- `@media (min-width:700px)`：手机壳圆角、底栏 inset；路径气泡在宽屏下相对画布定位（V12/V13）。
- Demo `rb-admin-mode`：全屏后台，隐藏 `.phone`。

## Mock Coverage

| Surface | 参考 |
|---------|------|
| C 端全 Tab + 学院（图文详情、工具页无项目行） | [demo/iteration/creator-home-2-opt-demo.html](../../../demo/iteration/creator-home-2-opt-demo.html) |
| 学院后台 | 同上（Admin 切换） |
| FR 迭代入口 | [demo/iteration/fr-creator-home-2-opt.html](../../../demo/iteration/fr-creator-home-2-opt.html) |

**Spine-only / 延后：** 生产登录/session、真实 API 错误态；**新手引导 rb122** 本刀延后（D-3）。动态「查看全部」链 **现网已有完整页**（D-2）。
