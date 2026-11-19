// js/detail.js
const appEl = document.getElementById('app');
const backToTopBtn = document.getElementById('back-to-top'); 

function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  // 1. 从 registry.js 提供的 GAMES 数组中找基础信息
  // 注意：如果你在 registry.js 里没有把 GAMES 挂载到 window，这里直接访问可能会报错
  const meta = window.GAMES ? window.GAMES.find(g => g.id === id) : null;
  
  if (!meta) {
    appEl.innerHTML = `<div class="error">找不到该游戏的基础信息，<a href="../index.html">返回首页</a></div>`;
    return;
  }

  // 2. 从全局游戏数据库（GAME_DB）中获取详细长文数据
  const gameData = window.GAME_DB ? window.GAME_DB[id] : null;
  
  if (!gameData) {
    appEl.innerHTML = `<div class="error">找不到该游戏的详细数据，请检查 HTML 是否引入了对应的 js 文件。<br><br><a href="../index.html">返回首页</a></div>`;
    return;
  }

  // 3. 获取当前收藏状态
  let favorites = JSON.parse(localStorage.getItem('gv_favorites')) || [];
  let isFav = favorites.includes(id);

  // 4. 渲染页面结构
  appEl.innerHTML = `
    <div class="back-nav">
      <a href="../index.html" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回游戏库
      </a>
    </div>

    <div class="detail-top-bar">
      <button id="detail-fav-btn" class="detail-fav-btn ${isFav ? 'is-fav' : ''}">
        ${isFav ? '❤️ 已加入喜欢' : '🤍 加入喜欢'}
      </button>
    </div>

    ${renderGame(gameData, meta)}
  `;

  // 5. 绑定收藏按钮事件
  const favBtn = document.getElementById('detail-fav-btn');
  if (favBtn) {
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
  }

  // 更新标题并置顶
  document.title = `${gameData.title} · GameVault`;
  updateSocialMeta(gameData, meta);
  window.scrollTo(0, 0);
}

// 根据当前游戏动态更新 SEO 描述与社交分享卡片信息
function updateSocialMeta(gameData, meta) {
  const title = `${gameData.title} · GameVault`;
  const desc = gameData.tagline || meta.desc || '';

  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  // 基础 SEO
  setMeta('meta[name="description"]', 'content', desc);
  // OG 标签
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', desc);
  // 封面图在详情页需要补成 ../ 前缀（meta.cover 形如 ./image/xxx.jpg）
  const cover = meta.cover ? '.' + meta.cover : '../image/hero-bg.jpg';
  setMeta('meta[property="og:image"]', 'content', cover);
  // Twitter 卡片
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', desc);
  setMeta('meta[name="twitter:image"]', 'content', cover);
}

// ================= 返回顶部交互逻辑 =================
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 启动
document.addEventListener('DOMContentLoaded', init);