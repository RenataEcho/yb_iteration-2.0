---
title: 'FR-014 一键代发：发布技巧改为单段可编、可复制，并先出示 AI 提示词'
type: 'feature'
created: '2026-09-10'
status: 'in-progress'
baseline_commit: '3fffc50972d3ff3f872ab5ce20e1d367d11529e0'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/requirements.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 发布技巧拆成标题/描述，确认表不能改，用户侧两块复制，AI 直接灌文看不到提示词。

**Approach:** 改成一段正文。PC 确认表可编；已领详情一个可复制文字框；AI 先出示提示词、约束和规则，确认后再整表写入。

## Boundaries & Constraints

**Always:**
- 只改 FR-014 Demo / 规则 / 合同伴生 / 本 spec / 本 FR e2e。不 bump `VER`（KEY=`fr014-yjd-v4`）。
- 读写走 `YJD.tipText(w)`：优先 `pubTips`，否则 `pubTitle`+换行+`pubDesc`。新写入只填 `pubTips`；`syncFlags` 给旧行补上。
- 确认表每行一个可编辑文字框。空技巧可入队。AI 整表一键，先出提示词弹窗。
- 已领详情去掉「作品发布技巧」和标题/描述分块，只留 `#pubTips` 只读框+复制。未领仍是领取步骤。
- 后台列表/详情/编辑也改成一段。失败只重传文件。壳页 `v9`；C iframe `v=22`；PC iframe `v=8`。
- Demo 不接真模型。生成须单段、含书名和稿件名、文末 1–2 个 #话题。

**Ask First:** 若必须 bump `VER` 才能读出旧 localStorage 正文。

**Never:** 不改门禁/占用/次数/审核。技巧不改必填。用户不可编。不做按行 AI。不改其他 FR。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 手改技巧 | 确认表改某行 | 上传后 C/后台读同一段 | N/A |
| 空技巧入队 | 不填不点 AI | 可上传；空框复制 toast「暂无发布技巧」 | 不拦截 |
| AI 先看词 | 点 AI 按钮 | 弹出提示词+约束+规则，表不改 | 取消不写表 |
| AI 确认 | 弹窗点生成 | 整表单段，toast「已为全表生成发布技巧」 | 无行 toast「请先解析成片」 |
| 旧种子 | 只有两段旧字段 | 各面显示拼好的一段 | 不 bump VER |
| 已领复制 | 领取后点复制 | 复制整段，toast「已复制发布技巧」 | 无标题/描述文案 |
| 失败重传 | 点重新上传 | 只重文件，技巧不变 | N/A |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-store.js` — `work()` 96–110、seed 16–23 仍两段；`syncFlags` 177 不补 pub。在此 export `tipText` 并补 `pubTips`。
- `demo/iteration/yijian-daifa-pc.html` — `renderExcel` 577 只读；`aiTips` 836 直接写两段；`#upAiTips` 353。改 textarea + 提示词弹窗（复用 365 `confirm-box`，样式对齐 `fr-book-select.html` `.prompt-block`）。`makeWork`/`fullTable`/`retryUpload` 走 `tipText`。
- `demo/iteration/yijian-daifa-demo.html` — `renderDetail` 1095–1140 两块复制。改一个只读框。
- `demo/iteration/fr-opc-yijian-daifa.html` — 列表 2072、详情 2167、编辑 `#wPubT/#wPubD` 2482 仍两段。徽标 `v8`；C `v=21`（2796）；PC `v=7`（2805）。升 v9 / 22 / 8。
- `demo/iteration/yijian-daifa-rules.js` — 已领 106、确认表 381、字段 402/465。补与弹窗同一套提示词。
- `tests/e2e/test_yijian_daifa.py` — 60–67、367–375 旧文案；645 直接点 AI。按 I/O 改。
- `_bmad-output/specs/spec-fr014-yijian-daifa/` — requirements/glossary/flows/surfaces 与操作说明：去「标题+描述」「不能改一行」。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-store.js` -- `tipText` + 补 `pubTips`
- [x] `demo/iteration/yijian-daifa-pc.html` -- 可编确认表；AI 先出提示词
- [x] `demo/iteration/yijian-daifa-demo.html` -- 已领单框可复制
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- 后台一段 + 版本号
- [x] `demo/iteration/yijian-daifa-rules.js` -- 规则对齐弹窗模板
- [x] `_bmad-output/specs/spec-fr014-yijian-daifa/` -- 合同与操作说明改单段
- [x] `tests/e2e/test_yijian_daifa.py` -- 覆盖 I/O 矩阵

**Acceptance Criteria:**
- Given 确认表已解析，when 改某行并上传，then C 端与后台是同一段。
- Given 确认表，when 点 AI 后取消，then 表不变；确认后整表单段且 toast 成功。
- Given 领取成功，when 看详情，then 只有 `#pubTips` 一框，无「作品发布技巧」「发布标题」「发布描述」；复制 toast「已复制发布技巧」。
- Given 旧种子只有两段，when 打开已领或后台，then 显示拼好的一段。

## Spec Change Log

- 2026-09-10: 按本 spec 落地单段发布技巧、AI 先出示提示词、已领 `#pubTips` 只读复制，并改合同与 e2e。

## Design Notes

```js
function tipText(w) {
  if (w && w.pubTips) return String(w.pubTips);
  return [w && w.pubTitle, w && w.pubDesc].filter(Boolean).join('\n');
}
```

弹窗与规则共用（花括号换当次值，只输出一段）：

```
你是代发文案助手。只根据给定书籍与稿件写一条发布技巧，不要拆标题和描述。
【输入】书名：{book}；书籍ID：{book_id}；稿件：{title}；类型：{kind}；素材：{mat}
【约束】一段连续正文，无标签/序号/「标题」「描述」。30–180 字。必须出现书名和稿件名。文末 1–2 个 #话题（从书名或稿件名截取，禁止平台名）。简介没有的情节不准编。
【规则】禁涉黄涉政暴力歧视；不号召下载站外 App；不得输出解释或 JSON。
```

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q` -- expected: 全绿
