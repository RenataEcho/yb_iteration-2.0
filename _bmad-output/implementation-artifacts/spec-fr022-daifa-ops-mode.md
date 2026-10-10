---
title: '代发运营合作模式预览 · 广场与领取'
type: 'feature'
created: '2026-10-09'
status: 'withdrawn'
review_loop_iteration: 0
baseline_commit: '6cebc3a67058d2cd299a51320cb5c2c6b3ab3de0'
context:
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-10-09/prd.md'
---

2026-10-10 随需求撤回。专属演示页、测试和侧栏入口在同一变更里删除。

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 要先看到广场上的运营模式，以及两种领取差在哪。这一版不包含上传、继续回填和海外题词。

**Approach:** 新建页面，视觉从代发 1.0 用户端复制。广场增加任务协作 / 帐号运营 Tab。任务协作仍选词后领取。帐号运营不选词，直接扣次，下载用可中断弹窗，第一次保存成功后提示回填。

## Boundaries & Constraints

**Always:**
- 新用户端还原 1.0 的手机壳、橙色、广场宫格、详情底栏和选词浮层。
- 广场默认任务协作 Tab。切换 Tab 不重置项目和其它筛选。
- 任务协作：停权 → 次数 → 选词 → 占用。词须是该用户已通过、且与书一致。
- 帐号运营：停权 → 次数 → 占用。不出现选词。领取关键词等于稿件上已绑定的那一个。通过后扣 1 次。
- 下载进度在弹窗里：正在下载稿件 → 正在保存到相册 → 已保存到相册。保存完成前可中断。中断不退次、不解除占用、不出现回填提示。
- 该次领取第一次保存成功后出现回填提示。「去回填」进现有回填页；「稍后」留在已领取详情。
- 种子数据里两种稿都有。帐号运营稿已经绑好关键词。剪辑手比例已写在种子里，详情只显示该模式的一个比例。

**Ask First:**
- 要改 `yijian-daifa-demo.html` 或 `yijian-daifa-store.js` 时先停下来问。

**Never:**
- 不改 `yijian-daifa-demo.html`、`yijian-daifa-pc.html`、`fr-opc-yijian-daifa.html`、`yijian-daifa-store.js`。
- 不做 PC 上传、剪辑手档案编辑、继续回填、海外题词。这些在 `deferred-work.md`。
- 不从迭代 2.0、迭代 3.0、收益池页复制视觉。
- 不改 1.0 的 localStorage 键 `fr014-yjd-v6`。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 帐号运营领取 | Tab 为帐号运营，次数足够，未停权 | 无选词浮层；扣 1 次；下载弹窗保存成功；出现回填提示；关键词等于稿件绑定词 | 次数不足只开兑换，不扣次 |
| 任务协作领取 | Tab 为任务协作，次数足够 | 先选与书一致的已通过词，再扣次并进下载弹窗 | 未选词或书不一致：不扣次 |
| 中断下载 | 弹窗尚未到已保存 | 弹窗关闭，无回填提示；占用和次数保持 | 不退次 |
| 切换 Tab | 当前停在某个项目 | 只换稿件列表，项目和其它筛选不变 | 该模式无稿时用 1.0 空态 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-demo.html` — 只读。`:root` 8–17，手机壳 32–54，宫格 136–163，选词 `.kw-sheet` 281–302，loading `.load-mask` 546–562。领取 `startClaim` / `confirmKw` / `runClaimLoading` 约 1978–2078。
- `demo/iteration/yijian-daifa-store.js` — 只读。`KEY` 第 4 行为 `fr014-yjd-v6`。`seed().works` 64–82，`keywords` 136–148，`plazaEligible` 742–751。
- `demo/iteration/sidebar-nav.js` — 只在第 71 行 FR-021 之后追加一项。`detectActiveId` 94–97 用文件名匹配。
- `demo/iteration/assets/fr014/*` — 新页沿用这些图，不复制目录。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-ops-store.js` — 从 1.0 store 复制。键改为 `fr022-yjd-ops-v1`。稿件增加运营模式；帐号运营稿带绑定关键词。种子同时有两种稿，以及一个次数不足的用户路径所需的次数字段沿用 1.0。
- [x] `demo/iteration/yijian-daifa-ops-demo.html` — 从 `yijian-daifa-demo.html` 复制，脚本指向新 store。加两个 Tab、帐号运营跳过选词、下载弹窗与中断、首次保存成功的回填提示。
- [x] `demo/iteration/fr-yijian-daifa-ops.html` — 新建壳，iframe 指向新用户端 `?embed=1`。本版不挂 PC。
- [x] `demo/iteration/sidebar-nav.js` — 追加 `id` `fr-yijian-daifa-ops`，标签「代发运营合作模式」，`href` `fr-yijian-daifa-ops.html`，`fr` `FR-022`，`defaultStatus` `todo`。不改已有项。

**Acceptance Criteria:**
- Given 打开新壳页，when 看广场，then 版式与 1.0 广场一致，并有任务协作 / 帐号运营两个 Tab。
- Given 上述四个 1.0 文件，when 本版做完，then 它们没有新增 diff。
- Given 侧栏点「代发运营合作模式」，when 进入页面，then 是新壳，不是 1.0 也不是迭代 3.0。

## Spec Change Log

## Design Notes

新 store 使用 `fr022-yjd-ops-v1`，避免覆盖 1.0 的 `fr014-yjd-v6`。复制用户端后先改脚本和存储键，再加 Tab 和弹窗。回填提示只打开 1.0 已有的回填屏，不增加「再填一次」。

## Verification

**Commands:**
- `git diff -- demo/iteration/yijian-daifa-demo.html demo/iteration/yijian-daifa-pc.html demo/iteration/fr-opc-yijian-daifa.html demo/iteration/yijian-daifa-store.js` — 这四份没有因本版新增的改动。

**Manual checks:**
- 浏览器打开 `demo/iteration/fr-yijian-daifa-ops.html`，走矩阵四条。

## Suggested Review Order

**入口**

- 新壳只嵌用户端，不挂 PC。
  [`fr-yijian-daifa-ops.html:107`](../../demo/iteration/fr-yijian-daifa-ops.html#L107)

**广场**

- 两个 Tab 过滤稿件，默认任务协作。
  [`yijian-daifa-ops-demo.html:734`](../../demo/iteration/yijian-daifa-ops-demo.html#L734)

**领取**

- 帐号运营不选词，按停权、次数、占用提交绑定词。
  [`yijian-daifa-ops-demo.html:2131`](../../demo/iteration/yijian-daifa-ops-demo.html#L2131)

- 下载弹窗可中断，第一次保存成功才提示回填。
  [`yijian-daifa-ops-demo.html:2076`](../../demo/iteration/yijian-daifa-ops-demo.html#L2076)

**分成**

- 详情只取当前模式的一个比例。
  [`yijian-daifa-ops-store.js:232`](../../demo/iteration/yijian-daifa-ops-store.js#L232)

**侧栏**

- 在 FR-021 后登记本预览。
  [`sidebar-nav.js:72`](../../demo/iteration/sidebar-nav.js#L72)

**测试**

- 四条矩阵路径和壳页入口。
  [`test_fr022_ops_claim.py:31`](../../tests/e2e/test_fr022_ops_claim.py#L31)
