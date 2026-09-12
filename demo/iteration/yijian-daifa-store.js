/* FR-014 一键代发 · 前后端共用数据（localStorage 逻辑闭环，非真实接口） */
(function (global) {
  var KEY = 'fr014-yjd-v6';
  var VER = 6;
  var CLIENT_DL_MS = 3 * 86400000;
  var OSS_TTL_MS = 7 * 86400000;
  var UNCLAIMED_TTL_MS = 15 * 86400000;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function fillYmdRange(set, y, m, d1, d2) {
    for (var day = d1; day <= d2; day++) set[y + '-' + pad2(m) + '-' + pad2(day)] = 1;
  }
  var HOLIDAY = {};
  fillYmdRange(HOLIDAY, 2026, 1, 1, 3);
  fillYmdRange(HOLIDAY, 2026, 2, 15, 23);
  fillYmdRange(HOLIDAY, 2026, 4, 4, 6);
  fillYmdRange(HOLIDAY, 2026, 5, 1, 5);
  fillYmdRange(HOLIDAY, 2026, 6, 19, 21);
  fillYmdRange(HOLIDAY, 2026, 10, 1, 8);
  var MAKEUP = {
    '2026-01-04': 1,
    '2026-02-14': 1,
    '2026-02-28': 1,
    '2026-05-09': 1,
    '2026-09-20': 1,
    '2026-10-10': 1
  };
  function dayType(d) {
    d = d || new Date();
    var key = ymd(d);
    if (MAKEUP[key]) return 'weekday';
    if (HOLIDAY[key]) return 'holiday';
    var w = d.getDay();
    return (w === 0 || w === 6) ? 'holiday' : 'weekday';
  }
  function todayFree(data, d) {
    var q = (data && data.freeQuota) || { weekday: 1, holiday: 1 };
    var n = dayType(d || new Date()) === 'holiday' ? Number(q.holiday) : Number(q.weekday);
    return (isNaN(n) || n < 0) ? 0 : n;
  }
  function applyFreeDay(data, d) {
    d = d || new Date();
    if (!data.user) data.user = {};
    var today = ymd(d);
    if (data.user.freeDate !== today) {
      data.user.free = todayFree(data, d);
      data.user.freeDate = today;
    }
    return data.user.free;
  }

  function seed() {
    return {
      v: VER,
      editors: [
        { id: 'E-01', ybId: 'YB10086', name: '林夏', share: '50%', note: '主力口播', src: '客服二维码', projects: '番茄小说', status: '已录入', time: '2026-09-01 10:12', needReview: true, platforms: ['右豹'] },
        { id: 'E-02', ybId: 'YB10221', name: '阿凯', share: '40%', note: '短剧混剪', src: '客服二维码', projects: '红果短剧 / 知乎故事', status: '已录入', time: '2026-09-02 15:40', needReview: false, platforms: ['右豹', '站外'] },
        { id: 'E-03', ybId: 'YB10801', name: '小禾', share: '35%', note: '已停用，暂不接稿', src: '客服二维码', projects: '—', status: '已停用', time: '2026-08-20 09:03', needReview: true, platforms: ['右豹'] },
        { id: 'E-04', ybId: 'YB10330', name: '庭宇', share: '50%', note: '图文切片', src: '客服二维码', projects: '番茄小说 / 红果漫剧', status: '已录入', time: '2026-09-03 11:08', needReview: true, platforms: ['右豹', '站外'] }
      ],
      works: [
        work('M-01', '掌心宠 · 口播切片', '番茄小说', '我成了老公掌心宠', '7128491023', '18.6 MB', '林夏', '图集', '口播', '空闲', '1小时前', '50%', 'cover-m01.jpg', '小说', ['甜宠', '年代'], 12, '被偏爱的感觉藏不住｜掌心宠口播', '一口气看完这篇年代甜宠，评论区扣1告诉我你嗑哪对#掌心宠溺 #年代甜宠'),
        work('M-02', '末世囤货混剪', '红果短剧', '我在末世囤了亿万物资', '8301928471', '42.1 MB', '阿凯', '视频', '混剪', '空闲', '昨天', '40%', 'cover-m02.jpg', '视频', ['末世'], 0, '末世囤货才是真本事｜混剪成片', '物资拉满的生存局，收藏后慢慢看，评论区报库存#末世囤货 #逆袭短剧', 28),
        work('M-03', '团宠解压图集', '番茄小说', '被偷听心声后我成了全村团宠', '7093312840', '12.4 MB', '林夏', '图集', '解压', '占用中', '昨天', '45%', 'cover-m03.jpg', '小说', ['解压'], 9, '偷听心声后全村都宠我｜解压图集', '解压向切片，睡前刷完心情会好一点#团宠 #解压'),
        work('M-04', '走入没有你的夜', '红果漫剧', '走入没有你的夜', '6641029385', '21.8 MB', '庭宇', '图集', '图文切片', '空闲', '1小时前', '50%', 'cover-m04.jpg', '漫画', ['现代言情'], 16, '走入没有你的夜｜漫剧切片', '现代言情名场面拉片，看到哪集了扣在评论#走入没有你的夜 #古风漫剧'),
        work('M-05', '百日新娘口播', '知乎故事', '我给死对头当了百日新娘', '5910284736', '36.0 MB', '阿凯', '视频', '口播', '空闲', '3小时前', '35%', 'cover-m05.jpg', '视频', ['豪门'], 0, '给死对头当了百日新娘｜口播', '豪门契约婚这口太上头，完整版看简介#百日新娘 #都市脑洞', 22),
        work('M-06', '银发军官图集', '番茄小说', '银发军官把我宠上天', '7482019356', '15.2 MB', '庭宇', '图集', '图文切片', '已完成', '今天', '50%', 'cover-m06.jpg', '小说', ['年代'], 8, '银发军官把我宠上天｜年代图集', '军装＋年代甜，建议循环看第三张#年代甜宠 #银发军官'),
        work('M-07', '待审口播样例', '番茄小说', '我成了老公掌心宠', '7128491023', '9.2 MB', '林夏', '图集', '口播', '空闲', '刚刚', '50%', 'cover-m01.jpg', '小说', ['甜宠'], 6, '待审口播｜尚未公开', '审核通过后才会出现在广场', 0, '审核中', ''),
        work('M-08', '驳回混剪样例', '红果短剧', '我在末世囤了亿万物资', '8301928471', '11.0 MB', '阿凯', '视频', '混剪', '空闲', '昨天', '40%', 'cover-m02.jpg', '视频', ['末世'], 0, '驳回混剪｜需补封面', '请补封面后重传', 16, '已驳回', '成片缺封面，请补封面后重传'),
        offsiteWork('X-01', '掌心宠 · 站外合集', '番茄小说', '我成了老公掌心宠', '7128491023', '86.4 MB', '庭宇', '图集', 8, 3, '今天', '50%'),
        offsiteWork('X-02', '末世切片包', '红果短剧', '我在末世囤了亿万物资', '8301928471', '128.0 MB', '阿凯', '视频', 5, 1, '昨天', '40%'),
        offsiteWork('X-03', '漫剧夜色文件夹', '红果漫剧', '走入没有你的夜', '6641029385', '42.0 MB', '庭宇', '图集', 6, 0, '1小时前', '50%'),
        offsiteWork('X-04', '已领完样例', '番茄小说', '我成了老公掌心宠', '7128491023', '24.0 MB', '庭宇', '图集', 4, 4, '昨天', '50%'),
        (function () {
          var stale = work('M-09', '超期未领样例', '番茄小说', '我成了老公掌心宠', '7128491023', '8.0 MB', '林夏', '图集', '口播', '空闲', '16天前', '50%', 'cover-m01.jpg', '小说', ['甜宠'], 6, '超期未领｜系统已删', '上传后一直无人领取');
          stale.uploadedAt = Date.now() - 16 * 86400000;
          return stale;
        })()
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
        { id: 'S-1', times: 1, points: 50, origPoints: 80, on: true, buyers: 128 },
        { id: 'S-2', times: 3, points: 120, origPoints: 180, on: true, buyers: 64 },
        { id: 'S-3', times: 10, points: 350, origPoints: 500, on: true, buyers: 21 },
        { id: 'S-4', times: 30, points: 900, origPoints: 1200, on: false, buyers: 8 }
      ],
      claims: [
        {
          id: 'C-01', user: 'U-10086', mid: 'M-06', title: '银发军官图集', work: '银发军官图集',
          project: '番茄小说', editor: '庭宇', cover: 'assets/fr014/cover-m06.jpg', kind: '图集',
          book: '银发军官把我宠上天', bookId: '7482019356',
          kw: '年代甜宠', fill: '视频号 / @北城', fillVideo: 'https://channels.weixin.qq.com/demo/C-01',
          status: '已回填', time: '今天 10:21', pendingEarn: 0,
          link: 'https://ybdd.demo/ms/M-06', claimedAt: Date.now() - 2 * 86400000,
          downloadedAt: Date.now() - 3600000, expireAt: Date.now() + 1 * 86400000
        },
        {
          id: 'C-03', user: 'U-10221', mid: 'M-03', title: '团宠解压图集', work: '团宠解压图集',
          project: '番茄小说', editor: '林夏', cover: 'assets/fr014/cover-m03.jpg', kind: '图集',
          book: '被偷听心声后我成了全村团宠', bookId: '7093312840',
          kw: '全村团宠', fill: '—', fillVideo: '',
          status: '未回填', time: '昨天 09:40', pendingEarn: 90,
          link: 'https://ybdd.demo/ms/M-03', claimedAt: Date.now() - 86400000,
          downloadedAt: Date.now() - 80000000, expireAt: Date.now() + 2 * 86400000
        },
        {
          id: 'C-05', user: 'U-10001', mid: 'M-06', title: '银发军官图集', work: '银发军官图集',
          project: '番茄小说', editor: '庭宇', cover: 'assets/fr014/cover-m06.jpg', kind: '图集',
          book: '银发军官把我宠上天', bookId: '7482019356',
          kw: '年代甜宠', fill: '抖音 / @南城', fillVideo: 'https://channels.weixin.qq.com/demo/C-05',
          status: '已回填', time: '4天前', pendingEarn: 0,
          link: 'https://ybdd.demo/ms/M-06', claimedAt: Date.now() - 4 * 86400000,
          downloadedAt: Date.now() - 3.5 * 86400000, expireAt: Date.now() - 1 * 86400000
        }
      ],
      bans: [
        { user: 'U-10999', strikes: 4, time: '2026-09-07 20:11', status: '停权中' },
        { user: 'U-10801', strikes: 4, time: '2026-09-03 13:40', status: '已恢复' }
      ],
      freeQuota: { weekday: 1, holiday: 1 },
      user: { id: 'U-10086', free: 1, bought: 2, strikes: 0, banned: false },
      keywords: {
        '番茄小说': [
          kw('掌心宠溺', '审核通过待发布'),
          kw('年代甜宠', '审核通过已回填'),
          kw('我是关键词最多十个字', '审核通过待发布'),
          kw('别暴躁别暴躁', '审核通过待发布'),
          kw('待审核甜宠', '待审核'),
          kw('已驳回口播', '已驳回')
        ],
        '红果短剧': [kw('末世囤货', '审核通过待发布'), kw('逆袭短剧', '审核通过已回填')],
        '知乎故事': [kw('百日新娘', '审核通过待发布'), kw('都市脑洞', '审核通过待发布')],
        '红果漫剧': [kw('走入没有你的夜', '审核通过待发布'), kw('古风漫剧', '审核通过已回填')]
      },
      settlements: [
        { id: 'ST-01', editor: '庭宇', mid: 'M-06', claimId: 'C-01', project: '番茄小说', book: '银发军官把我宠上天', bookId: '7482019356', kw: '年代甜宠', user: 'U-10086', amount: 72, settledAt: '2026-09-10 02:43:53', channel: '右豹' },
        { id: 'ST-02', editor: '庭宇', mid: 'M-06', claimId: 'C-05', project: '番茄小说', book: '银发军官把我宠上天', bookId: '7482019356', kw: '年代甜宠', user: 'U-10001', amount: 48, settledAt: '2026-09-09 16:12:08', channel: '右豹' },
        { id: 'ST-03', editor: '庭宇', mid: 'M-06', claimId: 'C-01', project: '番茄小说', book: '银发军官把我宠上天', bookId: '7482019356', kw: '年代甜宠', user: 'U-10086', amount: 36, settledAt: '2026-09-08 11:05:20', channel: '右豹' },
        { id: 'ST-04', editor: '庭宇', mid: 'M-06', claimId: 'C-05', project: '番茄小说', book: '银发军官把我宠上天', bookId: '7482019356', kw: '年代甜宠', user: 'U-10001', amount: 30, settledAt: '2026-08-21 09:18:40', channel: '右豹' },
        { id: 'ST-06', editor: '庭宇', mid: 'M-04', project: '红果漫剧', book: '走入没有你的夜', bookId: '6641029385', kw: '走入没有你的夜', user: 'U-10221', amount: 24, settledAt: '2026-09-10 19:06:12', channel: '右豹' }
      ],
      offsiteEarns: [
        { id: 'OE-01', editor: '庭宇', ybId: 'YB10330', mid: 'X-01', project: '番茄小说', book: '我成了老公掌心宠', bookId: '7128491023', kw: '掌心宠溺', amount: 50, settledAt: '2026-09-10 08:00:00' },
        { id: 'OE-02', editor: '庭宇', ybId: 'YB10330', mid: 'X-03', project: '红果漫剧', book: '走入没有你的夜', bookId: '6641029385', kw: '走入没有你的夜', amount: 18, settledAt: '2026-09-09 12:20:00' },
        { id: 'OE-03', editor: '庭宇', ybId: 'YB10330', mid: 'X-01', project: '番茄小说', book: '我成了老公掌心宠', bookId: '7128491023', kw: '年代甜宠', amount: 12, settledAt: '2026-09-08 15:40:00' },
        { id: 'OE-04', editor: '阿凯', ybId: 'YB10221', mid: 'X-02', project: '红果短剧', book: '我在末世囤了亿万物资', bookId: '8301928471', kw: '末世囤货', amount: 32, settledAt: '2026-09-10 11:08:00' }
      ],
      banners: [
        { id: 'B-01', title: '剪辑手招募', sub: '扫码联系客服 · 录入即可供稿', kind: 'recruit', on: true, img: 'assets/fr014/bn-recruit.jpg' },
        { id: 'B-02', title: '热门稿件上新', sub: '小说 / 漫画 / 视频成片可领', kind: 'promo', on: true, img: 'assets/fr014/bn-hot.jpg' },
        { id: 'B-03', title: '领取后 24 小时回填', sub: '超时记一次未回填，次数不退', kind: 'promo', on: true, img: 'assets/fr014/bn-guide.jpg' },
        { id: 'B-04', title: '剪辑手精选', sub: '口播、混剪、图文切片都有', kind: 'promo', on: true, img: 'assets/fr014/bn-pick.jpg' },
        { id: 'B-05', title: '不会剪辑也能做项目', sub: '领取成片，去项目里发布变现', kind: 'promo', on: true, img: 'assets/fr014/bn-tips.jpg' }
      ]
    };
  }

  function albumPreview(cover) {
    var own = String(cover || '').replace(/^assets\/fr014\//, '');
    var pool = ['cover-m01.jpg', 'cover-m03.jpg', 'cover-m04.jpg', 'cover-m06.jpg'];
    var out = [];
    if (own) out.push('assets/fr014/' + own);
    pool.forEach(function (c) {
      var url = 'assets/fr014/' + c;
      if (out.indexOf(url) < 0 && out.length < 3) out.push(url);
    });
    return out.slice(0, 3);
  }

  var CLAIMABLE_KW_STATUS = ['审核通过待发布', '审核通过已回填'];
  function kw(name, status, bookId) {
    var row = { name: name, status: status || '审核通过待发布' };
    if (bookId != null && bookId !== '') row.bookId = bookId;
    return row;
  }
  function normalizeKeyword(item) {
    if (typeof item === 'string') return kw(item, '审核通过待发布');
    if (item && item.name) return kw(item.name, item.status, item.bookId);
    return null;
  }
  function findProjectKeyword(data, project, name) {
    if (!name) return null;
    var list = projectKeywords(data, project);
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === name) return list[i];
    }
    return null;
  }
  function keywordBookConflict(data, project, name, workBookId) {
    var k = findProjectKeyword(data, project, name);
    if (!k || k.bookId == null || k.bookId === '') return false;
    return String(k.bookId) !== String(workBookId == null ? '' : workBookId);
  }
  function projectKeywords(data, project) {
    return ((data && data.keywords && data.keywords[project]) || []).map(normalizeKeyword).filter(Boolean);
  }
  function claimableKeywords(data, project) {
    return projectKeywords(data, project).filter(function (k) {
      return CLAIMABLE_KW_STATUS.indexOf(k.status) >= 0;
    }).map(function (k) { return k.name; });
  }
  function isClaimableKeyword(data, project, name) {
    return !!name && claimableKeywords(data, project).indexOf(name) >= 0;
  }
  function normalizeKeywordsMap(data) {
    if (!data || !data.keywords) return;
    Object.keys(data.keywords).forEach(function (project) {
      data.keywords[project] = projectKeywords(data, project);
    });
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
      fileName: title,
      uploadStatus: '已上传',
      bookLink: 'https://ybdd.demo/book/' + bookId,
      preview: kind === '图集' ? albumPreview(cover) : [],
      channel: '右豹',
      ossKey: ossObjectKey(id),
      ossDeleted: false,
      ossRestoreUsed: false,
      ossExpireAt: null,
      uploadedAt: uploadedAtFromLabel(time),
      fileStatus: '正常',
      ossDeletedReason: ''
    };
  }

  function offsiteWork(id, title, project, book, bookId, size, editor, kind, assets, claimed, time, share) {
    return {
      id: id, title: title, project: project, book: book, bookId: bookId, size: size,
      dl: offsiteSharePath(id), editor: editor, kind: kind, mat: '', occ: '空闲', time: time,
      share: share || '50%', cover: 'assets/fr014/cover-m01.jpg', genre: kind === '视频' ? '视频' : '小说',
      tags: [], imgs: assets || 1, pubTips: '', duration: kind === '视频' ? 18 : 0,
      occupied: false, earn: 0, audit: '已通过', rejectReason: '',
      fileName: title, uploadStatus: '已上传',
      bookLink: 'https://ybdd.demo/book/' + bookId, preview: [],
      channel: '站外', folder: true,
      assets: assets || 1, claimedAssets: claimed || 0,
      ossKey: ossObjectKey(id),
      ossDeleted: (claimed || 0) >= (assets || 1),
      ossRestoreUsed: false,
      ossExpireAt: null,
      uploadedAt: uploadedAtFromLabel(time),
      fileStatus: '正常',
      ossDeletedReason: ''
    };
  }

  function uploadedAtFromLabel(time) {
    var now = Date.now();
    var raw = String(time || '');
    var days = raw.match(/(\d+)\s*天前/);
    if (days) return now - Number(days[1]) * 86400000;
    if (raw.indexOf('昨天') >= 0) return now - 86400000;
    if (raw.indexOf('小时') >= 0) {
      var hours = raw.match(/(\d+)\s*小时/);
      return now - (hours ? Number(hours[1]) : 1) * 3600000;
    }
    return now - 3600000;
  }

  function isFileDeleted(w) {
    return !!(w && w.fileStatus === '已删除');
  }

  function fileStatusOf(w) {
    return isFileDeleted(w) ? '已删除' : '正常';
  }

  function hasBeenClaimed(data, w) {
    if (!w) return false;
    if (isOffsite(w)) return offsiteClaimedCount(w) > 0;
    if (w.ossExpireAt) return true;
    return (data.claims || []).some(function (c) { return c.mid === w.id; });
  }

  function markFileDeleted(w, reason) {
    if (!w) return w;
    w.fileStatus = '已删除';
    w.ossDeleted = true;
    w.ossDeletedReason = reason || w.ossDeletedReason || 'manual';
    return w;
  }

  function canSoftDelete(data, w) {
    if (!w) return { ok: false, reason: '稿件已不存在' };
    if (isFileDeleted(w)) return { ok: false, reason: '稿件已删除' };
    if (w.uploadStatus === '上传中') return { ok: false, reason: '上传中的稿件不能删除' };
    if (w.occ === '占用中') return { ok: false, reason: '占用中的稿件不能删除' };
    if ((data.claims || []).some(function (c) { return c.mid === w.id && c.status !== '已超时'; })) {
      return { ok: false, reason: '仍有未超时领取记录，不能删除' };
    }
    return { ok: true };
  }

  function softDeleteWork(data, id) {
    var w = workById(data, id);
    var gate = canSoftDelete(data, w);
    if (!gate.ok) return gate;
    markFileDeleted(w, 'manual');
    return { ok: true, work: w };
  }

  function offsiteSharePath(id) {
    return 'yijian-daifa-offsite.html?id=' + encodeURIComponent(id);
  }

  function ossObjectKey(id) {
    return 'oss://ybdd-yjd/works/' + id;
  }

  function clientExpireAt(from) {
    return (from || Date.now()) + CLIENT_DL_MS;
  }

  function ossExpireAtFrom(from) {
    return (from || Date.now()) + OSS_TTL_MS;
  }

  function ensureOssFields(w) {
    if (!w) return w;
    if (!w.ossKey) w.ossKey = ossObjectKey(w.id);
    if (w.ossDeleted == null) w.ossDeleted = false;
    if (w.ossRestoreUsed == null) w.ossRestoreUsed = false;
    if (w.ossExpireAt === undefined) w.ossExpireAt = null;
    if (!w.uploadedAt) w.uploadedAt = uploadedAtFromLabel(w.time);
    if (w.ossDeletedReason == null) w.ossDeletedReason = '';
    if (!w.fileStatus) {
      w.fileStatus = (w.ossDeletedReason || (!isOffsite(w) && w.ossDeleted)) ? '已删除' : '正常';
    }
    if (w.ossDeletedReason) w.fileStatus = '已删除';
    return w;
  }

  function ossAlive(w) {
    if (!w) return false;
    if (isFileDeleted(w)) return false;
    if (isOffsite(w)) return offsiteRemaining(w) > 0;
    if (w.ossDeleted) return false;
    if (w.ossExpireAt && w.ossExpireAt <= Date.now()) return false;
    return true;
  }

  function bindClaimOss(work, claimedAt) {
    if (!work || isOffsite(work)) return;
    ensureOssFields(work);
    var start = claimedAt || Date.now();
    var next = ossExpireAtFrom(start);
    if (!work.ossExpireAt || next < work.ossExpireAt) work.ossExpireAt = next;
  }

  function sweepOss(data) {
    var now = Date.now();
    (data.works || []).forEach(function (w) {
      ensureOssFields(w);
      if (isFileDeleted(w)) return;
      if (hasBeenClaimed(data, w)) {
        if (!isOffsite(w) && w.ossExpireAt && w.ossExpireAt <= now) markFileDeleted(w, 'ttl7');
        return;
      }
      if (w.uploadedAt && (w.uploadedAt + UNCLAIMED_TTL_MS) <= now) markFileDeleted(w, 'ttl15');
    });
  }

  function latestClaimForWork(data, mid) {
    var list = (data.claims || []).filter(function (c) { return c.mid === mid; });
    if (!list.length) return null;
    list.sort(function (a, b) { return (b.claimedAt || 0) - (a.claimedAt || 0); });
    return list[0];
  }

  function restoreClientDownload(data, mid, claimId) {
    var w = workById(data, mid);
    if (!w || isOffsite(w)) return { ok: false, reason: '站外稿件不支持恢复C端下载' };
    sweepOss(data);
    if (!ossAlive(w)) return { ok: false, reason: '云端资源已失效，无法恢复' };
    if (w.ossRestoreUsed) return { ok: false, reason: '该稿件下载链接已恢复过一次' };
    var claim = (data.claims || []).find(function (c) { return claimId && c.id === claimId; })
      || (data.claims || []).filter(function (c) { return c.mid === mid && (c.expireAt || 0) <= Date.now(); })
        .sort(function (a, b) { return (b.claimedAt || 0) - (a.claimedAt || 0); })[0]
      || latestClaimForWork(data, mid);
    if (!claim) return { ok: false, reason: '没有可恢复的领取记录' };
    if ((claim.expireAt || 0) > Date.now()) return { ok: false, reason: 'C端下载尚未过期' };
    var cap = w.ossExpireAt || (Date.now() + CLIENT_DL_MS);
    claim.expireAt = Math.min(Date.now() + CLIENT_DL_MS, cap);
    claim.restoredAt = Date.now();
    w.ossRestoreUsed = true;
    return { ok: true, expireAt: claim.expireAt };
  }

  function downloadBlockReason(claim, work, opts) {
    opts = opts || {};
    if (!claim) return '稿件已不存在';
    if (work && isOffsite(work)) {
      if (offsiteRemaining(work) <= 0) return '云端资源已删除，无法再下载';
      return '';
    }
    if (work && !ossAlive(work)) return '云端资源已失效，无法再下载';
    if ((claim.expireAt || 0) <= Date.now()) return '当前稿件下载时效已过期';
    if (opts.banned) return '您已违反平台规则，超过3次未回填；下载链接已失效';
    if (claim.status === '已超时') return '当前任务未及时回填，下载链接已失效';
    return '';
  }

  function ossStatusLabel(w) {
    if (!w) return '—';
    if (isOffsite(w)) {
      var left = offsiteRemaining(w);
      var n = offsiteAssetCount(w);
      if (left >= n) return '有效（领一个删一个）';
      if (left > 0) return '部分已删（领一个删一个）';
      return '已按份删完';
    }
    if (isFileDeleted(w)) {
      if (w.ossDeletedReason === 'manual') return '已删除（主动删除，不可恢复）';
      if (w.ossDeletedReason === 'ttl15') return '已删除（上传未领满 15 天）';
      if (w.ossDeletedReason === 'ttl7') return '已删除（已领取，系统满 7 天）';
      return '已删除';
    }
    if (w.ossExpireAt) return '有效（已领取，系统 7 天内）';
    return '有效（未领取，满 15 天删除）';
  }

  var PLATFORM_OPTS = ['右豹', '站外'];

  function editorPlatforms(editor) {
    var list = editor && Array.isArray(editor.platforms) ? editor.platforms.slice() : [];
    list = list.filter(function (p) { return PLATFORM_OPTS.indexOf(p) >= 0; });
    return list.length ? list : ['右豹'];
  }

  function editorHasPlatform(editor, name) {
    return editorPlatforms(editor).indexOf(name) >= 0;
  }

  function platformsLabel(editor) {
    return editorPlatforms(editor).join(' / ');
  }

  function workChannel(w) {
    return (w && w.channel) === '站外' ? '站外' : '右豹';
  }

  function isOffsite(w) {
    return workChannel(w) === '站外';
  }

  function nowStamp() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var LOGO_OPTS = [
    { name: '番茄小说', src: 'assets/fr014/logo-fanqie.jpg' },
    { name: '红果短剧', src: 'assets/fr014/logo-hongguo-drama.jpg' },
    { name: '知乎故事', src: 'assets/fr014/logo-zhihu.jpg' },
    { name: '红果漫剧', src: 'assets/fr014/logo-hongguo-comic.jpg' }
  ];
  var BRAND_CATALOG = LOGO_OPTS.concat([
    { name: '点众小说', src: 'assets/fr014/logo-zhihu.jpg' }
  ]);
  var SKU_BUYERS = { 'S-1': 128, 'S-2': 64, 'S-3': 21, 'S-4': 8 };
  var SKU_ORIG = { 'S-1': 80, 'S-2': 180, 'S-3': 500, 'S-4': 1200 };

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function tipText(w) {
    if (w && w.pubTips != null) return String(w.pubTips);
    return [w && w.pubTitle, w && w.pubDesc].filter(Boolean).join('\n');
  }

  function tipPrompt(vars) {
    vars = vars || {};
    function slot(key) {
      var val = vars[key];
      return val != null && String(val) !== '' ? String(val) : '{' + key + '}';
    }
    return '你是代发文案助手。只根据给定书籍与稿件写一条发布技巧，不要拆标题和描述。\n' +
      '【输入】书名：' + slot('book') + '；书籍ID：' + slot('book_id') + '；稿件：' + slot('title') +
      '；类型：' + slot('kind') + '；素材：' + slot('mat') + '\n' +
      '【约束】一段连续正文，无标签/序号/「标题」「描述」。30–180 字。必须出现书名和稿件名。文末 1–2 个 #话题（从书名或稿件名截取，禁止平台名）。简介没有的情节不准编。\n' +
      '【规则】禁涉黄涉政暴力歧视；不号召下载站外 App；不得输出解释或 JSON。';
  }

  function topicTag(s) {
    return String(s || '').replace(/[#\s]/g, '').slice(0, 8);
  }

  function makeTip(input) {
    var book = String((input && input.book) || '本书');
    var title = String((input && input.title) || '成片');
    var t1 = topicTag(book);
    var t2 = topicTag(title);
    var tags = '#' + (t1 || '成片');
    if (t2 && t2 !== t1) tags += ' #' + t2;
    return '发布「' + title + '」时写明书名「' + book + '」，只根据书和成片已有内容写一段，不另编情节。' + tags;
  }

  function workQty(w) {
    if (!w) return 1;
    return w.kind === '视频' ? 1 : (Number(w.imgs) || 1);
  }

  function workInfoLabel(w) {
    if (isOffsite(w)) return offsiteInfoLabel(w);
    return (w && w.size ? w.size : '—') + ' (' + workQty(w) + ')';
  }

  function offsiteAssetCount(w) {
    if (!w) return 1;
    if (w.assets != null) return Number(w.assets) || 1;
    return w.kind === '视频' ? 1 : (Number(w.imgs) || 1);
  }

  function offsiteClaimedCount(w) {
    return w && w.claimedAssets != null ? Number(w.claimedAssets) || 0 : 0;
  }

  function offsiteInfoLabel(w) {
    var n = offsiteAssetCount(w);
    var c = offsiteClaimedCount(w);
    return n + '个素材(已领' + c + '个) · ' + (w && w.size ? w.size : '—');
  }

  function offsiteRemaining(w) {
    return Math.max(0, offsiteAssetCount(w) - offsiteClaimedCount(w));
  }

  function offsiteExhausted(w) {
    return !w || offsiteRemaining(w) <= 0;
  }

  function claimOffsiteAsset(data, work) {
    if (!work || !isOffsite(work) || isFileDeleted(work)) return false;
    if (offsiteRemaining(work) <= 0) return false;
    work.claimedAssets = offsiteClaimedCount(work) + 1;
    return true;
  }

  function offsiteStatus(w) {
    var n = offsiteAssetCount(w);
    var c = offsiteClaimedCount(w);
    if (c <= 0) return '空闲';
    if (c >= n) return '已领完';
    return '部分领取';
  }

  function sharePct(editor) {
    var n = parseInt(String(editor && editor.share || '50'), 10);
    return n > 0 ? n : 50;
  }

  function mockPendingEarn(data, claim) {
    var snap = claim && claim.shareSnapshot;
    var pct = snap ? sharePct({ share: snap }) : sharePct(editorByName(data, claim && claim.editor));
    return Math.round(180 * pct / 100);
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
    var fresh = !data;
    var hadQuota = !!(data && data.freeQuota);
    var prevDate = data && data.user && data.user.freeDate;
    if (!data) data = seed();
    var worksBefore = JSON.stringify(data.works || []);
    var kwsBefore = JSON.stringify(data.keywords || {});
    syncFlags(data);
    var swept = worksBefore !== JSON.stringify(data.works || []) || kwsBefore !== JSON.stringify(data.keywords || {});
    if (fresh || !hadQuota || swept || (data.user && data.user.freeDate !== prevDate)) {
      localStorage.setItem(KEY, JSON.stringify(data));
    }
    return data;
  }

  function syncFlags(data) {
    (data.editors || []).forEach(function (e) {
      if (e.needReview == null) e.needReview = true;
      e.platforms = editorPlatforms(e);
    });
    (data.works || []).forEach(function (w) {
      ensureOssFields(w);
      if (!w.channel) w.channel = String(w.id || '').indexOf('X-') === 0 ? '站外' : '右豹';
      if (!w.occ) w.occ = w.occupied ? '占用中' : '空闲';
      w.occupied = w.occ === '占用中';
      if (isOffsite(w)) {
        w.folder = true;
        w.mat = w.mat || '';
        w.pubTips = '';
        w.audit = '已通过';
        w.rejectReason = '';
        if (w.assets == null) w.assets = offsiteAssetCount(w);
        if (w.claimedAssets == null) w.claimedAssets = 0;
        if (!w.dl || String(w.dl).indexOf('ybdd.demo/ms/') >= 0) w.dl = offsiteSharePath(w.id);
      } else if (!w.dl) {
        w.dl = 'https://ybdd.demo/ms/' + w.id;
      }
      if (w.earn == null) w.earn = (w.occ === '已完成' && w.id === 'M-06') ? 186 : 0;
      if (!('audit' in w) || w.audit == null) w.audit = '已通过';
      if (w.rejectReason == null) w.rejectReason = '';
      if (!w.fileName) w.fileName = w.title;
      if (!w.uploadStatus) w.uploadStatus = '已上传';
      if (!w.bookLink && w.bookId) w.bookLink = 'https://ybdd.demo/book/' + w.bookId;
      if (!isOffsite(w) && w.pubTips == null) w.pubTips = tipText(w);
      if (w.kind === '图集' && !isOffsite(w)) {
        var list = Array.isArray(w.preview) ? w.preview.filter(Boolean) : [];
        w.preview = (list.length ? list : albumPreview(w.cover)).slice(0, 3);
      } else if (!isOffsite(w)) {
        w.preview = [];
      }
    });
    (data.skus || []).forEach(function (s) {
      if (s.buyers == null) s.buyers = SKU_BUYERS[s.id] != null ? SKU_BUYERS[s.id] : 0;
      if (s.origPoints == null) s.origPoints = SKU_ORIG[s.id] != null ? SKU_ORIG[s.id] : (Number(s.points) || 0);
    });
    if (!data.freeQuota) data.freeQuota = { weekday: 1, holiday: 1 };
    if (data.freeQuota.weekday == null) data.freeQuota.weekday = 1;
    if (data.freeQuota.holiday == null) data.freeQuota.holiday = 1;
    applyFreeDay(data);
    if (!Array.isArray(data.settlements) || !data.settlements.length) {
      data.settlements = seed().settlements.slice();
    }
    if (!(data.settlements || []).some(function (s) { return s.id === 'ST-06'; })) {
      data.settlements.push({
        id: 'ST-06', editor: '庭宇', mid: 'M-04', project: '红果漫剧',
        book: '走入没有你的夜', bookId: '6641029385', kw: '走入没有你的夜', user: 'U-10221',
        amount: 24, settledAt: '2026-09-10 19:06:12', channel: '右豹'
      });
    }
    if (!Array.isArray(data.offsiteEarns) || !data.offsiteEarns.length) {
      data.offsiteEarns = seed().offsiteEarns.slice();
    }
    (data.settlements || []).forEach(function (s) {
      var row = decorateSettlement(data, s);
      if (!s.project) s.project = row.project;
      if (!s.kw) s.kw = row.kw;
      if (!s.user) s.user = row.user;
    });
    (data.claims || []).forEach(function (c) {
      var w = workById(data, c.mid);
      if (w) {
        if (!c.book) c.book = w.book;
        if (!c.bookId) c.bookId = w.bookId;
        if (!c.project) c.project = w.project;
        if (!c.editor) c.editor = w.editor;
      }
      if (!c.shareSnapshot && c.editor) {
        var ed = editorByName(data, c.editor);
        if (ed && ed.share) c.shareSnapshot = ed.share;
      }
      if (c.claimedAt && w && !isOffsite(w)) bindClaimOss(w, c.claimedAt);
      if (c.expireAt == null && c.claimedAt) c.expireAt = clientExpireAt(c.claimedAt);
      if (c.status === '已回填') {
        if (!c.fillVideo) c.fillVideo = 'https://channels.weixin.qq.com/demo/' + c.id;
        c.pendingEarn = 0;
        if (!c.filledAt) c.filledAt = c.time || '';
      } else if (c.status === '未回填' || c.status === '待回填') {
        if (c.fillVideo == null) c.fillVideo = '';
        if (c.pendingEarn == null) c.pendingEarn = mockPendingEarn(data, c);
      } else {
        if (c.fillVideo == null) c.fillVideo = '';
        if (c.pendingEarn == null) c.pendingEarn = 0;
      }
    });
    normalizeKeywordsMap(data);
    sweepOss(data);
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
    if (!w || isOffsite(w) || isFileDeleted(w)) return false;
    if (w.uploadStatus && w.uploadStatus !== '已上传') return false;
    if ((w.audit || '已通过') !== '已通过') return false;
    if (w.occ === '占用中' || w.occ === '已完成' || w.occupied) return false;
    var p = projectByName(data, w.project);
    var e = editorByName(data, w.editor);
    var m = (data.mats || []).find(function (x) { return x.name === w.mat; });
    return !!(p && p.status === '启用' && e && e.status === '已录入' && editorHasPlatform(e, '右豹') && m && m.status === '启用');
  }

  function worksByChannel(data, channel, editorName) {
    return (data.works || []).filter(function (w) {
      if (workChannel(w) !== channel) return false;
      if (editorName && w.editor !== editorName) return false;
      return true;
    });
  }

  function worksByEditor(data, editorName) {
    return (data.works || []).filter(function (w) { return w.editor === editorName; });
  }

  function claimedWorksByEditor(data, editorName) {
    return worksByEditor(data, editorName).filter(function (w) {
      if (isOffsite(w)) return false;
      return w.occ === '占用中' || w.occ === '已完成' ||
        (data.claims || []).some(function (c) { return c.mid === w.id && c.status !== '已超时'; });
    });
  }

  function parseSizeToMB(size) {
    var raw = String(size || '').replace(/,/g, '').trim();
    var m = raw.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)?$/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    if (!isFinite(n)) return 0;
    var u = (m[2] || 'MB').toUpperCase();
    if (u === 'B') return n / 1048576;
    if (u === 'KB') return n / 1024;
    if (u === 'GB') return n * 1024;
    if (u === 'TB') return n * 1048576;
    return n;
  }

  function formatSizeMB(mb) {
    if (!mb) return '0.0 MB';
    if (mb >= 1024) return (Math.round(mb / 102.4) / 10).toFixed(1) + ' GB';
    return (Math.round(mb * 10) / 10).toFixed(1) + ' MB';
  }

  function worksSizeMBByEditor(data, editorName) {
    return worksByEditor(data, editorName).reduce(function (n, w) {
      return n + parseSizeToMB(w.size);
    }, 0);
  }

  function worksSizeByEditor(data, editorName) {
    return formatSizeMB(worksSizeMBByEditor(data, editorName));
  }

  function earnByEditor(data, editorName) {
    return worksByEditor(data, editorName).reduce(function (n, w) {
      return n + (w.occ === '已完成' ? (Number(w.earn) || 0) : 0);
    }, 0);
  }

  function pendingEarnByEditor(data, editorName) {
    return (data.claims || []).reduce(function (n, c) {
      if (c.editor !== editorName) return n;
      if (c.status !== '未回填' && c.status !== '待回填') return n;
      return n + (Number(c.pendingEarn) || 0);
    }, 0);
  }

  function settlementTime(s) {
    if (!s) return 0;
    if (typeof s.settledAt === 'number') return s.settledAt;
    var raw = String(s.settledAt || '').trim();
    var t = Date.parse(raw.replace(/-/g, '/'));
    return isNaN(t) ? 0 : t;
  }

  function settlementDateKey(s, grain) {
    var d = new Date(settlementTime(s));
    if (isNaN(d.getTime())) return '';
    if (grain === 'month') return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function listSettlements(data, editorName, opts) {
    opts = opts || {};
    var from = opts.from ? Date.parse(String(opts.from).replace(/-/g, '/') + ' 00:00:00') : 0;
    var to = opts.to ? Date.parse(String(opts.to).replace(/-/g, '/') + ' 23:59:59') : 0;
    return (data.settlements || []).filter(function (s) {
      if (editorName && s.editor !== editorName) return false;
      if (opts.channel && (s.channel || '右豹') !== opts.channel) return false;
      var t = settlementTime(s);
      if (opts.from && (!from || t < from)) return false;
      if (opts.to && (!to || t > to)) return false;
      return true;
    });
  }

  function earnSeries(data, editorName, grain, opts) {
    grain = grain === 'month' ? 'month' : 'day';
    var buckets = {};
    listSettlements(data, editorName, opts).forEach(function (s) {
      var key = settlementDateKey(s, grain);
      if (!key) return;
      if (!buckets[key]) buckets[key] = { label: key, amount: 0, count: 0 };
      buckets[key].amount += Number(s.amount) || 0;
      buckets[key].count += 1;
    });
    return Object.keys(buckets).sort().reverse().map(function (k) { return buckets[k]; });
  }

  function claimForSettlement(data, s) {
    if (!s) return null;
    if (s.claimId) {
      var hit = (data.claims || []).find(function (c) { return c.id === s.claimId; });
      if (hit) return hit;
    }
    var list = (data.claims || []).filter(function (c) {
      return c.mid === s.mid && (!s.editor || c.editor === s.editor);
    });
    if (!list.length) return null;
    var t = settlementTime(s);
    list.sort(function (a, b) {
      return Math.abs((a.claimedAt || 0) - t) - Math.abs((b.claimedAt || 0) - t);
    });
    return list[0];
  }

  function decorateSettlement(data, s) {
    var w = workById(data, s.mid) || {};
    var c = claimForSettlement(data, s) || {};
    return {
      date: settlementDateKey(s, 'day'),
      mid: s.mid,
      project: s.project || w.project || c.project || '—',
      book: s.book || w.book || c.book || '—',
      bookId: s.bookId || w.bookId || c.bookId || '—',
      kw: s.kw || c.kw || '—',
      user: s.user || c.user || '—',
      amount: Number(s.amount) || 0,
      channel: s.channel || '右豹'
    };
  }

  function earnDetails(data, editorName, periodKey, grain, opts) {
    grain = grain === 'month' ? 'month' : 'day';
    return listSettlements(data, editorName, opts).filter(function (s) {
      return !periodKey || settlementDateKey(s, grain) === periodKey;
    }).sort(function (a, b) {
      return settlementTime(b) - settlementTime(a);
    }).map(function (s) {
      return decorateSettlement(data, s);
    });
  }

  function earnDailyByProject(data, editorName, opts) {
    opts = opts || {};
    var withBook = !!opts.withBook;
    var buckets = {};
    listSettlements(data, editorName, opts).forEach(function (s) {
      var row = decorateSettlement(data, s);
      if (!row.date) return;
      var key = withBook ? (row.date + '\t' + row.project + '\t' + row.bookId) : (row.date + '\t' + row.project);
      if (!buckets[key]) buckets[key] = { date: row.date, project: row.project, book: row.book, bookId: row.bookId, amount: 0 };
      buckets[key].amount += row.amount;
    });
    return Object.keys(buckets).sort().reverse().map(function (k) { return buckets[k]; });
  }

  function sumAmount(list) {
    return (list || []).reduce(function (n, x) { return n + (Number(x.amount) || 0); }, 0);
  }

  function onsiteEarnByEditor(data, editorName) {
    return sumAmount(listSettlements(data, editorName, { channel: '右豹' }));
  }

  function listOffsiteEarns(data, editorName, opts) {
    opts = opts || {};
    var from = opts.from ? Date.parse(String(opts.from).replace(/-/g, '/') + ' 00:00:00') : 0;
    var to = opts.to ? Date.parse(String(opts.to).replace(/-/g, '/') + ' 23:59:59') : 0;
    var ed = editorName ? editorByName(data, editorName) : null;
    return (data.offsiteEarns || []).filter(function (s) {
      if (editorName && s.editor !== editorName && (!ed || s.ybId !== ed.ybId)) return false;
      var t = settlementTime(s);
      if (opts.from && (!from || t < from)) return false;
      if (opts.to && (!to || t > to)) return false;
      return true;
    });
  }

  function decorateOffsiteEarn(data, s) {
    var w = workById(data, s.mid) || {};
    var ed = editorByName(data, s.editor) || {};
    return {
      date: settlementDateKey(s, 'day'),
      mid: s.mid,
      ybId: s.ybId || ed.ybId || '—',
      project: s.project || w.project || '—',
      book: s.book || w.book || '—',
      bookId: s.bookId || w.bookId || '—',
      kw: s.kw || '—',
      amount: Number(s.amount) || 0
    };
  }

  function offsiteEarnByEditor(data, editorName) {
    return sumAmount(listOffsiteEarns(data, editorName));
  }

  function offsiteEarnDetails(data, editorName, opts) {
    return listOffsiteEarns(data, editorName, opts).sort(function (a, b) {
      return settlementTime(b) - settlementTime(a);
    }).map(function (s) {
      return decorateOffsiteEarn(data, s);
    });
  }

  function offsiteEarnDaily(data, editorName, opts) {
    var buckets = {};
    listOffsiteEarns(data, editorName, opts).forEach(function (s) {
      var row = decorateOffsiteEarn(data, s);
      if (!row.date) return;
      var key = row.date + '\t' + row.project + '\t' + row.bookId;
      if (!buckets[key]) buckets[key] = { date: row.date, project: row.project, book: row.book, bookId: row.bookId, amount: 0 };
      buckets[key].amount += row.amount;
    });
    return Object.keys(buckets).sort().reverse().map(function (k) { return buckets[k]; });
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

  function editorNeedsReview(editor) {
    return !editor || editor.needReview !== false;
  }

  function workAuditAfterUpload(editor) {
    return editorNeedsReview(editor) ? '审核中' : '已通过';
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
    albumPreview: albumPreview,
    plazaEligible: plazaEligible,
    worksByEditor: worksByEditor,
    claimedWorksByEditor: claimedWorksByEditor,
    worksSizeByEditor: worksSizeByEditor,
    worksSizeMBByEditor: worksSizeMBByEditor,
    parseSizeToMB: parseSizeToMB,
    formatSizeMB: formatSizeMB,
    earnByEditor: earnByEditor,
    onsiteEarnByEditor: onsiteEarnByEditor,
    offsiteEarnByEditor: offsiteEarnByEditor,
    offsiteEarnDetails: offsiteEarnDetails,
    offsiteEarnDaily: offsiteEarnDaily,
    pendingEarnByEditor: pendingEarnByEditor,
    earnSeries: earnSeries,
    earnDetails: earnDetails,
    earnDailyByProject: earnDailyByProject,
    listSettlements: listSettlements,
    workQty: workQty,
    workInfoLabel: workInfoLabel,
    offsiteWork: offsiteWork,
    offsiteSharePath: offsiteSharePath,
    offsiteInfoLabel: offsiteInfoLabel,
    offsiteStatus: offsiteStatus,
    offsiteAssetCount: offsiteAssetCount,
    offsiteClaimedCount: offsiteClaimedCount,
    offsiteRemaining: offsiteRemaining,
    offsiteExhausted: offsiteExhausted,
    claimOffsiteAsset: claimOffsiteAsset,
    PLATFORM_OPTS: PLATFORM_OPTS,
    editorPlatforms: editorPlatforms,
    editorHasPlatform: editorHasPlatform,
    platformsLabel: platformsLabel,
    workChannel: workChannel,
    isOffsite: isOffsite,
    worksByChannel: worksByChannel,
    LOGO_OPTS: LOGO_OPTS,
    BRAND_CATALOG: BRAND_CATALOG,
    projectByName: projectByName,
    editorByName: editorByName,
    workById: workById,
    tipText: tipText,
    tipPrompt: tipPrompt,
    makeTip: makeTip,
    editorNeedsReview: editorNeedsReview,
    workAuditAfterUpload: workAuditAfterUpload,
    onSaleCount: onSaleCount,
    admClaimSt: admClaimSt,
    feClaimSt: feClaimSt,
    CLIENT_DL_MS: CLIENT_DL_MS,
    OSS_TTL_MS: OSS_TTL_MS,
    UNCLAIMED_TTL_MS: UNCLAIMED_TTL_MS,
    ossObjectKey: ossObjectKey,
    clientExpireAt: clientExpireAt,
    ossExpireAtFrom: ossExpireAtFrom,
    ossAlive: ossAlive,
    ossStatusLabel: ossStatusLabel,
    isFileDeleted: isFileDeleted,
    fileStatusOf: fileStatusOf,
    hasBeenClaimed: hasBeenClaimed,
    markFileDeleted: markFileDeleted,
    canSoftDelete: canSoftDelete,
    softDeleteWork: softDeleteWork,
    bindClaimOss: bindClaimOss,
    sweepOss: sweepOss,
    restoreClientDownload: restoreClientDownload,
    downloadBlockReason: downloadBlockReason,
    CLAIMABLE_KW_STATUS: CLAIMABLE_KW_STATUS,
    claimableKeywords: claimableKeywords,
    isClaimableKeyword: isClaimableKeyword,
    keywordBookConflict: keywordBookConflict,
    latestClaimForWork: latestClaimForWork,
    dayType: dayType,
    todayFree: todayFree,
    applyFreeDay: applyFreeDay
  };
})(window);
