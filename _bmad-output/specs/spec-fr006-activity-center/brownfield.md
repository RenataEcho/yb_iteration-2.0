# 活动中心 · 棕地

本仓库无活动中心后端接口可引用。禁止发明 HTTP 路径。

## 1. v1 仍有效

来源：`demo/iteration/fr-activity-center.html`。

- 入口：个人中心 / 首页等既有入口；页头「活动中心」。
- 列表视觉：`demo/iteration/activity-center-demo.html`。
- 后台：新增/编辑同一套两步向导（基础信息与详情内容 / 活动规则）；补上 v1「是否置顶」。废除三步空态；废除单页平铺「基础信息 → 活动跳转 → 活动详情」。
- 运营不直接改 C 端角标文案。
- 站内可登录已实现；本 FR 不改登录。

相对 v1，以下约束已废除：不重做详情页；无跳转则进旧详情仅展示活动内容。

## 2. 现有奖励管理

**现有业务流程。本 FR 不建设、不改造奖励管理录入页；榜单不投影其五列。**

本人获奖/未获奖 **不是** 读奖励管理名单。由能力「活动详情」在 `showUserAward=true` 时下发 `awardStatus`。废除作为作业项：`PLACEHOLDER_EXISTING_REWARD_MGMT`、`PLACEHOLDER_REWARD_LIST_SOURCE`。榜单行走能力「活动榜单」；Demo 阶段 Mock，禁止发明 HTTP 路径。

曾点名过后台列（用户ID、昵称、活动排名、奖品/金额、期间收益）属于现有流程认知，**不作为本 FR 验收**。达标用户奖励计算只用本活动 `rewardRules`。

## 3. 本 FR 可新存储

活动主数据（含封面）、领取配置、奖励规则、已参与记录、榜单开关与 TOP 条数：现网无则本 FR 可新表，不得伪装成奖励管理。名单数据由能力「活动榜单」提供。不建报名表单提交表作为本增量交付。不把奖励管理改造成获奖展位数据源。

## 4. 边界

- 不并入 FR-008 礼品中心。
- `outputs/points-admin-prd.md` 的「任务奖励管理」不是这里的现有奖励管理，禁止混用。
- Demo 阶段不做真实接口（`ITERATION-FR-GUIDE.md`）。
- 已冻结故事 `spec-fr006-admin-config.md`（三组平铺）与 `spec-fr006-fe-be-interaction.md`（表单提交记已参与）相对本轮合同 **superseded**；禁止再按其 Always 改字段表。
