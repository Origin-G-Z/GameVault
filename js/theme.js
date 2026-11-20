// js/theme.js
// 主题色切换：把用户选择的主色写入 CSS 变量，并持久化到 localStorage
// 两个页面都会加载，刷新和跳转后保持一致

(function () {
  'use strict';

  var STORAGE_KEY = 'gv_theme';

  // 可选主题：name 用于提示，accent 是主色，soft 是柔和色，
  // aux 是首屏极光的第二配色（让光晕层次更丰富）
  var THEMES = [
    { id: 'indigo',  name: '靛蓝', accent: '#6366f1', soft: '#818cf8', aux: '#8b5cf6' },
    { id: 'emerald', name: '翡翠', accent: '#10b981', soft: '#34d399', aux: '#06b6d4' },
    { id: 'amber',   name: '琥珀', accent: '#f59e0b', soft: '#fbbf24', aux: '#f97316' },
    { id: 'rose',    name: '玫红', accent: '#f43f5e', soft: '#fb7185', aux: '#ec4899' },
    { id: 'ocean',   name: '海蓝', accent: '#0ea5e9', soft: '#38bdf8', aux: '#6366f1' }
  ];

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ].join(', ');
  }

  // 把主题应用到根元素
  function applyTheme(id) {
    var t = THEMES.filter(function (x) { return x.id === id; })[0] || THEMES[0];
    var root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', t.soft);
    root.style.setProperty('--accent-rgb', hexToRgb(t.accent));
    root.style.setProperty('--accent-aux', t.aux);
    root.style.setProperty('--accent-aux-rgb', hexToRgb(t.aux));
    root.setAttribute('data-theme', t.id);
    return t;
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'indigo';
    } catch (e) {
      return 'indigo';
    }
  }

  function saveTheme(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      /* 隐私模式下可能不可写，忽略 */
    }
  }

  // 页面加载前就先应用，避免默认靛蓝闪一下
  applyTheme(getSavedTheme());

  // 渲染主题选择器（放在 header 里）
  function renderThemePicker() {
    var host = document.getElementById('theme-picker');
    if (!host) return;

    var current = getSavedTheme();
    var currentTheme = THEMES.filter(function (t) { return t.id === current; })[0] || THEMES[0];

    // 左侧文字标签 + 当前主题名，让用户一眼知道这排色点是干什么的
    var label = '<span class="theme-label">主题</span>' +
                '<span class="theme-current" id="theme-current">' + currentTheme.name + '</span>';

    var dots = THEMES.map(function (t) {
      return '<button class="theme-dot' + (t.id === current ? ' active' : '') + '" ' +
             'data-theme-id="' + t.id + '" ' +
             'title="' + t.name + '" ' +
             'aria-label="切换到' + t.name + '主题" ' +
             'aria-pressed="' + (t.id === current) + '" ' +
             'style="--dot-color: ' + t.accent + '">' +
             '<span class="theme-dot-tip">' + t.name + '</span>' +
             '</button>';
    }).join('');

    host.innerHTML = label + '<span class="theme-dots">' + dots + '</span>';

    host.addEventListener('click', function (e) {
      var dot = e.target.closest('.theme-dot');
      if (!dot) return;
      var id = dot.getAttribute('data-theme-id');
      var t = applyTheme(id);
      saveTheme(id);

      host.querySelectorAll('.theme-dot').forEach(function (d) {
        var on = d === dot;
        d.classList.toggle('active', on);
        d.setAttribute('aria-pressed', String(on));
      });

      // 同步更新右侧显示的当前主题名
      var cur = document.getElementById('theme-current');
      if (cur) {
        cur.textContent = t.name;
        cur.classList.add('pulse');
        setTimeout(function () { cur.classList.remove('pulse'); }, 400);
      }
    });
  }

  // 暴露给外部（详情页目录高亮等可能需要读取当前主题）
  window.GV_THEME = {
    get: getSavedTheme,
    apply: applyTheme,
    list: THEMES
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderThemePicker);
  } else {
    renderThemePicker();
  }
})();
