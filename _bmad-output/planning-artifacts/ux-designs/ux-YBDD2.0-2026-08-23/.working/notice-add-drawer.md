# FR-010 · 新增通知 · 表单抽屉

**日期**：2026-09-07  
**状态**：已落地 Demo  
**Live**：`demo/iteration/fr-agent-cert.html?tab=notice` → `#ntAddDrawer`

## 决策

字段含类型、标题、描述、配图、接收范围 + 代理勾选，用 520px Form Config Drawer，不用 480px 弹窗，也不用 720px Wide。

## 分组

1. 通知内容 — 类型卡片 + 标题 + 描述  
2. 配图 — 虚线上传，选填  
3. 接收范围 — 全部 / 指定卡片 + 勾选列表  

Footer：取消 | 确认发送。打开时关闭详情/规则抽屉。
