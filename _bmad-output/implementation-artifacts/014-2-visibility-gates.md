# Story 014.2: 广场可见性与项目/授权闭环

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 运营 / 领取用户 / 演示操作者,
I want 停用剪辑手或素材的稿立刻离开广场、新项目能配已通过关键词、剪辑手授权项目从项目表勾选、已有稿在无启用剪辑手时仍可编辑、超时 QA 场景不因种子稿被删而崩,
so that v4 已承诺的即时影响与项目管理闭环能点通，且不回退 v6 审核门禁。

## Acceptance Criteria

1. **广场 / 领取同步藏稿。** Given 已通过且空闲的稿，when 其剪辑手变为「已停用」或素材类型变为「禁用」，then 广场 `visibleItems` 不再列出该稿；详情领取按钮为「当前不可领」，`startClaim` / `finishClaim` 不扣次。重新启用后空闲已通过稿回到广场。
2. **新项目可领。** Given 后台添加项目，when 保存，then 必须至少 1 条已通过关键词（一行一词）；该项目上领取浮层能列出这些词。空词列表不得保存。编辑项目可改词；改项目名时关键词键随名称迁移（已有逻辑保留）。
3. **授权项目勾选。** Given 录入/编辑剪辑手，when 填「可上传项目」，then 从项目表多选，禁止自由文本。落库仍用现有 `parseProjectNames` 分隔串（` / `），PC `authorizedProjects` 不用改算法。
4. **编辑旧稿不依赖启用剪辑手。** Given 已有稿件，when 当前没有「已录入」剪辑手，then 「编辑」仍打开；仅「录入稿件」在无启用剪辑手 / 项目 / 素材时拦截。
5. **超时场景空安全。** Given `M-01` 已被删除，when 切 QA 场景 `timeout`，then toast「演示稿件已删除」，不抛异常，落到领取页。
6. **回归。** v6 行为保持：PC 新稿审核中、运营录入已通过、仅审核中可驳回、门禁先次数后选词后占用、招募帧进海报、领取成功留详情。不改 FR-001/002/012/013 文件。

## Tasks / Subtasks

- [ ] 广场与领取共用可见性（AC: 1）
  - [ ] 在 `yijian-daifa-store.js` 增加并 export `plazaEligible(data, work)`：`(audit||'已通过')==='已通过'` + `occ` 非占用中/已完成 + 非 `occupied` + 项目存在且启用 + 剪辑手存在且 `已录入` + 素材存在且 `启用`。缺记录 = 不合格。
  - [ ] `visibleItems()` **只把资格判断换成** `YJD.plazaEligible(STORE, it)`；搜索与 `state.filters` 仍留在后面。禁止重写整段 filter。
  - [ ] `claimBlockReason()` 在现有「项目禁用 → 占用」之间插入：剪辑手/素材不合格也返回「稿件当前不可领」。顺序保持：停权 → 次数 → 审核/项目/剪辑手/素材 → 占用。
  - [ ] 规则抽屉补一句：广场只列启用项目、已录入剪辑手、启用素材、已通过且空闲的稿。
- [ ] 项目关键词可维护（AC: 2）
  - [ ] `openProjectModal`（约 1026）在排序字段后加 textarea `#pjKw`，回填 `(STORE.keywords[row.name]||[]).join('\n')`。
  - [ ] 保存：按行 trim、去空；0 条 toast「请至少填写 1 个已通过关键词」并 `return true`。写入 `STORE.keywords[name]`。改名迁移已有（约 1053–1056），不要另写一套。
  - [ ] 新建不再 `keywords[name]=[]`。`surfaces.md` / CAP-9：项目管理含已通过关键词；SKU 页不动。
- [ ] 剪辑手授权改为多选（AC: 3）
  - [ ] `editorFormHtml` 删 `#mProj` 文本框。用 `STORE.projects` 渲染 checkbox（`name=mProj`），预勾选 `YJD.parseProjectNames(e.projects)`。
  - [ ] `openEditorModal` 保存处（约 1011）改为读勾选名，`join(' / ')`；零勾选存 `'—'`（`parseProjectNames` 会丢掉破折号，PC 授权为空）。
- [ ] 编辑稿件门槛（AC: 4）
  - [ ] **只改** `openWorkModal` 三道门：`if (!row && !YJD.enrolledEditors(...).length)` 等。编辑不拦。
  - [ ] **不要改** `workFormHtml` 1144–1158：它已经会把当前已停用剪辑手/项目/素材 unshift 进下拉。
- [ ] 超时 QA 空安全（AC: 5）
  - [ ] `applyScene('timeout')`：`item('M-01')` 为空则 toast「演示稿件已删除」，`setScreen('claims')`（该文件用 `setScreen` 不是 `showScreen`），return。不要碰 `it.occ`。
- [ ] 合同与版本（AC: 1, 2, 6）
  - [ ] CAP-3 success：停用剪辑手、禁用素材的已通过空闲稿不进广场、不可领。
  - [ ] 壳页 `fr-opc-yijian-daifa.html:257` 徽标 `v7 当前`；iframe `v=19`→`v=20`（约 1404）、PC `v=4`→`v=5`（约 1413）。
  - [ ] `.memlog.md` 一条 decision。不 bump store `VER`（不改 seed 形状）。
- [ ] e2e（AC: 1–5, 6）
  - [ ] 追加到 `tests/e2e/test_yijian_daifa.py`（embed + localStorage；跨页必须 `embed=1`）：
    - 停用素材「口播」→ 广场无「掌心宠」；再启用 → 回来。
    - 停用剪辑手「阿凯」（无占用中）→ 广场无「末世囤货混剪」。**不要停用林夏**（有占用中 M-03，`toggleEditor` 会拦）。
    - 添加项目「闭环词项」+ `#pjKw` 填「测试通过词」→ C 端该项目领取浮层含该词。空 `#pjKw` 保存被拦。
    - 录入剪辑手时「可上传项目」是 checkbox 不是 `#mProj` input。
    - 把所有剪辑手设为已停用后，后台仍能打开已有稿编辑弹窗（`#wTitle` 可见）。
    - 删掉 `M-01` 后 `applyScene('timeout')` 不抛，toast 含「已删除」。
  - [ ] `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" python3 -m pytest tests/e2e/test_yijian_daifa.py -q` 全绿。

## Dev Notes

- **合同：** FR-014 SPEC CAP-3 今天只锁「启用项目」。v4 memlog 已写「停用剪辑手 / 停用素材即时影响广场」。本 story 把这条补进 CAP-3，不要另开产品讨论。
- **不要重写广场过滤。** 只抽 `YJD.plazaEligible`，C 端调用。`visibleItems` 的搜索/筛选项原样留下。
- **`parseProjectNames` 已吃** `/`、`、`、`,`、`，`，并丢掉 `'—'`。多选保存必须 `join(' / ')`，否则 PC `authorizedProjects` 会裂。
- **`workFormHtml` 已处理停用项回填（1147–1158）。** AC4 只改 `openWorkModal` 的 `!row` 门禁。重写下拉即回归。
- **`toggleEditor` 有占用中不能停用。** 测停用用阿凯或素材「口播」，不要停林夏（占用中 M-03）。
- **`toggleMat` toast 已写「上传与广场筛选不再列出」。** 改 `plazaEligible` 兑现，勿改 toast。
- **关键词挂项目弹窗，不新开页。** Demo 用 `STORE.keywords[项目名]` 字符串数组。
- **门禁顺序 v6 已修好。** 只在审核/项目旁加剪辑手/素材，占用仍最后。
- **独立打开 PC/C 会 `YJD.open({ reset: !embed })`。** e2e 跨页必须 `embed=1`。KEY=`fr014-yjd-v4`，不 bump VER。
- **不改：** 审核三态、运营录入默认已通过、PC 三步上传、list 无下载链接、仅空闲可删、招募海报、水印、次数商品、流程图 SVG。
- **独立 FR：** 禁止改 FR-001/002/012/013 文件。

### 当前代码（UPDATE，必须先读）

| 文件 | 现状 | 本 story 改什么 | 必须保留 |
|------|------|----------------|----------|
| `demo/iteration/yijian-daifa-store.js` | `authorizedProjects` / `enrolledEditors` / `enabledMats` / `enabledProjects` / `parseProjectNames` 已有 | 新增 `plazaEligible` 并 export | KEY/VER 除非改 seed；`join` 分隔约定 |
| `demo/iteration/yijian-daifa-demo.html` | `visibleItems` 922–935 只挡审核/占用/项目；`claimBlockReason` 1586–1596 同；`applyScene('timeout')` 1683 写死 M-01 | 资格走 `plazaEligible`；timeout 用 `setScreen` | 门禁顺序、海报、领取留详情、`esc` |
| `demo/iteration/fr-opc-yijian-daifa.html` | `#mProj` 文本（976）+ 保存读 `.value`（1011）；项目弹窗无 `#pjKw`（1026）；`openWorkModal` 1173 对编辑也拦 | 多选+关键词+仅新建拦截 | `workFormHtml` 停用项 unshift；审核仅审核中可驳回；右豹 ID 查重 |
| `demo/iteration/yijian-daifa-pc.html` | `authorizedProjects` 驱动下拉 | **默认不改**；授权串格式不变则自动生效 | 三步上传、提交复检、pubDesc 必填 |
| `tests/e2e/test_yijian_daifa.py` | v6 闭环已绿 | 只追加，不删旧断言 | `embed=1` 跨端 |

### Project Structure Notes

- 交付仍是 `fr-opc-yijian-daifa.html` 四 Tab + 规则抽屉。C 橙、PC 桌面框、Mockup 只 iframe。[Source: `demo/iteration/ITERATION-FR-GUIDE.md`]
- 无独立架构文档。模式：三页共 `yijian-daifa-store.js` + `localStorage` 逻辑闭环，不是真实接口。[Source: `SPEC.md` Constraints；`brownfield.md`]
- 上一增量：`spec-fr014-yijian-daifa-opt.md`（封面/BN/海报/领取进详情，status=done）。v6 审查 defer 见 `deferred-work.md`。

### References

- [Source: `_bmad-output/specs/spec-fr014-yijian-daifa/SPEC.md` CAP-3 / CAP-5 / CAP-9]
- [Source: `_bmad-output/specs/spec-fr014-yijian-daifa/surfaces.md` 项目管理 / 素材类型]
- [Source: `_bmad-output/specs/spec-fr014-yijian-daifa/.memlog.md` v4 停用即时影响]
- [Source: `_bmad-output/implementation-artifacts/deferred-work.md`]
- [Source: `demo/iteration/yijian-daifa-store.js` `parseProjectNames` / `authorizedProjects`]
- [Source: `tests/e2e/test_yijian_daifa.py` `test_admin_fe_store_loop`]

### Previous Story Intelligence

- e2e 本机需 `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"`，沙箱默认路径没有浏览器。
- 独立打开 `yijian-daifa-pc.html`（无 embed）会 reset store，会毁掉前一步后台改动。
- 林夏有占用中稿，停用会被 `toggleEditor` 拦住；测剪辑手停用用阿凯。
- 规则抽屉与 SPEC 必须同步，否则审查会再打合同漂移。

### Git Intelligence Summary

- 最近相关提交：`7404a58` 封面/BN/领取进详情。v6 上传审核与本次门禁修补仍在工作区未提交。
- 本 story 基于工作区 v6 代码，不要以 HEAD 旧 Demo 为基准。

### Latest Tech Information

- 纯静态 HTML/JS Demo，无新依赖、无 npm。不要引入框架或组件库。

### Project Context Reference

- 无 `project-context.md`。遵守 ITERATION-FR-GUIDE：不做真实接口；本 FR 已采纳 localStorage 例外。

## Dev Agent Record

### Agent Model Used

Cursor Grok 4.6（create-story）

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created

### File List

## Change Log

- 2026-09-10：从 FR-014 v6 审查 defer 生成，Status=ready-for-dev
