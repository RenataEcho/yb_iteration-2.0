## Deferred from: code review of SPEC.md (2026-09-10)

- 停用剪辑手 / 停用素材后，其已通过空闲稿仍出现在广场。`visibleItems()` 只挡审核态、占用、项目禁用。memlog v4 写过即时影响，SPEC CAP-3 只锁「启用项目」。`demo/iteration/yijian-daifa-demo.html:865-878`
- 新建项目 `keywords[name] = []`，后台无关键词维护，该项目领取会被「无/未选」拦住。属 v4 项目管理遗留。`demo/iteration/fr-opc-yijian-daifa.html:1033-1034`
- 剪辑手「可上传项目」是自由文本，与项目表无多选绑定，写错即授权失败。属 v4 录入形态。`demo/iteration/fr-opc-yijian-daifa.html:972`
- 无启用剪辑手时，`openWorkModal` 对新建和编辑一并拦截，已有稿无法打开。`demo/iteration/fr-opc-yijian-daifa.html:1142`
- QA 场景 `applyScene('timeout')` 写死 `item('M-01')`，演示稿被删后空引用崩溃。`demo/iteration/yijian-daifa-demo.html:1617-1619`

- source_spec: `_bmad-output/implementation-artifacts/spec-014-2-visibility-gates.md`
  summary: 本机已有 localStorage 里 keywords 为空的旧项目仍进广场，领取才提示暂无已通过词
  evidence: 未 bump VER，plazaEligible 不检查词表；仅新建/编辑弹窗拦空词

- source_spec: `_bmad-output/implementation-artifacts/spec-014-2-visibility-gates.md`
  summary: 删除项目不清理 keywords 与剪辑手授权串，留下孤儿数据
  evidence: deleteProject 未改；本 story 只改了保存与改名迁移

- source_spec: `_bmad-output/implementation-artifacts/spec-014-2-visibility-gates.md`
  summary: 广场空态与筛选项仍按旧文案/全量 ITEMS，停用剪辑手或素材后下拉仍能选到不可见表的人
  evidence: buildFilters 与空态文案未动，属展示层遗留

- source_spec: `_bmad-output/implementation-artifacts/spec-014-2-visibility-gates.md`
  summary: 其它写死 M-01 的 QA 入口没有超时空守卫
  evidence: 本 story 只护了 applyScene('timeout')

- source_spec: `_bmad-output/implementation-artifacts/spec-fr014-yijian-daifa-v7.md`
  summary: brownfield.md 仍写旧的四 Tab（前端 / PC / 后台 / 业务流程）
  evidence: 本增量任务只同步 SPEC / surfaces / flows，未改 brownfield

- source_spec: `_bmad-output/implementation-artifacts/spec-fr014-yijian-daifa-v7.md`
  summary: Sprint 概览 framework-shell 仍标 FR-014 v6 与旧 Tab 文案
  evidence: 规格未要求改框架壳，属入口文档漂移

- source_spec: `_bmad-output/implementation-artifacts/spec-014-3-admin-surfaces.md`
  summary: plazaEligible 比已提交基线多了 uploadStatus 门槛，规则抽屉仍写五条可见性
  evidence: 本 story Never 禁止重写 plazaEligible；该行来自并行 PC 上传队列，规则/FAQ 未同步

- source_spec: `_bmad-output/implementation-artifacts/spec-014-3-admin-surfaces.md`
  summary: 批量审核的驳回支路（空原因拦截、只驳审核中且空闲）没有 e2e
  evidence: test_admin_batch_audit_and_delete 只走默认通过；属并行审核增量，不在本 I/O 矩阵

- source_spec: `_bmad-output/implementation-artifacts/spec-014-5-show-publish-tips-field.md`
  summary: 发布技巧为空时只读框没有占位，用户要点复制才看到「暂无发布技巧」
  evidence: 本改动只补字段名；空态 toast 是既有复制逻辑，未改正文区空态

- source_spec: `_bmad-output/implementation-artifacts/spec-014-5-show-publish-tips-field.md`
  summary: 复制未处理 clipboard 失败，接口不可用时仍 toast「已复制发布技巧」
  evidence: `navigator.clipboard.writeText` 无 catch；属领取详情既有复制实现

- source_spec: `_bmad-output/implementation-artifacts/spec-014-6-sku-orig-price.md`
  summary: 数据交互表没有独立的在售档 GET，C 端 origPoints 只能从实体清单推断
  evidence: 本改动只补 sku 字段与兑换校验句；既有契约本来就没有 `GET /api/yjd/skus`

- source_spec: `_bmad-output/implementation-artifacts/spec-014-6-sku-orig-price.md`
  summary: 兑换浮层划线价没有「原价」字样，选中态灰色对比度偏低
  evidence: 本改动按常见划线价只出示数字；未改文案层级和对比度
