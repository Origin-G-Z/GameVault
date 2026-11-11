// js/index.js
import { GAMES } from './registry.js';

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

// 【修改这里】：直接固定总时长为 2583.7
const totalHours = "2583.7";

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

function renderFilterBtns(list, current, type) {
  return `
    <div class="filter-group">
      <span class="filter-label">${type === 'platform' ? '平台：' : '类型：'}</span>
      <button class="filter-btn ${current === '全部' ? 'active' : ''}" data-type="${type}" data-val="全部">全部</button>
      ${list.map(item => `
        <button class="filter-btn ${current === item ? 'active' : ''}" data-type="${type}" data-val="${item}">${item}</button>
      `).join('')}
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
    const rating = g.rating || (8 + Math.random()).toFixed(1); 
    // 如果游戏没有具体时长，给一个随机的保底展示
    const displayHours = g.hours || Math.floor(Math.random() * 50 + 10);
    
    return `
      <a href="./pages/detail.html?id=${g.id}" class="game-card" style="animation-delay: ${index * 0.04}s">
        <div class="card-cover">
          <img src="${g.cover}" alt="${g.title}" loading="lazy" class="cover-img">
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

// ================= 事件绑定 =================
function init() {
  const allPlatforms = [...new Set(GAMES.flatMap(g => g.platforms))];
  const allGenres = [...new Set(GAMES.flatMap(g => g.genres))];

  appEl.innerHTML = `
    <div class="hero">
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
          <span class="stat-label">喜爱的游戏</span>
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

  appEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      activeTab = target.dataset.tab;
      appEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      renderCards();
    });
  });

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderCards();
  });

  appEl.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const type = target.dataset.type;
      const val = target.dataset.val;
      if (type === 'platform') activePlatform = val;
      if (type === 'genre') activeGenre = val;
      appEl.querySelectorAll(`.filter-btn[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      renderCards();
    });
  });

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

init();