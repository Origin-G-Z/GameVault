// js/theme.js
// 主题色切换：把用户选择的主色写入 CSS 变量，并持久化到 localStorage
// 两个页面都会加载，刷新和跳转后保持一致

(function () {
  'use strict';

  var STORAGE_KEY = 'gv_theme';

  // 可选主题：name 用于提示，accent 是主色，soft 是卡片光晕用的柔和色
  var THEMES = [
    { id: 'indigo',  name: '靛蓝', accent: '#6366f1', soft: '#818cf8' },
    { id: 'emerald', name: '翡翠', accent: '#10b981', soft: '#34d399' },
    { id: 'amber',   name: '琥珀', accent: '#f59e0b', soft: '#fbbf24' },
    { id: 'rose',    name: '玫红', accent: '#f43f5e', soft: '#fb7185' },
    { id: 'ocean',   name: '海蓝', accent: '#0ea5e9', soft: '#38bdf8' }
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

    host.innerHTML = THEMES.map(function (t) {
      return '<button class="theme-dot' + (t.id === current ? ' active' : '') + '" ' +
             'data-theme-id="' + t.id + '" ' +
             'title="' + t.name + '" ' +
             'aria-label="切换到' + t.name + '主题" ' +
             'style="--dot-color: ' + t.accent + '"></button>';
    }).join('');

    host.addEventListener('click', function (e) {
      var dot = e.target.closest('.theme-dot');
      if (!dot) return;
      var id = dot.getAttribute('data-theme-id');
      applyTheme(id);
      saveTheme(id);
      host.querySelectorAll('.theme-dot').forEach(function (d) {
        d.classList.toggle('active', d === dot);
      });
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
