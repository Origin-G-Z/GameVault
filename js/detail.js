// js/detail.js
import { GAMES } from './registry.js';
import { renderGame } from './renderer.js';

const appEl = document.getElementById('app');
const backToTopBtn = document.getElementById('back-to-top'); 

async function init() {
  // 1. 获取 URL 参数 ?id=xxx
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  // 2. 查找游戏基础配置
  const meta = GAMES.find(g => g.id === id);
  
  if (!meta) {
    appEl.innerHTML = `<div class="error">找不到该游戏，<a href="../index.html">返回首页</a></div>`;
    return;
  }

  appEl.innerHTML = `<div class="loading">正在加载深度鉴赏...</div>`;

  try {
    // 3. 动态导入游戏详细数据文件
    const module = await import(meta.file);
    const gameData = module.default;
    
    // 4. 获取当前收藏状态
    let favorites = JSON.parse(localStorage.getItem('gv_favorites')) || [];
    let isFav = favorites.includes(id);

    // 5. 渲染页面结构（包含新的返回按钮、收藏按钮、以及大图渲染）
    appEl.innerHTML = `
      <!-- 返回按钮（新版带 SVG 图标） -->
      <div class="back-nav">
        <a href="../index.html" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回游戏库
        </a>
      </div>

      <!-- 顶部操作栏 -->
      <div class="detail-top-bar">
        <button id="detail-fav-btn" class="detail-fav-btn ${isFav ? 'is-fav' : ''}">
          ${isFav ? '❤️ 已加入喜欢' : '🤍 加入喜欢'}
        </button>
      </div>

      <!-- 注入 renderer 渲染的核心内容 -->
      ${renderGame(gameData, meta)}
    `;

    // 6. 绑定详情页的收藏按钮事件
    const favBtn = document.getElementById('detail-fav-btn');
    favBtn.addEventListener('click', () => {
      favorites = JSON.parse(localStorage.getItem('gv_favorites')) || [];
      const index = favorites.indexOf(id);

      if (index > -1) {
        favorites.splice(index, 1);
        isFav = false;
        favBtn.classList.remove('is-fav');
        favBtn.innerHTML = '🤍 加入喜欢';
      } else {
        favorites.push(id);
        isFav = true;
        favBtn.classList.add('is-fav');
        favBtn.innerHTML = '❤️ 已加入喜欢';
      }
      localStorage.setItem('gv_favorites', JSON.stringify(favorites));
    });

    // 7. 更新页面标题并重置滚动条
    document.title = `${gameData.title} · GameVault`;
    window.scrollTo(0, 0);
  } catch (err) {
    console.error('加载失败:', err);
    appEl.innerHTML = `<div class="error">数据加载失败，请检查控制台或文件路径。</div>`;
  }
}

// ================= 滚动事件：控制返回顶部按钮 =================
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

// ================= 返回顶部按钮点击事件 =================
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// 启动
init();