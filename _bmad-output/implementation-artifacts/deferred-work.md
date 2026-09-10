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
