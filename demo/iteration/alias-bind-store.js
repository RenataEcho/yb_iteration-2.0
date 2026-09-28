(function (global) {
  var KEY = 'ybdd-alias-bind-demo-v1';
  var USERS = {
    U10086: '阿宁',
    U10087: '老陈',
    U10088: '小周',
    U10089: '阿凯'
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function nowStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function addDays(base, days) {
    var d = new Date(base.replace(/-/g, '/'));
    if (isNaN(d.getTime())) d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function strip(s) {
    return String(s || '').replace(/ /g, '');
  }

  var BIND_SEED = {
    A001: [
      { userId: 'U20011', name: '林夏', type: '新用户', boundAt: '2026-09-13 08:21' },
      { userId: 'U20012', name: '周野', type: '静默45天用户', boundAt: '2026-09-21 19:04' }
    ],
    A002: [
      { userId: 'U20021', name: '陈果', type: '新用户', boundAt: '2026-09-19 11:36' }
    ]
  };

  function seed() {
    return {
      currentUserId: 'U10088',
      apps: [
        { id: 'A001', userId: 'U10086', alias: '红果', status: '已通过', source: '用户', at: '2026-09-12 10:18', reviewedAt: '2026-09-12 11:02', binds: BIND_SEED.A001 },
        { id: 'A002', userId: 'U10087', alias: '青提', status: '已通过', source: '后台创建', at: '2026-09-18 09:40', reviewedAt: '2026-09-18 09:40', binds: BIND_SEED.A002 },
        { id: 'A003', userId: 'U10088', alias: '番茄小说', status: '审核中', source: '用户', at: '2026-09-26 16:22', reviewedAt: '', binds: [] }
      ],
      guests: [
        { id: 'G001', guestUuid: '018f3a2c-7b11-7c3a-9a01-6e2d4b8c1001', version: '2.4.1', channel: '苹果', installedAt: '2026-08-01 09:00', launchedAt: '2026-09-20 14:06', os: 'iOS', osVersion: '18.1', model: 'iPhone 15', deviceId: 'DEV-9F3A', alias: '红果', ownerId: 'U10086', boundAt: '2026-09-20 14:06', expireAt: '2026-10-05 14:06', status: '未过期', registeredUserId: '' },
        { id: 'G002', guestUuid: '018f2b10-11aa-7a20-8c44-91ab00c20002', version: '2.4.0', channel: '苹果', installedAt: '2026-08-01 09:00', launchedAt: '2026-08-01 09:12', os: 'iOS', osVersion: '17.6', model: 'iPhone 15', deviceId: 'DEV-9F3A', alias: '山楂', ownerId: 'U10089', boundAt: '2026-08-01 09:12', expireAt: '2026-08-16 09:12', status: '已到期', registeredUserId: 'U10088' },
        { id: 'G003', guestUuid: '018f44e0-90c2-7d11-b331-77c0aa190003', version: '2.4.1', channel: 'OPPO', installedAt: '2026-09-10 11:20', launchedAt: '2026-09-22 19:33', os: '安卓', osVersion: '15', model: 'OPPO Find X7', deviceId: 'DEV-77B2', alias: '青提', ownerId: 'U10087', boundAt: '2026-09-22 19:33', expireAt: '2026-10-07 19:33', status: '未过期', registeredUserId: '' }
      ]
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return seed();
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.apps) || !Array.isArray(data.guests)) return seed();
      if (!data.guests.length || !data.guests[0].guestUuid) return seed();
      data.currentUserId = data.currentUserId || 'U10088';
      var renamed = false;
      data.apps.forEach(function (a) {
        if (a.source === 'H5') { a.source = '用户'; renamed = true; }
        if (!Array.isArray(a.binds)) {
          a.binds = BIND_SEED[a.id] ? BIND_SEED[a.id].map(function (b) { return Object.assign({}, b); }) : [];
          renamed = true;
        } else if (BIND_SEED[a.id]) {
          a.binds.forEach(function (b) {
            if (b.boundAt) return;
            var seed = BIND_SEED[a.id].find(function (s) { return s.userId === b.userId; });
            if (seed && seed.boundAt) { b.boundAt = seed.boundAt; renamed = true; }
          });
        }
      });
      if (renamed) save(data);
      return data;
    } catch (_) {
      return seed();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function reset() {
    var data = seed();
    save(data);
    return data;
  }

  function userName(id) {
    return USERS[id] || '';
  }

  function occupied(data, alias, exceptId) {
    return data.apps.some(function (a) {
      return a.alias === alias && a.id !== exceptId && (a.status === '审核中' || a.status === '已通过');
    });
  }

  function ownerOf(data, alias) {
    var hit = data.apps.find(function (a) { return a.alias === alias && a.status === '已通过'; });
    return hit ? { userId: hit.userId, name: userName(hit.userId) } : null;
  }

  function validAliases(data, userId) {
    return data.apps.filter(function (a) { return a.userId === userId && a.status === '已通过'; });
  }

  function nextId(list, prefix) {
    var n = list.reduce(function (m, row) {
      var v = parseInt(String(row.id).replace(/\D/g, ''), 10);
      return isNaN(v) ? m : Math.max(m, v);
    }, 0) + 1;
    return prefix + String(n).padStart(3, '0');
  }

  function checkAlias(data, raw) {
    var alias = strip(raw);
    if (!alias) return { ok: false, message: '去掉空格后是空的，不能提交' };
    if (occupied(data, alias)) return { ok: false, message: '「' + alias + '」已被有效别名或审核中的申请占住' };
    return { ok: true, alias: alias };
  }

  function submitH5(userId, raw) {
    var data = load();
    var checked = checkAlias(data, raw);
    if (!checked.ok) return checked;
    if (!USERS[userId]) return { ok: false, message: '请选择站内用户' };
    data.apps.unshift({
      id: nextId(data.apps, 'A'),
      userId: userId,
      alias: checked.alias,
      status: '审核中',
      source: '用户',
      at: nowStr(),
      reviewedAt: '',
      binds: []
    });
    save(data);
    return { ok: true, message: '已提交，等待审核', alias: checked.alias };
  }

  function createAdmin(userId, raw) {
    var data = load();
    var checked = checkAlias(data, raw);
    if (!checked.ok) return checked;
    if (!USERS[userId]) return { ok: false, message: '用户不存在' };
    var t = nowStr();
    data.apps.unshift({
      id: nextId(data.apps, 'A'),
      userId: userId,
      alias: checked.alias,
      status: '已通过',
      source: '后台创建',
      at: t,
      reviewedAt: t,
      binds: []
    });
    save(data);
    return { ok: true, message: '已创建并生效', alias: checked.alias };
  }

  function approve(id) {
    var data = load();
    var row = data.apps.find(function (a) { return a.id === id; });
    if (!row || row.status !== '审核中') return { ok: false, message: '只能通过审核中的申请' };
    if (occupied(data, row.alias, row.id)) return { ok: false, message: '这串字已被占住，不能通过' };
    row.status = '已通过';
    row.reviewedAt = nowStr();
    save(data);
    return { ok: true, message: '已通过，别名生效' };
  }

  function reject(id) {
    var data = load();
    var row = data.apps.find(function (a) { return a.id === id; });
    if (!row || row.status !== '审核中') return { ok: false, message: '只能驳回审核中的申请' };
    row.status = '已驳回';
    row.reviewedAt = nowStr();
    save(data);
    return { ok: true, message: '已驳回，这串字已释放' };
  }

  function invalidate(id) {
    var data = load();
    var row = data.apps.find(function (a) { return a.id === id; });
    if (!row || row.status !== '已通过') return { ok: false, message: '只能失效已生效的别名' };
    row.status = '已失效';
    row.reviewedAt = nowStr();
    var t = nowStr();
    data.guests.forEach(function (g) {
      if (g.alias === row.alias && g.status === '未过期') {
        g.status = '运营失效';
        g.expireAt = t;
      }
    });
    save(data);
    return { ok: true, message: '别名已失效，手机上未到期的绑定也已到期' };
  }

  function deviceHasOpen(data, deviceId) {
    return data.guests.some(function (g) { return g.deviceId === deviceId && g.status === '未过期'; });
  }

  function searchGuest(deviceId, raw) {
    var data = load();
    var alias = strip(raw);
    var device = String(deviceId || '').trim();
    if (!device) return { ok: false, message: '请填写设备 ID' };
    if (!alias) return { ok: false, message: '去掉空格后不是有效别名' };
    var owner = ownerOf(data, alias);
    if (!owner) return { ok: false, message: '「' + alias + '」不是有效别名，不新开' };
    if (deviceHasOpen(data, device)) return { ok: false, message: '该设备已有一条未过期记录，不新开' };
    var prev = data.guests.find(function (g) { return g.deviceId === device; });
    var t = nowStr();
    data.guests.unshift({
      id: nextId(data.guests, 'G'),
      guestUuid: '018f-new-' + Date.now().toString(16),
      version: prev ? prev.version : '2.4.1',
      channel: prev ? prev.channel : '苹果',
      installedAt: prev ? prev.installedAt : t,
      launchedAt: t,
      os: prev ? prev.os : 'iOS',
      osVersion: prev ? prev.osVersion : '18.1',
      model: prev ? prev.model : 'iPhone 15',
      deviceId: device,
      alias: alias,
      ownerId: owner.userId,
      boundAt: t,
      expireAt: addDays(t, 15),
      status: '未过期',
      registeredUserId: ''
    });
    save(data);
    return { ok: true, message: '已新开一条，绑定「' + alias + '」' };
  }

  function setCurrentUser(userId) {
    var data = load();
    if (!USERS[userId]) return data;
    data.currentUserId = userId;
    save(data);
    return data;
  }

  global.AliasBind = {
    USERS: USERS,
    load: load,
    reset: reset,
    strip: strip,
    userName: userName,
    validAliases: validAliases,
    submitH5: submitH5,
    createAdmin: createAdmin,
    approve: approve,
    reject: reject,
    invalidate: invalidate,
    searchGuest: searchGuest,
    setCurrentUser: setCurrentUser
  };
})(window);
