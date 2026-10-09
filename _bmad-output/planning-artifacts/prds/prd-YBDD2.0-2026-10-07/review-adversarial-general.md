# Adversarial Review — FR-021 2.0优化

## Verdict

**Ship with minor follow-ups.** 无 block 级矛盾；实现团队需以 Demo diff + addendum 缺口表做走查。

## Top findings

1. **high** §4.5 与 §4.1 边界 — 「首页结构不动」（V22）已写在 FR-12，但 FR-12–14 变更面大，需架构确认是否单 Epic 或拆 C 端 Tab 子 Epic。
2. **medium** FR-11 完课 — C 端 UI 与 FR-15 统计口径一致，但未写进度上报失败/离线续播规则。
3. **medium** reconcile 缺口「设置工作台」— 若 2.0 必含，缺 FR。
4. **low** SM-3 基线 TBD — 可接受为增量 PRD，上线前补基线或删 SM-3。

## Ignored (noise)

- Demo base64 资源体积 — 非 PRD 范畴。
