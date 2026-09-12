---
title: 'FR-014 已领详情出示「发布技巧」字段名'
type: 'feature'
created: '2026-09-10'
status: 'done'
route: 'one-shot'
---

# FR-014 已领详情出示「发布技巧」字段名

## Intent

**Problem:** 已领详情去掉发布标题/描述后，`#pubTips` 只剩复制按钮和正文，用户看不出这是「发布技巧」字段。

**Approach:** 已领中部继续只保留一段只读正文，但必须出示字段名「发布技巧」；不恢复分区标题「作品发布技巧」，也不拆回标题/描述。

## Suggested Review Order

**字段出示**

- 已领卡片左侧出字段名，右侧复制，正文仍是一段只读框
  [`yijian-daifa-demo.html:1099`](../../demo/iteration/yijian-daifa-demo.html#L1099)

- 字段表与已领/已回填态都写明字段名仍在，空也保留
  [`yijian-daifa-rules.js:102`](../../demo/iteration/yijian-daifa-rules.js#L102)

**合同对齐**

- C 端详情合同改为「字段名 + 一段」，禁止分区标题和两段拆分
  [`requirements.md:96`](../specs/spec-fr014-yijian-daifa/requirements.md#L96)

**测试**

- 领取后、已回填进详情、手改上传、空技巧都锁 `.tip-label` 为「发布技巧」
  [`test_yijian_daifa.py:61`](../../tests/e2e/test_yijian_daifa.py#L61)
