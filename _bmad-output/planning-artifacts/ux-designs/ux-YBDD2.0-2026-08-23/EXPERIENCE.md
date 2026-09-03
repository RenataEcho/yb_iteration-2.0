---
name: 右豹迭代需求记录后台
status: draft
updated: 2026-09-03
sources:
  - conversation: 迭代需求框架封板（Sprint、FR 版本链、三模板）
  - https://renataecho.github.io/yb_iteration-2.0/
---

# 右豹迭代需求记录后台 — Experience Spine

> 基础 UI 框架 v0.2 · 单层左侧主导航。Spines win on conflict with mockups.

## Foundation

- **Form-factor**：桌面 Web 优先（≥1280px 为设计基准）；1024px 以下 Sidebar 可折叠为图标轨，模板 B mockup 下移。
- **导航模式**：**单层 Sidebar 主导航** — 迭代入口、业务模块、Demo 页均在左侧；不用顶部一级 Tab（TopNav 适用于 SaaS 多版本/多模块，本迭代需求台不采用）。
- **UI system**：纯 HTML/CSS/JS 原型栈（与现有 [yb_iteration-2.0](https://renataecho.github.io/yb_iteration-2.0/) 一致）；视觉 token 见同目录 `DESIGN.md`。
- **定位**：产品侧迭代需求 **记录 + Demo 交付**，非运营后台；无登录与权限。
- **交互深度**：模板 A 增删改弹窗 **可点、Mock 提交**；模板 B 场景按钮 **驱动 mockup 联动**。

## Information Architecture

| Surface | 路径 / 入口 | 模板 | 用途 |
|---------|-------------|------|------|
| Sprint 概览 | Sidebar → 迭代 | — | 当前 Sprint FR 清单、变更摘要 |
| Sprint 列表 | Sidebar → 迭代 | — | 小批次迭代列表 |
| Sprint 详情 | Sprint 列表 → 详情 | — | 本批次需求包 + FR 版本 |
| 业务 Demo 页 | Sidebar 模块分组下 | A / B / C | 可交互 Demo + 需求规则 |
| FR 版本对比 | Sprint 详情 / Page Header 版本下拉 | — | v1→v2→v3 |

### Sidebar 结构（主导航）

```
[品牌 + 当前 Sprint 徽章]
── 迭代 ──
  Sprint 概览 · Sprint 列表
── 积分管理 ──
  积分商品 · 前后端交互需求
── 工具管理 ──
  前端交互需求
── 埋点统计 ──
  埋点事件需求（仅需求清单类）
── 迭代需求专题 ──
  实名相关 · 导师优化 · 礼品中心 …
```

### 导航原则

- **全部主需求在左侧**；主内容区无顶栏 Tab。
- 仅挂 **本 Sprint 有变更** 的 Demo 页。
- 面包屑在主内容区顶，辅助定位（模块 / 页面名），不替代 Sidebar。

→ 框架预览：`mockups/framework-shell.html`

## Voice and Tone

| Do | Don't |
|----|-------|
| 「需求规则」「业务流程」「边界规则」 | 「系统配置」「运营分析」 |
| 「Demo 数据，提交后不保存」 | 假装真实后端已成功 |
| 「FR-012 · v3 当前」 | 「工单 #1234」 |
| 描述用「本迭代变更…」 | 写成完整产品说明书 |

## Component Patterns

### 框架 Shell

| 区域 | 行为 |
|------|------|
| Sidebar | **唯一主导航**；顶品牌+Sprint；分组展示迭代/模块/Demo 页；可折叠 |
| 主内容区 | 无 TopNav；面包屑 + Page Header + Demo |
| Page Header | 标题 + FR 徽章 + 版本下拉 + 「需求规则」 |

### 模板 A — 后台数据表类

| 区块 | 行为 |
|------|------|
| Filter Card | 可选；筛选仅影响 Demo 表 Mock 数据 |
| Table Card | 示例数据；操作列：编辑 / 复制 / 上下架等 |
| 新增/编辑 Modal | 表单校验（必填、正整数等）；提交 → toast + 表刷新 |
| 需求规则 Drawer | 点击「需求规则」右侧滑入；Esc / 关闭钮 / 再次点击收起 |

**抽屉内容顺序（固定）**：①业务目标 ②字段规则 ③交互规则 ④边界规则 ⑤业务流程（文字 + 流程图）。

### 模板 B — 前端页面类

| 区块 | 行为 |
|------|------|
| 场景切换器 | 单选；切换 → 左文案 + 右 mockup 同步 |
| Mockup 区 | 手机框；展示 C 端态（banner、按钮文案、禁用态） |
| 新窗口打开 | 新 tab 仅 mockup + 场景条，便于评审截图 |

### 模板 C — 前后端交互链路类

| 区块 | 行为 |
|------|------|
| Tab | 前端需求 \| 接口契约 \| 状态与异常 |
| 交互清单表 | 模块 × 触发 × 后端交互 × 刷新 × 失败处理 |
| 业务流程 | 跨 Tab 总览区；文字 + 流程图 |

### FR 版本选择器

- 默认 **当前最新版**；下拉 v3 / v2 / v1。
- 切换版本 → Page Header 徽章、抽屉规则、Demo 表字段 **整页快照切换**。
- 历史版只读，展示所属 Sprint 标签。

## State Patterns

| 状态 | 处理 |
|------|------|
| 规则抽屉关闭 | Demo 全宽；「需求规则」按钮 default |
| 规则抽屉打开 | Demo 可继续操作；抽屉 overlay，不 modal 阻断 |
| Modal 打开 | 一层；打开时抽屉保持但不可点（z-index 低于 modal） |
| 版本切换中 | Header 版本徽章 loading 200ms → 内容 cross-fade |
| Mock 提交成功 | toast 3s：「Demo 已保存（Mock，不写入后端）」 |
| 空 Sprint | Sprint 详情空态 + 链到「如何新增 FR」说明 |

## Interaction Primitives

- **需求规则**：Page Header 按钮 toggle 抽屉；抽屉内锚点目录（1–5）点击滚动。
- **版本**：Header 下拉；Sprint 详情页可点 FR 行跳转对应 Demo 页并带版本 query。
- **模板 A CRUD**：新增 → modal；编辑行 → modal 预填；删除/上下架 → confirm dialog。
- **模板 B 场景**：键盘 1–5 切换场景（可选增强）；默认鼠标点击。
- **Esc**：关闭最顶层 overlay（modal > drawer）。

## Accessibility Floor

- 抽屉：`role="dialog"` + `aria-labelledby`；打开时焦点 trap 在抽屉内。
- 场景切换：`aria-pressed` 表示选中。
- 表格操作链接：≥44px 点击热区（padding 扩展）。
- 流程图：抽屉内提供文字步骤 duplicate（不依赖纯图形理解）。
- 对比度：规则正文 `{colors.text-primary}` on `{colors.drawer-bg}` ≥ 4.5:1。

## Key Flows

### Flow 1 — 研发小陈：按模块找 Demo

1. 打开原型，Sidebar **工具管理 → 前端交互需求**。
2. Page Header 见 **FR-024 · v2**；点 **需求规则** 浏览边界与业务流程。
3. 切换场景 **「积分不足」**，mockup 按钮变为充值引导。
4. ** climax **：不看 PRD 文档，抽屉 + mockup 已足够开工。

### Flow 2 — 产品阿琳：发布 FR 新版本

1. **Sprint 管理 → Sprint-W38** 见 FR-012 待交付。
2. 进入 **积分商品** Demo 页，版本下拉切 **v3**，确认表字段与抽屉规则一致。
3. 通知研发：「FR-012 v3 已更新，看 Demo 页即可。」

### Flow 3 — 模板 A 可点 Demo

1. **积分商品** → **新增档位** → 填表单 → 提交。
2. Toast 提示 Mock；表新增一行草稿态。
3. **编辑** 行 → 改标签 → 保存 → 行内 Tag 更新。

## Product-Specific Sections

### FR Demo 写入规范（canonical）

后续迭代 FR 的 Demo 结构、需求规则抽屉、流程图呈现等**默认按项目规范文档执行**：

→ [`demo/iteration/ITERATION-FR-GUIDE.md`](../../../../demo/iteration/ITERATION-FR-GUIDE.md)（2026-08-23 确认，参考 FR-001）

交互组件 live Demo：[`demo/iteration/component-spec-demo.html`](../../../../demo/iteration/component-spec-demo.html)

### FR-005 订单优化 · 策略配置抽屉

| 抽屉 | 入口 | 模式 | 行为 |
|------|------|------|------|
| 策略详情 | 列表「查看详情」 | Wide Config · 只读 | 摘要 `detail-row` + 结算字段表 + ID 规则表；Footer「编辑策略」跳转编辑抽屉 |
| 策略编辑 | 列表「编辑策略」/ 详情 Footer | Wide Config · 可编辑 | 6 个 `{config-block}` 分组；保存 → toast + 列表刷新 |

**编辑抽屉分组顺序（固定）**

1. **策略名称**（`.drawer-field-top`）
2. **优化项目** — 多选下拉，变更后刷新结算字段表
3. **结算字段比例 · 特定单量豁免** — 9 行内嵌表 + `.field-ratio-note` 说明条
4. **白名单隔离** — 行内 checkbox（用户 / 关键词）
5. **前几名不优化** — 行内数字输入（0=关）
6. **书籍 / 短剧 ID 差异化比例** — 可增删行内嵌表

**交互要点**

- 各配置项**共存生效**，副标题「各配置项共存生效，非互斥」保留在 Header。
- 优化项目未选时，结算字段表展示空态文案「请先选择优化项目」。
- 详情 ↔ 编辑：详情关闭后打开编辑，避免双层抽屉叠加。
- Esc / 遮罩 / 关闭钮 / Footer 取消：均关闭且不保存（编辑态）。

→ Live mock：[`demo/iteration/fr-project-order-optimize.html`](../../../../demo/iteration/fr-project-order-optimize.html)

### FR-007 订单分发 · 纯后台

纯管理后台（模板 A，无 C 端）：同组项目合并上传官方订单，按订单关键词查右豹关键词库所属项目后自动分发。

| 后台 Tab | 行为 |
|----------|------|
| 项目分组 | 表格展示；新增/编辑用项目多选（同订单优化）；仅同组可分发 |
| 分发记录 | 上传选所属分组并展示组内项目；已分发按项目聚合，未匹配只汇总笔数与金额；无「上传项目」列；**不支持重新分发**，未匹配仅可下载 |

**当前分组**：番茄小说组 / 番茄畅听组 / 悟空组 / 红果短剧APP 组。未入组项目不可发起分发。

→ Live mock：[`demo/iteration/fr-project-order-distribute.html`](../../../../demo/iteration/fr-project-order-distribute.html)

### FR-008 礼品中心

节假日实物礼。C 端个人中心独立入口，仅列表。后台：礼品列表 → 点发放名单人数进明细。色板与活动中心一致（浅底 + 橙色）。

| 表面 | 行为 |
|------|------|
| 列表 | 仅状态=显示的礼品。封面 + 礼物角标、标题、描述、标签、底部时间；点卡片出详情。收益礼：进度（当前累计 / 达标）+ 三态（恭喜获得 / 待达标 / 遗憾错失）。指定用户礼：定制礼品卡，无进度条，文案「特别为你」 |
| 详情弹窗 | 弹窗海报、介绍文案、收益统计日期（收益礼）、灰区展示物流状态 / 单号 / 收货地址 |
| 缺地址 | 占名额、标缺地址、不寄；详情点补全 → 「规则：跳转至现在的收获地址页面」 |
| 站内信 | 入选 + 发货各一条，点击都进礼品中心，文案可配 |
| 发放人员 | 单选：指定用户（填用户ID，不看收益）或 收益达标。一人一礼一次 |
| 收益达标判定 | 用户维度、统计闭区间内用户项目收益（已结算+未结算）≥ 达标额（等于也算）。期内首次达标即锁定；回落不撤销；期结束仍未达=遗憾错失、不入选。已入选不因改高门槛被踢出 |
| 礼品字段 | 标题、描述、介绍、多标签、展示图 / 详情图 / 弹窗海报（附件上传）、状态、站内信文案 |
| 发放名单 | 点人数进明细；顶栏统计未发信 / 缺地址；查询后：发入选/发货信、导单号、补礼品 |
| 明细 | 用户ID、入选方式、收获地址、物流平台、单号、当前状态、站内信、更新时间 |
| 物流 | 导入单号 → 已发货；满 7 天自动签收 |

→ Live mock：[`demo/iteration/fr-gift-center.html`](../../../../demo/iteration/fr-gift-center.html) · C 端 [`gift-center-demo.html`](../../../../demo/iteration/gift-center-demo.html)

### FR-005 策略配置抽屉（Wide Config Drawer）

| 抽屉 | 入口 | 行为 |
|------|------|------|
| 策略详情 | 策略列表「查看详情」 | 只读；`.config-block` 分组展示摘要 + 结算字段表 + ID 规则表；Footer「编辑策略」跳转编辑抽屉 |
| 策略编辑 | 列表「编辑策略」或详情 Footer | 可编辑；6 个配置分组（名称 → 优化项目 → 结算字段表 → 白名单 → 前几名 → ID 规则）；保存 → toast + 列表刷新 |

**编辑抽屉分组顺序（固定）**：

1. **策略名称** — 顶栏 `.drawer-field-top`，必填
2. **优化项目** — 多选下拉；变更后重算结算字段表行
3. **结算字段比例 · 特定单量豁免** — 9 行内嵌表 + info 说明条
4. **白名单隔离** — 行内 checkbox（用户 / 关键词）
5. **前几名不优化** — 行内数字输入（0=关）
6. **书籍/短剧 ID 差异化比例** — 可增删行内嵌表

**交互原则**：

- 各配置项**共存生效**，副标题明示「非互斥」
- 详情 ↔ 编辑：关闭详情再开编辑，避免双层 wide 抽屉叠压
- 表格空态：12px padding 居中提示，勿用 6px 微行高
- 视觉 token 见 `DESIGN.md` → Wide Config Drawer；**禁止**回退紧凑 override（10px 标题 / 26px 输入）

→ Live：`demo/iteration/fr-project-order-optimize.html`

### 业务流程图呈现（FR Demo · 业务流程 Tab）

- **分层渲染**：SVG 连线层（`flow-edges`）置于节点层（`flow-nodes`）下方，避免连线横穿线框。
- **正交路由**：分叉与汇聚使用水平/垂直折线，走节点间隙专用通道（如 y=208、y=402），不穿过线框。
- **间距**：相邻节点纵向 ≥24px；决策菱形与上下节点 ≥30px。
- **文本**：线框内超 12 字用 `tspan` 换行；副文案降字号、降对比度。
- **Tab 切换**：多张流程图横向 Tab，单面板仅展示一张，底部共用图例。


| 层 | 载体 | 读者 |
|----|------|------|
| 可交互 Demo | 主内容区 | 研发看「长什么样、怎么点」 |
| 结构化规则 | 抽屉 / 模板 B 左栏 | 研发看「字段/边界/流程」 |
| 版本快照 | FR + vN | 追溯「这 Sprint 改了什么」 |

### 非目标（Anti-patterns）

- 不做真实权限、审批、数据持久化。
- 不默认挂载无变更的运营分析页。
- 不用 Swagger 替代模板 C 的「接口契约」Tab  prose。
