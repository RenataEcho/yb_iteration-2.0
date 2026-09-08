(function (global) {
  var STORAGE_KEY = 'iteration-sidebar-groups';
  var STATUS_STORAGE_KEY = 'ybdd-sprint-fr-status';
  var COLLAPSE_STORAGE_KEY = 'iteration-sidebar-collapsed';
  var COLLAPSED_CLASS = 'sidebar-collapsed';

  var ICONS = {
    'framework-shell': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    'component-spec-demo': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'fr-opc-daifa-allocation': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    'fr-opc-daifa-revenue': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    'fr-finance-brand-refund': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'fr-project-estimated-data': '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
    'fr-project-order-optimize': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'fr-activity-center': '<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    'fr-project-order-distribute': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    'fr-gift-center': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    'fr-ai-workbench': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
    'fr-agent-cert': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'fr-org-mentor-board': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'
  };
  var ICON_FALLBACK = '<circle cx="12" cy="12" r="4"/>';
  var ICON_CHEVRON_LEFT = '<path d="m15 18-6-6 6-6"/>';
  var ICON_CHEVRON_RIGHT = '<path d="m9 18 6-6-6-6"/>';

  var NAV_GROUPS = [
    {
      key: 'iteration',
      label: '迭代',
      items: [
        { id: 'framework-shell', label: 'Sprint 概览', href: 'framework-shell.html' },
        { id: 'component-spec-demo', label: '组件规范', href: 'component-spec-demo.html' }
      ]
    },
    {
      key: 'requirements',
      label: '迭代需求',
      items: [
        { id: 'fr-opc-daifa-allocation', label: '代发分配', href: 'fr-opc-daifa-allocation.html', fr: 'FR-001', defaultStatus: 'paused' },
        { id: 'fr-opc-daifa-revenue', label: '代发收益', href: 'fr-opc-daifa-revenue.html', fr: 'FR-002', defaultStatus: 'live' },
        { id: 'fr-finance-brand-refund', label: '品牌退款', href: 'fr-finance-brand-refund.html', fr: 'FR-003', defaultStatus: 'live' },
        { id: 'fr-project-estimated-data', label: '预估数据', href: 'fr-project-estimated-data.html', fr: 'FR-004', defaultStatus: 'live' },
        { id: 'fr-project-order-optimize', label: '订单优化', href: 'fr-project-order-optimize.html', fr: 'FR-005' },
        { id: 'fr-activity-center', label: '活动中心', href: 'fr-activity-center.html', fr: 'FR-006', defaultStatus: 'paused' },
        { id: 'fr-project-order-distribute', label: '订单分发', href: 'fr-project-order-distribute.html', fr: 'FR-007' },
        { id: 'fr-gift-center', label: '礼品中心', href: 'fr-gift-center.html', fr: 'FR-008', defaultStatus: 'paused' },
        { id: 'fr-ai-workbench', label: 'AI工作台', href: 'fr-ai-workbench.html', fr: 'FR-009' },
        { id: 'fr-agent-cert', label: '代理迭代V1.0', href: 'fr-agent-cert.html', fr: 'FR-010' },
        { id: 'fr-org-mentor-board', label: '导师迭代V1.0', href: 'fr-org-mentor-board.html', fr: 'FR-011' }
      ]
    },
    {
      key: 'archived',
      label: '归档需求',
      items: []
    },
    {
      key: 'trash',
      label: '废纸篓',
      items: []
    }
  ];

  function svgIcon(inner, cls) {
    return (
      '<svg class="' + (cls || 'nav-icon') + '" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner +
      '</svg>'
    );
  }

  function detectActiveId() {
    var file = (location.pathname.split('/').pop() || 'framework-shell.html').split('?')[0];
    return file.replace(/\.html$/, '') || 'framework-shell';
  }

  function loadGroupState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function saveGroupState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function loadCollapsed() {
    try {
      return localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function saveCollapsed(collapsed) {
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, collapsed ? '1' : '0');
    } catch (_) {}
  }

  function isCollapsed() {
    return document.documentElement.classList.contains(COLLAPSED_CLASS);
  }

  function applyCollapsedClass(collapsed) {
    document.documentElement.classList.toggle(COLLAPSED_CLASS, !!collapsed);
  }

  function loadFrStatus() {
    try {
      return JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function resolveItemStatus(item, statusMap) {
    if (item.fr && statusMap[item.fr]) return statusMap[item.fr];
    return item.defaultStatus || '';
  }

  function resolveNavGroups() {
    var statusMap = loadFrStatus();
    var archivedItems = [];
    var trashItems = [];

    return NAV_GROUPS.map(function (group) {
      if (group.key === 'requirements') {
        var activeItems = [];
        group.items.forEach(function (item) {
          var status = resolveItemStatus(item, statusMap);
          if (status === 'live') {
            archivedItems.push(item);
          } else if (status === 'paused') {
            trashItems.push(item);
          } else {
            activeItems.push(item);
          }
        });
        return { key: group.key, label: group.label, items: activeItems };
      }
      if (group.key === 'archived') {
        return { key: group.key, label: group.label, items: archivedItems.slice() };
      }
      if (group.key === 'trash') {
        return { key: group.key, label: group.label, items: trashItems.slice() };
      }
      return group;
    });
  }

  function findGroupKeyByActiveId(groups, activeId) {
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      for (var j = 0; j < group.items.length; j++) {
        if (group.items[j].id === activeId) return group.key;
      }
    }
    return null;
  }

  function isGroupExpanded(group, activeGroupKey, savedState) {
    if (group.key === activeGroupKey) return true;
    if (Object.prototype.hasOwnProperty.call(savedState, group.key)) {
      return !!savedState[group.key];
    }
    if ((group.key === 'archived' || group.key === 'trash') && !group.items.length) return false;
    return true;
  }

  function injectStyles() {
    if (document.getElementById('iteration-sidebar-fix')) return;
    var style = document.createElement('style');
    style.id = 'iteration-sidebar-fix';
    style.textContent = [
      'html.sidebar-collapsed{--sidebar-w:56px;}',
      '.sidebar{transition:width .22s ease;}',
      '.main,.editor-page{transition:margin-left .22s ease,left .22s ease;}',
      '.sidebar-brand,.sidebar-foot{overflow-x:hidden;}',
      '.sidebar-scroll{flex:1;min-height:0;overflow-x:hidden;overflow-y:auto;}',
      '.nav-group{margin-bottom:2px;}',
      '.nav-group-toggle{',
      '  display:flex;align-items:center;justify-content:space-between;gap:8px;',
      '  width:calc(100% - 16px);margin:1px 8px;padding:10px 8px 6px 8px;',
      '  border:none;background:none;font-size:11px;font-weight:600;',
      '  color:var(--text-muted,#9aa5b4);letter-spacing:0.04em;',
      '  cursor:pointer;text-align:left;border-radius:8px;transition:background .18s,color .18s;',
      '}',
      '.nav-group-toggle-label{flex:1;min-width:0;}',
      '.nav-group-toggle:hover{background:rgba(99,102,241,0.06);color:var(--text-secondary,#4a5568);}',
      '.nav-group-chevron{',
      '  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;',
      '  width:14px;height:14px;font-size:11px;line-height:1;color:var(--text-muted,#9aa5b4);',
      '  transition:transform .18s ease;transform:rotate(90deg);',
      '}',
      '.nav-group.collapsed .nav-group-chevron{transform:rotate(0deg);}',
      '.nav-group-items{overflow:hidden;}',
      '.nav-group.collapsed .nav-group-items{display:none;}',
      '.nav-item{',
      '  position:relative;display:flex;align-items:center;gap:8px;height:40px;',
      '  padding:0 12px 0 14px;margin:1px 8px;width:calc(100% - 16px);',
      '  border-radius:8px;font-size:13px;font-weight:500;color:var(--text-secondary,#4a5568);',
      '  text-decoration:none;transition:background .18s,color .18s;',
      '}',
      '.nav-item:hover{background:rgba(99,102,241,0.06);color:var(--text-primary,#18222f);}',
      '.nav-item.active{color:var(--primary,#2563eb);background:rgba(37,99,235,0.12);font-weight:600;}',
      '.nav-item.active::before{',
      '  content:"";position:absolute;left:0;top:7px;bottom:7px;',
      '  width:3px;border-radius:0 2px 2px 0;background:var(--primary,#2563eb);',
      '}',
      '.nav-icon{display:none;flex-shrink:0;width:18px;height:18px;}',
      '.nav-text{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}',
      '.nav-empty{',
      '  margin:2px 16px 8px;padding:6px 8px;font-size:12px;',
      '  color:var(--text-muted,#9aa5b4);',
      '}',
      '.sidebar-collapse-btn{',
      '  position:absolute;top:18px;right:8px;z-index:2;',
      '  width:28px;height:28px;padding:0;border:none;border-radius:8px;',
      '  display:inline-flex;align-items:center;justify-content:center;',
      '  background:rgba(255,255,255,0.55);color:var(--text-secondary,#4a5568);',
      '  cursor:pointer;flex-shrink:0;',
      '  box-shadow:0 1px 4px rgba(30,40,60,0.08);',
      '  transition:background .16s ease,color .16s ease,top .22s ease,right .22s ease,transform .22s ease;',
      '}',
      '.sidebar-collapse-btn:hover{background:rgba(99,102,241,0.12);color:var(--primary,#2563eb);}',
      '.sidebar-collapse-btn:focus-visible{outline:2px solid var(--primary,#2563eb);outline-offset:2px;}',
      '.sidebar-collapse-btn svg{width:16px;height:16px;}',
      'html.sidebar-collapsed .sidebar-brand{padding:12px 8px;display:flex;justify-content:center;}',
      'html.sidebar-collapsed .brand{justify-content:center;gap:0;}',
      'html.sidebar-collapsed .brand>div:not(.brand-icon),',
      'html.sidebar-collapsed .sprint-pill,',
      'html.sidebar-collapsed .sidebar-foot,',
      'html.sidebar-collapsed .nav-group-toggle,',
      'html.sidebar-collapsed .nav-empty,',
      'html.sidebar-collapsed .nav-text{',
      '  opacity:0;position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;',
      '}',
      'html.sidebar-collapsed .nav-group.collapsed .nav-group-items{display:block;}',
      'html.sidebar-collapsed .nav-group[data-empty="1"]{display:none;}',
      'html.sidebar-collapsed .nav-group+.nav-group{margin-top:6px;padding-top:6px;border-top:1px solid rgba(148,163,196,0.18);}',
      'html.sidebar-collapsed .nav-item{justify-content:center;padding:0;margin:2px 6px;width:calc(100% - 12px);gap:0;}',
      'html.sidebar-collapsed .nav-icon{display:block;}',
      'html.sidebar-collapsed .sidebar-scroll{padding:8px 0 48px;}',
      'html.sidebar-collapsed .sidebar-collapse-btn{',
      '  top:auto;bottom:12px;right:auto;left:50%;transform:translateX(-50%);',
      '}',
      '@media (prefers-reduced-motion: reduce){',
      '  .sidebar,.main,.editor-page,.sidebar-collapse-btn{transition-duration:0.01ms !important;}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function updateNavTooltips() {
    var collapsed = isCollapsed();
    document.querySelectorAll('.nav-item').forEach(function (item) {
      var textEl = item.querySelector('.nav-text');
      item.title = collapsed && textEl ? textEl.textContent.trim() : '';
    });
    document.querySelectorAll('.sidebar-collapse-btn').forEach(syncCollapseButton);
  }

  function syncCollapseButton(btn) {
    if (!btn) return;
    var collapsed = isCollapsed();
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('aria-label', collapsed ? '展开菜单' : '收起菜单');
    btn.title = collapsed ? '展开菜单' : '收起菜单';
    btn.innerHTML = svgIcon(collapsed ? ICON_CHEVRON_RIGHT : ICON_CHEVRON_LEFT, 'sidebar-collapse-icon');
  }

  function toggleSidebarCollapsed() {
    var next = !isCollapsed();
    applyCollapsedClass(next);
    saveCollapsed(next);
    updateNavTooltips();
  }

  function bindCollapseChrome() {
    document.querySelectorAll('.sidebar').forEach(function (sidebar) {
      if (sidebar.querySelector('.sidebar-collapse-btn')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sidebar-collapse-btn';
      btn.addEventListener('click', toggleSidebarCollapsed);
      sidebar.appendChild(btn);
      syncCollapseButton(btn);
    });
    updateNavTooltips();
  }

  function bindGroupToggles(container, savedState) {
    container.querySelectorAll('.nav-group').forEach(function (groupEl) {
      var toggle = groupEl.querySelector('.nav-group-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var nextExpanded = !expanded;
        groupEl.classList.toggle('collapsed', !nextExpanded);
        toggle.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
        savedState[groupEl.dataset.navGroup] = nextExpanded;
        saveGroupState(savedState);
      });
    });
  }

  function renderSidebarNav(container, activeId) {
    if (!container) return;
    injectStyles();

    var active = activeId || container.getAttribute('data-iteration-sidebar') || detectActiveId();
    if (active === 'index') active = 'framework-shell';

    var groups = resolveNavGroups();
    var activeGroupKey = findGroupKeyByActiveId(groups, active);
    var savedState = loadGroupState();
    var html = [];

    groups.forEach(function (group) {
      var expanded = isGroupExpanded(group, activeGroupKey, savedState);
      var collapsedClass = expanded ? '' : ' collapsed';
      var ariaExpanded = expanded ? 'true' : 'false';
      var emptyAttr = group.items.length ? '' : ' data-empty="1"';

      html.push(
        '<div class="nav-group' + collapsedClass + '" data-nav-group="' + group.key + '"' + emptyAttr + '>',
        '  <button type="button" class="nav-group-toggle" aria-expanded="' + ariaExpanded + '">',
        '    <span class="nav-group-toggle-label">' + group.label + '</span>',
        '    <span class="nav-group-chevron" aria-hidden="true">›</span>',
        '  </button>',
        '  <div class="nav-group-items">'
      );

      if (group.items.length) {
        group.items.forEach(function (item) {
          var cls = item.id === active ? 'nav-item active' : 'nav-item';
          html.push(
            '    <a class="' + cls + '" href="' + item.href + '">',
            svgIcon(ICONS[item.id] || ICON_FALLBACK),
            '      <span class="nav-text">' + item.label + '</span>',
            '    </a>'
          );
        });
      } else {
        html.push('    <div class="nav-empty">暂无</div>');
      }

      html.push('  </div>', '</div>');
    });

    container.innerHTML = html.join('\n');
    bindGroupToggles(container, savedState);
    bindCollapseChrome();
  }

  function initSidebars() {
    injectStyles();
    document.querySelectorAll('[data-iteration-sidebar]').forEach(function (el) {
      renderSidebarNav(el);
    });
    bindCollapseChrome();
  }

  applyCollapsedClass(loadCollapsed());
  injectStyles();

  global.renderIterationSidebar = renderSidebarNav;
  global.refreshIterationSidebar = initSidebars;
  global.toggleIterationSidebar = toggleSidebarCollapsed;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebars);
  } else {
    initSidebars();
  }
})(window);
