---
title: 'FR-013 AI申词 H5'
type: 'feature'
created: '2026-09-09'
status: 'done'
baseline_commit: '2f176dce5b1b8ce47446f3915a1497ec28b9fdd9'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 用户已知书籍 ID、或只要用选书中心的书时，没有独立入口做批量 AI 申词；选书中心是逛书再单本申，走不通这条路径。

**Approach:** 新增 FR-013 H5：选项目 → 选推广类型 → 手填书籍 ID 和/或勾选选书中心已上架书 → 多本书、每本 1–10 词，先预览/更换再一次提交，写入现有申词审核。

## Boundaries & Constraints

**Always:**
- 独立 FR-013（三 Tab + Mockup + 规则抽屉）。不改 FR-012 文件。
- 类型 = 项目题词配置。Demo 枚举：真人出镜、图文、解压TTS、解说混剪、AIGC。
- 官方推荐 = 选书中心已上架书的独立拷贝（同书名，ID 用 `BK-10xx`）。无推荐 flag、无推荐维护表。下架书不出现。
- 无自有书库项目才有推荐列表；有自有书库则推荐为空，只允许手填。
- 手填不要求命中书库：命中带书名，未命中标「未匹配书名」仍可申。换行/逗号/空格分隔，按 ID 去重。
- 双层批量：多本书；每本独立数量 1–10（默认 3）；「更换」按行换词。
- 缺项目/类型/有效 ID/任一行未出词 → 不可提交，Toast 点名缺项。类型为空则下拉空并阻断。
- 一次提交 = 一条批次记录（详情展开多本书+词）。审核复用现有流程，不重定义状态。
- C 端橙色；Mockup 只 iframe；无真实接口。

**Ask First:** 官方推荐改为选书中心子集（加推荐标记）；一批拆成多笔审核单。

**Never:**
- 不改 `fr-book-select.html` / `book-select-demo.html`。
- 不做手动「申请关键词」Tab。
- 不在本 FR 做上下架或新推荐表。
- 不用 Mermaid；不改 Sidebar 架构；postMessage 不用 `bookSelectScreen`。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 推荐批量 | 不鸣推文 + 图文 + 勾 2 本 + 已出词提交 | 成功；批次含两本书和词 | N/A |
| 手填批量 | 两行/逗号合法 ID | 两行；命中带书名 | 空段忽略 |
| 未匹配 ID | `BK-9999` | 行保留「未匹配书名」，可出词提交 | 不拦截 |
| 混用去重 | 推荐已含该 ID 再手填 | Toast「已添加」，不重复行 | N/A |
| 缺项/未出词 | 未选项目或类型，或未更换 | 不提交 | Toast 点名 |
| 数量越界 | 0 或 12 再更换 | 钳到 1–10 后出词 | 空数量 Toast |
| 自有书库 | 星河小说 | 推荐空，可手填 | 无假推荐 |
| 无类型 | 未配置项目 | 类型下拉空 | 阻断 Toast |
| embed | `?embed=1&screen=preview` | 落到预览态 | 未知 screen 回表单 |

</frozen-after-approval>

## Code Map

- `demo/iteration/ITERATION-FR-GUIDE.md` — 三 Tab、iframe、橙色、规则抽屉、手写 SVG、组件 class。
- `demo/iteration/fr-book-select.html` — **只读**：壳/`#mockupFrame`/`?tab=`/规则抽屉；Admin `BK-1001+`。禁止改。
- `demo/iteration/book-select-demo.html` — **只读**：`PROMO_TYPES`、`AI_POOL`、`BOOKS`、出词上限 10、embed。出站 postMessage 用新名（如 `aiKeywordScreen`）。禁止改。
- `demo/iteration/sidebar-nav.js` — 在 `fr-book-select` 后加 `fr-ai-keyword` / FR-013。
- `demo/iteration/framework-shell.html` — FR-012 行后加 `data-fr-row="FR-013" data-order="13"`。
- `demo/iteration/component-spec-demo.html` — `.flow-page` / `.flow-edges` / `.flow-nodes` / `.flow-legend`。
- `tests/conftest.py` + `tests/e2e/test_book_select.py` — `demo_server` 与 E2E 对照。
- `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/` — 同步副本。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/ai-keyword-demo.html` -- 新建 H5（项目/类型、手填+推荐、待申词行、提交）；embed + postMessage
- [x] `demo/iteration/fr-ai-keyword.html` -- 新建三 Tab + 规则；场景含表单/推荐/手填/预览/空推荐/无类型；Admin 仅批次记录表；一张闭环流程
- [x] `demo/iteration/sidebar-nav.js` -- 注册 FR-013
- [x] `demo/iteration/framework-shell.html` -- Sprint 行
- [x] `_bmad-output/planning-artifacts/ux-designs/ux-YBDD2.0-2026-08-23/mockups/{fr-ai-keyword,ai-keyword-demo}.html` -- 同步副本
- [x] `tests/e2e/test_ai_keyword.py` -- 覆盖 I/O 主路径与拦截

**Acceptance Criteria:**
- Given 不鸣推文 + 已选类型，when 打开官方推荐，then 书名与选书中心已上架拷贝一致，可多选加入。
- Given 至少两本且每本已出词，when 提交，then 一条批次成功，后台能看见这两本和词。
- Given 星河小说，when 看推荐区，then 为空且仍可手填。
- Given 未出词或未选类型，when 提交，then Toast 拦截。
- Given FR-012 页面，when 本需求落地，then 选书中心不变。

## Spec Change Log

## Design Notes

单页不逛书。项目 Mock：`不鸣推文`（有推荐）、`星河小说`（自有书库，推荐空）、`未配置项目`（类型空）。待申词行：ID、书名或「未匹配书名」、数量、词芯片、更换。推荐数组独立拷贝，不 import FR-012。

## Verification

**Commands:**
- `unset PLAYWRIGHT_BROWSERS_PATH && python3 -m pytest tests/e2e/test_ai_keyword.py --browser chromium` -- expected: 通过
- `unset PLAYWRIGHT_BROWSERS_PATH && python3 -m pytest tests/e2e/test_book_select.py --browser chromium` -- expected: FR-012 仍通过

## Suggested Review Order

**H5 主路径**

- 单页入口：选项目/类型、手填与推荐、待申词后一次提交
  [`ai-keyword-demo.html:199`](../../demo/iteration/ai-keyword-demo.html#L199)

- 官方推荐是选书中心已上架拷贝，下架书不进列表
  [`ai-keyword-demo.html:204`](../../demo/iteration/ai-keyword-demo.html#L204)

- 手填按分隔符拆 ID、去重，未匹配仍可成行
  [`ai-keyword-demo.html:272`](../../demo/iteration/ai-keyword-demo.html#L272)

- 提交校验项目/类型/出词，数量必须等于词数
  [`ai-keyword-demo.html:458`](../../demo/iteration/ai-keyword-demo.html#L458)

- 写批次失败不报成功；成功后清行防连点
  [`ai-keyword-demo.html:312`](../../demo/iteration/ai-keyword-demo.html#L312)

**壳页与后台**

- 三 Tab + 场景切 iframe，postMessage 用新类型名
  [`fr-ai-keyword.html:639`](../../demo/iteration/fr-ai-keyword.html#L639)

- 用户批次叠在种子前，详情展开多本书和词
  [`fr-ai-keyword.html:561`](../../demo/iteration/fr-ai-keyword.html#L561)

- 一张闭环流程，否分支回到起点顶边
  [`fr-ai-keyword.html:304`](../../demo/iteration/fr-ai-keyword.html#L304)

**接线**

- 侧栏挂上 FR-013
  [`sidebar-nav.js:53`](../../demo/iteration/sidebar-nav.js#L53)

- Sprint 概览增加 FR-013 行
  [`framework-shell.html:335`](../../demo/iteration/framework-shell.html#L335)

**测试**

- 推荐提交必须落到新 BAT-*，不被种子带过
  [`test_ai_keyword.py:32`](../../tests/e2e/test_ai_keyword.py#L32)

- 未匹配 ID 出词后可以提交
  [`test_ai_keyword.py:79`](../../tests/e2e/test_ai_keyword.py#L79)
