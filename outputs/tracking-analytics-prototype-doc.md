# 右豹管理后台 - 埋点统计原型文档

## 1. 背景与目标

基于《右豹小程序首页-变现埋点需求》中的事件体系，后台新增一级菜单“埋点统计”，用于承接用户端首页、变现、项目入口、Banner、工具和冷启动链路的数据分析。

该模块不是埋点配置后台，而是数据分析后台，主要给运营和数据分析师使用：

- 运营：看用户行为趋势、活动效果、新用户激活、项目入口转化、Banner 位置效率和工具使用表现。
- 数据分析师：核对事件口径、排查缺参/重复/异常波动、导出事件数据、沉淀业务漏斗。

埋点事件声明覆盖三个端口：小程序、安卓、iOS。所有统计页均支持或预留端口筛选，字段口径统一使用 platform 区分 mini_program、android、ios。

本模块不展示金额、订单、支付、钱包、兑换码和收益类指标。

## 2. 菜单结构

后台新增一级菜单：埋点统计。

二级菜单如下：

- 统计总览
- 埋点事件需求
- 冷启动分析
- 页面事件分析
- 转化漏斗
- 事件质量
- 经营分析

所有二级菜单均保留“需求规则”入口，点击后以右侧抽屉展示当前页面的数据口径、字段规则、字段注释、统计公式和交互规则。

## 3. 埋点事件需求

该页面用于把最初交付的《右豹小程序首页-变现埋点需求.xlsx》嵌入后台，作为事件索引页面。

页面内容：

- 顶部展示事件总数、页面曝光事件数、冷启动事件数、验收规则数。
- 表格字段包含事件ID、事件中文名、适用端口、触发位置、事件类型、核心参数、分析用途。
- 支持事件总表、冷启动、首页、变现、项目详情、公共参数 Tab 切换。
- 保留“查看 Excel 文件”入口，打开完整 Excel 交付物。

字段注释：

- 事件ID：研发上报的唯一事件名，必须稳定，不允许随页面文案变化。
- 事件中文名：给产品、运营、测试识别事件含义的中文说明。
- 适用端口：事件需要上报的端，取值为小程序、安卓、iOS。
- 触发位置：用户在哪个页面、模块或按钮触发事件。
- 事件类型：launch、page_view、exposure、click、submit、result。
- 核心参数：当前事件必须携带的业务字段，用于分组、归因和公式计算。
- 分析用途：该事件主要回答的业务问题，如入口转化、Banner位置效率、冷启动激活。

事件清理规则：

- 钱包相关事件不进入埋点统计需求。
- 组合提词结果事件不进入埋点统计需求，仅保留组合提词提交点击用于意向分析。
- 官方任务台、钱包、其他入口的复制类事件不进入埋点统计需求。
- 消息入口事件不进入埋点统计需求。
- 项目发布相关事件只保留项目详情页面曝光，其他项目发布过程事件不进入埋点统计需求。

新增重点事件：

- yb_banner_exposure：Banner 曝光，参数包含 banner_id、banner_name、banner_position、banner_page。
- yb_banner_click：Banner 点击，参数包含 banner_id、banner_name、banner_position、banner_page、target_type、target_id。
- yb_project_entry_exposure：项目入口页曝光，参数包含 page_id、source_page、source_module、project_id、project_name、position_index。
- yb_project_detail_view：项目详情曝光，参数包含 project_id、project_name、track_name、source_page。

表格规则：

- 长英文事件ID和参数必须自动换行。
- 中文说明必须跟随列宽换行。
- 不允许事件ID、参数、中文说明和相邻列内容重叠。
- 页面宽度不足时优先保持表格在当前屏幕内阅读，必要时才横向滚动。

## 4. 统计总览

### 4.1 页面定位

统计总览是埋点统计的默认页，用于快速回答“今天/近 7 日用户整体行为是否正常”“核心事件是否有明显变化”“哪些事件最值得运营关注”。

### 4.2 筛选区

- 日期范围：今日、近 7 日、近 30 日、自定义。
- 端口：全部端口、小程序、安卓、iOS。
- 端来源：全部、首页、变现、项目详情、工具。
- 用户类型：全部用户、新用户、老用户。
- 渠道：全部渠道、自然打开、分享、小程序码、公众号。
- 事件名称：支持事件名和中文名模糊搜索。

字段注释：

- 日期范围：按事件 client_time 或服务端接收时间过滤。
- 端口：按 platform 过滤。
- 端来源：按 page_id、source_page 或业务入口映射。
- 用户类型：按 is_new_user 或用户生命周期标签过滤。
- 渠道：按 source_scene、launch_scene 映射。

### 4.3 核心指标与公式

- 事件触发次数：关联全部保留的 yb_ 前缀事件；公式=count(event_id)。
- 触发用户数：关联全部保留的 yb_ 前缀事件；公式=count_distinct(user_id)。
- 新用户激活率：分子=yb_new_user_activation_complete 去重用户数；分母=yb_new_user_first_open 去重用户数；公式=分子/分母。
- 埋点成功率：成功入库事件数 / 接收事件数。
- 曝光趋势：关联 yb_page_view、yb_module_exposure、yb_cold_start_page_view、yb_first_project_recommend_exposure、yb_project_entry_exposure、yb_banner_exposure；公式=按日期 count(event_id)。
- 点击趋势：关联 yb_search_entry_click、yb_banner_click、yb_project_card_click、yb_tool_entry_click、yb_workbench_project_click 等 click 事件；公式=按日期 count(event_id)。
- 提交趋势：关联 yb_search_submit、yb_prompt_combo_submit_click；公式=按日期 count(event_id)。
- 完成趋势：关联 yb_route_customization_complete、yb_tool_use_result、yb_new_user_activation_complete；公式=按日期 count(event_id)。

### 4.4 图表与表格

- 核心事件趋势：支持曝光、点击、提交、完成四类事件切换。
- 运营关注事件：展示项目卡片点击、Banner 1号位点击、路径定制完成、工具使用完成等重点事件。
- 事件排行：字段包含排名、事件名、事件中文名、模块、触发次数、触发用户数、人均次数、转化说明。
- 事件排行增加对比趋势图，支持今日/昨日、本周/上周和日期筛选；变化率=(当前周期值-对比周期值)/对比周期值。

## 5. 冷启动分析

### 5.1 页面定位

冷启动分析用于观察新用户首次进入右豹后的完整转化，重点判断路径定制、首批推荐项目、项目详情和首次关键动作是否有效。

### 5.2 筛选区与字段注释

- 新用户周期：D0、D1、D3、D7，表示首次打开后的生命周期。
- 端口：全部端口、小程序、安卓、iOS，按 platform 过滤。
- 来源场景：固定为小程序码、服务号、小程序分享，来自 source_scene 或 launch_scene 映射。
- 用户目标：兼职副业、内容创作、项目变现等，来自路径定制答案。
- 激活类型：轻激活、强激活，由后端或数据层根据行为规则生成。
- 项目：按 first_project_id 或 project_id 过滤。

### 5.3 核心指标与公式

- 新用户首次打开：event_id=yb_new_user_first_open；公式=count_distinct(user_id)。
- 路径定制完成率：count_distinct(user_id where event_id=yb_route_customization_complete) / count_distinct(user_id where event_id=yb_new_user_first_open)。
- 首次项目点击率：count_distinct(user_id where event_id=yb_first_project_click) / count_distinct(user_id where event_id=yb_new_user_first_open)。
- 首次详情承接率：count_distinct(user_id where event_id=yb_first_project_detail_view) / count_distinct(user_id where event_id=yb_first_project_click)。
- 新用户激活率：count_distinct(user_id where event_id=yb_new_user_activation_complete) / count_distinct(user_id where event_id=yb_new_user_first_open)。

### 5.4 冷启动漏斗

漏斗节点：

1. 首次打开：yb_new_user_first_open。
2. 首页曝光：yb_cold_start_page_view 或 yb_page_view(page_id=home, is_new_user=true)。
3. 路径定制完成：yb_route_customization_complete。
4. 首次项目点击：yb_first_project_click。
5. 首次详情曝光：yb_first_project_detail_view。
6. 首次关键动作：yb_first_action_click。

每一步按 user_id 去重，且必须按 client_time 严格满足先后顺序。

### 5.5 首个项目表现

按 first_project_id 聚合，展示：

- 首个项目：first_project_id 对应项目名称。
- 曝光用户：yb_first_project_recommend_exposure 去重用户数。
- 首次点击用户：yb_first_project_click 去重用户数。
- 详情曝光用户：yb_first_project_detail_view 去重用户数。
- 首次关键动作用户：yb_first_action_click 去重用户数。
- 激活完成用户：yb_new_user_activation_complete 去重用户数。
- 点击率：首次点击用户 / 曝光用户。
- 激活率：激活完成用户 / 曝光用户。
- 首个项目表现增加对比趋势图，支持今日/昨日、本周/上周和日期筛选。
- 项目点击率变化=当前周期首次点击用户/当前周期曝光用户 - 对比周期首次点击用户/对比周期曝光用户。
- 项目激活率变化=当前周期激活完成用户/当前周期曝光用户 - 对比周期激活完成用户/对比周期曝光用户。

## 6. 页面事件分析

### 6.1 页面定位

页面事件分析用于观察每个页面、模块和按钮的曝光、点击、提交和完成表现，帮助运营识别用户行为重心，也帮助数据分析师核对事件覆盖完整性。

### 6.2 筛选区与字段注释

- 端口：全部端口、小程序、安卓、iOS。
- 页面：全部页面、首页、变现、搜索页、项目详情、工具页。
- 模块：顶部搜索、Banner、我的工作台、项目列表、工具入口、变现-Banner、变现-项目赛道等。
- 事件类型：page_view、exposure、click、submit、result。
- 用户类型：全部用户、新用户、老用户。
- 关键词：事件名、页面、模块模糊查询。

明细字段注释：

- 页面：事件发生页面，来自 page_id/page_name。
- 模块：事件发生模块，来自 module_id/module_name。
- 事件名：event_id。
- 事件中文名：业务可读名称。
- 事件类型：事件分类。
- 触发次数：当前事件 count(event_id)。
- 用户数：当前事件 count_distinct(user_id)。
- 点击率/成功率：点击事件展示 click_uv/exposure_uv，结果事件展示 success_count/result_count。
- 核心参数：当前事件用于分析的必填参数。

### 6.3 指标与公式

- 页面曝光PV：关联 yb_page_view、yb_cold_start_page_view、yb_route_question_view、yb_first_project_detail_view；公式=count(event_id)。
- 页面曝光UV：同页面曝光事件；公式=count_distinct(user_id)。
- 模块曝光：关联 yb_module_exposure、yb_banner_exposure、yb_project_entry_exposure、yb_first_project_recommend_exposure、yb_onboarding_popup_exposure；公式=count(event_id)。
- 点击次数：关联 event_type=click 的事件；公式=count(event_id)。
- 点击转化率：点击事件去重用户数 / 对应页面或模块曝光去重用户数。
- 变现-Banner：关联 yb_banner_exposure、yb_banner_click，条件 banner_page=monetize；CTR=yb_banner_click 去重用户数/yb_banner_exposure 去重用户数。
- 变现-项目赛道：关联 yb_track_click，按 track_id、track_name 聚合点击次数和点击用户数；后续可串联 yb_project_card_click、yb_project_detail_view 分析承接。
- 页面与模块事件明细增加对比趋势图，支持今日/昨日、本周/上周和日期筛选；页面模块点击率变化=当前周期 click_uv/exposure_uv - 对比周期 click_uv/exposure_uv。

## 7. 转化漏斗

### 7.1 页面定位

转化漏斗用于沉淀常用行为路径，帮助运营快速发现哪一步流失最大。本页不展示金额、订单、支付、钱包、兑换码指标。

### 7.2 支持的漏斗模板

- 首页到项目：首页曝光 → 搜索/项目入口点击 → 项目卡片点击 → 项目详情曝光 → 关键动作点击。
- Banner位置转化：Banner曝光 → Banner点击 → 目标页曝光 → 项目详情曝光。
- 项目入口页对比：入口页曝光 → 项目入口曝光 → 项目点击 → 项目详情曝光。
- 冷启动激活：首次打开 → 路径定制完成 → 首次项目点击 → 首次项目详情 → 激活完成。
- 工具使用：工具曝光 → 工具点击 → 使用开始 → 使用结果。

### 7.3 筛选区与字段注释

- 漏斗类型：后台预设的行为链路模板。
- 端口：全部端口、小程序、安卓、iOS。
- 日期范围：按 client_time 或服务端接收时间过滤。
- 日期范围支持今日、昨日、本周、上周、近7日、近30日、自定义。
- 用户类型：全部用户、新用户、老用户。
- 项目/工具：按 project_id 或 tool_id 过滤。

### 7.4 事件ID与公式

- 首页到项目：首页曝光 yb_page_view(page_id=home) → 搜索/项目入口点击 yb_search_entry_click、yb_workbench_project_click、yb_track_click、yb_banner_click → 项目卡片点击 yb_project_card_click → 项目详情曝光 yb_project_detail_view 或 yb_page_view(page_id=project_detail) → 关键动作点击 yb_first_action_click。
- Banner位置转化：yb_banner_exposure → yb_banner_click → yb_page_view(target_page_id) → yb_project_detail_view；按 banner_position 分组计算。
- 项目入口页对比：yb_page_view(source_page) → yb_project_entry_exposure → yb_project_card_click → yb_project_detail_view；按 source_page/page_id 分组计算。
- 冷启动激活：yb_new_user_first_open → yb_route_customization_complete → yb_first_project_click → yb_first_project_detail_view → yb_new_user_activation_complete。
- 工具使用：yb_tool_exposure → yb_tool_entry_click → yb_tool_use_start → yb_tool_use_result。
- 单步转化率=当前步骤去重用户数 / 上一步去重用户数。
- 整体转化率=最后一步去重用户数 / 第一步去重用户数。
- 流失率=1 - 下一步去重用户数 / 当前步骤去重用户数。
- 转化漏斗增加对比趋势模块，支持今日/昨日、本周/上周和日期筛选。
- 每个漏斗步骤需展示当前周期人数、对比周期人数、单步转化率差值和流失率差值。
- 单步转化率差值=当前周期单步转化率-对比周期单步转化率。
- 流失扩大判断：当前周期流失率-对比周期流失率超过阈值时标记为断点风险。

## 8. 事件质量

### 8.1 页面定位

事件质量用于判断埋点数据是否可信，重点监控缺参、重复上报、异常峰值、未上报和行为完成断链。

### 8.2 筛选区与字段注释

- 日期范围：今日、近7日、近30日。
- 端口：全部端口、小程序、安卓、iOS。
- 质量类型：缺参、异常峰值、重复上报、未上报。
- 影响等级：高、中、低，由影响核心漏斗程度和发生比例共同判定。
- 责任方：前端、后端、数据。
- 事件名：支持 event_id 搜索。

问题明细字段注释：

- 事件名：出现质量问题的 event_id。
- 问题类型：缺参、异常峰值、重复上报、未上报。
- 影响字段：出现问题的参数名，如 banner_position、project_id、platform。
- 发生次数：当前筛选范围内命中该质量问题的事件次数。
- 影响等级：高、中、低。
- 责任方：前端、后端、数据。
- 处理状态：待修复、排查中、待确认、已处理。

### 8.3 指标与公式

- 上报成功率：关联全部保留的 yb_ 事件接收日志和入库日志；公式=success_ingest_count / received_count。
- 缺参事件：关联全部保留的 yb_ 事件；公式=count(event_id where required_param is null or empty)。
- 异常波动：关联全部保留的 yb_ 事件；公式=count(event_id where abs(today_count - avg_7d_count)/avg_7d_count > threshold)。
- 待修复问题：关联质量规则表；公式=count(issue_status in 待修复、排查中、待确认)。
- 首访事件去重：关联 yb_new_user_first_open；公式=max(count(event_id by user_id)) <= 1。
- Banner字段完整：关联 yb_banner_exposure、yb_banner_click；必填 banner_id、banner_name、banner_position、banner_page。
- 项目字段完整：关联 yb_project_entry_exposure、yb_project_card_click、yb_project_detail_view、yb_first_project_click；必填 project_id、project_name、source_page 或 source_module。
- 行为完成闭环：关联 yb_search_submit、yb_prompt_combo_submit_click、yb_tool_use_start 以及 yb_route_customization_complete、yb_tool_use_result、yb_new_user_activation_complete；公式=30秒内存在完成事件或可解释状态的起点用户数 / 起点用户数。

## 9. 经营分析

### 9.1 页面定位

经营分析参考用户提供的“首页经营分析驾驶舱”结构，保留驾驶舱、KPI、漏斗、趋势、排行、洞察的形态，但去掉所有金额、订单、支付和收益相关指标。

### 9.2 筛选区与字段注释

- 日期范围：今日、近7日、近30日、自定义。
- 端口：全部端口、小程序、安卓、iOS。
- 用户类型：全部用户、新用户、老用户。
- 入口页：全部入口页、首页、变现页、路径定制页、工具页。
- 项目：全部项目或指定 project_id。

### 9.3 核心指标与公式

- 访问UV：事件ID=yb_page_view；公式=count_distinct(user_id)。
- 项目曝光UV：事件ID in (yb_project_entry_exposure,yb_workbench_project_exposure,yb_first_project_recommend_exposure)；公式=count_distinct(user_id)。
- 项目点击UV：事件ID in (yb_project_card_click,yb_workbench_project_click,yb_first_project_click)；公式=count_distinct(user_id)。
- 项目点击率：项目点击UV / 项目曝光UV。
- 项目详情UV：事件ID in (yb_project_detail_view,yb_first_project_detail_view) 或 yb_page_view(page_id=project_detail)；公式=count_distinct(user_id)。
- 详情承接率：项目详情UV / 项目点击UV。
- 新用户激活UV：事件ID=yb_new_user_activation_complete；公式=count_distinct(user_id)。
- 有效使用UV：事件ID in (yb_tool_use_result,yb_route_customization_complete,yb_first_action_click)；公式=count_distinct(user_id)。

### 9.4 Banner位置效果分析

字段：

- 位置：banner_position，如 1号位、2号位、3号位。
- 展示页面：banner_page，如首页、变现页。
- Banner名称：banner_name。
- 曝光UV：yb_banner_exposure 去重用户数。
- 点击UV：yb_banner_click 去重用户数。
- 点击率：点击UV / 曝光UV。
- 详情承接UV：Banner点击后进入项目详情的去重用户数。
- 详情承接率：详情承接UV / 点击UV。

该表用于分析哪个 Banner 位置点击率最高，以及高点击位置是否真的承接到项目详情。

### 9.5 项目入口页转化对比

字段：

- 入口页：source_page/page_id，如首页-我的工作台、首页-Banner、变现页-项目列表、路径定制-推荐项目。
- 项目曝光UV：yb_project_entry_exposure 或对应入口曝光事件的去重用户数。
- 项目点击UV：yb_project_card_click、yb_workbench_project_click、yb_first_project_click 的去重用户数。
- 项目点击率：项目点击UV / 项目曝光UV。
- 详情曝光UV：yb_project_detail_view 或 yb_page_view(page_id=project_detail) 去重用户数。
- 详情承接率：详情曝光UV / 项目点击UV。
- 关联事件：该行统计涉及的主要 event_id。

该表用于对比每个项目入口页的数据，判断哪个页面转化更高。

## 10. 后台原型交互

- 一级菜单“埋点统计”支持展开和折叠。
- 点击二级菜单切换对应统计页面。
- 每个页面标题旁均有“需求规则”按钮，点击后打开右侧抽屉。
- 查询按钮刷新当前页面原型数据并提示“查询已完成”。
- 导出按钮导出当前页面对应的 CSV 原型数据。
- 统计总览趋势图支持曝光、点击、提交、完成切换。
- 经营分析趋势图支持 UV、项目、激活切换。
- 埋点事件需求表格中的长英文和中文说明必须自动换行，不能重叠。

## 11. 数据依赖

埋点统计依赖以下事件体系：

- 公共事件：yb_page_view、yb_module_exposure、yb_bottom_tab_click。
- Banner事件：yb_banner_exposure、yb_banner_click。
- 首页事件：yb_search_entry_click、yb_search_submit、yb_search_hot_click、yb_tutorial_click、yb_group_click、yb_workbench_project_exposure、yb_workbench_project_click。
- 变现事件：yb_monetize_region_tab_click、yb_monetize_card_click、yb_prompt_combo_submit_click、yb_activity_click、yb_track_click、yb_project_card_click。
- 项目事件：yb_project_entry_exposure、yb_project_card_click、yb_project_detail_view、yb_page_view(page_id=project_detail)。
- 工具事件：yb_tool_exposure、yb_tool_entry_click、yb_tool_use_start、yb_tool_use_result。
- 冷启动事件：yb_new_user_first_open、yb_cold_start_page_view、yb_route_customization_complete、yb_first_project_recommend_exposure、yb_first_project_click、yb_first_project_detail_view、yb_first_action_click、yb_new_user_activation_complete。

## 12. 验收标准

- 后台可看到“埋点统计”一级菜单，并能展开/折叠。
- “埋点统计”下二级菜单完整展示统计总览、埋点事件需求、冷启动分析、页面事件分析、转化漏斗、事件质量、经营分析。
- 每个页面均能正常切换，标题、描述、查询、导出、需求规则入口正常。
- 需求规则抽屉内容与当前页面一致。
- 每个埋点数据分析页的需求规则抽屉需写清字段注释、统计值关联的事件ID和计算公式。
- 图表、表格、指标卡无明显遮挡或文本溢出。
- 英文字段和中文字段在表格中不重叠，长内容自动换行。
- 查询、导出、趋势切换等按钮有可感知反馈。
- 经营分析页不出现金额、订单、支付、钱包、兑换码和收益指标。
