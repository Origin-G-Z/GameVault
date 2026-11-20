// js/index.js
// 注意：因为你之前改成了全局变量，所以这里不需要 import 了

const appEl = document.getElementById('app');

// ================= 状态管理 =================
let favorites = JSON.parse(localStorage.getItem('gv_favorites'));
if (!favorites) {
  favorites = GAMES.filter(g => g.isFavorite).map(g => g.id);
  localStorage.setItem('gv_favorites', JSON.stringify(favorites));
}

let activeTab = 'all';
let activePlatform = '全部';
let activeGenre = '全部';
let searchQuery = '';
let activeSort = 'default';   // default | hours | rating | title

// ================= URL 状态同步 =================
// 把筛选条件写进地址栏：刷新不丢、可分享、浏览器前进后退可用
function readUrlState() {
  const p = new URLSearchParams(window.location.search);
  searchQuery = p.get('q') || '';
  activePlatform = p.get('platform') || '全部';
  activeGenre = p.get('genre') || '全部';
  activeTab = p.get('tab') === 'fav' ? 'fav' : 'all';
  const sort = p.get('sort');
  activeSort = ['hours', 'rating', 'title'].indexOf(sort) > -1 ? sort : 'default';
}

function syncUrlState() {
  const p = new URLSearchParams();
  if (searchQuery) p.set('q', searchQuery);
  if (activePlatform !== '全部') p.set('platform', activePlatform);
  if (activeGenre !== '全部') p.set('genre', activeGenre);
  if (activeTab === 'fav') p.set('tab', 'fav');
  if (activeSort !== 'default') p.set('sort', activeSort);

  const qs = p.toString();
  try {
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  } catch (e) {
    /* 个别环境（如某些 file:// 策略）不允许改写地址，忽略即可 */
  }
}

// ================= 通用小工具 =================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// 把搜索命中的部分包成 <mark>，让用户一眼看到为什么被搜出来
function highlightMatch(text, query) {
  const safeText = escapeHtml(text);
  if (!query) return safeText;

  const haystack = String(text).toLowerCase();
  const needle = String(query).toLowerCase();
  let out = '';
  let from = 0;

  while (true) {
    const pos = haystack.indexOf(needle, from);
    if (pos === -1) {
      out += escapeHtml(String(text).slice(from));
      break;
    }
    out += escapeHtml(String(text).slice(from, pos));
    out += '<mark class="hl">' + escapeHtml(String(text).slice(pos, pos + needle.length)) + '</mark>';
    from = pos + needle.length;
  }
  return out;
}

// 排序：默认保留 registry 里的收录顺序
function sortGames(list) {
  const arr = list.slice();
  if (activeSort === 'hours') {
    arr.sort(function (a, b) { return (Number(b.hours) || 0) - (Number(a.hours) || 0); });
  } else if (activeSort === 'rating') {
    arr.sort(function (a, b) { return (Number(b.rating) || 0) - (Number(a.rating) || 0); });
  } else if (activeSort === 'title') {
    arr.sort(function (a, b) { return a.title.localeCompare(b.title, 'zh'); });
  }
  return arr;
}

// ================= 最近浏览 =================
const RECENT_KEY = 'gv_recent';
const RECENT_MAX = 5;

function getRecentIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function renderRecentStrip() {
  const ids = getRecentIds().filter(function (id) {
    return GAMES.some(function (g) { return g.id === id; });
  });
  if (!ids.length) return '';

  const items = ids.map(function (id) {
    const g = GAMES.filter(function (x) { return x.id === id; })[0];
    return `
      <a class="recent-item" href="./pages/detail.html?id=${g.id}" title="${escapeHtml(g.title)}">
        <img src="${g.cover}" alt="${escapeHtml(g.title)}" loading="lazy">
        <span class="recent-name">${escapeHtml(g.title)}</span>
      </a>`;
  }).join('');

  return `
    <section class="recent-strip" aria-label="最近浏览">
      <div class="recent-head">
        <span class="recent-title">最近看过</span>
        <span class="recent-hint">共 ${ids.length} 款</span>
      </div>
      <div class="recent-list">${items}</div>
    </section>`;
}

// 累计游玩时长：由 registry.js 中每款游戏的 hours 字段实时求和，无需手动维护
// 整数时不显示小数位（2077 而不是 2077.0），有小数时保留一位
const totalHoursRaw = GAMES.reduce((sum, g) => sum + (Number(g.hours) || 0), 0);
const totalHours = Number.isInteger(totalHoursRaw)
  ? String(totalHoursRaw)
  : totalHoursRaw.toFixed(1);

// ================= 渲染逻辑 =================
// 排序选项：自定义下拉用，顺序即菜单顺序
const SORT_OPTIONS = [
  { v: 'default', t: '默认排序' },
  { v: 'hours', t: '按时长' },
  { v: 'rating', t: '按评分' },
  { v: 'title', t: '按名称' }
];

function getSortLabel(value) {
  const hit = SORT_OPTIONS.filter(function (o) { return o.v === value; })[0];
  return hit ? hit.t : SORT_OPTIONS[0].t;
}

function renderHeaderControls() {
  // 自定义下拉：原生 <select> 的弹层由系统绘制，无法美化
  const sortMenu = SORT_OPTIONS.map(function (o) {
    const on = activeSort === o.v;
    return `<li role="option" class="sort-option" data-value="${o.v}" aria-selected="${on}">
        <span>${o.t}</span>
        <svg class="sort-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m5 13 4 4L19 7"/>
        </svg>
      </li>`;
  }).join('');

  return `
    <div class="control-panel">
      <div class="tabs">
        <button class="tab-btn ${activeTab === 'all' ? 'active' : ''}" data-tab="all">
          全部游戏 <span class="count">${GAMES.length}</span>
        </button>
        <button class="tab-btn ${activeTab === 'fav' ? 'active' : ''}" data-tab="fav">
          ❤️ 我喜欢的 <span class="count" id="fav-count">${favorites.length}</span>
        </button>
      </div>

      <div class="control-right">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="text" id="search-input" placeholder="搜索游戏名称..." value="${escapeHtml(searchQuery)}" title="按 / 快速聚焦">
          <kbd class="search-kbd" aria-hidden="true">/</kbd>
        </div>

        <div class="sort-box" id="sort-box">
          <button type="button" class="sort-trigger" id="sort-trigger"
                  aria-haspopup="listbox" aria-expanded="false" aria-controls="sort-menu" aria-label="排序方式">
            <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/>
            </svg>
            <span class="sort-label">${getSortLabel(activeSort)}</span>
            <svg class="sort-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          <ul class="sort-menu" id="sort-menu" role="listbox" aria-label="排序方式" hidden>${sortMenu}</ul>
        </div>
      </div>
    </div>
  `;
}

// 已选条件标签：点单个 ✕ 取消该条件，也可一键清除
function renderActiveChips() {
  const chips = [];
  if (searchQuery) chips.push({ k: 'q', label: '关键词：' + searchQuery });
  if (activeTab === 'fav') chips.push({ k: 'tab', label: '我喜欢的' });
  if (activePlatform !== '全部') chips.push({ k: 'platform', label: '平台：' + activePlatform });
  if (activeGenre !== '全部') chips.push({ k: 'genre', label: '类型：' + activeGenre });

  if (!chips.length) return '';

  const items = chips.map(function (c) {
    return `<button class="active-chip" data-clear="${c.k}" title="取消该条件">
      ${escapeHtml(c.label)}<span class="chip-x" aria-hidden="true">✕</span>
    </button>`;
  }).join('');

  return `<div class="active-chips">
    <span class="chips-label">筛选：</span>
    ${items}
    ${chips.length > 1 ? '<button class="chip-clear-all" data-clear="all">清除全部</button>' : ''}
  </div>`;
}

// ================= 筛选按钮渲染 =================
// 类型标签默认只展示占比最高的若干个，其余折叠进「更多」里
const GENRE_VISIBLE_COUNT = 10;
let genreExpanded = false;   // 类型筛选是否已展开

// 统计每个标签出现的游戏数，按数量降序（同数量按名称排，保证顺序稳定）
function sortTagsByCount(list, key) {
  const counter = {};
  GAMES.forEach(g => g[key].forEach(v => { counter[v] = (counter[v] || 0) + 1; }));
  return list
    .slice()
    .sort((a, b) => (counter[b] || 0) - (counter[a] || 0) || a.localeCompare(b, 'zh'));
}

function renderFilterBtns(list, current, type) {
  const isGenre = type === 'genre';
  const label = isGenre ? '类型：' : '平台：';

  // 类型按占比排序后再决定展示哪些
  const sorted = sortTagsByCount(list, isGenre ? 'genres' : 'platforms');

  let visible = sorted;
  let hidden = [];
  if (isGenre && !genreExpanded && sorted.length > GENRE_VISIBLE_COUNT) {
    visible = sorted.slice(0, GENRE_VISIBLE_COUNT);
    hidden = sorted.slice(GENRE_VISIBLE_COUNT);
  }

  const btn = (item) =>
    `<button class="filter-btn ${current === item ? 'active' : ''}" data-type="${type}" data-val="${item}">${item}</button>`;

  // 折叠状态下，若当前选中的是隐藏项，把它"提"到可见区末尾，
  // 否则用户收起后看不到自己选了什么，容易困惑。
  let pinnedActive = null;
  if (isGenre && !genreExpanded && hidden.includes(current)) {
    pinnedActive = current;
    hidden = hidden.filter(i => i !== current);
  }

  // 「更多」按钮：展开时有收起，折叠时显示剩余数量
  let moreBtn = '';
  if (isGenre && sorted.length > GENRE_VISIBLE_COUNT) {
    moreBtn = genreExpanded
      ? `<button class="filter-more-btn expanded" id="genre-more-btn" aria-expanded="true">
           <span>收起</span>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>
         </button>`
      : `<button class="filter-more-btn" id="genre-more-btn" aria-expanded="false">
           <span>更多 ${hidden.length}</span>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
         </button>`;
  }

  return `
    <div class="filter-group ${isGenre ? 'filter-group-genre' : ''}">
      <span class="filter-label">${label}</span>
      <div class="filter-chips">
        <button class="filter-btn ${current === '全部' ? 'active' : ''}" data-type="${type}" data-val="全部">全部</button>
        ${visible.map(btn).join('')}
        ${pinnedActive ? btn(pinnedActive) : ''}
        ${moreBtn}
      </div>
      ${hidden.length ? `
        <div class="filter-chips filter-chips-more ${genreExpanded ? 'open' : ''}" id="genre-more-chips">
          ${hidden.map(btn).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// ================= 空状态 =================
// 根据"为什么没结果"给出不同的提示和对应的解决按钮
function renderEmptyState() {
  const conds = [];
  if (searchQuery) conds.push(`关键词「${searchQuery}」`);
  if (activePlatform !== '全部') conds.push(`平台「${activePlatform}」`);
  if (activeGenre !== '全部') conds.push(`类型「${activeGenre}」`);
  if (activeTab === 'fav') conds.push('「我喜欢的」');

  // 收藏夹本身为空
  if (activeTab === 'fav' && favorites.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z"/>
          </svg>
        </div>
        <h3 class="empty-title">收藏夹还是空的</h3>
        <p class="empty-desc">在游戏卡片右上角点击爱心，就能把喜欢的游戏收进这里。</p>
        <div class="empty-actions">
          <button class="empty-btn primary" data-empty-action="show-all">去逛逛全部游戏</button>
        </div>
      </div>`;
  }

  const condText = conds.length ? conds.join(' + ') : '当前条件';

  return `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10.5" cy="10.5" r="6.5"/>
          <path d="m20 20-4.7-4.7"/>
          <path d="M10.5 7.5v6M7.5 10.5h6" opacity="0.45"/>
        </svg>
      </div>
      <h3 class="empty-title">没有找到符合条件的游戏</h3>
      <p class="empty-desc">你正在筛选：<strong>${condText}</strong><br>试试放宽条件，或者清空后重新找找。</p>
      <div class="empty-actions">
        <button class="empty-btn primary" data-empty-action="reset">清空全部筛选</button>
        ${activeTab === 'fav' ? '<button class="empty-btn" data-empty-action="show-all">查看全部游戏</button>' : ''}
        <button class="empty-btn" data-empty-action="lucky">随机推荐一款</button>
      </div>
    </div>`;
}

// 重置所有筛选条件并重建页面
function resetAllFilters() {
  activeTab = 'all';
  activePlatform = '全部';
  activeGenre = '全部';
  searchQuery = '';
  genreExpanded = false;
  initLibrary();

  // 同步清空两处搜索框的输入值，否则界面上还留着旧关键词
  const pageSearch = document.getElementById('search-input');
  const headerSearch = document.getElementById('header-search-input');
  if (pageSearch) pageSearch.value = '';
  if (headerSearch) headerSearch.value = '';

  syncUrlState();

  // 清空搜索若导致列表重建，需要重新绑定骨架屏状态
  syncCoverImages();
}

// 随机推荐：在当前可见的卡片里抽一款，让它原地上下跳动
// 注意：这里不重置筛选、不重新渲染列表，
// 避免整页卡片"消失再重新加载"的观感。
function rollLuckyGame() {
  const cards = [...document.querySelectorAll('#game-grid .game-card')];

  // 当前没有任何卡片（空状态）时才退回全部游戏
  if (!cards.length) {
    resetAllFilters();
    const retry = [...document.querySelectorAll('#game-grid .game-card')];
    if (!retry.length) return;
    animateLuckyCard(retry[Math.floor(Math.random() * retry.length)]);
    return;
  }

  // 避免连续两次抽到同一张，显得随机性更好
  let pool = cards;
  if (cards.length > 1) {
    const last = document.querySelector('.game-card.lucky-bounce');
    if (last) pool = cards.filter(c => c !== last);
  }

  animateLuckyCard(pool[Math.floor(Math.random() * pool.length)]);
}

// 跳动动画实例：只保留一个，连点时先取消上一轮
let luckyAnim = null;
let luckyTimer = null;

// 让指定卡片上下跳动：只添加一个高亮 class，位移交给 Web Animations API
// 这样做的好处是完全不触碰 CSS 的 animation 属性，
// 不会顶掉卡片自身的入场动画，也就不会出现"消失再重新加载"的闪烁。
function animateLuckyCard(card) {
  if (!card) return;

  // 清理上一轮
  if (luckyAnim) {
    try { luckyAnim.cancel(); } catch (e) { /* 已结束则忽略 */ }
    luckyAnim = null;
  }
  if (luckyTimer) {
    clearTimeout(luckyTimer);
    luckyTimer = null;
  }
  document.querySelectorAll('.game-card.lucky-bounce').forEach(c => c.classList.remove('lucky-bounce'));

  // 卡片不在视口内时，才做一次最小幅度的滚动，否则用户看不到跳动
  const rect = card.getBoundingClientRect();
  const topLimit = 120;                       // 顶部导航 + 筛选框的大致高度
  const bottomLimit = window.innerHeight - 20;
  if (rect.top < topLimit || rect.bottom > bottomLimit) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  card.classList.add('lucky-bounce');

  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && typeof card.animate === 'function') {
    // 用独立的 translate 属性做位移：
    // 卡片自身的入场动画占用 transform，translate 与它互不干扰
    luckyAnim = card.animate([
      { translate: '0 0' },
      { translate: '0 -18px', offset: 0.22 },
      { translate: '0 0', offset: 0.45 },
      { translate: '0 -9px', offset: 0.62 },
      { translate: '0 0', offset: 0.80 },
      { translate: '0 -3px', offset: 0.90 },
      { translate: '0 0' }
    ], {
      duration: 620,
      iterations: 3,          // 共约 1.9 秒
      easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)'
    });

    luckyAnim.onfinish = function () {
      card.classList.remove('lucky-bounce');
      luckyAnim = null;
    };
  } else {
    // 降级：不支持 WAAPI 或用户要求减少动效时，只保留高亮，1 秒后移除
    luckyTimer = setTimeout(function () {
      card.classList.remove('lucky-bounce');
      luckyTimer = null;
    }, 1000);
  }
}

function renderCards() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;

  const filteredGames = sortGames(GAMES.filter(g => {
    const isFav = favorites.includes(g.id);
    if (activeTab === 'fav' && !isFav) return false;
    if (activePlatform !== '全部' && !g.platforms.includes(activePlatform)) return false;
    if (activeGenre !== '全部' && !g.genres.includes(activeGenre)) return false;
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }));

  if (filteredGames.length === 0) {
    grid.innerHTML = renderEmptyState();
    return;
  }

  grid.innerHTML = filteredGames.map((g, index) => {
    const isFav = favorites.includes(g.id);
    // 评分与时长均为 registry.js 中的固定真实数据；缺失时显示占位符，不再使用随机数
    const rating = (g.rating !== undefined && g.rating !== null) ? Number(g.rating).toFixed(1) : '—';
    const displayHours = (g.hours !== undefined && g.hours !== null) ? g.hours : '—';

    // 处理路径问题
    let displayCover = g.cover;
    if (displayCover.startsWith('./')) {
      // 如果是在首页，不需要加 ../
    }

    return `
      <a href="./pages/detail.html?id=${g.id}" class="game-card" style="animation-delay: ${index * 0.04}s">
        <div class="card-cover">
          <div class="skeleton"></div>
          <!-- 首屏前 9 张直接加载；其余先不设 src，由 IntersectionObserver 接近视口时再加载。
               不用原生 loading="lazy"：Chrome 会因此输出
               [Intervention] Images loaded lazily... 提示，且 load 事件被延迟。 -->
          <img ${index < 9 ? `src="${displayCover}"` : ''} alt="${g.title}"
               class="cover-img is-loading" data-src="${displayCover}">
          <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" data-id="${g.id}" title="${isFav ? '取消喜欢' : '加入喜欢'}">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-content">
          <h2 class="card-title">${highlightMatch(g.title, searchQuery)} <span class="card-en">${escapeHtml(g.en)}</span></h2>
          
          <div class="card-meta">
            <span class="meta-rating">★ ${rating}</span>
            <span class="meta-divider">·</span>
            <span class="meta-hours">⏱ ${displayHours} 小时</span>
          </div>

          <p class="card-desc">${g.desc}</p>
          <div class="card-tags">
            ${g.platforms.map(p => `<span class="tag tag-platform">${p}</span>`).join('')}
            ${g.genres.map(g => `<span class="tag tag-genre">${g}</span>`).join('')}
          </div>
        </div>
      </a>
    `;
  }).join('');

  syncCoverImages();
}

// 绑定骨架屏淡出 + 懒加载封面
// 说明：没有用原生 loading="lazy"，而是自己用 IntersectionObserver 控制，
// 这样既不会触发 Chrome 的 [Intervention] 提示，也能精确控制加载时机。
function syncCoverImages() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;

  const lazyList = [];

  grid.querySelectorAll('.cover-img').forEach(img => {
    const cover = img.closest('.card-cover');

    const done = () => {
      img.classList.remove('is-loading');
      img.classList.add('is-loaded');
      if (cover) cover.classList.add('loaded');
    };

    if (!img.getAttribute('src')) {
      // 还没有 src 的图片交给观察器，等接近视口再加载
      lazyList.push(img);
    } else if (img.complete && img.naturalWidth > 0) {
      // 已经缓存命中的图片
      done();
    } else {
      img.addEventListener('load', done, { once: true });
      // 加载失败也收掉骨架，避免一直转
      img.addEventListener('error', done, { once: true });
    }
  });

  if (!lazyList.length) return;

  // 给懒加载图片挂上加载完成回调
  lazyList.forEach(img => {
    const cover = img.closest('.card-cover');
    img.addEventListener('load', () => {
      img.classList.remove('is-loading');
      img.classList.add('is-loaded');
      if (cover) cover.classList.add('loaded');
    }, { once: true });
    img.addEventListener('error', () => {
      img.classList.remove('is-loading');
      if (cover) cover.classList.add('loaded');
    }, { once: true });
  });

  const loadNow = (img) => {
    if (!img.getAttribute('src')) img.setAttribute('src', img.dataset.src);
  };

  if (!('IntersectionObserver' in window)) {
    lazyList.forEach(loadNow);
    return;
  }

  const io = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      loadNow(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '400px 0px' });

  lazyList.forEach(img => io.observe(img));
}

// ================= 页面初始化与事件绑定 =================
function initLibrary() {
  const allPlatforms = [...new Set(GAMES.flatMap(g => g.platforms))];
  const allGenres = [...new Set(GAMES.flatMap(g => g.genres))];

  appEl.innerHTML = `
    <div class="hero" style="padding-top: 20px;">
      <h1>GameVault 游戏档案</h1>
      <p>记录我的游玩足迹，分享深度体验。</p>
      
      <!-- 数据统计看板 -->
      <div class="stats-board">
        <div class="stat-item">
          <span class="stat-num">${GAMES.length}</span>
          <span class="stat-label">收录游戏</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">${totalHours}</span>
          <span class="stat-label">累计时长(h)</span>
        </div>
        <div class="stat-item">
          <span class="stat-num" id="board-fav-count">${favorites.length}</span>
          <span class="stat-label">心头好</span>
        </div>
      </div>
    </div>
    
    <div class="filter-wrapper">
      <div class="filter-section">
        ${renderHeaderControls()}
        <div class="filter-divider"></div>
        ${renderFilterBtns(allPlatforms, activePlatform, 'platform')}
        ${renderFilterBtns(allGenres, activeGenre, 'genre')}
        <div id="active-chips-host">${renderActiveChips()}</div>
      </div>
    </div>

    ${renderRecentStrip()}

    <div class="game-grid" id="game-grid"></div>
  `;

  renderCards();

  // 同步顶部搜索框初始值（地址栏可能带 q 参数）
  const headerSearchInput = document.getElementById('header-search-input');
  if (headerSearchInput) headerSearchInput.value = searchQuery;

  renderCards();
  bindAppEvents();
  bindKeyboardShortcuts();
}

// ================= 事件绑定（只绑一次） =================
// appEl 是常驻节点，而 initLibrary 会被多次调用（如重置筛选）。
// 所有委托监听都必须只绑一次，否则点击会被执行多次——
// 典型症状是「更多」被连点两次，看起来像没反应。
let appEventsBound = false;

function bindAppEvents() {
  if (appEventsBound) return;
  appEventsBound = true;

  // ---------- 点击委托 ----------
  appEl.addEventListener('click', function (e) {
    // 1. Tab 切换
    const tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
      activeTab = tabBtn.dataset.tab;
      appEl.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.toggle('active', b.dataset.tab === activeTab);
      });
      updateChips();
      renderCards();
      syncUrlState();
      return;
    }

    // 2. 更多 / 收起
    const moreBtn = e.target.closest('.filter-more-btn');
    if (moreBtn) { toggleGenreMore(moreBtn); return; }

    // 2.1 排序下拉：展开 / 收起
    if (e.target.closest('#sort-trigger')) { toggleSortMenu(); return; }

    // 2.2 排序下拉：选中某一项
    const sortOpt = e.target.closest('.sort-option');
    if (sortOpt) { chooseSort(sortOpt.dataset.value); return; }

    // 3. 已选条件标签上的 ✕ / 清除全部
    const chip = e.target.closest('[data-clear]');
    if (chip) { clearOneCondition(chip.dataset.clear); return; }

    // 4. 平台 / 类型筛选按钮
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn && filterBtn.dataset.type) { onFilterClick(filterBtn); return; }

    // 5. 空状态里的按钮
    const emptyBtn = e.target.closest('[data-empty-action]');
    if (emptyBtn) {
      const act = emptyBtn.dataset.emptyAction;
      if (act === 'reset' || act === 'show-all') {
        resetAllFilters();
        window.scrollTo({ top: getContentStartY(), behavior: 'smooth' });
      } else if (act === 'lucky') {
        rollLuckyGame();
      }
      return;
    }

    // 6. 卡片上的爱心
    const favBtn = e.target.closest('.card-fav-btn');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.id);
    }
  });

  // ---------- 页面内搜索输入 ----------
  appEl.addEventListener('input', function (e) {
    if (e.target.id !== 'search-input') return;
    searchQuery = e.target.value.trim();
    const headerInput = document.getElementById('header-search-input');
    if (headerInput) headerInput.value = e.target.value;
    updateChips();
    renderCards();
    syncUrlState();
  });

  // ---------- 排序下拉：点空白处关闭 ----------
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#sort-box')) closeSortMenu();
  });

  // ---------- 顶部迷你搜索框（在 appEl 之外，单独绑一次） ----------
  const hs = document.getElementById('header-search-input');
  if (hs) {
    hs.addEventListener('input', function (e) {
      searchQuery = e.target.value.trim();
      const pageSearch = document.getElementById('search-input');
      if (pageSearch) pageSearch.value = e.target.value;
      updateChips();
      renderCards();
      syncUrlState();

      // 还在首屏时就自动滚到结果区，否则用户看不到筛选结果
      if (window.scrollY < getContentStartY()) scrollToGames();
    });
  }

  // ---------- 随机推荐悬浮按钮（在 appEl 之外） ----------
  const luckyBtn = document.getElementById('lucky-btn');
  if (luckyBtn) luckyBtn.addEventListener('click', rollLuckyGame);
}

// 只刷新「已选条件」容器，避免整个筛选区重绘打断输入焦点
function updateChips() {
  const host = document.getElementById('active-chips-host');
  if (host) host.innerHTML = renderActiveChips();
}

// ================= 排序下拉 =================
function openSortMenu(focusCurrent) {
  const box = document.getElementById('sort-box');
  const menu = document.getElementById('sort-menu');
  const trigger = document.getElementById('sort-trigger');
  if (!box || !menu || !trigger) return;

  menu.hidden = false;
  box.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');

  if (focusCurrent) {
    const opts = [].slice.call(menu.querySelectorAll('.sort-option'));
    opts.forEach(function (o) { o.classList.remove('focused'); });
    const active = menu.querySelector('.sort-option[aria-selected="true"]') || opts[0];
    if (active) active.classList.add('focused');
  }
}

function closeSortMenu() {
  const box = document.getElementById('sort-box');
  const menu = document.getElementById('sort-menu');
  const trigger = document.getElementById('sort-trigger');
  if (!box || !menu || !trigger) return;

  menu.hidden = true;
  box.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  menu.querySelectorAll('.sort-option.focused').forEach(function (o) {
    o.classList.remove('focused');
  });
}

function toggleSortMenu() {
  const menu = document.getElementById('sort-menu');
  if (!menu) return;
  if (menu.hidden) openSortMenu(false);
  else closeSortMenu();
}

// 选择排序方式：只更新按钮文字与选中态，不重渲染整个筛选区
function chooseSort(value) {
  if (!value) return;
  activeSort = value;

  const label = document.querySelector('.sort-label');
  if (label) label.textContent = getSortLabel(value);

  document.querySelectorAll('.sort-option').forEach(function (o) {
    o.setAttribute('aria-selected', String(o.dataset.value === value));
  });

  renderCards();
  syncUrlState();
  closeSortMenu();

  const trigger = document.getElementById('sort-trigger');
  if (trigger) trigger.focus();
}

// 展开 / 收起类型折叠区
function toggleGenreMore(moreBtn) {
  genreExpanded = !genreExpanded;
  const chips = document.getElementById('genre-more-chips');
  const sp = moreBtn.querySelector('span');

  if (genreExpanded) {
    moreBtn.classList.add('expanded');
    moreBtn.setAttribute('aria-expanded', 'true');
    if (sp) sp.textContent = '收起';
    if (chips) chips.classList.add('open');
  } else {
    moreBtn.classList.remove('expanded');
    moreBtn.setAttribute('aria-expanded', 'false');
    if (sp) sp.textContent = '收起';
    if (chips) chips.classList.remove('open');

    // 收起动画播完后重渲染类型区，把"当前选中的隐藏项"提回可见区
    setTimeout(function () {
      const genreGroup = appEl.querySelector('.filter-group-genre');
      if (!genreGroup) return;
      const allGenres = [...new Set(GAMES.flatMap(g => g.genres))];
      genreGroup.outerHTML = renderFilterBtns(allGenres, activeGenre, 'genre');
    }, 400);
  }
}

// 点击平台 / 类型筛选按钮
function onFilterClick(btn) {
  const type = btn.dataset.type;
  const val = btn.dataset.val;

  if (type === 'platform') activePlatform = val;

  if (type === 'genre') {
    activeGenre = val;
    // 选中的是折叠区里的标签时，自动展开让用户看到自己的选择
    const inMore = btn.closest('#genre-more-chips');
    if (inMore && !genreExpanded) {
      genreExpanded = true;
      const chips = document.getElementById('genre-more-chips');
      if (chips) chips.classList.add('open');
      const mb = document.getElementById('genre-more-btn');
      if (mb) {
        mb.classList.add('expanded');
        mb.setAttribute('aria-expanded', 'true');
        const s = mb.querySelector('span');
        if (s) s.textContent = '收起';
      }
    }
  }

  appEl.querySelectorAll('.filter-btn[data-type="' + type + '"]').forEach(function (b) {
    b.classList.remove('active');
  });
  appEl.querySelectorAll('.filter-btn[data-type="' + type + '"][data-val="' + CSS.escape(val) + '"]')
    .forEach(function (b) { b.classList.add('active'); });

  updateChips();
  renderCards();
  syncUrlState();
}

// 取消单个筛选条件，或清除全部
function clearOneCondition(kind) {
  if (kind === 'all' || kind === 'q') searchQuery = '';
  if (kind === 'all' || kind === 'tab') activeTab = 'all';
  if (kind === 'all' || kind === 'platform') activePlatform = '全部';
  if (kind === 'all' || kind === 'genre') activeGenre = '全部';

  // 同步 Tab 与按钮高亮
  appEl.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.toggle('active', b.dataset.tab === activeTab);
  });
  ['platform', 'genre'].forEach(function (t) {
    const val = t === 'platform' ? activePlatform : activeGenre;
    appEl.querySelectorAll('.filter-btn[data-type="' + t + '"]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.val === val);
    });
  });

  // 同步两处搜索框
  const pageSearch = document.getElementById('search-input');
  const headerSearch = document.getElementById('header-search-input');
  if (pageSearch) pageSearch.value = searchQuery;
  if (headerSearch) headerSearch.value = searchQuery;

  updateChips();
  renderCards();
  syncUrlState();
}

// 收藏 / 取消收藏
function toggleFavorite(id) {
  const index = favorites.indexOf(id);
  if (index > -1) favorites.splice(index, 1);
  else favorites.push(id);

  localStorage.setItem('gv_favorites', JSON.stringify(favorites));

  const fc = document.getElementById('fav-count');
  const bc = document.getElementById('board-fav-count');
  if (fc) fc.textContent = favorites.length;
  if (bc) bc.textContent = favorites.length;

  renderCards();
  updateChips();
}

// ================= 键盘快捷键 =================
// / 聚焦搜索    Esc 清空搜索    g 回到顶部
let keyboardBound = false;

function bindKeyboardShortcuts() {
  if (keyboardBound) return;
  keyboardBound = true;

  document.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT' || el.isContentEditable);

    // ===== 排序下拉打开时，键盘优先服务于下拉 =====
    const menu = document.getElementById('sort-menu');
    if (menu && !menu.hidden) {
      const opts = [].slice.call(menu.querySelectorAll('.sort-option'));
      const cur = opts.findIndex(function (o) { return o.classList.contains('focused'); });

      if (e.key === 'Escape') {
        e.preventDefault();
        closeSortMenu();
        const t = document.getElementById('sort-trigger');
        if (t) t.focus();
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        let next;
        if (cur === -1) next = e.key === 'ArrowDown' ? 0 : opts.length - 1;
        else next = (cur + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;

        opts.forEach(function (o) { o.classList.remove('focused'); });
        opts[next].classList.add('focused');
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = cur >= 0 ? opts[cur] : opts[0];
        if (target) chooseSort(target.dataset.value);
        return;
      }
    }

    // 焦点在排序按钮上时，Enter / 空格 / 下箭头打开菜单
    if (el && el.id === 'sort-trigger' &&
        (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      openSortMenu(true);
      return;
    }

    // Esc：清空搜索并失焦
    if (e.key === 'Escape') {
      if (!typing) return;
      el.value = '';
      el.blur();
      searchQuery = '';
      const pageSearch = document.getElementById('search-input');
      const headerSearch = document.getElementById('header-search-input');
      if (pageSearch) pageSearch.value = '';
      if (headerSearch) headerSearch.value = '';
      updateChips();
      renderCards();
      syncUrlState();
      return;
    }

    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;

    // /：聚焦搜索框
    // 注意：页面内的搜索框在首屏下方，直接 focus 时浏览器不一定会滚动过去，
    // 用户在首屏按 / 会"没有任何反应"。所以优先选当前可见的那个搜索框，
    // 两个都不可见时（首屏）才滚动到筛选区再聚焦。
    if (e.key === '/') {
      e.preventDefault();
      focusSearch();
      return;
    }

    // g：回到顶部
    if (e.key === 'g' || e.key === 'G') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// 元素是否完整地落在视口内（顶部预留导航栏高度）
function isFullyVisible(el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top >= 70 && r.bottom <= window.innerHeight;
}

// 智能聚焦搜索框
function focusSearch() {
  const headerSearch = document.getElementById('header-search-input');
  const pageSearch = document.getElementById('search-input');

  // 1) 页面内搜索框可见时优先用它（它带着排序、筛选上下文）
  if (isFullyVisible(pageSearch)) {
    // 保险：如果此刻筛选栏正在收起（动画途中），先把 hide 去掉，
    // 否则输入框会在聚焦之后继续淡出，用户还是看不到它
    const wrapper = pageSearch.closest('.filter-wrapper');
    if (wrapper) wrapper.classList.remove('hide');

    pageSearch.focus();
    pageSearch.select();
    return;
  }

  // 2) 否则用顶部常驻搜索框（始终可见，按下去立刻有反馈）
  if (headerSearch) {
    headerSearch.focus();
    headerSearch.select();

    // 若当前在首屏，顺手滚到游戏列表，让用户看到筛选结果
    if (window.scrollY < getContentStartY()) {
      scrollToGames();
    }
    return;
  }

  // 3) 兜底：聚焦页面内搜索框并把它滚进视野
  if (pageSearch) {
    pageSearch.focus({ preventScroll: true });
    pageSearch.select();
    pageSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


// ================= 首屏滚动交互逻辑 =================

// 动态计算滚动的偏移量，精准定位到第一款游戏（避开顶部导航与吸顶筛选框）
function getTargetScrollTop() {
  const gameGrid = document.getElementById('game-grid');
  if (!gameGrid) return 0;
  const filterWrapper = document.querySelector('.filter-wrapper');
  const filterHeight = filterWrapper ? filterWrapper.offsetHeight : 0;
  const yOffset = -(filterHeight + 65 + 20);
  return gameGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
}

// 平滑滚动到游戏列表
function scrollToGames() {
  window.scrollTo({ top: getTargetScrollTop(), behavior: 'smooth' });
}

// 内容区（首屏以下）的起始位置，用于判断"是否还在首屏区域"
function getContentStartY() {
  const contentSection = document.getElementById('content-section');
  return contentSection ? contentSection.getBoundingClientRect().top + window.pageYOffset : 0;
}

function initScrollEffects() {
  const heroSection = document.getElementById('hero-section');
  const heroContent = document.querySelector('.hero-content');
  const scrollHint = document.querySelector('.scroll-hint');
  const exploreBtn = document.getElementById('explore-btn');
  const gameGrid = document.getElementById('game-grid');
  const filterWrapper = document.querySelector('.filter-wrapper'); // 获取筛选框

  if (scrollHint) scrollHint.addEventListener('click', scrollToGames);
  if (exploreBtn) exploreBtn.addEventListener('click', scrollToGames);

  // 首屏滚出视口时暂停背景动画：省电，也避免看不见的地方持续重绘
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroSection.classList.toggle('hero-paused', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  }

  // 监听滚动，控制动画和按钮显隐
  let ticking = false;
  let lastScrollY = window.scrollY; // 记录上一次的滚动位置

  // ===== 筛选框显隐的防抖与滞回状态 =====
  const HIDE_AT = 120;      // 卡片顶边进入该范围内，才可能收起
  const SHOW_AT = 180;      // 卡片顶边超过该值才恢复显示（与 HIDE_AT 形成滞回，避免临界点抖动）
  const DIR_DELTA = 8;      // 滚动方向判定的最小位移（px），过滤惯性滚动/回弹的微小抖动
  const DIR_DELAY = 60;     // 方向反转需持续的时间（ms），避免手一抖就弹回
  let direction = 0;        // 1 = 向下，-1 = 向上，0 = 未定
  let pendingDir = 0;       // 待确认的方向
  let pendingAt = 0;        // 待确认方向的起始时间

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const targetTop = getTargetScrollTop();

        // 1. 控制右下角悬浮按钮显隐
        if (scrollY > targetTop + 100) {
          exploreBtn.classList.add('visible');
        } else {
          exploreBtn.classList.remove('visible');
        }

        // 2. 筛选框的显隐（向上立即恢复，收起才做防抖）
        if (filterWrapper && gameGrid) {
          const delta = scrollY - lastScrollY;
          const now = performance.now();
          const gridTopDistance = gameGrid.getBoundingClientRect().top;

          // 向上滚动：立即显示，不做任何延迟（用户最需要"往上滑就出来"的即时反馈）
          if (delta <= -DIR_DELTA) {
            direction = -1;
            pendingDir = 0;
            filterWrapper.classList.remove('hide');
          }
          // 向下滚动：需要累计位移并持续一小段时间，才认为"真的在往下浏览"
          else if (delta >= DIR_DELTA) {
            if (direction !== 1) {
              if (pendingDir !== 1) {
                pendingDir = 1;
                pendingAt = now;
              } else if (now - pendingAt >= DIR_DELAY) {
                direction = 1;
                pendingDir = 0;
              }
            }
            // 确认向下且卡片快要贴上导航栏 -> 收起
            // 例外：焦点在筛选栏内（正在输入搜索词）时不能收起，
            // 否则用户刚按 / 聚焦到的输入框会被一起藏起来，看起来像"按了没反应"
            const focusInsideFilter = filterWrapper.contains(document.activeElement);
            if (direction === 1 && gridTopDistance < HIDE_AT && !focusInsideFilter) {
              filterWrapper.classList.add('hide');
            }
          }
          // 没有明显滚动（惯性/回弹等微小位移）：保持现状不动

          // 滞回：一旦回到临界点之上方，无条件显示
          if (gridTopDistance > SHOW_AT) {
            filterWrapper.classList.remove('hide');
          }
        }

        // 3. 首屏文字的视差淡出效果
        if (scrollY <= heroHeight) {
          if (heroContent) {
            heroContent.style.opacity = 1 - (scrollY / (heroHeight * 0.6));
            heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
          }
        }

        // 更新上一次的滚动位置
        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
  readUrlState();   // 先从地址栏还原筛选条件（刷新 / 分享链接时生效）
  initLibrary();    // 初始化游戏列表
  initScrollEffects(); // 初始化首屏滚动
});