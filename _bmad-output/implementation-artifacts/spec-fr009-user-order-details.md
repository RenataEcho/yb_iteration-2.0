---
title: 'FR-009 用户订单明细查询'
type: 'feature'
created: '2026-09-09'
status: 'done'
baseline_commit: '7114fbb9475298a98a3e170171dc725a31601c7c'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 运营要按用户ID + 日期范围查已审核待结算 / 已结算 / 退款订单明细，且品牌、海外故事、海外短剧、融合、星图都要能查；现工作台只有项目按日订单（不出词面）和项目收益，对不上这条排查。

**Approach:** 在 FR-009 用户数据增加一条只读意图：槽位为用户ID + 日期范围 + 业务 title + 可组合状态；结果区先出表头统计，再出项目明细表与订单明细表。

## Boundaries & Constraints

**Always:**
- 槽位：用户ID、日期范围、业务 title 缺一先澄清，结果区不出假表。
- 状态可组合：已审核待结算、已结算、退款/已退款。未点名状态 = 三种全出。表按所选状态过滤。
- 业务 title 必须由提问带上，识别：品牌业务、海外故事、海外短剧、星图融合、星图。别名：品牌→品牌业务，融合→星图融合。
- 表头 KPI（口径=该用户 + 日期范围 + 该业务，不过滤状态）：日期范围订单量；日期范围累计收益，按已审核 / 已结算 / 已退款拆开。
- 表1 项目明细：项目名称、订单量、订单金额、状态。一行 = 项目 × 状态。
- 表2 订单明细：项目名称、订单ID、关键词、订单日期、订单金额、状态。本意图出词面。
- 状态展示：已审核待结算→已审核；已结算→已结算；退款→已退款。
- `detect()` 必须先于现有 `/订单/`（FR-20 指定项目按日订单），避免把「用户…订单明细」误判成要项目名。
- 同步 UX mockup 副本；「如何使用」与「需求规则」写清本意图。

**Ask First:** 业务 title 枚举要增删；KPI 是否改为只统计所选状态。

**Never:**
- 不开放 NL2SQL；不写库；不把本意图关键词 count-only（那是 FR-20）。
- 不因缺业务 title 回退成「全业务汇总明细」。
- 不改 Sidebar / 双栏骨架 / 既有邀请、注册、团长、收益、关系问法。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 单状态 | `用户 1001 2026-08-01至2026-08-31 品牌业务 已审核待结算订单明细` | KPI 三态齐全；两表仅已审核行；含品牌项目 | N/A |
| 组合状态 | `用户 1001 2026-08-01至2026-08-31 星图融合 已结算和退款订单明细` | 两表含已结算+已退款，不含已审核 | N/A |
| 未点名状态 | `用户 1001 2026-08-01至2026-08-31 海外故事 订单明细` | 两表三种状态都可出现 | N/A |
| 海外短剧 / 星图 | 同上句式换 title | 能出该业务项目，不澄清「未知业务」 | N/A |
| 缺用户ID | `2026-08-01至2026-08-31 品牌业务 已结算订单明细` | 结果区「还缺用户ID」 | 不出表 |
| 缺日期 | `用户 1001 品牌业务 已结算订单明细` | 「还缺时间范围」 | 不出表 |
| 缺业务 title | `用户 1001 2026-08-01至2026-08-31 已结算订单明细` | 「还缺业务名称」，列出 5 个 title | 不出表 |
| 用户不存在 | `用户 9999 2026-08-01至2026-08-31 品牌业务 订单明细` | 「用户不存在」 | 不出表 |
| FR-20 不被抢 | `星河小说按日订单数据` | 仍走项目按日订单，关键词只出数量 | N/A |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-ai-workbench.html`
  - `detect()` ~1004：`/订单/` 在 ~1037 无用户/明细槽就会 `clarify-project`，新意图必须插在它前面。
  - 复用：`parseRange` ~708、`kpiHtml`/`summary`/`money`/`esc`、`missingUser`、`run()` 分发 ~1063。
  - 文案：如何使用「用户数据」~422；需求规则 FR-25 后 ~503；`run` 澄清文案 ~1074。
  - Mock：现 `PROJECTS`/`ORDER_DAYS` 只有小说/短剧项目名，不够覆盖 5 个业务 title，需另建用户订单事实表。
- `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/fr-ai-workbench.html` — 与 Demo 同步副本。
- `_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-09-03/prd.md` — §4.7 在 FR-25 后加 FR-28；§6.1 用户数据清单补本意图。
- `tests/conftest.py` — 已有 `demo_server`；加 `ai_page` fixture。
- `tests/e2e/test_ai_workbench.py` — 新建，覆盖 I/O 矩阵。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/fr-ai-workbench.html` -- 加 5 业务 Mock 订单、detect/render、如何使用与需求规则 -- 本意图落地处
- [x] `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/fr-ai-workbench.html` -- 与 Demo 同步 -- 迭代规范要求副本一致
- [x] `_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-09-03/prd.md` -- 写入 FR-28 -- 与已批准意图清单对齐
- [x] `tests/conftest.py` + `tests/e2e/test_ai_workbench.py` -- 覆盖 I/O 矩阵 -- 防 detect 抢单与缺槽出假表

**Acceptance Criteria:**
- Given 完整槽位，when 提交用户订单明细，then 结果区同时有 KPI、表1、表2，且表2 有关键词词面。
- Given 同一句点了两种状态，when 出表，then 表内状态只属于这两种。
- Given 五个业务 title 各问一次，when 识别成功，then 都能出该业务数据或该业务空表，不误澄清。
- Given `星河小说按日订单数据`，when 提交，then 仍是 FR-20，不出订单ID/词面明细。

## Spec Change Log

## Design Notes

识别优先看「订单明细」或（用户ID + 订单 +（状态词或业务 title））。组合用「和 / 、 / 及」。

示例：`用户 1001 2026-08-01至2026-08-31 品牌业务 已审核待结算订单明细`

KPI 按用户+范围+业务汇总三态；表按状态过滤。表1 按项目×状态聚合表2。

## Verification

**Commands:**
- `unset PLAYWRIGHT_BROWSERS_PATH && python3 -m pytest tests/e2e/test_ai_workbench.py --browser chromium` -- expected: 全部通过

**Manual checks:**
- 浏览器走单状态、组合状态、五个 title、缺槽、FR-20 对照各一次。

## Suggested Review Order

**意图识别**

- 先于 FR-20 的 `/订单/`，用订单明细或「用户+订单+状态/业务」抢槽
  [`fr-ai-workbench.html:1156`](../../demo/iteration/fr-ai-workbench.html#L1156)

- 五个 title 与品牌/融合别名，星图融合必须先于星图
  [`fr-ai-workbench.html:741`](../../demo/iteration/fr-ai-workbench.html#L741)

- 状态可组合；未点名则三态全出
  [`fr-ai-workbench.html:758`](../../demo/iteration/fr-ai-workbench.html#L758)

**结果区**

- KPI 用 inScope（不过滤状态）；两表用 filtered；表1 按项目×状态聚合
  [`fr-ai-workbench.html:991`](../../demo/iteration/fr-ai-workbench.html#L991)

- 起止日颠倒先澄清，不当成零订单
  [`fr-ai-workbench.html:993`](../../demo/iteration/fr-ai-workbench.html#L993)

**文案与口径**

- 如何使用写清 KPI 不过滤、别名与组合示例
  [`fr-ai-workbench.html:444`](../../demo/iteration/fr-ai-workbench.html#L444)

- 研发对照口径 FR-28
  [`fr-ai-workbench.html:511`](../../demo/iteration/fr-ai-workbench.html#L511)

- PRD 已批准意图清单补本条
  [`prd.md:252`](../planning-artifacts/prds/prd-YBDD2.0-2026-09-03/prd.md#L252)

**测试**

- 单状态钉死 KPI 数值、表1 一行订单量 2、用户隔离
  [`test_ai_workbench.py:42`](../../tests/e2e/test_ai_workbench.py#L42)

- 五 title、别名、组合标点、缺槽、FR-20 不被抢
  [`test_ai_workbench.py:99`](../../tests/e2e/test_ai_workbench.py#L99)
