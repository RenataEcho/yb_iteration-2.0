# FR-021 前后端能力契约（交付）

合同源：`ARCHITECTURE-SPINE.md`、`prd-YBDD2.0-2026-10-07/prd.md`、`EXPERIENCE.md`。  
**禁止发明 HTTP 路径**；联调用下表能力名。Demo 不发真实请求。

## 1. 能力一览

| 能力名 | 调用方 | 入参 | 出参（要点） | 不写/不调 |
| --- | --- | --- | --- | --- |
| 创作者首页 | C 端 | `userId` | 模块序 DTO：双卡、stats、rankCards[]、projectTrackTabs、projects[]（含 tools[]）、dynamicFeed（≤2）、pathBubbleEligible | 第 3 条动态；未发布课程 |
| 学院课程列表 | C 端 | `userId`, `channel` | `courses[]`（封面、类型、时长/张数、进度摘要） | 草稿/下架 |
| 学院课程详情 | C 端 | `userId`, `courseId` | 资产列表或 videoUrl、收藏态、进度断点 | 未发布 |
| 学习进度上报 | C 端 | `userId`, `courseId`, `clientReportId`, 图集 index 或 video position | `progressPercent`, `completed`, `completedAt?` | 完课规则在服务端算 |
| 学院收藏切换 | C 端 | `userId`, `courseId`, `favorite` | 最新收藏态 | — |
| 项目工具 Sheet | C 端 | `userId`, `projectId`, `toolId?` | 工具项（**名称/描述/范围来自工具市场主数据**）+ `recommendReason`（来自 ProjectToolLink） | 无映射则不返回该项；禁止返回与 ToolCatalog 不一致的副本字段源 |
| 今日路径推荐 | C 端 | `userId`, `date` | 文案 + `steps[]` + `recommendedProjects[3]` | 拖拽坐标 |
| 数据概览 | C 端 | `userId` | 黑金 Hero 字段或 **空态** | 无数据时禁止伪造真实金额 |
| 示例数据 | C 端 | `userId`, `action=enter\|exit` | 演示 DTO，**`isDemo:true`** | 任何账本写 |
| 学院课程保存 | Admin | `operatorId`, 课程表单 | `courseId`, `status` | 无标题拒绝 |
| 学院课程上下架 | Admin | `operatorId`, `courseId`, `status` | 更新后状态 | — |
| 学院分类保存 | Admin | `operatorId`, 分类行 | 分类列表 | 「我的学习」分类 |
| 新人推荐保存 | Admin | `operatorId`, 配置 | 生效配置 | — |
| 学习数据查询 | Admin | `operatorId`, 筛选 | 课程维度 UV/学习人数/完成率/收藏 | 复杂教务报表 |
| 学院课程预览 | Admin | `operatorId`, `courseId` | 打开 C 端 **学院课程详情** 路由（图集/视频播放）；列表不提供预览按钮 | 列表内嵌播放器 |
| 右豹动态全部 | C 端 | — | 导航至 **现网已有** 完整动态列表页 | 本 FR 新建列表页 |

变现/工具 Tab 复用现网 **`工具市场`** / **`项目详情`** 能力时，仅追加 **Sheet 组装** 与 **decision-chips** 筛选入参；缺失时在 brownfield §2 登记后再补行。

## 2. 下发组装（C 端必须一致）

| 字段/块 | 下发当且仅当 |
| --- | --- |
| `newbieAcademyCard` / `activityCard` | 运营配置或默认；学院卡点击进学院，不参与活动轮播帧 |
| `rankCards[].items` | 每榜 ≤5；TOP 权重由前端 token 实现，数据只供 rank/value |
| `dynamicFeed.items` | **长度 ≤2**（首页）；「查看全部」跳转现网已有完整页（D-2） |
| `projects[].tools[]` | 存在 `ProjectToolLink`；含 `recommendReason` |
| `course.intro`, `assets[]` | 课程 `published` |
| `progress.continueLabel` | 存在未完成进度 |
| `completed` | ProgressSvc 按 AD-2 计算 |

## 3. 完课（能力「学习进度上报」响应）

- **图集：** 上报 `lastAssetIndex`；当 `lastAssetIndex >= assetCount - 1` → `completed=true`。
- **视频：** 上报 `positionSec`, `durationSec`；当 `positionSec/durationSec >= 0.90` → `completed=true`。
- **学习数据** 完成率 = 完课用户数 / 学习人数（同一投影）。

## 4. 错误与边界

| 场景 | 行为 |
| --- | --- |
| 未登录 | 网关 401；C 端跳现网登录 |
| 课程下架后仍在学 | 详情可读进度；列表不出现；上报仍接受直至完课 |
| 示例数据态 | 响应头或 body `isDemo:true`；禁止触发分析/job |
| Admin 无权限 | 403 + 无 body 细节 |

## 5. Demo 迭代仓

`creator-home-2-opt-demo.html` 可用内存数据模拟上表；**字段名与语义** 与生产 DTO 对齐，便于 Epic 7 前后端联调替换 Mock 层。
