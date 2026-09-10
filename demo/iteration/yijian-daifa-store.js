/* FR-014 一键代发 · 前后端共用数据（localStorage 逻辑闭环，非真实接口） */
(function (global) {
  var KEY = 'fr014-yjd-v4';
  var VER = 4;

  function seed() {
    return {
      v: VER,
      editors: [
        { id: 'E-01', ybId: 'YB10086', name: '林夏', share: '50%', note: '主力口播', src: '客服二维码', projects: '番茄小说', status: '已录入', time: '2026-09-01 10:12' },
        { id: 'E-02', ybId: 'YB10221', name: '阿凯', share: '40%', note: '短剧混剪', src: '客服二维码', projects: '红果短剧 / 知乎故事', status: '已录入', time: '2026-09-02 15:40' },
        { id: 'E-03', ybId: 'YB10801', name: '小禾', share: '35%', note: '已停用，暂不接稿', src: '客服二维码', projects: '—', status: '已停用', time: '2026-08-20 09:03' },
        { id: 'E-04', ybId: 'YB10330', name: '庭宇', share: '50%', note: '图文切片', src: '客服二维码', projects: '番茄小说 / 红果漫剧', status: '已录入', time: '2026-09-03 11:08' }
      ],
      works: [
        work('M-01', '掌心宠 · 口播切片', '番茄小说', '我成了老公掌心宠', '7128491023', '18.6 MB', '林夏', '图集', '口播', '空闲', '1小时前', '50%', 'cover-m01.jpg', '小说', ['甜宠', '年代'], 12, '被偏爱的感觉藏不住｜掌心宠口播', '一口气看完这篇年代甜宠，评论区扣1告诉我你嗑哪对#掌心宠溺 #年代甜宠'),
        work('M-02', '末世囤货混剪', '红果短剧', '我在末世囤了亿万物资', '8301928471', '42.1 MB', '阿凯', '视频', '混剪', '空闲', '昨天', '40%', 'cover-m02.jpg', '视频', ['末世'], 0, '末世囤货才是真本事｜混剪成片', '物资拉满的生存局，收藏后慢慢看，评论区报库存#末世囤货 #逆袭短剧', 28),
        work('M-03', '团宠解压图集', '番茄小说', '被偷听心声后我成了全村团宠', '7093312840', '12.4 MB', '林夏', '图集', '解压', '占用中', '昨天', '45%', 'cover-m03.jpg', '小说', ['解压'], 9, '偷听心声后全村都宠我｜解压图集', '解压向切片，睡前刷完心情会好一点#团宠 #解压'),
        work('M-04', '走入没有你的夜', '红果漫剧', '走入没有你的夜', '6641029385', '21.8 MB', '庭宇', '图集', '图文切片', '空闲', '1小时前', '50%', 'cover-m04.jpg', '漫画', ['现代言情'], 16, '走入没有你的夜｜漫剧切片', '现代言情名场面拉片，看到哪集了扣在评论#走入没有你的夜 #古风漫剧'),
        work('M-05', '百日新娘口播', '知乎故事', '我给死对头当了百日新娘', '5910284736', '36.0 MB', '阿凯', '视频', '口播', '空闲', '3小时前', '35%', 'cover-m05.jpg', '视频', ['豪门'], 0, '给死对头当了百日新娘｜口播', '豪门契约婚这口太上头，完整版看简介#百日新娘 #都市脑洞', 22),
        work('M-06', '银发军官图集', '番茄小说', '银发军官把我宠上天', '7482019356', '15.2 MB', '庭宇', '图集', '图文切片', '已完成', '今天', '50%', 'cover-m06.jpg', '小说', ['年代'], 8, '银发军官把我宠上天｜年代图集', '军装＋年代甜，建议循环看第三张#年代甜宠 #银发军官'),
        work('M-07', '待审口播样例', '番茄小说', '我成了老公掌心宠', '7128491023', '9.2 MB', '林夏', '图集', '口播', '空闲', '刚刚', '50%', 'cover-m01.jpg', '小说', ['甜宠'], 6, '待审口播｜尚未公开', '审核通过后才会出现在广场', 0, '审核中', ''),
        work('M-08', '驳回混剪样例', '红果短剧', '我在末世囤了亿万物资', '8301928471', '11.0 MB', '阿凯', '视频', '混剪', '空闲', '昨天', '40%', 'cover-m02.jpg', '视频', ['末世'], 0, '驳回混剪｜需补封面', '请补封面后重传', 16, '已驳回', '成片缺封面，请补封面后重传')
      ],
      projects: [
        { id: 'P-01', name: '番茄小说', logo: 'assets/fr014/logo-fanqie.jpg', status: '启用', sort: 1, updated: '2026-09-08 18:20' },
        { id: 'P-02', name: '红果短剧', logo: 'assets/fr014/logo-hongguo-drama.jpg', status: '启用', sort: 2, updated: '2026-09-08 18:20' },
        { id: 'P-03', name: '知乎故事', logo: 'assets/fr014/logo-zhihu.jpg', status: '启用', sort: 3, updated: '2026-09-07 11:04' },
        { id: 'P-04', name: '红果漫剧', logo: 'assets/fr014/logo-hongguo-comic.jpg', status: '启用', sort: 4, updated: '2026-09-06 09:30' }
      ],
      mats: [
        { id: 'T-01', name: '口播', status: '启用' },
        { id: 'T-02', name: '混剪', status: '启用' },
        { id: 'T-03', name: '图文切片', status: '启用' },
        { id: 'T-04', name: '解压', status: '启用' }
      ],
      skus: [
        { id: 'S-1', times: 1, points: 50, on: true },
        { id: 'S-2', times: 3, points: 120, on: true },
        { id: 'S-3', times: 10, points: 350, on: true },
        { id: 'S-4', times: 30, points: 900, on: false }
      ],
      claims: [
        {
          id: 'C-01', user: 'U-10086', mid: 'M-06', title: '银发军官图集', work: '银发军官图集',
          project: '番茄小说', editor: '庭宇', cover: 'assets/fr014/cover-m06.jpg', kind: '图集',
          kw: '年代甜宠', fill: '视频号 / @北城', status: '已回填', time: '今天 10:21',
          link: 'https://ybdd.demo/ms/M-06', claimedAt: Date.now() - 2 * 86400000,
          downloadedAt: Date.now() - 3600000, expireAt: Date.now() + 5 * 86400000
        },
        {
          id: 'C-03', user: 'U-10221', mid: 'M-03', title: '团宠解压图集', work: '团宠解压图集',
          project: '番茄小说', editor: '林夏', cover: 'assets/fr014/cover-m03.jpg', kind: '图集',
          kw: '全村团宠', fill: '—', status: '未回填', time: '昨天 09:40',
          link: 'https://ybdd.demo/ms/M-03', claimedAt: Date.now() - 86400000,
          downloadedAt: Date.now() - 80000000, expireAt: Date.now() + 6 * 86400000
        }
      ],
      bans: [
        { user: 'U-10999', strikes: 4, time: '2026-09-07 20:11', status: '停权中' },
        { user: 'U-10801', strikes: 4, time: '2026-09-03 13:40', status: '已恢复' }
      ],
      user: { id: 'U-10086', free: 1, bought: 2, strikes: 0, banned: false },
      keywords: {
        '番茄小说': ['掌心宠溺', '年代甜宠', '我是关键词最多十个字', '别暴躁别暴躁'],
        '红果短剧': ['末世囤货', '逆袭短剧'],
        '知乎故事': ['百日新娘', '都市脑洞'],
        '红果漫剧': ['走入没有你的夜', '古风漫剧']
      },
      banners: [
        { id: 'B-01', title: '剪辑手招募', sub: '扫码联系客服 · 录入即可供稿', kind: 'recruit', on: true, img: 'assets/fr014/bn-recruit.jpg' },
        { id: 'B-02', title: '热门稿件上新', sub: '小说 / 漫画 / 视频成片可领', kind: 'promo', on: true, img: 'assets/fr014/bn-hot.jpg' },
        { id: 'B-03', title: '领取后 24 小时回填', sub: '超时记一次未回填，次数不退', kind: 'promo', on: true, img: 'assets/fr014/bn-guide.jpg' },
        { id: 'B-04', title: '剪辑手精选', sub: '口播、混剪、图文切片都有', kind: 'promo', on: true, img: 'assets/fr014/bn-pick.jpg' },
        { id: 'B-05', title: '不会剪辑也能做项目', sub: '领取成片，去项目里发布变现', kind: 'promo', on: true, img: 'assets/fr014/bn-tips.jpg' }
      ]
    };
  }

  function work(id, title, project, book, bookId, size, editor, kind, mat, occ, time, share, cover, genre, tags, imgs, pubTitle, pubDesc, duration, audit, rejectReason) {
    return {
      id: id, title: title, project: project, book: book, bookId: bookId, size: size,
      dl: 'https://ybdd.demo/ms/' + id, editor: editor, kind: kind, mat: mat, occ: occ, time: time,
      share: share, cover: 'assets/fr014/' + cover, genre: genre, tags: tags, imgs: imgs || 1,
      pubTitle: pubTitle, pubDesc: pubDesc, duration: duration || 0,
      occupied: occ === '占用中',
      earn: occ === '已完成' && id === 'M-06' ? 186 : 0,
      audit: audit || '已通过',
      rejectReason: rejectReason || '',
      fileName: title
    };
  }

  function nowStamp() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function readRaw() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || '');
      if (!data || data.v !== VER) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function open(opts) {
    opts = opts || {};
    var data = opts.reset ? null : readRaw();
    if (!data) {
      data = seed();
      localStorage.setItem(KEY, JSON.stringify(data));
    }
    syncFlags(data);
    return data;
  }

  function syncFlags(data) {
    (data.works || []).forEach(function (w) {
      if (!w.occ) w.occ = w.occupied ? '占用中' : '空闲';
      w.occupied = w.occ === '占用中';
      if (!w.dl) w.dl = 'https://ybdd.demo/ms/' + w.id;
      if (w.earn == null) w.earn = (w.occ === '已完成' && w.id === 'M-06') ? 186 : 0;
      if (!w.audit) w.audit = '已通过';
      if (w.rejectReason == null) w.rejectReason = '';
      if (!w.fileName) w.fileName = w.title;
    });
  }

  function save(data) {
    syncFlags(data);
    localStorage.setItem(KEY, JSON.stringify(data));
    try { global.dispatchEvent(new CustomEvent('yjd-change')); } catch (e) {}
  }

  function onChange(fn) {
    global.addEventListener('yjd-change', fn);
    global.addEventListener('storage', function (e) {
      if (e.key === KEY) fn();
    });
  }

  function enabledProjects(data) {
    return (data.projects || []).filter(function (p) { return p.status === '启用'; })
      .slice().sort(function (a, b) { return a.sort - b.sort; });
  }

  function enabledMats(data) {
    return (data.mats || []).filter(function (m) { return m.status === '启用'; });
  }

  function enrolledEditors(data) {
    return (data.editors || []).filter(function (e) { return e.status === '已录入'; });
  }

  function parseProjectNames(raw) {
    return String(raw || '').split(/[\/、,，]/).map(function (s) { return s.trim(); }).filter(function (s) { return s && s !== '—'; });
  }

  function authorizedProjects(data, editor) {
    if (!editor || editor.status !== '已录入') return [];
    return parseProjectNames(editor.projects).filter(function (name) {
      var p = projectByName(data, name);
      return p && p.status === '启用';
    });
  }

  function plazaEligible(data, w) {
    if (!w || (w.audit || '已通过') !== '已通过') return false;
    if (w.occ === '占用中' || w.occ === '已完成' || w.occupied) return false;
    var p = projectByName(data, w.project);
    var e = editorByName(data, w.editor);
    var m = (data.mats || []).find(function (x) { return x.name === w.mat; });
    return !!(p && p.status === '启用' && e && e.status === '已录入' && m && m.status === '启用');
  }

  function worksByEditor(data, editorName) {
    return (data.works || []).filter(function (w) { return w.editor === editorName; });
  }

  function claimedWorksByEditor(data, editorName) {
    return worksByEditor(data, editorName).filter(function (w) {
      return w.occ === '占用中' || w.occ === '已完成' ||
        (data.claims || []).some(function (c) { return c.mid === w.id && c.status !== '已超时'; });
    });
  }

  function earnByEditor(data, editorName) {
    return worksByEditor(data, editorName).reduce(function (n, w) {
      return n + (w.occ === '已完成' ? (Number(w.earn) || 0) : 0);
    }, 0);
  }

  function projectByName(data, name) {
    return (data.projects || []).find(function (p) { return p.name === name; });
  }

  function editorByName(data, name) {
    return (data.editors || []).find(function (e) { return e.name === name; });
  }

  function workById(data, id) {
    return (data.works || []).find(function (w) { return w.id === id; });
  }

  function onSaleCount(data) {
    return (data.skus || []).filter(function (s) { return s.on; }).length;
  }

  function admClaimSt(s) {
    if (s === '未回填') return '待回填';
    if (s === '已超时') return '已超时释放';
    return s;
  }

  function feClaimSt(s) {
    if (s === '待回填') return '未回填';
    if (s === '已超时释放') return '已超时';
    return s;
  }

  global.YJD = {
    KEY: KEY,
    seed: seed,
    open: open,
    save: save,
    onChange: onChange,
    now: nowStamp,
    enabledProjects: enabledProjects,
    enabledMats: enabledMats,
    enrolledEditors: enrolledEditors,
    parseProjectNames: parseProjectNames,
    authorizedProjects: authorizedProjects,
    plazaEligible: plazaEligible,
    worksByEditor: worksByEditor,
    claimedWorksByEditor: claimedWorksByEditor,
    earnByEditor: earnByEditor,
    projectByName: projectByName,
    editorByName: editorByName,
    workById: workById,
    onSaleCount: onSaleCount,
    admClaimSt: admClaimSt,
    feClaimSt: feClaimSt
  };
})(window);
