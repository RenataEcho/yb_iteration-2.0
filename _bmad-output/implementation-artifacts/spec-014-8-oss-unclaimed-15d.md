---
title: 'FR-014 未领 15 天删除与稿件状态'
type: 'feature'
created: '2026-09-11'
status: 'done'
route: 'one-shot'
---

# FR-014 未领 15 天删除与稿件状态

## Intent

已领取稿继续走 3/7。一直没人领的成片不能无限占桶：上传起 15 天系统删。后台或剪辑手主动删除必须同步清阿里云，且不能恢复。列表用「稿件状态」区分正常 / 已删除。

## Approach

- `uploadedAt` + `fileStatus` + `ossDeletedReason`
- `sweepOss`：无领取且满 15 天 → 已删除；有领取且满 7 天 → 已删除
- `softDeleteWork`：行保留，OSS 标记删除，不可恢复
- 后台稿件管理、PC list 增加稿件状态列
- 业务解释 + 剪辑手操作说明写清删除规则；操作说明只留步骤和注意事项
