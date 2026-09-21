# FR-006 前后端能力契约（交付）

合同源：`SPEC.md`、`admin-fields.md`、`visibility-rules.md`。禁止发明 HTTP 路径；联调用能力名。Demo 不发真实请求。

已冻结故事 `spec-fr006-admin-config.md`、`spec-fr006-fe-be-interaction.md` 相对本文件 **superseded**（仍写三组平铺、表单记已参与），禁止再按其 Always 实现。

## 1. 能力一览

| 能力名 | 入参 | 出参（仅已下发字段） | 不返回 |
|---|---|---|---|
| 活动列表 | `filter`：all / ongoing / ended / participated；`userId`（已参与必带） | `banner`（0 或 1 条置顶）；`list[]` 图1卡片字段 | 隐藏活动；`listOutboundUrl` |
| 活动详情 | `activityId`；`userId`（登录则带，用于展位与领取态） | 下发组装：基础信息 + Tab 子集 + 领取按钮 + 可选 `awardStatus` | 隐藏活动视为不存在；半填按钮/案例/规则 |
| 活动榜单 | `activityId` | `rows[]`（≤ `leaderboardLimit`）；`self` | `leaderboardVisible≠开启` 时整能力不调/不返回名单 |
| 已参与集合 | `userId` | 显示池 ∩ 该用户已参与的活动列表 | 查看、期外点击、跳转失败写入 |
| 后台保存 | 第 1–2 步字段 | 活动主数据（按下发组装） | 校验失败整单不写 |
| 参与明细 | `activityId` | 用户 ID、昵称、手机号、作品数 | — |
| 达标用户 | `activityId` | 用户 ID、昵称、手机号、达标锚定、排名、奖品/金额、奖励计算 | 不建设奖励管理录入 |

卡片字段：`title`、`description`（未填则无灰字）、`tags[]` 不出现在列表灰字、`projects[]`、时间、角标、`initialViews`、可选 `enrolledCount`、固定「查看」。

详情另含：`cover`、`introContent`、完整 `cases[]`、`leaderboardVisible` + `leaderboardLimit` + 可选两描述、`needClaimButtons` + 已配 `claimButtons[]`、可选 `showUserAward` 控制的 `awardStatus` / `awardPrize`。

## 2. 下发组装（后端必须执行）

与 `admin-fields.md` §3 同一套，C / 后台不得各写一份。

| 字段 | 下发当且仅当 |
|---|---|
| `initialViews` | 始终；缺省 0 |
| `enrolledCount` | 后台填了数字 |
| `description` | 非空（去首尾空白后） |
| `cover` | 已上传图片 |
| `introContent` | 去空白与空标签后仍有可见文本，或含 img/video/table |
| `cases[]` | 仅完整条（名称非空且附件 ≥1）；完整条 ≥1 才带数组 |
| `leaderboardVisible` + `leaderboardLimit` | 开启且 `leaderboardLimit≥1` |
| `leaderboardLineDesc` / `leaderboardPeriodDesc` | 开启且该字段非空 |
| `claimButtons[]` | `needClaimButtons=true` 且该条齐全；最多 2；半填丢弃 |
| `needClaimButtons` | 始终（关则前端无底栏且不带按钮数组） |
| `showUserAward` | 始终（默认否） |
| `awardStatus` | `showUserAward=true` 且后端已算出 `won` / `not_won`；缺算则当未配置、不展示展位 |
| `awardPrize` | 仅 `won` 且有展示串 |
| `rewardRules[]` | 仅完整规则（见 §4）；C 端不渲染正文 |

`isReward`、审核中、`excludeProjects`、`listOutboundUrl`、报名表单：**禁止出现在出参**。

本人展位 **不** 绑定「是否有榜单」。有榜单无开关 → 无展位。无榜单有开关 → 仍可有展位。

## 3. 能力「活动榜单」

- 仅详情已下发榜单 Tab 时请求。隐藏开关：不请求。
- `rows[]`：`rank`（从 1）、`avatarUrl`（可空，C 端用头像初文）、`nicknameMasked`（能力已脱敏，C 端禁止再用明文）、`value`（已是展示串）。禁止 `badges`、禁止昵称旁标签。
- 行数 ≤ `leaderboardLimit`；不足则更短，不补空行。
- 开启时 **必带 `self`**：`nicknameMasked`、`rankLabel`、`avatarUrl`、`value`。本人不在 TOP 内时 `rankLabel` 仍为展示串（如 `999+`），底栏仍在。
- 行描述 / 周期描述 **不是** 本能力字段，读活动主数据已下发的 `leaderboardLineDesc` / `leaderboardPeriodDesc`。
- 空 `rows`：仍有榜单 Tab（若该 Tab 被配置）；正文「暂无榜单数据」；`self` 仍可展示。

## 4. 奖励规则完整性（后台保存 / 下发）

**播放奖 `play`**：≥1 条完整阶梯。每档：`playsFrom`、`playsTo` 均为整数 ≥1 且 `to≥from`；`prizeKind` 为 `cash` 或 `goods`；`prizeValue` 非空。`cash` 的 `prizeValue` 为金额数字串，展示为 `{prizeValue} 元`；`goods` 为礼品名称原文。

**全勤奖 `attendance`**：`dailyWorks≥1`、`streakDays≥1`、`bonus` 非空。

**累计项目收益奖 `revenue`**：`brandProjects[]` 与 `otherBizProjects[]` **至少一类非空**；≥1 条完整名次阶梯（`rankFrom`/`rankTo` 规则同播放区间；奖品同播放奖）。禁止 `excludeProjects`。

不完整整条丢弃，不影响其他已完整规则。允许 0 条规则（活动仍可保存）。

多条规则 **独立命中**，不互相覆盖。达标用户「奖励计算」列出全部命中项。同一类型内区间由运营配成互斥；若重叠，按该类型数组 **从上到下第一条** `from≤x≤to` 命中即停。

播放量、项目收益、全勤稿件的 **统计口径沿用现网**，本 FR 不新建统计页、不发明其 HTTP。

## 5. 已参与与领取

写入仅两条（已登录）：

1. 角标=进行中，介绍 Tab，点击不需跳转且已配齐全的领取按钮。
2. 同上，需跳转且 **客户端成功调起跳转**（不要求落地页 HTTP 200）。Demo / 联调失败约定：地址含 `fail` 视为失败。

不记：列表/Banner「查看」；待开始/已结束（按钮可展示但 `disabled`）；跳转失败；未登录（本 FR 不单开未登录 UI，请求在已登录会话发出）。

去重 `(userId, activityId)`：已存在则保持原记录时间与状态，不新增行。两个领取按钮点任意一个都算同一条已参与。重复点击不需跳转：保持 `clickedLabel`，不再插行。

无介绍 Tab：即使 `needClaimButtons=true` 也 **永不展示底栏**（领取只挂介绍）。

## 6. 显示池、筛选、深链

- `visible=隐藏`：不进 Banner、四个列表 Tab、详情。深链 / 打开隐藏 `activityId`：详情能力当不存在，C 端留在列表。
- 已参与后被隐藏：已参与 Tab **不再出现**该卡（显示池 ∩ 已参与）。
- 筛选无「待开始」Tab。待开始只出现在「全部」。进行中 / 已结束按角标滤。已参与不按角标滤，但仍须在显示池。
- 置顶 Banner 不随筛选（含已参与）隐藏；置顶活动不在下方列表重复（已参与 Tab 仍可出该卡片）。
- 列表序：既有「排序」列，**数值越大越靠前**；同分再按稳定 id。本 FR 不新增排序写入字段。
- 角标：`now < startAt` 待开始；`now ≥ startAt` 且（`endAt` 空或 `now ≤ endAt`）进行中；`endAt` 有值且 `now > endAt` 已结束。`endAt` 当天结束时刻前（含等于）算进行中。
- `initialViews` 不下发累加、C 端不 +1。

## 7. 详情装配

Tab 顺序：介绍 → 案例 → 榜单。实际存在 **不足 2 个** 则无 Tab 栏，正文仍在内容卡片。默认第一个实际存在 Tab。无介绍、仅案例或仅榜单：无领取底栏。

`showUserAward=true` 且已下发 `awardStatus`：信息卡与 Tab 之间展示展位，**不依赖活动是否结束、不依赖是否有榜单**。`won` 文案「恭喜获奖」可拼 `awardPrize`；`not_won`「未获奖，再接再厉」。无审核中。列表卡片 **不** 打已获奖角标。

## 8. 后台保存校验

拒绝整单：标题空或 >64；无开始时间；无活动状态；`endAt` 有值且早于开始；显示且置顶时显示池已有 **另一条** 置顶（不自动取消对方，提示运营先取消）。

不拦保存：介绍/案例/榜单/领取/奖励半填（半填只是不下发）。榜单开启但 `leaderboardLimit<1`：拒绝或视为未开启——本 FR 取 **拒绝保存并提示填前 x 名**（与 Demo 一致）。

## 9. 研发对照顺序

1. 本文件 + `admin-fields.md` + `visibility-rules.md`  
2. `SPEC.md` CAP 验收  
3. `activity-center-impl-prompts.js` 切片（节点名对齐流程图）  
4. Demo：`activity-center-demo.html` / `fr-activity-center.html`  

冲突时 **1 > 2 > 3 > 4**。Mock 视觉服从 Demo，字段与显隐服从 1。
