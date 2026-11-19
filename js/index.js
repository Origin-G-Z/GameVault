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

// 累计游玩时长：由 registry.js 中每款游戏的 hours 字段实时求和，无需手动维护
const totalHours = GAMES
  .reduce((sum, g) => sum + (Number(g.hours) || 0), 0)
  .toFixed(1);

// ================= 渲染逻辑 =================
function renderHeaderControls() {
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
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="search-input" placeholder="搜索游戏名称..." value="${searchQuery}">
      </div>
    </div>
  `;
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

function renderCards() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;

  const filteredGames = GAMES.filter(g => {
    const isFav = favorites.includes(g.id);
    if (activeTab === 'fav' && !isFav) return false;
    if (activePlatform !== '全部' && !g.platforms.includes(activePlatform)) return false;
    if (activeGenre !== '全部' && !g.genres.includes(activeGenre)) return false;
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (filteredGames.length === 0) {
    grid.innerHTML = `<div class="no-result">没有找到符合条件的游戏，请尝试放宽筛选条件。</div>`;
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
          <img src="${displayCover}" alt="${g.title}" loading="lazy" class="cover-img">
          <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" data-id="${g.id}" title="${isFav ? '取消喜欢' : '加入喜欢'}">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-content">
          <h2 class="card-title">${g.title} <span class="card-en">${g.en}</span></h2>
          
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
      </div>
    </div>

    <div class="game-grid" id="game-grid"></div>
  `;

  renderCards();

  // 绑定 Tab
  appEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      activeTab = target.dataset.tab;
      appEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      renderCards();
    });
  });

  // 绑定搜索（页面内筛选框）
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    // 同步到顶部迷你搜索框
    const headerInput = document.getElementById('header-search-input');
    if (headerInput) headerInput.value = e.target.value;
    renderCards();
  });

  // 绑定顶部迷你搜索框（与页面内搜索框双向同步）
  const headerSearchInput = document.getElementById('header-search-input');
  if (headerSearchInput) {
    // 如果主页加载时带着 ?q= 参数（从详情页搜索跳转而来），自动填入
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      searchQuery = q;
      searchInput.value = q;
      headerSearchInput.value = q;
      renderCards();
    }

    headerSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      // 同步到页面内筛选框
      searchInput.value = e.target.value;
      renderCards();

      // 在首屏或列表上方搜索时，自动滚动到结果区，让用户看到搜索结果
      const grid = document.getElementById('game-grid');
      if (grid && window.scrollY < getContentStartY()) {
        scrollToGames();
      }
    });
  }

  // 绑定筛选（用事件委托，覆盖「更多」展开后新出现的按钮）
  appEl.addEventListener('click', (e) => {
    // ① 点击「更多 / 收起」
    const moreBtn = e.target.closest('.filter-more-btn');
    if (moreBtn) {
      genreExpanded = !genreExpanded;

      if (genreExpanded) {
        // 展开：只切类名，让 CSS 的 max-height 过渡自然展开（不重渲染，动画更顺滑）
        moreBtn.classList.add('expanded');
        moreBtn.setAttribute('aria-expanded', 'true');
        const sp = moreBtn.querySelector('span');
        if (sp) sp.textContent = '收起';
        const chips = document.getElementById('genre-more-chips');
        if (chips) chips.classList.add('open');
      } else {
        // 收起：先播放收起动画，动画结束后重新渲染类型区，
        // 好让"当前选中的隐藏项"被提到可见区（否则用户看不到自己选了什么）
        moreBtn.classList.remove('expanded');
        moreBtn.setAttribute('aria-expanded', 'false');
        const sp = moreBtn.querySelector('span');
        if (sp) sp.textContent = '收起';
        const chips = document.getElementById('genre-more-chips');
        if (chips) chips.classList.remove('open');

        setTimeout(function () {
          // 仅重渲染类型这一组，保持平台组与卡片不动
          const genreGroup = appEl.querySelector('.filter-group-genre');
          if (!genreGroup) return;
          const allPlatforms = [...new Set(GAMES.flatMap(g => g.platforms))];
          const allGenres = [...new Set(GAMES.flatMap(g => g.genres))];
          genreGroup.outerHTML = renderFilterBtns(allGenres, activeGenre, 'genre');
        }, 400); // 与 CSS 收起时长 0.38s 对齐
      }
      return;
    }

    // ② 点击具体筛选按钮
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const type = btn.dataset.type;
    const val = btn.dataset.val;
    if (type === 'platform') activePlatform = val;
    if (type === 'genre') {
      activeGenre = val;
      // 若选中的是折叠区里的标签，自动展开，让用户看到自己的选择
      const inMore = btn.closest('#genre-more-chips');
      if (inMore && !genreExpanded) {
        genreExpanded = true;
        const chips = document.getElementById('genre-more-chips');
        if (chips) chips.classList.add('open');
        const mb = document.getElementById('genre-more-btn');
        if (mb) {
          mb.classList.add('expanded');
          mb.setAttribute('aria-expanded', 'true');
          const sp = mb.querySelector('span');
          if (sp) sp.textContent = '收起';
        }
      }
    }

    appEl.querySelectorAll(`.filter-btn[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
    appEl.querySelectorAll(`.filter-btn[data-type="${type}"][data-val="${CSS.escape(val)}"]`).forEach(b => b.classList.add('active'));
    renderCards();
  });

  // 绑定爱心收藏
  document.getElementById('game-grid').addEventListener('click', (e) => {
    const favBtn = e.target.closest('.card-fav-btn');
    if (!favBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = favBtn.dataset.id;
    const index = favorites.indexOf(id);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(id);

    localStorage.setItem('gv_favorites', JSON.stringify(favorites));
    document.getElementById('fav-count').textContent = favorites.length;
    document.getElementById('board-fav-count').textContent = favorites.length;
    renderCards();
  });
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
            if (direction === 1 && gridTopDistance < HIDE_AT) {
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
  initLibrary(); // 初始化游戏列表
  initScrollEffects(); // 初始化首屏滚动
});