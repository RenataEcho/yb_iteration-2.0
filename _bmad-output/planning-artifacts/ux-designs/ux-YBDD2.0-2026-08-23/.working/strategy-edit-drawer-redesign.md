# FR-005 · 策略编辑抽屉 · UX 重设计说明

**日期**：2026-08-27  
**状态**：已落地 Demo  
**Live**：`demo/iteration/fr-project-order-optimize.html` → `#strategyEditDrawer`

## 问题

此前为塞下 9 行结算字段表 + ID 规则表，对 `#strategyEditDrawer` 做了大量 compact override：

- 标题 14px → 实际 12px，说明 10px
- 表单 label 10px、input 高 26px
- config-block 间距 8px，表格 cell padding 2–4px
- 表格固定宽 392px，在 720px 抽屉内显得挤且不对齐

**根因**：用「压缩字号/间距」代替「合理分组 + 标准 token」。

## 设计决策

| 维度 | 旧（紧凑） | 新（标准） |
|------|-----------|-----------|
| 抽屉宽度 | 720px（宽但未利用） | 720px + 表格 `width:100%` |
| Header | 12×16px, 标题14px | 16×20px, 标题15px, 副标题12px |
| Body | 10×14px | 0×24×24px（顶部分组自带 padding） |
| 区段标题 | 12px | 14px `{typography.rule-heading}` |
| 区段间距 | 8px | 20px + 分割线 |
| 表单控件 | 26px / 11px | 34px / 13px（表内 32px / 12px） |
| 说明条 | 10px 灰底小条 | 12px info 蓝底 callout |

## 信息架构（6 组）

```
┌─ Header：编辑策略 · {名称} ─────────────────┐
│  副标题：各配置项共存生效，非互斥              │
├─ Body ──────────────────────────────────────┤
│  [顶栏] 策略名称 *                            │
│  ─────────────────                          │
│  [1] 优化项目（多选）                         │
│  ─────────────────                          │
│  [2] 结算字段比例 · 豁免（info + 9行表）       │
│  ─────────────────                          │
│  [3] 白名单隔离（行内 checkbox）              │
│  ─────────────────                          │
│  [4] 前几名不优化（行内 N）                   │
│  ─────────────────                          │
│  [5] ID 差异化比例（可增删表）                │
├─ Footer：取消 | 保存策略 ────────────────────┤
└─────────────────────────────────────────────┘
```

## 类名契约

- `.drawer.wide` — 720px 复杂抽屉壳
- `.drawer-field-top` — 顶栏单字段区
- `.config-block` — 分组容器
- `.config-block-inline` — 单行控件分组
- `.config-block-head` — 分组标题 + 说明
- `.field-ratio-note` — info 说明条
- `.strategy-table` — 抽屉内嵌表格

## 关联文档

- `DESIGN.md` → Wide Config Drawer
- `EXPERIENCE.md` → FR-005 策略配置抽屉
