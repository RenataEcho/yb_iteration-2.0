/* PC 剪辑供稿 · 操作说明：拉取同目录 Markdown 并渲染 */
(function (global) {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function slug(s) {
    return String(s).replace(/[^\u4e00-\u9fff\w]+/g, '-').replace(/^-|-$/g, '') || 'sec';
  }
  function isSep(line) {
    return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  }
  function splitRow(line) {
    var t = line.trim();
    if (t.charAt(0) === '|') t = t.slice(1);
    if (t.charAt(t.length - 1) === '|') t = t.slice(0, -1);
    return t.split('|').map(function (c) { return c.trim(); });
  }
  function renderMarkdown(md) {
    var lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var toc = [];
    var i = 0;
    var inCode = false;
    var code = [];
    var table = [];
    function flushTable() {
      if (!table.length) return;
      var rows = table.filter(function (r) { return !isSep(r); }).map(splitRow);
      table = [];
      if (!rows.length) return;
      var head = rows[0];
      var body = rows.slice(1);
      html.push('<div class="table-scroll"><table><thead><tr>' +
        head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        body.map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
        }).join('') +
        '</tbody></table></div>');
    }
    function flushCode() {
      html.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      code = [];
      inCode = false;
    }
    while (i < lines.length) {
      var line = lines[i];
      if (line.indexOf('```') === 0) {
        flushTable();
        if (inCode) flushCode();
        else { inCode = true; code = []; }
        i += 1;
        continue;
      }
      if (inCode) { code.push(line); i += 1; continue; }
      if (line.indexOf('|') !== -1 && (line.trim().charAt(0) === '|' || /\|/.test(line))) {
        table.push(line);
        i += 1;
        continue;
      }
      flushTable();
      if (/^\s*$/.test(line) || /^---+\s*$/.test(line)) { i += 1; continue; }
      var m = /^(#{1,3})\s+(.+)$/.exec(line);
      if (m) {
        var lv = m[1].length;
        var title = m[2].trim();
        var id = 'g-' + slug(title);
        if (lv <= 2) toc.push({ id: id, title: title.replace(/^\d+\.\s*/, '') });
        html.push('<h' + lv + ' id="' + id + '">' + inline(title) + '</h' + lv + '>');
        i += 1;
        continue;
      }
      if (line.indexOf('> ') === 0) {
        var qs = [];
        while (i < lines.length && lines[i].indexOf('> ') === 0) {
          qs.push(lines[i].replace(/^>\s?/, ''));
          i += 1;
        }
        html.push('<blockquote>' + qs.map(inline).join('<br />') + '</blockquote>');
        continue;
      }
      if (/^\d+\.\s/.test(line) || /^[-*]\s/.test(line)) {
        var ordered = /^\d+\.\s/.test(line);
        var items = [];
        while (i < lines.length && (ordered ? /^\d+\.\s/.test(lines[i]) : /^[-*]\s/.test(lines[i]))) {
          items.push(lines[i].replace(/^\d+\.\s|^[-*]\s/, ''));
          i += 1;
        }
        html.push((ordered ? '<ol>' : '<ul>') +
          items.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') +
          (ordered ? '</ol>' : '</ul>'));
        continue;
      }
      html.push('<p>' + inline(line) + '</p>');
      i += 1;
    }
    flushTable();
    if (inCode) flushCode();
    var nav = toc.length
      ? '<div class="guide-toc">' + toc.map(function (t) {
          return '<a href="#' + t.id + '">' + esc(t.title) + '</a>';
        }).join('') + '</div>'
      : '';
    return nav + '<div class="guide-article">' + html.join('') + '</div>';
  }

  var FALLBACK = '<div class="guide-article"><h2>操作说明暂时载入失败</h2>' +
    '<p>请刷新后再试。最短路径：创作者中心 → 剪辑供稿 → 上传稿件 → 填项目与书 → 选文件夹或压缩包 → 确认表 → 开始上传。</p></div>';

  function mount(el) {
    if (!el) return Promise.resolve();
    if (el.getAttribute('data-ok') === '1') return Promise.resolve();
    el.innerHTML = '<p class="desc">正在载入操作说明…</p>';
    return fetch('yijian-daifa-pc-guide.md').then(function (r) {
      if (!r.ok) throw new Error('guide');
      return r.text();
    }).then(function (md) {
      el.innerHTML = renderMarkdown(md);
      el.setAttribute('data-ok', '1');
    }).catch(function () {
      el.innerHTML = FALLBACK;
      el.setAttribute('data-ok', '0');
    });
  }

  global.YJD_GUIDE = { renderMarkdown: renderMarkdown, mount: mount };
})(window);
