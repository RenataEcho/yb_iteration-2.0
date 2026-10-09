# Input Reconciliation — creator-home-2-opt-demo.html

**Input:** `demo/iteration/creator-home-2-opt-demo.html` (V125)  
**Against:** `prd.md`, `addendum.md`

## Covered

- 双端切换、Alt 快捷键、sessionStorage（FR-19）。
- 首页模块顺序、学院/活动双卡、榜单 TOP3/5、动态 2 条（FR-1–FR-4）。
- 找项目 Tab、收益格式、chips+Sheet+推荐原因、V34/V35 分割行（FR-5–FR-7）。
- 今日路径拖拽阈值与首页限定（FR-8–FR-9）。
- 学院频道、详情、我的学习（FR-10–FR-11）。
- 变现/工具/数据主要行为（FR-12–FR-14）。
- 后台四模块字段与完课 90%/末张（FR-15–FR-18）。

## Gaps

1. **新手引导 rb122/rb124**：Demo 有完整分步高亮，PRD 仅 §8 OQ4 待定——有意 defer。
2. **「我的」Tab toast**：FR-1 提到占位，未定义生产行为——需现网对齐或 OQ。
3. **OPC 服务机构列表**：Demo 有模块，PRD 未单独 FR——视为首页 FR-1 顺序一部分，无独立业务规则。
4. **设置工作台 Sheet**：Demo 存在，PRD 未展开字段——若 2.0 必交付需补 FR 或引用现网。

## Demo-only vs production

- FR-19 已标 Demo 切换；预览 260ms 切 C 端在 OQ1。
