(function () {
  'use strict';

  function injectStyles() {
    if (document.getElementById('fe-copy-html-styles')) return;
    var style = document.createElement('style');
    style.id = 'fe-copy-html-styles';
    style.textContent = [
      '.fe-scene-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap;}',
      '.fe-scene-head h2{margin-bottom:0;}',
      '.fe-copy-html-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;font-size:12px;font-weight:500;',
      'border:1px solid var(--border,#e8edf3);border-radius:7px;background:var(--surface,#fff);color:var(--text-secondary,#4a5568);',
      'cursor:pointer;transition:all .18s ease;flex-shrink:0;font-family:inherit;}',
      '.fe-copy-html-btn:hover{background:var(--surface-hover,#f8fafc);color:var(--text-primary,#18222f);border-color:var(--primary-border,#bfdbfe);}',
      '.fe-copy-html-btn:disabled{opacity:.55;cursor:wait;}',
      '.fe-copy-html-btn.is-copied{color:var(--success,#16a34a);border-color:#bbf7d0;background:#f0fdf4;}'
    ].join('');
    document.head.appendChild(style);
  }

  function notify(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    alert(msg);
  }

  function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function getDemoPath(frame) {
    var dataSrc = frame.getAttribute('data-src');
    if (dataSrc) return dataSrc.split('?')[0];
    var src = frame.getAttribute('src') || '';
    if (!src || src === 'about:blank') return null;
    return src.split('?')[0];
  }

  function readFromIframe(frame) {
    try {
      var doc = frame.contentDocument;
      if (doc && doc.documentElement) {
        return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      }
    } catch (_) {}
    return null;
  }

  function fetchDemoHtml(path) {
    return fetch(path).then(function (resp) {
      if (!resp.ok) throw new Error('fetch failed');
      return resp.text();
    });
  }

  function getFeHtmlSource(frame) {
    var path = getDemoPath(frame);
    if (path) {
      return fetchDemoHtml(path).catch(function () {
        return readFromIframe(frame);
      });
    }
    return Promise.resolve(readFromIframe(frame));
  }

  function copyFeHtml(btn) {
    var frame = document.getElementById('mockupFrame');
    if (!frame) {
      notify('未找到 Mockup 预览');
      return;
    }
    btn.disabled = true;
    getFeHtmlSource(frame)
      .then(function (html) {
        if (!html) throw new Error('empty');
        return writeClipboard(html);
      })
      .then(function () {
        btn.classList.add('is-copied');
        var label = btn.textContent;
        btn.textContent = '已复制';
        notify('已复制 HTML 代码');
        setTimeout(function () {
          btn.classList.remove('is-copied');
          btn.textContent = label;
        }, 1800);
      })
      .catch(function () {
        notify('复制失败，请确认 Mockup 已加载或通过本地服务访问');
      })
      .finally(function () {
        btn.disabled = false;
      });
  }

  function init() {
    var viewFe = document.getElementById('view-fe');
    var frame = document.getElementById('mockupFrame');
    var scenePanel = viewFe && viewFe.querySelector('.scene-panel');
    if (!scenePanel || !frame || scenePanel.querySelector('.fe-copy-html-btn')) return;

    injectStyles();

    var h2 = scenePanel.querySelector('h2');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fe-copy-html-btn';
    btn.textContent = '复制 HTML 代码';
    btn.addEventListener('click', function () {
      copyFeHtml(btn);
    });

    if (h2) {
      var headRow = document.createElement('div');
      headRow.className = 'fe-scene-head';
      h2.parentNode.insertBefore(headRow, h2);
      headRow.appendChild(h2);
      headRow.appendChild(btn);
    } else {
      scenePanel.insertBefore(btn, scenePanel.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
