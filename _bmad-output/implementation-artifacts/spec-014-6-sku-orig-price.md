---
title: 'FR-014 次数商品增加原价划线'
type: 'feature'
created: '2026-09-10'
status: 'done'
route: 'one-shot'
---

# FR-014 次数商品增加原价划线

## Intent

**Problem:** 次数商品只有现价积分，兑换浮层看不出优惠，运营也无法配置原价。

**Approach:** 档位增加 `origPoints`（原价，积分，须 ≥ 现价）；C 端仅当原价 > 现价出示划线价。

## Suggested Review Order

**数据与校验**

- 种子档带原价；缺字段按已知档回填，未知档回落到现价
  [`yijian-daifa-store.js:41`](../../demo/iteration/yijian-daifa-store.js#L41)

- 后台改价/新增必填原价，拦截原价 < 现价
  [`fr-opc-yijian-daifa.html:2539`](../../demo/iteration/fr-opc-yijian-daifa.html#L2539)

**C 端划线**

- 原价 > 现价才渲染 `<s class="orig">`
  [`yijian-daifa-demo.html:1305`](../../demo/iteration/yijian-daifa-demo.html#L1305)

- 划线样式跟在现价前
  [`yijian-daifa-demo.html:318`](../../demo/iteration/yijian-daifa-demo.html#L318)

**合同与规则**

- FR-014-13 写明条件划线
  [`requirements.md:140`](../specs/spec-fr014-yijian-daifa/requirements.md#L140)

- 兑换浮层字段与后台改价规则对齐
  [`yijian-daifa-rules.js:162`](../../demo/iteration/yijian-daifa-rules.js#L162)

**测试**

- 改价透传、原价过低拦截、相等不划线
  [`test_yijian_daifa.py:121`](../../tests/e2e/test_yijian_daifa.py#L121)
