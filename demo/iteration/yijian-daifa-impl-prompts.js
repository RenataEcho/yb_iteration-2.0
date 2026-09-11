/* FR-014 开发提示词 · Demo 可复制面。合同源：_bmad-output/specs/spec-fr014-yijian-daifa/impl-prompts.md */
(function (global) {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var SLICES = {
    c: {
      id: 'c',
      title: 'C 端开发提示词',
      flow: '前端交互 → 业务流程',
      role: '你正在实现一键代发的 C 端（作品广场 / 详情 / 领取 / 我的领取 / 水印 / 抖音）。一次只改本端。',
      scope: '广场、海报、详情、预览、领取门禁、兑换、我的领取、回填入口、图集水印、下载并发布到抖音。',
      nonGoals: ['上传', '后台 CRUD', '站外落地', '入账拆账', '真扣积分', '另开一套 FR'],
      deps: [
        'store key=fr014-yjd-v6；资格只认 YJD.plazaEligible；下载拦截只认 YJD.downloadBlockReason',
        'GET /api/yjd/feed | /projects | /works/:id | /works/:id/preview | /projects/:id/keywords',
        'POST /api/yjd/claims  {mid,keywordId,idempotencyKey}',
        'POST /api/yjd/skus/:id/redeem  ·  POST /api/yjd/claims/:id/fill  ·  GET /api/yjd/claims/:id/file'
      ],
      note: '页内 SVG 未画「停权中?」菱形。合同优先：门禁必须先停权，再次数，再选词，再占用。',
      steps: [
        { kind: 'check', node: '停权中?（合同补；图未画）', check: 'user.banned 或 bans.status=停权中', ok: '继续次数', fail: '停在详情，不打开任何浮层', toast: '按钮文案「已被停权，无法领取」', api: '读 user / bans，前端不得本地解禁', fr: 'FR-014-11 / 17' },
        { kind: 'ui', node: '作品广场宫格 + 项目直选', check: 'plazaEligible 七条全真后再筛项目/剪辑师/素材/类型/q', ok: '进详情', fail: '空态「没有可领取的稿件」', toast: '列表禁止金额/分成/积分；封面必须是图', api: 'GET /api/yjd/feed', fr: 'FR-014-08' },
        { kind: 'ui', node: '详情铺满素材 · 发起领取', check: '未领/已领换区，不跳下级页', ok: '未领底栏=次数+提词+领取；已领=#pubTips+水印+下载抖音', fail: '—', toast: '预览不扣次；图集≤3；视频试看5秒；快捷提词只跳转题词页', api: 'GET /api/yjd/works/:id  ·  GET .../preview', fr: 'FR-014-09 / 10' },
        { kind: 'check', node: '剩余次数>0?', check: '先 YJD.applyFreeDay；remain=free+bought', ok: '打开选词浮层', fail: '积分买在售档', toast: '次数不足不打开选词、不扣次', api: '读 user.free/bought + freeQuota', fr: 'FR-014-11 / 13' },
        { kind: 'write', node: '积分买在售档', check: 'sku.on && origPoints≥points>0；同时在售≤4', ok: 'bought+=times；关浮层刷新次数', fail: '停在兑换', toast: '原价>现价才划线；不自动打开选词', api: 'POST /api/yjd/skus/:id/redeem', fr: 'FR-014-13 / 26' },
        { kind: 'check', node: '已选通过关键词?', check: '词∈该用户该项目已通过申词；词带 bookId 则必须=稿件 bookId；无默认带入', ok: '进入占用校验', fail: '拦截领取', toast: '未选：「请先选择该项目已通过的关键关键词」；书不一致：「请选择与该稿件书籍一致的已通过关键词」', api: 'GET /api/yjd/projects/:id/keywords（现有申词，不读项目管理）', fr: 'FR-014-11' },
        { kind: 'check', node: '稿件空闲未占用?', check: '确认瞬间重跑停权/次数/词仍通过/plazaEligible/occ=空闲', ok: '领取成功', fail: '领取失败 · 回广场', toast: '占用「稿件已被占用」；资格「稿件当前不可领」；均不扣次', api: 'POST /api/yjd/claims 同一事务', fr: 'FR-014-11 / 16' },
        { kind: 'write', node: '领取成功 · 扣次不退', check: '同一 claimId 原子；失败整单回滚', ok: 'occ=占用中；先扣 free 后 bought；claim=未回填；分成快照；expireAt=+3d；首次领取 ossExpireAt=+7d', fail: '不写占用不扣次', toast: 'loading：正在下载稿件→正在保存到相册→已保存；不拉抖音', api: 'POST /api/yjd/claims + idempotencyKey', fr: 'FR-014-12 / 19 / 32' },
        { kind: 'check', node: '24h 内已回填?', check: '回填页带 claimId；不得改项目/书/词', ok: '完成占用：claim=已回填；occ=已完成；filledAt；不退次；不入账', fail: '记 1 次未回填 + 释放', toast: '已回填/已超时不得再进回填页', api: 'POST /api/yjd/claims/:id/fill', fr: 'FR-014-15 / 16' },
        { kind: 'async', node: '记 1 次未回填 + 释放', check: '满24h且未回填；按 claimId 幂等', ok: 'claim=已超时；occ=空闲；strikes+1；不退次', fail: '—', toast: '前端倒计时不准自己释放', api: 'POST /api/yjd/claims/:id/timeout（任务）', fr: 'FR-014-16' },
        { kind: 'check', node: '终身未回填>3?', check: 'strikes>3（第4次超时）', ok: '停权', fail: '否 · 可再领', toast: '前3次超时仍可再领', api: '与 timeout 同一笔写 bans', fr: 'FR-014-17' },
        { kind: 'block', node: '停权 / 后台手动恢复', check: '仅后台 POST /admin/bans/:user/restore', ok: '回广场可再领', fail: '停权中无法再领任何稿', toast: '窗未过点下载：「您已违反平台规则，超过3次未回填；下载链接已失效」', api: '无自助解禁', fr: 'FR-014-17 / 23' },
        { kind: 'ui', node: '原领取人与他人均可再领（再扣次）', check: '未停权；稿已回空闲', ok: '新 claim、再选词、再扣次、新快照', fail: '已完成稿永不回广场', toast: '下载 toast 优先：时效过期 > 停权 > 24h未回填 > 云端失效', api: 'GET /api/yjd/claims/:id/file', fr: 'FR-014-16 / 19 / 28' },
        { kind: 'ui', node: '添加水印 / 下载并发布到抖音', check: 'downloadBlockReason==""；仅图集进水印页', ok: '先过3天窗再保存；成功后 #dySheet；scheme 只用隐藏 iframe', fail: '只 toast，不打开相册', toast: '视频：「视频稿件暂不支持添加水印」。禁止 location.href 带走宿主', api: '与 file 同一下载权', fr: 'FR-014-18 / 28' }
      ],
      side: [
        '占用后他人广场立即消失；领取人「我的领取」出现未回填',
        '回填后后台领取=已回填，稿件=已完成',
        '超时后稿回广场；strikes>3 进黑名单',
        '领取成功 loading 三态不拉抖音'
      ],
      accept: 'FR-014-08…19、28。e2e tests/e2e/test_yijian_daifa.py 的 C 端路径全绿。'
    },
    h5: {
      id: 'h5',
      title: 'H5 站外开发提示词',
      flow: '数据交互 → 阿里云存储 → 站外下载即删',
      role: '你正在实现站外无登录落地页 yijian-daifa-offsite.html。',
      scope: '扫码/开链 → 余量判断 → 点下即扣 → 删该份 OSS → 已领完缺省。',
      nonGoals: ['登录/注册', '选词/次数/回填/水印', '进广场', '3/7 天窗', '恢复C端下载', '写 claims'],
      deps: [
        'GET /api/yjd/offsite/:id  ·  GET /api/yjd/offsite/:id/file',
        'YJD.claimOffsiteAsset；余量=assets-claimedAssets；ID 前缀 X-'
      ],
      steps: [
        { kind: 'ui', node: '打开链接 / 扫码', check: '稿不存在或 fileStatus=已删除', ok: '继续余量判断', fail: '缺省「链接已失效」，无下载按钮', toast: '不得出现登录/注册', api: 'GET /api/yjd/offsite/:id', fr: 'FR-014-31' },
        { kind: 'check', node: '素材已领完?', check: 'claimedAssets>=assets', ok: '出示封面/标题/项目/书/类型 +「下载稿件」', fail: '缺省「素材已领完」，无下载按钮', toast: '余量空不是整夹清桶', api: '只读 assets/claimedAssets', fr: 'FR-014-31' },
        { kind: 'ui', node: 'H5 点下载', check: '余量>0 且稿正常', ok: '先扣再播保存动效', fail: '切已领完缺省', toast: '无选词、无次数、不写 claims', api: 'GET /api/yjd/offsite/:id/file', fr: 'FR-014-31' },
        { kind: 'write', node: '领一个删一个', check: 'claimedAssets+1 不超过素材数', ok: '立刻删该份 OSS', fail: '不写余量', toast: '下载链路不判定整夹是否领完', api: '与 file 同一事务', fr: 'FR-014-31 / 32' },
        { kind: 'ui', node: '该素材云端已删除', check: '虚线：夹内下一份再点下载', ok: '余量>0 回到「H5 点下载」', fail: '余量0 → 本页切缺省，无下载按钮', toast: 'PC/后台「x个素材(已领x个)」即时同步', api: '不走 restore-dl', fr: 'FR-014-30 / 31' }
      ],
      side: ['PC / 后台站外 Tab 余量即时变', '不进广场', '未领整夹满15天仍走站外15天钟（见接口切片）'],
      accept: '打开 X-01 可下并余量-1；X-04 / 失效 id 无下载按钮。'
    },
    pc: {
      id: 'pc',
      title: 'PC 剪辑供稿开发提示词',
      flow: 'PC端 → 业务流程',
      role: '你正在已有 PC 创作者中心加「剪辑供稿」增量，不新造 PC 产品。',
      scope: '招募 BN、看板、上传弹窗、上传 list、收益数据、操作说明。',
      nonGoals: ['改项目中心/作品管理/收益中心', 'C 端领取门禁', '中间再加授权项目栏', '收益表混入站外稿'],
      deps: [
        'POST /api/yjd/pc/works  ·  PUT /api/yjd/oss/works/:id',
        'editor.status / platforms / needReview / projects；YJD.workAuditAfterUpload'
      ],
      steps: [
        { kind: 'ui', node: 'PC 招募海报 · 底部客服二维码', check: '未录入也可看 BN 与操作说明', ok: '侧栏展开海报', fail: '—', toast: '无站内申请表；C 端不承载此页', api: '只读', fr: 'FR-014-01 / 02' },
        { kind: 'check', node: '已录入剪辑手?', check: 'status=已录入 且未停用', ok: '看四格+上传', fail: '阻断上传', toast: '停用点上传：「剪辑供稿权限已被收回，不能上传稿件」。未开通平台看不到对应 Tab', api: '读 editors', fr: 'FR-014-02 / 20 / 29' },
        { kind: 'ui', node: '先填字段再选成片 · 文件夹或压缩包', check: '顺序不可颠倒；压缩包必须先解压中再解析', ok: '确认表：ID系统生成 / 文件名=标题 / 图集一夹一组 / 空技巧可入队', fail: '不入队', toast: '右豹必选素材、含书籍链接、无标题无大小。站外无素材/技巧/压缩包，整夹一条', api: '本地解析后再 POST /pc/works 队列', fr: 'FR-014-04 / 30' },
        { kind: 'check', node: '项目已启用?', check: '项目∈授权∩启用', ok: '入队上传', fail: '项目禁用拦截 · 回选项目', toast: '零勾选项目=—，不能传', api: '读 projects + editor.projects', fr: 'FR-014-04 / 24' },
        { kind: 'write', node: '提交上传结果', check: '按条队列；失败只重传失败文件', ok: 'uploadStatus 三态；ossKey+uploadedAt；audit=needReview?审核中:已通过；站外免审已通过', fail: '该条=上传失败', toast: '已上传=文件+技巧已提交，其后走审核三态', api: 'POST /api/yjd/pc/works  ·  PUT /api/yjd/oss/works/:id', fr: 'FR-014-05 / 06 / 32' },
        { kind: 'check', node: '审核通过?', check: 'audit=已通过 且 occ=空闲 且 plazaEligible', ok: '空闲稿进入用户广场', fail: '已驳回出示原因；审核中/站外/已删除不进广场', toast: '已通过不可再驳', api: '后台 audit 接口，PC 只读', fr: 'FR-014-06 / 07' },
        { kind: 'write', node: '空闲稿进入用户广场', check: '占用中 / 已完成不回广场', ok: 'C 端 feed 可见', fail: '—', toast: '看板：授权只出数字弹窗；收益数据仅 channel=右豹；list 仅空闲且正常可删', api: '读 settlements 按日/月/自定义', fr: 'FR-014-03 / 07 / 08' }
      ],
      side: ['后台稿件表即时出现新稿', '需审稿不进广场', '主动删除同步清 OSS，行留已删除'],
      accept: 'FR-014-01…07、29、30。看板不得在统计与最近上传之间加项目栏。'
    },
    admin: {
      id: 'admin',
      title: '管理后台开发提示词',
      flow: '管理后台 · 七菜单各自「业务流程」',
      role: '你正在实现右豹后台七页。每页按自己的流程图闭环，不要把 C 端门禁重写一遍。',
      scope: '剪辑手 / 稿件 / 领取记录 / 黑名单 / 项目 / 素材 / 次数商品。',
      nonGoals: ['广场 Banner 配置页', '改领取门禁顺序', '改 FR-002 收益页', '项目管理维护关键词'],
      deps: [
        'POST /api/yjd/admin/works/:id/audit  ·  POST /admin/bans/:user/restore  ·  POST /admin/works/:id/restore-dl',
        'YJD.canSoftDelete / softDeleteWork / restoreClientDownload / onSaleCount'
      ],
      note: 'FR-014-20：停用不看占用、不看名下是否有稿。页内剪辑手图若写「有占用稿不能停用」，以本合同为准。',
      section: '',
      steps: [
        { kind: 'ui', node: '客服二维码招募接入', section: 'admin-editors', check: '无站内申请表', ok: '运营打开录入', fail: '—', toast: '—', api: '只读', fr: 'FR-014-01 / 20' },
        { kind: 'write', node: '后台录入剪辑手', section: 'admin-editors', check: 'ybId 唯一；分成；备注；needReview 默认是；platforms≥1；项目多选', ok: 'status=已录入', fail: '不建行', toast: '备注/来源只进详情；KPI 在筛选上方按当前筛选汇总', api: 'POST 剪辑手', fr: 'FR-014-20 / 29' },
        { kind: 'check', node: '已录入且未停用?', section: 'admin-editors', check: 'status=已录入', ok: '可上传授权∩启用项目', fail: '不能上传', toast: '停用即时藏其广场稿；有稿不能硬删', api: '改 status', fr: 'FR-014-20' },
        { kind: 'ui', node: 'PC 新上传', section: 'admin-works', check: 'needReview?审核中:已通过', ok: '汇入审核菱形', fail: '—', toast: '—', api: 'PC 写入', fr: 'FR-014-06' },
        { kind: 'write', node: '后台录入稿件', section: 'admin-works', check: '视为已审', ok: 'audit=已通过', fail: '右豹无启用剪辑手/项目/素材则不打开弹窗；站外不要素材', toast: '—', api: 'POST 后台稿', fr: 'FR-014-21' },
        { kind: 'check', node: '审核中?', section: 'admin-works', check: 'audit=审核中', ok: '单条或批量审核', fail: '已通过不可再驳', toast: '驳回原因必填', api: 'POST /admin/works/:id/audit', fr: 'FR-014-06' },
        { kind: 'check', node: '审核通过?', section: 'admin-works', check: 'pass 且空闲且 plazaEligible', ok: '空闲稿进入广场', fail: '不进广场', toast: '占用中/未超时领取/已删除不可删；主动删同步 OSS 不可恢复', api: 'YJD.canSoftDelete', fr: 'FR-014-21 / 32' },
        { kind: 'ui', node: '领取记录列表', section: 'admin-claims', check: '必出项目/书籍/剪辑手聚合/回填视频链接', ok: '按回填状态分流', fail: '—', toast: '不改状态、不删记录', api: 'GET 领取', fr: 'FR-014-22' },
        { kind: 'check', node: '回填状态?', section: 'admin-claims', check: '未回填→待回填；已回填；已超时→已超时释放', ok: '操作只留稿件详情抽屉（带 claimId）', fail: '—', toast: '恢复C端下载每稿一次；站外不可恢复', api: 'POST .../restore-dl', fr: 'FR-014-22 / 32' },
        { kind: 'async', node: '终身未回填超过 3 次', section: 'admin-ban', check: 'strikes>3', ok: '写入黑名单 · 停权', fail: '—', toast: '与 timeout 同一笔', api: '任务写入', fr: 'FR-014-17' },
        { kind: 'check', node: '运营手动恢复?', section: 'admin-ban', check: '仅恢复操作', ok: '后台手动恢复，行留已恢复', fail: '停权中', toast: '无自助解禁', api: 'POST /admin/bans/:user/restore', fr: 'FR-014-23' },
        { kind: 'ui', node: '添加 / 编辑项目', section: 'admin-projects', check: '品牌库带出名称+Logo；已添加仍列出', ok: '进启用判定', fail: '已添加则保存拦截；禁止手填新建', toast: '无关键词字段', api: '读品牌库', fr: 'FR-014-24' },
        { kind: 'check', node: '项目已启用?', section: 'admin-projects', check: 'status=启用', ok: '可上传 · 空闲稿可进广场', fail: '不可上传不进广场', toast: '有稿不可删', api: '改 status/sort', fr: 'FR-014-24' },
        { kind: 'ui', node: '维护素材类型', section: 'admin-mats', check: '上传必选；feed 素材只筛该字段', ok: '进启用判定', fail: '—', toast: '不是图集/视频', api: 'POST/PATCH 素材', fr: 'FR-014-25' },
        { kind: 'check', node: '类型启用?', section: 'admin-mats', check: 'status=启用', ok: '上传下拉与广场筛选项可见', fail: '不可选 / 不可筛；对应空闲稿即时藏', toast: '有稿改停用，不能删', api: '改 status', fr: 'FR-014-25' },
        { kind: 'ui', node: '配置工作日/节假日免费次数 + 次数商品', section: 'admin-skus', check: 'weekday/holiday≥0；origPoints≥points>0', ok: '进在售数判定', fail: '不保存', toast: '保存今日类型额度后 user.free 立刻改成该值', api: 'PATCH freeQuota', fr: 'FR-014-26' },
        { kind: 'check', node: '在售档位数≤4?', section: 'admin-skus', check: 'YJD.onSaleCount≤4', ok: 'C 端兑换浮层可见在售档', fail: '不可再上架', toast: '下架立即不可新购，已购保留；购买人数只读', api: 'PATCH sku.on', fr: 'FR-014-13 / 26' }
      ],
      side: ['项目/素材/剪辑手状态变更后广场即时按 plazaEligible 过滤', '次数商品下架不影响已购'],
      accept: 'FR-014-20…26。次数产品规则只在 FR-014-13+26 验收。'
    },
    api: {
      id: 'api',
      title: '接口开发提示词',
      flow: '数据交互 → 接口契约 / 用户收益入账 / 阿里云存储',
      role: '你正在实现一键代发后端：领取占用、代发入账、OSS 生命周期。不要用 Demo localStorage 当接口。',
      scope: 'claims 门禁与超时任务；settlements/apply；OSS 上传/签链/purge/restore；站外 file。',
      nonGoals: ['改 FR-002 账本结构', '前端倒计时写超时', '站内站外两条 OSS 链汇合', '先结算后回填回溯已落账'],
      deps: [
        'POST /api/yjd/claims  ·  /claims/:id/fill  ·  /claims/:id/timeout',
        'POST /api/yjd/settlements/apply {keywordId,orderId,settledAt,amount}',
        'PUT /api/yjd/oss/works/:id  ·  GET /claims/:id/file  ·  GET /offsite/:id/file  ·  POST /oss/purge  ·  POST /admin/works/:id/restore-dl'
      ],
      steps: [
        { kind: 'write', node: '领取事务', section: 'api-core', check: '同一请求重跑：停权→次数→词(含书ID)→plazaEligible→occ=空闲', ok: '原子写占用+扣次+未回填+快照+expireAt+首次ossExpireAt', fail: '整单回滚，不扣次', toast: '错误码与 C 端 toast 对齐', api: 'POST /api/yjd/claims + idempotencyKey', fr: 'FR-014-11 / 12' },
        { kind: 'write', node: '回填仍不入账', section: 'api-core', check: '仅 status=未回填', ok: 'claim=已回填；occ=已完成；filledAt', fail: '已回填/已超时 409', toast: '不得改领取时的项目/书/词', api: 'POST /api/yjd/claims/:id/fill', fr: 'FR-014-15' },
        { kind: 'async', node: '24h 超时任务', section: 'api-core', check: '按 claimId 幂等', ok: '已超时+释放+strikes+1；strikes>3 写黑名单', fail: '重试不叠加', toast: '不退次', api: 'POST /api/yjd/claims/:id/timeout', fr: 'FR-014-16 / 17' },
        { kind: 'ui', node: '用户回填完成', section: 'api-payout', check: 'claim=已回填 · 稿件已完成', ok: '此时不入账', fail: '—', toast: '—', api: '无结算写', fr: 'FR-014-27' },
        { kind: 'async', node: '关键词出单', section: 'api-payout', check: '待结算只累计', ok: '等待已结算', fail: '—', toast: '不写明细', api: '既有订单', fr: 'FR-014-27' },
        { kind: 'check', node: '订单已结算?', section: 'api-payout', check: '订单态=已结算', ok: '结算回调 apply', fail: '待结算不入账', toast: '—', api: '—', fr: 'FR-014-27' },
        { kind: 'write', node: '结算回调 apply', section: 'api-payout', check: '同一 orderId+keywordId 幂等', ok: '进入代发判定', fail: '已落账直接成功返回，不回溯', toast: '先结算后回填不影响已落账', api: 'POST /api/yjd/settlements/apply', fr: 'FR-014-27' },
        { kind: 'check', node: '代发关键词?', section: 'api-payout', check: '存在已回填 (keywordId,claimId)；多条取 filledAt 最近', ok: '按分成拆用户实结+剪辑手分账', fail: '全额用户入账 · 不写剪辑手分账', toast: '未回填/已超时不是代发', api: '只读快照，不读当前分成', fr: 'FR-014-27' },
        { kind: 'write', node: '按分成拆用户实结+剪辑手分账', section: 'api-payout', check: 'editorShare=round(gross×快照)；userNet=gross-share；两边之和=gross', ok: '进原子写入', fail: '—', toast: '文案模板见 FR-014-27', api: '计算层', fr: 'FR-014-27' },
        { kind: 'check', node: '原子写入成功?', section: 'api-payout', check: '双方明细同一秒时间戳', ok: '双方项目收益明细 · 状态已结算', fail: '整笔回滚，回到结算回调', toast: '复用既有明细，不改 FR-002', api: '同一事务', fr: 'FR-014-27' },
        { kind: 'write', node: 'PC / 后台上传入桶', section: 'api-oss', check: '写入 ossKey + uploadedAt；fileStatus=正常', ok: '未领取走15天', fail: '不建稿', toast: '未领不起算7天', api: 'PUT /api/yjd/oss/works/:id', fr: 'FR-014-32' },
        { kind: 'check', node: '已有首次领取?', section: 'api-oss', check: 'work.ossExpireAt 已有或存在领取', ok: '签发 C端3天 + 系统7天', fail: '未领满 15 天? 是则删OSS不可恢复', toast: 'ttl15 → fileStatus=已删除', api: 'POST /api/yjd/oss/purge', fr: 'FR-014-32' },
        { kind: 'check', node: 'C端 3 天内?', section: 'api-oss', check: 'claim.expireAt>now 且 ossAlive', ok: '下载签链成功 GET /claims/:id/file', fail: '进系统满7天?', toast: '403 CLIENT_DL_EXPIRED', api: 'GET /api/yjd/claims/:id/file', fr: 'FR-014-19 / 32' },
        { kind: 'check', node: '系统满 7 天?', section: 'api-oss', check: 'ossExpireAt≤now', ok: '否 → 已恢复过一次?', fail: '是 → 删OSS不可恢复', toast: '云端资源已失效，无法再下载 / 无法恢复', api: 'purge ttl7', fr: 'FR-014-32' },
        { kind: 'check', node: '已恢复过一次?', section: 'api-oss', check: 'ossRestoreUsed', ok: '否 → 后台恢复C端下载', fail: '不可再恢复', toast: '该稿件下载链接已恢复过一次', api: 'POST /admin/works/:id/restore-dl', fr: 'FR-014-22 / 32' },
        { kind: 'write', node: '后台恢复C端下载', section: 'api-oss', check: '已领取且对象仍在；站外拒绝', ok: '重计 min(now+3d, ossExpireAt)，不重置系统钟', fail: '已用/已删/未过期/站外', toast: 'YJD.restoreClientDownload 错误文案', api: 'restore-dl', fr: 'FR-014-22 / 32' },
        { kind: 'write', node: '主动删除', section: 'api-oss', check: 'YJD.canSoftDelete', ok: '阿里云同步删；fileStatus=已删除；不可恢复', fail: '占用中 / 未超时领取 / 上传中', toast: '行保留', api: 'DELETE 稿件', fr: 'FR-014-32' },
        { kind: 'write', node: '文件夹入桶', section: 'api-oss-off', check: 'channel=站外；assets=文件数', ok: '夹内每素材一份 OSS', fail: '—', toast: '不进广场', api: 'PUT oss channel=站外', fr: 'FR-014-30 / 32' },
        { kind: 'write', node: 'H5 点下载 → 领一个删一个', section: 'api-oss-off', check: '余量>0', ok: 'claimedAssets+1；立刻删该份 OSS', fail: '410 无余量', toast: '不判整夹；不走3/7；不能 restore-dl', api: 'GET /api/yjd/offsite/:id/file', fr: 'FR-014-31 / 32' }
      ],
      side: ['C/PC/后台/H5 读同一份状态', '入账失败不得出现单边明细', '站内/站外 OSS 链互不汇合'],
      accept: 'FR-014-11/12/16/17/27/32。同一 orderId+keywordId 只落一次；e2e 不依赖真实 HTTP。'
    }
  };

  var KIND_LABEL = { check: '校验', write: '写入', ui: '端侧', async: '任务', block: '阻断' };

  function filterSlice(base, section) {
    if (!base) return null;
    if (!section) return base;
    var steps = (base.steps || []).filter(function (s) {
      return !s.section || s.section === section ||
        (section === 'api-oss' && (s.section === 'api-oss' || s.section === 'api-oss-off')) ||
        (section === 'api-payout' && s.section === 'api-payout');
    });
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    out.steps = steps;
    out.section = section;
    return out;
  }

  function resolve(id) {
    if (SLICES[id]) return SLICES[id];
    if (id && id.indexOf('admin-') === 0) return filterSlice(SLICES.admin, id);
    if (id === 'api-payout' || id === 'api-oss') return filterSlice(SLICES.api, id);
    return null;
  }

  function textOf(id) {
    var s = resolve(id);
    if (!s) return '';
    var lines = [];
    lines.push('# FR-014 · ' + s.title);
    lines.push(s.role);
    lines.push('');
    lines.push('节点必须与「' + s.flow + '」SVG 同名。WHAT 以 requirements.md 为准，禁止另开规则。');
    if (s.note) lines.push('注意：' + s.note);
    lines.push('');
    lines.push('## 范围');
    lines.push(s.scope);
    lines.push('');
    lines.push('## 禁止');
    (s.nonGoals || []).forEach(function (x) { lines.push('- ' + x); });
    lines.push('');
    lines.push('## 依赖');
    (s.deps || []).forEach(function (x) { lines.push('- ' + x); });
    lines.push('');
    lines.push('## 按节点实现');
    (s.steps || []).forEach(function (st, i) {
      lines.push('');
      lines.push('### N' + (i + 1) + ' ' + st.node);
      lines.push('类型：' + (KIND_LABEL[st.kind] || st.kind));
      lines.push('判定：' + st.check);
      lines.push('成功：' + st.ok);
      lines.push('失败回：' + st.fail);
      lines.push('文案：' + st.toast);
      lines.push('接口：' + st.api);
      lines.push('FR：' + st.fr);
    });
    lines.push('');
    lines.push('## 跨端副作用');
    (s.side || []).forEach(function (x) { lines.push('- ' + x); });
    lines.push('');
    lines.push('## 验收');
    lines.push(s.accept);
    lines.push('');
    lines.push('实现时对照 Demo 同端「业务流程」图逐节点勾掉。节点改了必须回写 impl-prompts.md。');
    return lines.join('\n');
  }

  function render(id) {
    var s = resolve(id);
    if (!s) return '<p class="impl-empty">没有这份提示词。</p>';
    var steps = (s.steps || []).map(function (st, i) {
      return '<article class="impl-step">' +
        '<h3><span class="impl-kind ' + esc(st.kind) + '">' + esc(KIND_LABEL[st.kind] || st.kind) + '</span>' +
        '<span>N' + (i + 1) + ' · ' + esc(st.node) + '</span></h3>' +
        '<dl class="impl-kv">' +
        '<dt>判定</dt><dd>' + esc(st.check) + '</dd>' +
        '<dt>成功写</dt><dd>' + esc(st.ok) + '</dd>' +
        '<dt>失败回</dt><dd>' + esc(st.fail) + '</dd>' +
        '<dt>文案</dt><dd>' + esc(st.toast) + '</dd>' +
        '<dt>接口</dt><dd><code>' + esc(st.api) + '</code></dd>' +
        '<dt>FR</dt><dd>' + esc(st.fr) + '</dd>' +
        '</dl></article>';
    }).join('');
    return '<div class="impl-prompt" data-impl="' + esc(s.id) + '">' +
      '<div class="impl-prompt-head">' +
      '<div><h2>' + esc(s.title) + '</h2>' +
      '<p>按「' + esc(s.flow) + '」节点闭环。复制后交给实现者，不要再发明规则。</p></div>' +
      '<div class="impl-prompt-actions">' +
      '<button type="button" class="btn btn-primary impl-copy" data-copy="' + esc(id) + '">复制提示词</button>' +
      '<span class="impl-copied" hidden>已复制</span></div></div>' +
      (s.note ? '<div class="impl-note">' + esc(s.note) + '</div>' : '') +
      '<div class="impl-block"><h4>范围</h4><p>' + esc(s.scope) + '</p></div>' +
      '<div class="impl-block"><h4>禁止</h4><ul>' + (s.nonGoals || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="impl-block"><h4>依赖</h4><ul>' + (s.deps || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="impl-block"><h4>按节点执行</h4>' + steps + '</div>' +
      '<div class="impl-block"><h4>跨端副作用</h4><ul>' + (s.side || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="impl-block"><h4>验收</h4><p>' + esc(s.accept) + '</p></div>' +
      '</div>';
  }

  function mountAll() {
    document.querySelectorAll('[data-impl-host]').forEach(function (el) {
      el.innerHTML = render(el.getAttribute('data-impl-host'));
    });
    document.querySelectorAll('.impl-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-copy');
        var text = textOf(id);
        function done() {
          var tip = btn.parentElement && btn.parentElement.querySelector('.impl-copied');
          if (!tip) return;
          tip.hidden = false;
          setTimeout(function () { tip.hidden = true; }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            window.prompt('复制以下提示词', text);
            done();
          });
        } else {
          window.prompt('复制以下提示词', text);
          done();
        }
      });
    });
  }

  global.YJD_IMPL = {
    SLICES: SLICES,
    resolve: resolve,
    textOf: textOf,
    render: render,
    mountAll: mountAll
  };
})(window);
