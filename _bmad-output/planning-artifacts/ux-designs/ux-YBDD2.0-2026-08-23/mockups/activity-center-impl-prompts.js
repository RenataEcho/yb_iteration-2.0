/* FR-006 开发提示词 · Demo 可复制面。合同源：_bmad-output/specs/spec-fr006-activity-center/ */
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
      role: '你正在实现活动中心的 C 端（列表 / Banner / 详情 / 已参与）。一次只改本端。',
      scope: '显示池 Banner 与图1卡片、筛选 Tab、详情介绍/案例/榜单、封面 cover、领取仅介绍 Tab 且进行中可点、跳转失败不记已参与、showUserAward 展位。',
      nonGoals: ['活动级外链 / 列表外跳', '礼品中心', '审核中态', '报名表单', '真实 fetch', '列表获奖角标'],
      deps: [
        '能力名：活动列表、活动详情、已参与集合',
        '下发字段对齐 admin-fields.md；显隐对齐 visibility-rules.md'
      ],
      note: '列表与 Banner「查看」一律进详情，不外跳、不因该点击记已参与。',
      steps: [
        { kind: 'ui', node: '用户看 Banner + 列表', check: '只渲染 visible=显示 的显示池；置顶最多 1 条且不随筛选 Tab 隐藏', ok: '点「查看」', fail: '隐藏活动不出现', toast: '必带「x人浏览」；参加人数未下发整段不展示', api: '能力：活动列表', fr: 'CAP-1' },
        { kind: 'ui', node: '点「查看」进入详情', check: '卡片 / Banner 同一行为', ok: '打开详情', fail: '—', toast: '禁止外跳 toast；禁止因查看写入已参与', api: '能力：活动详情', fr: 'CAP-4' },
        { kind: 'ui', node: 'Tab 与封面', check: '介绍有 introContent；完整案例≥1；leaderboardVisible=开启才出榜单 Tab；实际 Tab<2 则无 Tab 栏；信息卡片与 Tab 区分；cover 已下发才展示 88px 封面', ok: '默认第一个实际存在的 Tab', fail: '未配置的整 Tab 不出现；无封面则不展示封面', toast: '禁止「我的作品」；榜单为列表无颁奖台', api: '能力：活动详情 / 活动榜单', fr: 'CAP-2 / CAP-7' },
        { kind: 'ui', node: '本人获奖展位', check: '第2步 showUserAward=开启才展示；awardStatus=won 或 not_won', ok: '卡片与 Tab 之间展示展位', fail: '开关关不出现展位', toast: '已获奖可带 awardPrize；无审核中；详情内容不配该样式', api: '能力：活动详情', fr: 'CAP-6' },
        { kind: 'check', node: '点已配置领取按钮？', check: '介绍 Tab 且 needClaimButtons=true 且进行中；跳转有地址或非跳转有变更文案', ok: '非跳转换文案并记账；跳转成功才记账', fail: '案例/榜单无底栏；待开始/已结束不可点；跳转失败不记账', toast: '关或半填无底栏', api: '能力：详情领取', fr: 'CAP-3 / CAP-5' },
        { kind: 'write', node: '记已参与', check: '去重键 (user, 活动)', ok: '已参与 Tab 出现该活动（仍须在显示池）', fail: '查看 / 期外 / 跳转失败不写入', toast: '空态「暂无已参与的活动」；Banner 仍在', api: '能力：已参与集合', fr: 'CAP-5' }
      ],
      side: ['改详情按钮不得改写列表「查看」行为', 'showUserAward 关不展示获奖展位', '榜单不投影奖励管理五列'],
      accept: '点列表/Banner 查看进详情且无外跳 toast；从未领取时已参与为空。'
    },
    admin: {
      id: 'admin',
      title: '后台开发提示词',
      flow: '管理后台 → 业务流程',
      role: '你正在实现活动中心后台列表与两步编辑页。不要把 C 端详情重写一遍。',
      scope: '活动列表筛选、新增/编辑两步向导、封面、保存校验、下发组装；参加人数点进参与详情；操作含达标用户与删除。',
      nonGoals: ['后台子菜单拆分', '活动级外链输入', '获奖字段 / isReward', '奖励管理录入页', '真实 HTTP'],
      deps: [
        '能力名：后台保存、活动列表、活动详情、参与明细、达标用户',
        '字段表 admin-fields.md；置顶冲突见该表'
      ],
      note: '不拆子菜单。第2步配置领取按钮与奖励规则。达标用户奖励按该活动奖励规则计算。',
      steps: [
        { kind: 'ui', node: '打开活动编辑', check: '两步：第1步基础（含活动描述）+封面+介绍+可删除案例+榜单开/关、前x名、行描述、周期描述 / 第2步领取开关 + 奖励规则（含显示获奖信息开关；播放/名次区间阶梯同一行；累计奖品牌项目+其他业务项目多选，无排除项目）', ok: '进入必填校验', fail: '—', toast: '赛道/项目取现有 list；项目多选；隐藏榜单不展示 TOP 与描述输入；详情内容不展示获奖样式', api: '读活动主数据', fr: 'CAP-1 / CAP-3 / CAP-6 / CAP-7 / CAP-11' },
        { kind: 'check', node: '必填齐全？', check: '标题≤64、开始时间、活动状态（显示/隐藏）', ok: '继续结束时间校验', fail: '拒绝保存并提示缺失项', toast: '校验失败不保存', api: '能力：后台保存', fr: 'Constraints' },
        { kind: 'check', node: '结束时间合法？', check: '有值不得早于开始；空=长期', ok: '继续置顶校验', fail: '拒绝保存', toast: '结束时间不能早于开始时间', api: '能力：后台保存', fr: 'Constraints' },
        { kind: 'check', node: '置顶冲突？', check: '显示且置顶时，显示池内不得已有另一条置顶', ok: '保存活动', fail: '保存失败，先取消原置顶', toast: '已有置顶活动提示', api: '能力：后台保存', fr: 'CAP-1' },
        { kind: 'write', node: '保存活动并下发组装', check: '浏览量缺省 0 必带；封面已配才下发；案例须名称+组成；榜单开启才下发开关与条数；needClaimButtons 关则无按钮；开则领取最多2个；奖励规则按类型下发', ok: '进入显示判定', fail: '不写库', toast: 'Demo 不发起真实请求', api: '能力：后台保存', fr: 'admin-fields §3' },
        { kind: 'check', node: '活动状态=显示？', check: 'visible=显示', ok: 'C 端可读显示池', fail: '写入但不进显示池', toast: '隐藏活动不出现 Banner/列表/详情', api: '能力：活动列表', fr: 'CAP-1' },
        { kind: 'ui', node: '点参加人数', check: '已配置才可点', ok: '打开参与详情', fail: '未配置显示 -', toast: '字段：用户ID / 昵称 / 手机号 / 作品数', api: '能力：参与明细', fr: 'admin-list' },
        { kind: 'ui', node: '点达标用户', check: '按活动 ID', ok: '打开达标用户表', fail: '空表', toast: '奖励计算按该活动奖励规则', api: '能力：达标用户', fr: 'admin-list' },
        { kind: 'write', node: '删除活动', check: '运营确认', ok: '列表移除', fail: '取消则不删', toast: 'Demo 不发真实请求', api: '能力：后台保存', fr: 'admin-list' }
      ],
      side: ['隐藏活动不进 C 端显示池', '达标用户不是奖励管理录入', 'showUserAward 与榜单开关解耦'],
      accept: '后台无子菜单；参加人数可点进明细；操作含达标用户与删除；编辑有封面；详情内容含榜单开关。'
    },
    api: {
      id: 'api',
      title: '接口开发提示词',
      flow: '前后端数据交互 → 接口契约',
      role: '你正在实现活动中心后端能力。禁止发明现网 HTTP 路径，用能力名 + 入参/出参对照。',
      scope: '列表、详情、已参与、后台保存、活动榜单。',
      nonGoals: ['新造奖励管理 HTTP', '给活动中心接真实 fetch', '冻结生产 URL', '把查看写成外跳记账', '审核中 / isReward'],
      deps: [
        '能力：活动列表 / 活动详情 / 已参与集合 / 后台保存 / 活动榜单',
        '响应字段对齐 admin-fields.md 下发组装'
      ],
      note: '本 Demo 无真实 HTTP。联调时按能力表落地，不要用 Demo 内存当接口。',
      steps: [
        { kind: 'ui', node: '活动列表', check: '筛选 Tab 只过滤卡片，不撤 Banner', ok: '返回显示池卡片 + 置顶 Banner', fail: '隐藏活动不返回', toast: '已参与空态文案固定', api: '入参：filter / userId；出参：banner + list', fr: 'CAP-1 / CAP-5' },
        { kind: 'ui', node: '活动详情', check: '按配置装配 Tab 与领取按钮；隐藏 activityId 当不存在', ok: '默认第一个实际存在 Tab', fail: '半填按钮不下发', toast: '响应不得带 listOutboundUrl、审核中、excludeProjects；awardStatus 仅 showUserAward=true 且已算出；榜单仅开启时下发', api: '入参：activityId；出参：下发组装字段', fr: 'CAP-2 / CAP-3 / CAP-4 / CAP-6 / CAP-7' },
        { kind: 'ui', node: '活动榜单', check: 'leaderboardVisible=开启', ok: '返回不超过 leaderboardLimit 的行', fail: '隐藏则不返回名单', toast: '行仅 rank / avatarUrl / nicknameMasked / value；描述字段名 leaderboardLineDesc / leaderboardPeriodDesc 走后台；灰色小字；昵称与 value 与头像居中', api: '入参：activityId；出参：rows[]', fr: 'CAP-7' },
        { kind: 'write', node: '已参与集合', check: '仅进行中领取；跳转成功或非跳转点击', ok: '显示池 ∩ 该用户已参与', fail: '「查看」/ 期外 / 跳转失败不得写入', toast: '重复动作保持原记录', api: '入参：userId；出参：活动列表子集', fr: 'CAP-5' },
        { kind: 'write', node: '后台保存', check: '必填与置顶冲突；封面与领取与奖励规则写入', ok: '按下发组装返回 C 端可读字段', fail: '整单不保存', toast: '领取按钮半填不下发', api: '入参：第1–2步字段；出参：活动主数据', fr: 'admin-fields' }
      ],
      side: ['C / 后台共用同一份下发组装', '不读现有奖励管理做本人结果；awardStatus 由详情能力按 rewardRules 计算'],
      accept: '契约表只用能力名；无真实 HTTP；查看不写已参与。'
    }
  };

  var KIND_LABEL = { check: '校验', write: '写入', ui: '端侧', async: '任务', block: '阻断' };

  function textOf(id) {
    var s = SLICES[id];
    if (!s) return '';
    var lines = [];
    lines.push('# FR-006 · ' + s.title);
    lines.push(s.role);
    lines.push('');
    lines.push('节点必须与「' + s.flow + '」SVG 同名。WHAT 以 SPEC / visibility-rules / admin-fields 为准，禁止另开规则。');
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
    lines.push('实现时对照 Demo 同端「业务流程」图逐节点勾掉。');
    return lines.join('\n');
  }

  function render(id) {
    var s = SLICES[id];
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

  global.AC_IMPL = {
    SLICES: SLICES,
    textOf: textOf,
    render: render,
    mountAll: mountAll
  };
})(window);
