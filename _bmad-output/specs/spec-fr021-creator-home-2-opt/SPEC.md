---
id: SPEC-fr021-creator-home-2-opt
companions:
  - requirements.md
  - glossary.md
  - surfaces.md
  - architecture-diagrams.md
  - ../../planning-artifacts/architecture/architecture-fr021-YBDD2.0-2026-10-07/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/architecture/architecture-fr021-YBDD2.0-2026-10-07/fe-be-contract.md
  - ../../planning-artifacts/architecture/architecture-fr021-YBDD2.0-2026-10-07/brownfield.md
  - ../../planning-artifacts/ux-designs/ux-YBDD2.0-2026-10-07/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-YBDD2.0-2026-10-07/EXPERIENCE.md
  - ../../../demo/iteration/creator-home-2-opt-demo.html
  - ../../../demo/iteration/fr-creator-home-2-opt.html
  - ../../../demo/iteration/ITERATION-FR-GUIDE.md
sources:
  - ../../planning-artifacts/prds/prd-YBDD2.0-2026-10-07/prd.md
  - ../../planning-artifacts/prds/prd-YBDD2.0-2026-10-07/addendum.md
  - ../../planning-artifacts/epics-FR-021-2026-10-07.md
---

> **Canonical contract.** 本 SPEC 与 `companions:` 为完整机器合同。功能细则见 `requirements.md`（FR-021-01…19）；能力入参/出参见 `fe-be-contract.md`；AD-1…8 见 `ARCHITECTURE-SPINE.md`；交互与 token 见 UX spines；Demo 行为以 V125 为准。

# 2.0优化 · 创作者首页与学院（FR-021）

## Why

**痛点 + 机会。** 创作者首页同时承担「学」与「赚」，信息堆叠导致新手不知先学什么、工具抢项目主角、动态与榜单分散注意力。2.0 要把层级收成：学院/活动分角色、找项目以收益为主、工具带推荐原因、今日路径不占整屏、学院与后台课/数据/完课口径打通。

## Capabilities

- **CAP-1**
  - **intent:** 创作者在首页按固定顺序浏览减噪后的模块，并分清新手学院与活动中心。
  - **success:** FR-021-01、FR-021-02、FR-021-03、FR-021-04 同时成立；动态首页 ≤2 条。

- **CAP-2**
  - **intent:** 创作者按国内/国外赛道浏览项目，并查看关联工具及推荐原因。
  - **success:** FR-021-05、FR-021-06、FR-021-07 同时成立；Sheet 含 tool-reason；chips 为底部分割行。

- **CAP-3**
  - **intent:** 创作者在首页用可拖拽气泡查看今日路径与推荐项目。
  - **success:** FR-021-08、FR-021-09 同时成立；非首页 Tab 不显示气泡。

- **CAP-4**
  - **intent:** 创作者在学院中心按频道学习图集/视频课，续播进度并收藏。
  - **success:** FR-021-10、FR-021-11 同时成立；完课判定与 CAP-6 口径一致。

- **CAP-5**
  - **intent:** 创作者在变现、工具、数据 Tab 完成选品、查项目、查看数据或受控示例。
  - **success:** FR-021-12、FR-021-13、FR-021-14 同时成立；示例数据不计入账户；#dataPage 样式 scoped。

- **CAP-6**
  - **intent:** 运营维护课程/分类/新人推荐，并查看与 C 端一致的学习完成统计。
  - **success:** FR-021-15、FR-021-16、FR-021-17、FR-021-18 同时成立；不交付项目管理/工具管理菜单。

- **CAP-7**
  - **intent:** 产品/研发在迭代 Demo 中一键切换 C 端与学院后台以验收 FR-021。
  - **success:** FR-021-19 成立；生产包不包含 Demo 切换器（AD-7）。

## Constraints

- **AD-1** 学院写模型与首页读聚合分离：课程/进度/完课不经首页直写表。
- **AD-2** 完课仅 ProgressSvc 派生：图集末张、视频 ≥90%；Admin 学习数据只读同一投影。
- **AD-3** ProjectToolLink 存 projectId/toolId/sort/recommendReason；**ToolCatalog=工具市场主数据**；BFF 组装下发 tools[]。
- **AD-4** 路径推荐可读配置/策略；气泡拖拽坐标仅客户端存储。
- **AD-5** 数据 Tab 示例分支 `isDemo:true`，禁止写账本或触发结算。
- **AD-6** C 端下发组装单点实现（published 课才下发、动态 ≤2 等），见 fe-be-contract §2。
- **AD-8** 黑金样式仅 `#dataPage`（或等价 route module）。
- 禁止发明 HTTP 路径作为验收依据；联调只用 fe-be-contract 能力名（brownfield §1）。
- 交付形态：`ITERATION-FR-GUIDE.md`；C 端橙色；Mockup iframe；Demo 阶段不发真实请求。
- **D-1** Admin 课程预览打开 C 端详情 deep link/等价路由，列表无预览按钮。
- **D-2** 「查看全部」链到现网已有完整动态页，不新路由。
- **D-4** 工具元数据同步 **工具市场**；本 FR 只配关联与 recommendReason。
- **D-5** 设置工作台 **沿用现网**，本 FR 不改。
- PRD/UX spines 与 mock 冲突时 spines 优先。
- 独立 FR-021：不回改历史 FR 页。

## Non-goals

- 后台「项目管理」「工具管理」占位菜单的能力。
- 复杂教务（排课/考试/证书/多级报表）。
- 数据 Tab 示例写入真实收益或对账。
- 生产 App 打包 Demo 双端切换与 Shadow DOM 后台壳。
- 新手引导 rb122/rb124（D-3 延后）。
- 改造首页设置工作台 Sheet（D-5 沿用现网）。

## Success signal

- SM-1：首页减噪走查（学院/活动、TOP3、动态 2 条、找项目布局）相对 Demo 一次通过率 ≥90%。
- SM-2：抽样课程在 C 端进度与 Admin 学习数据完成率零口径冲突。

## Assumptions

- 现网存在 ProjectCatalog、ToolCatalog、登录网关；本仓库无后端源码可引用。
- 榜单/动态 Feed 由现网或本 FR 新表补齐（brownfield §2–3）。

## Decisions（2026-10-07）

- **D-1 课程预览：** C 端学院 **课程详情页** 播放；Admin 列表行仅 **封面+标题**，无列表级预览；编辑/详情内触发预览。
- **D-2 动态查看全部：** 跳转 **现网已实现** 的完整列表页，不新建。
- **D-3 新手引导：** 延后；生产不交付，Demo 可保留。
- **D-4 项目↔工具：** 关联 + recommendReason 本 FR；工具字段 **同步工具市场主数据**。
- **D-5 设置工作台：** **沿用现网**，本 FR 不改造。
