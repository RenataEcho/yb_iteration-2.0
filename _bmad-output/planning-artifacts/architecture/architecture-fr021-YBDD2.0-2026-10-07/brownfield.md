# FR-021 · 2.0优化 · 棕地

## 1. 仓库现状

- **无** 创作者首页/学院相关后端源码与 OpenAPI 可引用（与 FR-006 活动中心相同）。
- **禁止** 在本 FR 文档或 Demo 注释中**发明** HTTP 路径作为验收依据。
- **有** 完整交互真源：`demo/iteration/creator-home-2-opt-demo.html`（V125）及 FR 页 iframe。
- **有** 已定稿 PRD、UX spines、Epic 分解；架构以能力名 + 域实体为准。

## 2. 现网假定（未在本仓库验证）

| 域 | 假定 |
| --- | --- |
| 登录 | C 端/Admin 已登录；网关解析 `userId` / `operatorId` |
| 项目 | 存在 **ProjectCatalog**（赛道国内/国外、收益文案等） |
| 工具 | 存在 **ToolCatalog（工具市场主数据）**；FR-021 **只配 ProjectToolLink + recommendReason**，工具字段禁止副本化 |
| 榜单/动态 | 存在只读 Feed 或运营配置；本 FR 不改其主数据模型 |
| 账户收益 | **Data Tab** 真实分支读现网收益投影；与学院无写交叉 |

若联调发现某 catalog 不存在，**先** 补平台能力或 **降级** 为 FR 可新表（见 §3），不得 Mock 伪装成现网 API。

## 3. 本 FR 可新存储（现网无则新建）

| 实体 | 说明 |
| --- | --- |
| `Course` / `CourseAsset` | 图集多图+说明；视频 1:1 |
| `CourseCategory` | 项目教学/案例拆解/进阶技巧；不含「我的学习」 |
| `NewbieRecommendConfig` | 标题/引导/推荐 courseId 有序列表 |
| `UserCourseProgress` | 进度与完课时刻 |
| `UserCourseFavorite` | 收藏 |
| `ProjectToolLink` | 项目关联工具 + `recommendReason` |
| `LearningAnalyticsSnapshot` | 可选日聚合；MVP 可 SQL 即时算 |

不得把 **示例数据 Tab** 写入任何收益/订单表。

## 4. 边界

- **不** 实现后台「项目管理」「工具管理」占位菜单（PRD Non-Goal）。
- **不** 建设复杂教务（排课/考试/证书）。
- **不** 改写历史 FR 迭代页；交付入口 `fr-creator-home-2-opt.html`。
- **不** 合并 FR-006 活动中心域。
- Demo 阶段（迭代仓）：不发真实请求；生产 Epic 按 `fe-be-contract.md` 联调。

## 5. 与 Epic 的对应

| Epic | 架构焦点 |
| --- | --- |
| 1 首页减噪 | BFF `创作者首页` + Feed 只读 |
| 2 找项目+工具 | `ProjectToolLink` + ToolCatalog |
| 3 今日路径 | `今日路径推荐` + 本地拖拽 AD-4 |
| 4 学院 C 端 | `学院学习` + `学习进度上报` |
| 5 三 Tab | 工具/变现/数据 BFF；AD-5 |
| 6 学院后台 | Admin 写 AcademyDomain |
| 7 Token/a11y | 前端 scoped；非后端 |
