---
title: 'FR-014 一键代发：广场可见性与项目/授权闭环'
type: 'feature'
created: '2026-09-10'
status: 'done'
baseline_commit: '7f66ec868879e760e32b5e52fe760bade93e6b9d'
review_loop_iteration: 0
context:
  - '{project-root}/demo/iteration/ITERATION-FR-GUIDE.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-fr014-yijian-daifa/surfaces.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 停用剪辑手或素材后，已通过空闲稿仍留在广场；新项目 keywords 为空导致无法领取；剪辑手授权项目靠手打、写错即失效；无启用剪辑手时旧稿不能编辑；QA 超时场景在 M-01 被删后崩。

**Approach:** 资格判断抽到 store 共用；项目弹窗维护已通过关键词；授权改项目表多选；编辑旧稿不再拦；超时场景空守卫。徽标升 v7。

## Boundaries & Constraints

**Always:**
- 只改 FR-014 Demo / 规则 / 合同 / 本 spec / 本 FR e2e。资格只抽 `YJD.plazaEligible`，`visibleItems` 的搜索与筛选原样留下。
- 领取门禁顺序：停权 → 次数 → 审核/项目/剪辑手/素材 → 占用。不合格文案「稿件当前不可领」。
- 授权落库 `join(' / ')`，零勾选 `'—'`。不 bump store `VER`（KEY=`fr014-yjd-v4`）。
- `workFormHtml` 1147–1158 停用项 unshift 已有，只改 `openWorkModal` 的新建门禁。
- 跨页 e2e 必须 `embed=1`。测停用剪辑手用阿凯，不要停林夏（占用中 M-03）。
- 壳页 `v7 当前`；C iframe `v=20`；PC iframe `v=5`。

**Ask First:** 若必须改 seed 形状才能写 e2e，先问再 bump `VER`。

**Never:** 不改审核三态、运营录入默认已通过、PC 三步上传、list 下载链接、仅空闲可删、招募海报、水印、次数商品、流程图 SVG、FR-001/002/012/013。不重写 `authorizedProjects` / `parseProjectNames` 算法。不新开关键词页。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 停用素材 | 后台停用「口播」 | 广场无「掌心宠」；详情不可领 | 文案「稿件当前不可领」，不扣次 |
| 停用剪辑手 | 停用阿凯 | 广场无「末世囤货混剪」 | 林夏有占用中，停用被拦 |
| 恢复可见 | 再启用口播/阿凯 | 对应空闲已通过稿回广场 | N/A |
| 新项目带词 | 项目「闭环词项」+ 词「测试通过词」 | 领取浮层含该词 | N/A |
| 空关键词 | `#pjKw` 空保存 | 不写 store | toast「请至少填写 1 个已通过关键词」 |
| 授权多选 | 录入剪辑手勾选项目 | `projects` 为 `A / B` | 零勾选存 `—`，PC 不能传 |
| 无启用剪辑手 | 全部已停用后点编辑已有稿 | 弹窗打开，`#wTitle` 可见 | 仅「录入稿件」toast 拦截 |
| 超时空稿 | 删除 M-01 后 `applyScene('timeout')` | toast「演示稿件已删除」，落到领取页 | 不碰 `it.occ`，不抛 |

</frozen-after-approval>

## Code Map

- `demo/iteration/yijian-daifa-store.js` — `parseProjectNames` 178–180 未 export；`authorizedProjects` 182–188；`YJD` 出口 235–255。新增并 export `plazaEligible` + `parseProjectNames`。
- `demo/iteration/yijian-daifa-demo.html` — `visibleItems` 971–985 只挡审核/占用/项目；`claimBlockReason` 1678–1687 缺剪辑手/素材；`applyScene('timeout')` 1774 写死 `item('M-01')`，末尾 `showScreen(id)` 1831（`showScreen('timeout')` 会递归，空守卫必须 `showScreen('claims')`）。
- `demo/iteration/fr-opc-yijian-daifa.html` — `#mProj` 文本 971–978 / 保存 `.value` 1011；`openProjectModal` 1026 无 `#pjKw`，改名迁 keywords 1053–1056 已有；`openWorkModal` 1173 对编辑也拦；`workFormHtml` 1147–1158 **不要改**；`toggleEditor` 1115 占用中拦截；徽标 257 `v6`；iframe 1404 `v=19`、1413 `v=4`。
- `demo/iteration/yijian-daifa-pc.html` — `authorizedProjects` 驱动下拉，默认不改。
- `tests/e2e/test_yijian_daifa.py` — 只追加；跨页抄 `test_admin_fe_store_loop` 的 `embed=1`。
- `_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md` — CAP-3 现只锁启用项目；CAP-9 项目无关键词字段。
- 种子：阿凯无占用中；林夏有 M-03 占用中；M-01 素材=口播。`toggleMat` toast 已写「广场筛选不再列出」，改资格即兑现。

## Tasks & Acceptance

**Execution:**
- [x] `demo/iteration/yijian-daifa-store.js` -- 新增 `plazaEligible` 并 export，同时 export `parseProjectNames` -- C 端与领取共用资格，后台多选要解析已有串
- [x] `demo/iteration/yijian-daifa-demo.html` -- `visibleItems` 资格改走 `plazaEligible`；`claimBlockReason` 在项目与占用之间插入剪辑手/素材；timeout 空守卫 -- 兑现即时藏稿且不崩
- [x] `demo/iteration/fr-opc-yijian-daifa.html` -- 项目 `#pjKw`；剪辑手 checkbox；`openWorkModal` 仅 `!row` 拦截；徽标/iframe/规则一句 -- 运营配置可点通
- [x] `_bmad-output/specs/spec-fr014-yijian-daifa/{SPEC,surfaces,.memlog}.md` -- CAP-3/CAP-9 与规则同步 -- 避免合同再漂
- [x] `tests/e2e/test_yijian_daifa.py` -- 覆盖 I/O 矩阵各行，不删旧断言 -- 防回归

**Acceptance Criteria:**
- Given 已通过空闲稿，when 其剪辑手停用或素材禁用，then 广场不列且领取不扣次；再启用后回来。
- Given 后台项目弹窗，when 保存，then 至少 1 条已通过关键词；领取浮层能列出。
- Given 剪辑手表单，when 填可上传项目，then 只能勾选项目表；PC 授权下拉仍可用。
- Given 无启用剪辑手，when 编辑已有稿，then 弹窗可开；新建仍拦截。
- Given M-01 已删，when QA 超时场景，then toast「演示稿件已删除」且不抛。
- Given v6 审核/海报/三步上传/领取留详情，when 跑旧 e2e，then 全绿。

## Spec Change Log

- 2026-09-10：实现广场资格 `plazaEligible`、项目已通过关键词、剪辑手项目多选、旧稿编辑门禁与 timeout 空守卫；合同 CAP-3/CAP-9 与 e2e 同步。

## Design Notes

```js
function plazaEligible(data, w) {
  if (!w || (w.audit || '已通过') !== '已通过') return false;
  if (w.occ === '占用中' || w.occ === '已完成' || w.occupied) return false;
  var p = projectByName(data, w.project);
  var e = editorByName(data, w.editor);
  var m = (data.mats || []).find(function (x) { return x.name === w.mat; });
  return !!(p && p.status === '启用' && e && e.status === '已录入' && m && m.status === '启用');
}
```

缺记录视为不合格。多选预勾选：`parseProjectNames(e.projects)`。

## Verification

**Commands:**
- `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q` -- expected: 全绿（含新增用例）

## Suggested Review Order

**资格判断**

- 广场与领取共用的唯一资格函数，缺记录即不合格
  [`yijian-daifa-store.js:171`](../../demo/iteration/yijian-daifa-store.js#L171)

- 搜索筛选留下，只换资格判断
  [`yijian-daifa-demo.html:922`](../../demo/iteration/yijian-daifa-demo.html#L922)

- 用空闲副本走 plazaEligible，占用文案仍在最后
  [`yijian-daifa-demo.html:1584`](../../demo/iteration/yijian-daifa-demo.html#L1584)

**运营配置**

- 可上传项目改项目表多选，落库 ` / `
  [`fr-opc-yijian-daifa.html:982`](../../demo/iteration/fr-opc-yijian-daifa.html#L982)

- 项目弹窗维护已通过词；改名同步剪辑手授权
  [`fr-opc-yijian-daifa.html:1043`](../../demo/iteration/fr-opc-yijian-daifa.html#L1043)

- 仅新建拦无启用剪辑手，编辑旧稿可开
  [`fr-opc-yijian-daifa.html:1197`](../../demo/iteration/fr-opc-yijian-daifa.html#L1197)

**演示守卫与合同**

- M-01 已删时超时场景 toast 后落到领取页
  [`yijian-daifa-demo.html:1682`](../../demo/iteration/yijian-daifa-demo.html#L1682)

- CAP-3 补停用剪辑手/素材不进广场
  [`SPEC.md:32`](../specs/spec-fr014-yijian-daifa/SPEC.md#L32)

**测试**

- 停用口播/阿凯后广场藏稿，详情不可领不扣次
  [`test_yijian_daifa.py:509`](../../tests/e2e/test_yijian_daifa.py#L509)

- 关键词、多选授权、无启用剪辑手、超时空守卫
  [`test_yijian_daifa.py:555`](../../tests/e2e/test_yijian_daifa.py#L555)
