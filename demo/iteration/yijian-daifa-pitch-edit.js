(function () {
  var KEY = document.documentElement.getAttribute('data-pitch-store');
  var sheet = document.querySelector('.sheet') || document.querySelector('.doc');
  var editBtn = document.getElementById('pitchEdit');
  var resetBtn = document.getElementById('pitchReset');
  var copyBtn = document.getElementById('pitchCopy');
  if (/[?&]embed=1/.test(location.search)) document.documentElement.classList.add('embed');
  if (!sheet) return;

  var ORIG = sheet.innerHTML;
  var editing = false;

  function loadSaved() {
    try {
      ['fr014-pitch-brief-v2', 'fr014-pitch-brief-v3', 'fr014-pitch-brief-v4', 'fr014-pitch-brief-v5'].forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (_) {}
    if (!KEY) return;
    try {
      var saved = localStorage.getItem(KEY);
      if (!saved) return;
      if (KEY.indexOf('fr014-pitch-brief-') === 0 && saved.indexOf('flow-svg-wrap') === -1) {
        localStorage.removeItem(KEY);
        return;
      }
      sheet.innerHTML = saved;
    } catch (_) {}
  }

  function persist() {
    if (!KEY) return;
    try {
      localStorage.setItem(KEY, sheet.innerHTML);
    } catch (_) {}
  }

  function setEditing(on) {
    if (!editBtn) return;
    editing = !!on;
    sheet.contentEditable = editing ? 'true' : 'false';
    sheet.classList.toggle('is-editing', editing);
    sheet.spellcheck = editing;
    sheet.querySelectorAll('.no-edit').forEach(function (el) {
      el.contentEditable = 'false';
    });
    editBtn.textContent = editing ? '完成' : '编辑';
    editBtn.setAttribute('aria-pressed', editing ? 'true' : 'false');
    if (!editing) persist();
  }

  function inlineMd(el) {
    var s = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) {
        s += n.nodeValue;
      } else if (n.nodeType === 1) {
        var t = n.tagName;
        if (t === 'STRONG' || t === 'B') s += '**' + inlineMd(n) + '**';
        else if (t === 'EM' || t === 'I') s += '*' + inlineMd(n) + '*';
        else if (t === 'BR') s += '  \n';
        else if (t === 'CODE') s += '`' + (n.textContent || '') + '`';
        else s += inlineMd(n);
      }
    }
    return s.replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').trim();
  }

  function childTags(el, tag) {
    var out = [];
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].tagName === tag) out.push(el.children[i]);
    }
    return out;
  }

  function toMarkdown(root) {
    var parts = [];
    function push(s) {
      if (s) parts.push(s);
    }
    for (var i = 0; i < root.children.length; i++) {
      var n = root.children[i];
      var tag = n.tagName;
      if (tag === 'H1') push('# ' + inlineMd(n));
      else if (tag === 'H2') push('## ' + inlineMd(n));
      else if (tag === 'H3') push('### ' + inlineMd(n));
      else if (tag === 'P') {
        var body = inlineMd(n);
        if (n.classList.contains('meta') || n.classList.contains('sub') || n.classList.contains('note')) {
          push('*' + body + '*');
        } else {
          push(body);
        }
      } else if (tag === 'UL') {
        push(childTags(n, 'LI').map(function (li) {
          return '- ' + inlineMd(li);
        }).join('\n'));
      } else if (tag === 'OL') {
        push(childTags(n, 'LI').map(function (li, idx) {
          return (idx + 1) + '. ' + inlineMd(li);
        }).join('\n'));
      } else if (tag === 'TABLE') {
        var rows = [];
        var trs = n.querySelectorAll('tr');
        for (var r = 0; r < trs.length; r++) {
          var cells = [];
          var cs = trs[r].querySelectorAll('th,td');
          for (var c = 0; c < cs.length; c++) cells.push(inlineMd(cs[c]).replace(/\|/g, '\\|'));
          rows.push('| ' + cells.join(' | ') + ' |');
        }
        if (rows.length) {
          var nCol = trs[0].querySelectorAll('th,td').length;
          rows.splice(1, 0, '| ' + Array(nCol).fill('---').join(' | ') + ' |');
          push(rows.join('\n'));
        }
      } else if (n.classList.contains('callout') || n.classList.contains('redline')) {
        push('> ' + inlineMd(n));
      } else if (n.classList.contains('flow-chart')) {
        var cap = n.querySelector('figcaption');
        var mdEl = n.querySelector('.flow-md');
        var copy = mdEl ? String(mdEl.textContent || '').replace(/^\s+|\s+$/g, '') : (n.getAttribute('data-copy') || '').trim();
        var fence = copy.indexOf('flowchart') === 0 || copy.indexOf('graph ') === 0 ? 'mermaid' : 'text';
        var block = [];
        if (cap) block.push('**' + inlineMd(cap) + '**');
        block.push('```' + fence);
        block.push(copy);
        block.push('```');
        push(block.join('\n'));
      }
    }
    return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  function docText() {
    return toMarkdown(sheet);
  }

  function copied() {
    if (!copyBtn) return;
    var old = copyBtn.textContent;
    copyBtn.textContent = '已复制 Markdown';
    setTimeout(function () { copyBtn.textContent = old; }, 1800);
  }

  function copyAll() {
    if (editing) persist();
    var text = docText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copied).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); copied(); } catch (_) {}
      ta.remove();
    }
  }

  loadSaved();

  if (editBtn) {
    editBtn.addEventListener('click', function () {
      setEditing(!editing);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!confirm('还原为初始文案？本机改过的字会清掉。')) return;
      try { if (KEY) localStorage.removeItem(KEY); } catch (_) {}
      sheet.innerHTML = ORIG;
      setEditing(false);
    });
  }
  if (copyBtn) copyBtn.addEventListener('click', copyAll);
  sheet.addEventListener('blur', function () {
    if (editing) persist();
  }, true);
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (editing) persist();
      setEditing(false);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection().toString()) {
      /* keep native copy when user selected text */
    }
  });
})();
