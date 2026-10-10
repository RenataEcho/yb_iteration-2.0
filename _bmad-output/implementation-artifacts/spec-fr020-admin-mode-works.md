---
title: '迭代 3.0 后台：合作模式多选与稿件回填数量'
type: 'feature'
created: '2026-10-10'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'fd789c9c1c7603e72394841e5b909b4d9554f330'
context:
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-YBDD2.0-2026-09-28/prd.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 迭代 3.0 管理后台的剪辑手弹窗把代运营合作模式做成两个比例框。后台也没有 1.0 的稿件管理，看不到回填作品数量。

**Approach:** 只改本迭代页的管理后台。弹窗改为多选模式，每个选中的模式单独填比例。稿件收费方式是跟随平台或定制，定制再填单次积分。稿件管理复刻 1.0 的右豹 / 站外表，增加回填作品数量，点数字看到的列表与剪辑手 PC 相同。

## Boundaries & Constraints

**Always:**
- 新增和编辑都有代运营合作模式，选项是任务协作、帐号运营，可同时选。至少选一个才能保存。
- 未勾选的模式不出现比例。勾选后出现该模式自己的 0 到 100 比例，两个模式分开保存。
- 稿件收费方式是跟随平台或定制。跟随平台不出现积分。定制时出现单次积分，须是大于 0 的整数。
- 列表和详情里，已选模式带上自己的比例。收费方式为定制时写出单次积分。
- 稿件管理有右豹稿件、站外稿件。字段按 1.0 的表：右豹含发布技巧、素材类型、占用、审核；站外无这四项，状态是空闲 / 部分领取 / 已领完。两栏都有稿件状态（正常 / 已删除）和回填作品。
- 回填作品格内是数量。点数量打开列表，列是媒体平台、帐号 ID、帐号昵称、作品链接、发布时间、回填时间。数量等于条数。0 也可点，列表为空。
- 已删除只出现在稿件状态。回填作品数量仍单独保留。
- 种子至少覆盖：两个模式都选、只选任务协作、只选帐号运营；稿件有 0 条回填、有回填、已删除但仍有回填数量。

**Ask First:**
- 要改 `yijian-daifa-iter3-demo.html` 或 `fr-opc-yijian-daifa.html` 时先停下来问。

**Never:**
- 不改 `demo/iteration/fr-opc-yijian-daifa.html`，也不改用户端和剪辑手 PC 的 iframe 页。
- 不恢复官方帐号、剪辑任务、任务稿件、领取记录、黑名单、项目管理、素材类型、次数商品。
- 不移植 1.0 的批量审核、二维码和 OSS 删除。站外「分享链接」点了只提示已复制。
- 不把已删除写进回填作品。不改用户端已领列表的回填提示。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 保存剪辑手 | 两个模式都没选，其余必填齐全 | 弹窗不关，列表不变 | 提示至少选一个合作模式 |
| 保存剪辑手 | 选了任务协作，比例 40；帐号运营，比例 50 | 列表写出两个模式和各自的比例 | 已选模式的比例空或超出 0 到 100 时不保存 |
| 保存剪辑手 | 收费方式选定制，单次积分空、0 或小数 | 弹窗不关 | 提示请填写单次积分 |
| 保存剪辑手 | 收费方式跟随平台 | 不出现单次积分，列表写跟随平台 | 不要求积分 |
| 保存剪辑手 | 收费方式定制，单次 80 | 列表写定制，并写出单次 80 积分 | 无 |
| 看回填 | 某稿有 2 条回填 | 格内是 2，点开两行，列与剪辑手 PC 相同 | 无 |
| 已删除稿 | 稿件状态为已删除，回填数量为 1 | 已删除在稿件状态；回填作品仍是 1，点开仍有那一条 | 不把已删除写进回填作品 |
| 零回填 | 数量为 0 | 点开后列表为空 | 无 |

</frozen-after-approval>

## Code Map

- `demo/iteration/fr-yijian-daifa-iter3.html` — 只改这一页。管理后台页签是剪辑手和稿件管理。弹窗 `#edModes` 两个复选框，勾选后才显示 `#edShareTask` / `#edShareAccount`。`#edCharge` 是跟随平台或定制，定制才显示 `#edPoints`。种子 `editors` 字段是 `modes`、`taskShare`、`accountShare`、`charge`、`points`。稿件表在 `renderWorks`，回填列表在 `fillTable`。
- `demo/iteration/fr-opc-yijian-daifa.html` — 只读。稿件表面在 1266–1305 行：渠道页签、筛选、`wkHead` / `wkBody`。表头在 `renderWorks` 2543–2547 行。不要改这个文件。
- `demo/iteration/yijian-daifa-iter3-demo.html` — 只读。剪辑手 PC 的回填列表在 `fillDrawer` 1156–1166 行，列是媒体平台、帐号 ID、帐号昵称、作品链接、发布时间、回填时间。不要改这个文件。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/fr-yijian-daifa-iter3.html` — 弹窗的代运营合作模式改为两个复选框。勾选后才出现该模式的比例。稿件收费方式为跟随平台或定制，定制再填单次积分。种子、列表、详情、保存使用 `taskShare`、`accountShare`、`charge`、`points`。模式一个都没选不能保存。
- [x] `demo/iteration/fr-yijian-daifa-iter3.html` — 管理后台增加稿件管理页签。右豹 / 站外两栏按 1.0 表头，多一列回填作品。点数量打开详情抽屉，列与剪辑手 PC 相同。已删除只改稿件状态。
- [x] `demo/iteration/fr-yijian-daifa-iter3.html` — 页头说明和「后台需求」规则改成多选模式、已选模式各自的比例、稿件收费方式、稿件管理的回填作品数量。

**Acceptance Criteria:**
- Given 打开本迭代管理后台，when 看页签，then 有剪辑手管理和稿件管理，没有官方帐号、剪辑任务、任务稿件。
- Given 上述两个只读文件，when 本版做完，then 它们没有新增 diff。

## Spec Change Log

- 2026-10-10：按页面反馈改合同。代运营合作模式仍是多选，比例按模式分开设置。新增稿件收费方式：跟随平台、定制；定制时填写单次积分。

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_fr020_admin_mode_works.py -q` — expected: 5 passed

**Manual checks:**
- 浏览器打开 `demo/iteration/fr-yijian-daifa-iter3.html`，进入管理后台。录入时不选模式，保存被拦住。勾选模式后才出现该模式的比例。收费方式选定制才出现单次积分，不填不能保存。
- 稿件管理切到右豹和站外。点有回填的数字能看到六列。点 0 看到空列表。已删除稿的回填数量仍可点开。

## Suggested Review Order

**合作模式**

- 弹窗用两个复选框，旁边只有一个分成比例。
  [`fr-yijian-daifa-iter3.html:553`](../../demo/iteration/fr-yijian-daifa-iter3.html#L553)

- 一个模式都没选就不能保存。
  [`fr-yijian-daifa-iter3.html:720`](../../demo/iteration/fr-yijian-daifa-iter3.html#L720)

- 列表只显示模式名称和那一个百分比。
  [`fr-yijian-daifa-iter3.html:622`](../../demo/iteration/fr-yijian-daifa-iter3.html#L622)

**稿件回填**

- 后台增加稿件管理页签。
  [`fr-yijian-daifa-iter3.html:295`](../../demo/iteration/fr-yijian-daifa-iter3.html#L295)

- 点数量打开六列回填列表。
  [`fr-yijian-daifa-iter3.html:782`](../../demo/iteration/fr-yijian-daifa-iter3.html#L782)

- 右豹和站外切换表头，回填列都在。
  [`fr-yijian-daifa-iter3.html:819`](../../demo/iteration/fr-yijian-daifa-iter3.html#L819)

**测试**

- 保存、编辑、站外表和回填数量。
  [`test_fr020_admin_mode_works.py:19`](../../tests/e2e/test_fr020_admin_mode_works.py#L19)
