# Reconcile — spec-fr014-yijian-daifa

**Input:** `_bmad-output/specs/spec-fr014-yijian-daifa/`（SPEC / requirements / glossary / flows）
**Against:** `prd.md` + `addendum.md`

## Gaps

1. 合同 `剩余次数 = 免费 + 已购`、扣次「先免费后已购」。PRD 已扩成三桶并写明顺序，但未要求后续更新 FR-014-13 字面——下游 SPEC 必须改合同句，不能只改本 PRD。
2. 「一词多条已回填取 filledAt 最近」只约束分账对象；实际累计按代发关键词上已结算应结算加总，不依赖取哪条 claim。PRD 未复述这条，实施时勿误把池子也改成「只加最近一条 claim 的分成」。
3. C 端介绍「每个关键词只领一个作品」与合同「一词多条」并存。本增量不仲裁，池子按合同代发关键词集合读。
4. 门禁「次数不足只开兑换」仍指向历史兑换浮层。PRD FR-10 已写不改浮层；售罄后的引导也不得改该浮层。
5. 定性语气（成片有成本、领了要发）未进 FR，由 SM-C1 接住，不写入历史页文案。
