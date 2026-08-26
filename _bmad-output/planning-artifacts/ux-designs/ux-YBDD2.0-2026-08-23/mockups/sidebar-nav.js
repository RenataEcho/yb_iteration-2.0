(function (global) {
  var STORAGE_KEY = 'iteration-sidebar-groups';

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
        { id: 'fr-opc-daifa-revenue', label: '代发收益', href: 'fr-opc-daifa-revenue.html' },
        { id: 'fr-finance-brand-refund', label: '品牌退款', href: 'fr-finance-brand-refund.html' },
        { id: 'fr-project-estimated-data', label: '预估数据', href: 'fr-project-estimated-data.html' },
        { id: 'fr-project-order-optimize', label: '订单优化', href: 'fr-project-order-optimize.html' },
        { id: 'fr-activity-center', label: '活动中心', href: 'fr-activity-center.html' }
      ]
    },
    {
      key: 'trash',
      label: '废纸篓',
      items: [
        { id: 'fr-opc-daifa-allocation', label: '代发分配', href: 'fr-opc-daifa-allocation.html' }
      ]
    }
  ];

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

  function findGroupKeyByActiveId(activeId) {
    for (var i = 0; i < NAV_GROUPS.length; i++) {
      var group = NAV_GROUPS[i];
      for (var j = 0; j < group.items.length; j++) {
        if (group.items[j].id === activeId) return group.key;
      }
    }
    return null;
  }

  function isGroupExpanded(groupKey, activeGroupKey, savedState) {
    if (groupKey === activeGroupKey) return true;
    if (Object.prototype.hasOwnProperty.call(savedState, groupKey)) {
      return !!savedState[groupKey];
    }
    return true;
  }

  function injectStyles() {
    if (document.getElementById('iteration-sidebar-fix')) return;
    var style = document.createElement('style');
    style.id = 'iteration-sidebar-fix';
    style.textContent = [
      '.sidebar-scroll{flex:1;min-height:0;overflow-y:auto;}',
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
      '  position:relative;display:flex;align-items:center;height:40px;',
      '  padding:0 12px 0 14px;margin:1px 8px;width:calc(100% - 16px);',
      '  border-radius:8px;font-size:13px;font-weight:500;color:var(--text-secondary,#4a5568);',
      '  text-decoration:none;transition:background .18s,color .18s;',
      '}',
      '.nav-item:hover{background:rgba(99,102,241,0.06);color:var(--text-primary,#18222f);}',
      '.nav-item.active{color:var(--primary,#2563eb);background:rgba(37,99,235,0.12);font-weight:600;}',
      '.nav-item.active::before{',
      '  content:"";position:absolute;left:0;top:7px;bottom:7px;',
      '  width:3px;border-radius:0 2px 2px 0;background:var(--primary,#2563eb);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
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

    var activeGroupKey = findGroupKeyByActiveId(active);
    var savedState = loadGroupState();
    var html = [];

    NAV_GROUPS.forEach(function (group) {
      var expanded = isGroupExpanded(group.key, activeGroupKey, savedState);
      var collapsedClass = expanded ? '' : ' collapsed';
      var ariaExpanded = expanded ? 'true' : 'false';

      html.push(
        '<div class="nav-group' + collapsedClass + '" data-nav-group="' + group.key + '">',
        '  <button type="button" class="nav-group-toggle" aria-expanded="' + ariaExpanded + '">',
        '    <span class="nav-group-toggle-label">' + group.label + '</span>',
        '    <span class="nav-group-chevron" aria-hidden="true">›</span>',
        '  </button>',
        '  <div class="nav-group-items">'
      );

      group.items.forEach(function (item) {
        var cls = item.id === active ? 'nav-item active' : 'nav-item';
        html.push('    <a class="' + cls + '" href="' + item.href + '">' + item.label + '</a>');
      });

      html.push('  </div>', '</div>');
    });

    container.innerHTML = html.join('\n');
    bindGroupToggles(container, savedState);
  }

  function initSidebars() {
    document.querySelectorAll('[data-iteration-sidebar]').forEach(function (el) {
      renderSidebarNav(el);
    });
  }

  global.renderIterationSidebar = renderSidebarNav;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebars);
  } else {
    initSidebars();
  }
})(window);
