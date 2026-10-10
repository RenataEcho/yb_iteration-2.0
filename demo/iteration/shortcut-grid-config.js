/* 首页金刚区：后台「金刚区配置」为唯一数据源。C 端只展示启用项。 */
(function () {
  var STORAGE = 'rb-shortcut-grid-v1';
  var PATH_MIGRATE = {
    stay: 'youbao://page/newbie',
    'opc-rank': 'youbao://page/opc-rank',
    'org-list': 'youbao://page/org-list',
    invite: 'youbao://page/invite'
  };
  var KNOWN_TOAST = {
    'youbao://page/newbie': '打开新手学院',
    'youbao://page/opc-rank': '打开「OPC经营数据榜」完整榜单',
    'youbao://page/org-list': '打开机构详情页列表',
    'youbao://page/invite': '打开邀请落地页'
  };

  function seed() {
    return [
      { id: 'newbie', title: '新手学院', icon: 'book', sort: 1, path: 'youbao://page/newbie', clicks: 1280, users: 640, status: 'on', createdAt: '2026-10-07 10:20' },
      { id: 'rank', title: '收益榜单', icon: 'rank', sort: 2, path: 'youbao://page/opc-rank', clicks: 860, users: 410, status: 'on', createdAt: '2026-10-07 10:21' },
      { id: 'org', title: '社群中心', icon: 'org', sort: 3, path: 'youbao://page/org-list', clicks: 540, users: 300, status: 'on', createdAt: '2026-10-07 10:22' },
      { id: 'invite', title: '邀请好友', icon: 'invite', sort: 4, path: 'youbao://page/invite', clicks: 720, users: 390, status: 'on', createdAt: '2026-10-07 10:23' }
    ];
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function iconSvg(key, uid) {
    var id = 'sg' + key + String(uid).replace(/[^a-zA-Z0-9_-]/g, '');
    if (key === 'rank') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse"><stop stop-color="#ffb07a"/><stop offset="1" stop-color="#ff3d18"/></linearGradient></defs><rect x="4" y="13" width="4" height="7" rx="1.4" fill="url(#' + id + ')" opacity=".55"/><rect x="10" y="8.5" width="4" height="11.5" rx="1.4" fill="url(#' + id + ')" opacity=".8"/><rect x="16" y="4.5" width="4" height="15.5" rx="1.4" fill="url(#' + id + ')"/></svg>';
    }
    if (key === 'org') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#ffb089"/><stop offset="1" stop-color="#ff4a22"/></linearGradient></defs><circle cx="8.2" cy="8" r="2.5" fill="url(#' + id + ')"/><circle cx="15.6" cy="8.4" r="2.15" fill="url(#' + id + ')" opacity=".8"/><path fill="url(#' + id + ')" d="M3.6 18.2c.5-2.7 2.4-4 4.6-4s4.1 1.3 4.6 4v.6H3.6v-.6z"/><path fill="url(#' + id + ')" opacity=".75" d="M12.2 18.4c.4-2.2 2-3.4 3.8-3.4 1.7 0 3.2 1.1 3.7 3.2v.6h-7.5v-.4z"/></svg>';
    }
    if (key === 'invite') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#ff9a70"/><stop offset="1" stop-color="#ff3414"/></linearGradient></defs><circle cx="9.2" cy="8.2" r="2.7" fill="url(#' + id + ')"/><path fill="url(#' + id + ')" d="M3.8 18.4c.6-2.8 2.5-4.3 5.4-4.3s4.8 1.5 5.4 4.3v.6H3.8v-.6z"/><circle cx="17.5" cy="7.4" r="3.5" fill="#fff"/><path d="M17.5 5.6v3.6M15.7 7.4h3.6" stroke="url(#' + id + ')" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse"><stop stop-color="#ff9a6a"/><stop offset="1" stop-color="#e83a12"/></linearGradient></defs><path fill="url(#' + id + ')" d="M3.2 6.1c2.2-1.1 4.3-.8 6.3.6v12.1c-2-1.2-4.1-1.3-6.3-.4V6.1z"/><path fill="url(#' + id + ')" opacity=".82" d="M20.8 6.1c-2.2-1.1-4.3-.8-6.3.6v12.1c2-1.2 4.1-1.3 6.3-.4V6.1z"/><path fill="#fff" opacity=".72" d="M11.15 7.1h1.7v10.6h-1.7z"/></svg>';
  }

  function iconMarkup(icon, uid) {
    if (!icon) return '';
    if (String(icon).indexOf('data:') === 0 || /^https?:\/\//i.test(icon)) {
      return '<img alt="" src="' + esc(icon) + '">';
    }
    return iconSvg(icon, uid);
  }

  function isH5(path) {
    return /^https?:\/\//i.test(path);
  }

  function h5Id(path) {
    try {
      return new URL(path).searchParams.get('id') || '';
    } catch (e) {
      var m = String(path).match(/(?:\?|&)id=([^&]+)/i);
      return m ? decodeURIComponent(m[1]) : '';
    }
  }

  function pathError(path) {
    if (!path) return '请填写跳转路径';
    if (isH5(path) && !String(h5Id(path)).trim()) return 'H5 链接需要携带 ID，例如 ?id=10086';
    return '';
  }

  function pathToast(path) {
    if (KNOWN_TOAST[path]) return KNOWN_TOAST[path];
    if (isH5(path)) return '打开 H5 链接';
    return '打开端内链接';
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return migrate(parsed);
      }
    } catch (e) { /* 使用种子 */ }
    var data = seed();
    save(data);
    return data;
  }

  function migrate(list) {
    var changed = false;
    list.forEach(function (row) {
      if (PATH_MIGRATE[row.path]) {
        row.path = PATH_MIGRATE[row.path];
        changed = true;
      }
    });
    if (changed) save(list);
    return list;
  }

  function save(list) {
    localStorage.setItem(STORAGE, JSON.stringify(list));
  }

  function sorted(list) {
    return list.slice().sort(function (a, b) {
      if (a.sort !== b.sort) return a.sort - b.sort;
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
  }

  function visible() {
    return sorted(load()).filter(function (row) { return row.status === 'on'; });
  }

  function nowText() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function render() {
    var grid = document.getElementById('shortcutGrid');
    if (!grid) return;
    var rows = visible();
    grid.classList.toggle('is-empty', !rows.length);
    if (!rows.length) {
      grid.innerHTML = '<p class="shortcut-empty">暂无启用的金刚区入口</p>';
      return;
    }
    grid.innerHTML = rows.map(function (row) {
      return '<button type="button" data-shortcut="' + esc(row.id) + '" aria-label="' + esc(row.title) + '"><span class="ico">' + iconMarkup(row.icon, row.id) + '</span><span>' + esc(row.title) + '</span></button>';
    }).join('');
  }

  function onClick(id) {
    var list = load();
    var row = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) row = list[i];
    if (!row || row.status !== 'on') return;
    row.clicks = (row.clicks || 0) + 1;
    var seenKey = 'rb-sg-seen-' + id;
    try {
      if (!sessionStorage.getItem(seenKey)) {
        sessionStorage.setItem(seenKey, '1');
        row.users = (row.users || 0) + 1;
      }
    } catch (e) {
      row.users = (row.users || 0) + 1;
    }
    save(list);
    if (row.path === 'youbao://page/newbie') {
      var embedded = false;
      try { embedded = new URLSearchParams(location.search).get('embed') === '1'; } catch (err) {}
      if (embedded) {
        try { window.parent.postMessage({ type: 'rb-open-tile', tile: 'tile-nb-step1', screen: 'nb-step1' }, '*'); } catch (err2) {}
        if (typeof toast === 'function') toast(pathToast(row.path));
        return;
      }
      openNewbie();
      return;
    }
    if (typeof toast === 'function') toast(pathToast(row.path));
  }

  function openNewbie() {
    var phone = document.querySelector('.phone') || document.body;
    var nav = document.getElementById('bottomNav');
    var host = document.getElementById('rbNewbieHost');
    if (host) {
      host.hidden = false;
      if (nav) nav.style.visibility = 'hidden';
      return;
    }
    host = document.createElement('div');
    host.id = 'rbNewbieHost';
    host.style.cssText = 'position:absolute;inset:0;z-index:4000;background:#f6f7f9;';
    var frame = document.createElement('iframe');
    frame.title = '新手学院';
    frame.src = 'newbie-academy-demo.html?scene=step1&host=1&v=3';
    frame.style.cssText = 'width:100%;height:100%;border:0;display:block;background:#f6f7f9;';
    host.appendChild(frame);
    if (getComputedStyle(phone).position === 'static') phone.style.position = 'relative';
    phone.appendChild(host);
    if (nav) nav.style.visibility = 'hidden';
    window.addEventListener('message', function onMsg(ev) {
      var data = ev.data;
      if (!data || data.type !== 'rb-close-newbie') return;
      host.remove();
      if (nav) nav.style.visibility = '';
      window.removeEventListener('message', onMsg);
    });
  }

  function bindGrid() {
    var grid = document.getElementById('shortcutGrid');
    if (!grid || grid.dataset.bound) return;
    grid.dataset.bound = '1';
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-shortcut]');
      if (!btn) return;
      onClick(btn.getAttribute('data-shortcut'));
    });
  }

  function installAdmin(root) {
    if (!root || root.getElementById('shortcuts')) return;
    var style = document.createElement('style');
    style.textContent = '#sgMask,#sgDelMask{position:fixed;inset:0;background:rgba(20,22,26,.45);z-index:80;display:none;align-items:center;justify-content:center}#sgMask.show,#sgDelMask.show{display:flex}#sgDialog{width:480px;max-width:calc(100vw - 32px);background:#fff;border-radius:12px;padding:18px 20px 16px;box-shadow:0 16px 40px rgba(0,0,0,.16);max-height:calc(100vh - 48px);overflow:auto}#sgDelDialog{width:400px;max-width:calc(100vw - 32px);background:#fff;border-radius:12px;padding:18px 20px 16px;box-shadow:0 16px 40px rgba(0,0,0,.16)}#sgDialog h3,#sgDelDialog h3{margin:0 0 6px;font-size:16px}#sgDialog .lead,#sgDelDialog p{margin:0 0 14px;font-size:12px;color:#8a9098;line-height:1.6}#sgDialog .field{margin-bottom:12px}#shortcuts .pagehead .primary{white-space:nowrap}.sg-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:6px}.sg-upload{width:100%;min-height:72px;border:1px dashed #ef9b7c;background:#fff8f4;border-radius:10px;display:flex;align-items:center;gap:12px;padding:10px 12px;cursor:pointer;color:#e76b3d;font-size:12px}.sg-upload img,.sg-upload svg{width:40px;height:40px;object-fit:contain;flex:none}.sg-ico{width:28px;height:28px;display:grid;place-items:center}.sg-ico svg,.sg-ico img{width:20px;height:20px;object-fit:contain}.sg-path{max-width:220px;word-break:break-all;color:#4a5058}.sg-num{font-variant-numeric:tabular-nums}.link.danger{color:#d64d3d}.field .micro{font-size:11px;color:#999;margin-top:6px;font-weight:500}';
    root.appendChild(style);

    var side = root.querySelector('.side');
    var other = null;
    root.querySelectorAll('.menu-title').forEach(function (el) {
      if (el.textContent.indexOf('其他业务') >= 0) other = el;
    });
    var group = document.createElement('div');
    group.className = 'menu-title';
    group.textContent = '首页运营';
    var menu = document.createElement('div');
    menu.className = 'menu';
    menu.dataset.page = 'shortcuts';
    menu.innerHTML = '<i>▣</i>金刚区配置';
    if (other) {
      side.insertBefore(group, other);
      side.insertBefore(menu, other);
    } else {
      side.appendChild(group);
      side.appendChild(menu);
    }

    var content = root.querySelector('.content');
    var section = document.createElement('section');
    section.className = 'page';
    section.id = 'shortcuts';
    section.innerHTML = '<div class="pagehead"><div><h1>金刚区配置</h1><p>首页 Banner 下方的入口。只展示「启用」项，排序数字越小越靠左。</p></div><button class="primary" type="button" id="sgNew">＋ 新增入口</button></div><div class="tablebox"><table class="table" id="sgTable"><thead><tr><th>标题</th><th>图标</th><th>排序</th><th>跳转路径</th><th>点击次数</th><th>点击人数</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody></tbody></table></div>';
    content.appendChild(section);

    var mask = document.createElement('div');
    mask.id = 'sgMask';
    mask.innerHTML = '<div id="sgDialog" role="dialog" aria-modal="true" aria-labelledby="sgDialogTitle"><h3 id="sgDialogTitle">新增入口</h3><p class="lead">点击次数、点击人数、创建时间由系统记录，不在这里改。</p><div class="field"><label>标题 <span class="req">*</span></label><input id="sgTitle" maxlength="6" placeholder="例如：新手学院"><div class="micro">首页图标下方单行展示，建议 4 个字。</div></div><div class="field"><label>图标 <span class="req">*</span></label><button type="button" class="sg-upload" id="sgUpload"><span id="sgIconPreview"></span><span>点击上传图标</span></button><input id="sgFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden><div class="micro">上传图片，建议正方形，png / jpg / webp，不超过 200KB。</div></div><div class="field"><label>排序 <span class="req">*</span></label><input id="sgSort" type="number" min="0" max="999" placeholder="1"><div class="micro">数字越小，在首页越靠左。相同数字按创建时间先后。</div></div><div class="field"><label>跳转路径 <span class="req">*</span></label><input id="sgPath" placeholder="youbao://page/opc-rank"><div class="micro">支持端内链接和 H5 链接。H5 链接需要携带 ID，例如 https://h5.example.com/act?id=10086。</div></div><div class="field"><label>状态</label><div class="radio" id="sgStatus"><button type="button" data-status="on" class="on">启用</button><button type="button" data-status="off">停用</button></div><div class="micro">停用后首页立即隐藏，历史点击数据保留。</div></div><div class="sg-actions"><button type="button" class="secondary" id="sgCancel">取消</button><button type="button" class="primary" id="sgSave">保存</button></div></div>';
    root.appendChild(mask);

    var delMask = document.createElement('div');
    delMask.id = 'sgDelMask';
    delMask.innerHTML = '<div id="sgDelDialog" role="dialog" aria-modal="true" aria-labelledby="sgDelTitle"><h3 id="sgDelTitle">删除入口</h3><p id="sgDelText"></p><div class="sg-actions"><button type="button" class="secondary" id="sgDelCancel">取消</button><button type="button" class="primary" id="sgDelOk">删除</button></div></div>';
    root.appendChild(delMask);

    var editingId = null;
    var deletingId = null;
    var pickedIcon = '';
    var pickedStatus = 'on';
    var toast = root.getElementById('toast');
    var timer;

    function msg(t) {
      if (!toast) return;
      toast.textContent = t;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function () { toast.classList.remove('show'); }, 1400);
    }

    function paintIcon() {
      root.getElementById('sgIconPreview').innerHTML = pickedIcon ? iconMarkup(pickedIcon, 'preview') : '';
    }

    root.getElementById('sgUpload').onclick = function () { root.getElementById('sgFile').click(); };
    root.getElementById('sgFile').onchange = function () {
      var file = this.files && this.files[0];
      this.value = '';
      if (!file) return;
      if (!/^image\//.test(file.type)) { msg('请上传图片'); return; }
      if (file.size > 200 * 1024) { msg('图标请小于 200KB'); return; }
      var reader = new FileReader();
      reader.onload = function () {
        pickedIcon = String(reader.result || '');
        paintIcon();
      };
      reader.readAsDataURL(file);
    };

    function setStatus(status) {
      pickedStatus = status;
      root.querySelectorAll('#sgStatus button').forEach(function (b) {
        b.classList.toggle('on', b.dataset.status === status);
      });
    }

    root.querySelectorAll('#sgStatus button').forEach(function (b) {
      b.onclick = function () { setStatus(b.dataset.status); };
    });

    function show(id) {
      root.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('on', p.id === id); });
      root.querySelectorAll('.menu[data-page]').forEach(function (m) { m.classList.toggle('on', m.dataset.page === id); });
      var names = { courses: '课程管理', categories: '分类管理', analytics: '学习数据', shortcuts: '金刚区配置' };
      var groupName = id === 'shortcuts' ? '首页运营' : '学院中心';
      var crumb = root.getElementById('crumb');
      if (crumb) crumb.textContent = groupName + ' / ' + (names[id] || '课程管理');
      if (id === 'shortcuts') renderTable();
      var host = document.getElementById('rbAdminHost');
      if (host) host.scrollTop = 0;
    }

    root.querySelectorAll('.menu[data-page]').forEach(function (m) {
      m.onclick = function () { show(m.dataset.page); };
    });

    function renderTable() {
      var body = root.querySelector('#sgTable tbody');
      var rows = sorted(load());
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="9" class="emptybox">还没有入口，点右上角新增。</td></tr>';
        return;
      }
      body.innerHTML = rows.map(function (row) {
        var on = row.status === 'on';
        return '<tr data-id="' + esc(row.id) + '"><td><b>' + esc(row.title) + '</b></td><td><div class="sg-ico">' + iconMarkup(row.icon, 'row' + row.id) + '</div></td><td>' + esc(row.sort) + '</td><td class="sg-path">' + esc(row.path) + '</td><td class="sg-num">' + Number(row.clicks || 0).toLocaleString('zh-CN') + '</td><td class="sg-num">' + Number(row.users || 0).toLocaleString('zh-CN') + '</td><td><div class="status"><div class="dot' + (on ? '' : ' off') + '"></div>' + (on ? '已启用' : '已停用') + '</div></td><td>' + esc(row.createdAt) + '</td><td><div class="ops"><button class="link" type="button" data-act="edit">编辑</button><button class="link danger" type="button" data-act="del">删除</button></div></td></tr>';
      }).join('');
      body.querySelectorAll('tr[data-id]').forEach(function (tr) {
        tr.querySelector('[data-act="edit"]').onclick = function () { open(tr.dataset.id); };
        tr.querySelector('[data-act="del"]').onclick = function () { askDelete(tr.dataset.id); };
      });
    }

    function open(id) {
      editingId = id || null;
      var row = null;
      if (id) load().forEach(function (item) { if (item.id === id) row = item; });
      root.getElementById('sgDialogTitle').textContent = row ? '编辑入口' : '新增入口';
      root.getElementById('sgTitle').value = row ? row.title : '';
      root.getElementById('sgSort').value = row ? row.sort : (sorted(load()).reduce(function (m, item) { return Math.max(m, item.sort); }, 0) + 1);
      root.getElementById('sgPath').value = row ? row.path : '';
      pickedIcon = row ? row.icon : '';
      paintIcon();
      setStatus(row ? row.status : 'on');
      mask.classList.add('show');
      setTimeout(function () { root.getElementById('sgTitle').focus(); }, 30);
    }

    function close() {
      mask.classList.remove('show');
      editingId = null;
    }

    function askDelete(id) {
      deletingId = id;
      var row = null;
      load().forEach(function (item) { if (item.id === id) row = item; });
      root.getElementById('sgDelText').textContent = row
        ? '删除「' + row.title + '」后，首页不再展示该入口。点击次数与点击人数一并清除。'
        : '确认删除该入口？';
      delMask.classList.add('show');
    }

    root.getElementById('sgNew').onclick = function () { open(null); };
    root.getElementById('sgCancel').onclick = close;
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    root.getElementById('sgDelCancel').onclick = function () { delMask.classList.remove('show'); deletingId = null; };
    delMask.addEventListener('click', function (e) {
      if (e.target === delMask) { delMask.classList.remove('show'); deletingId = null; }
    });
    root.getElementById('sgDelOk').onclick = function () {
      if (!deletingId) return;
      save(load().filter(function (item) { return item.id !== deletingId; }));
      delMask.classList.remove('show');
      deletingId = null;
      renderTable();
      render();
      msg('入口已删除');
    };
    root.getElementById('sgSave').onclick = function () {
      var title = root.getElementById('sgTitle').value.trim();
      if (!title) { msg('请填写标题'); return; }
      var sort = parseInt(root.getElementById('sgSort').value, 10);
      if (!Number.isFinite(sort) || sort < 0) { msg('排序请填 0 及以上的整数'); return; }
      var path = root.getElementById('sgPath').value.trim();
      var pathMsg = pathError(path);
      if (pathMsg) { msg(pathMsg); return; }
      if (!pickedIcon) { msg('请上传图标'); return; }
      var list = load();
      if (list.some(function (item) { return item.title === title && item.id !== editingId; })) {
        msg('标题已存在');
        return;
      }
      if (editingId) {
        list.forEach(function (item) {
          if (item.id !== editingId) return;
          item.title = title;
          item.icon = pickedIcon;
          item.sort = sort;
          item.path = path;
          item.status = pickedStatus;
        });
        msg('入口已更新');
      } else {
        list.push({
          id: 'sg' + Date.now(),
          title: title,
          icon: pickedIcon,
          sort: sort,
          path: path,
          clicks: 0,
          users: 0,
          status: pickedStatus,
          createdAt: nowText()
        });
        msg('入口已创建');
      }
      save(list);
      close();
      renderTable();
      render();
    };

    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE) renderTable();
    });
    renderTable();
  }

  window.RBShortcut = {
    load: load,
    render: render,
    onClick: onClick,
    installAdmin: installAdmin
  };

  bindGrid();
  render();
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE) render();
  });
})();
