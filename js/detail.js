// js/detail.js
const appEl = document.getElementById('app');
const backToTopBtn = document.getElementById('back-to-top'); 

// 转义用户可见文本，避免标题中的特殊字符破坏 HTML 结构
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

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
    ${renderDetailNav(id)}
    ${renderRelated(id)}
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

  // 6. 记录到「最近浏览」
  recordRecentView(id);

  // 7. 侧边目录跟随滚动高亮
  initTocSpy();

  // 更新标题并置顶
  document.title = `${gameData.title} · GameVault`;
  updateSocialMeta(gameData, meta);
  window.scrollTo(0, 0);
}

// ================= 最近浏览 =================
// 与首页共用 gv_recent：最近看过的排在最前，最多保留 5 条
function recordRecentView(id) {
  try {
    var list = JSON.parse(localStorage.getItem('gv_recent') || '[]');
    list = list.filter(function (x) { return x !== id; });
    list.unshift(id);
    localStorage.setItem('gv_recent', JSON.stringify(list.slice(0, 5)));
  } catch (e) {
    /* 隐私模式下忽略 */
  }
}

// 详情页图片路径：registry 里是 ./image/xxx.jpg，详情页需要 ../image/xxx.jpg
function coverSrc(cover) {
  return '..' + String(cover).replace(/^\./, '');
}

// ================= 上一款 / 下一款 =================
function renderDetailNav(id) {
  var idx = GAMES.findIndex(function (g) { return g.id === id; });
  if (idx === -1) return '';

  var prev = idx > 0 ? GAMES[idx - 1] : null;
  var next = idx < GAMES.length - 1 ? GAMES[idx + 1] : null;

  var prevHtml = prev
    ? `<a class="dv-link prev" href="detail.html?id=${prev.id}">
         <img class="dv-cover" src="${coverSrc(prev.cover)}" alt="${escapeHtml(prev.title)}" loading="lazy">
         <span class="dv-text">
           <span class="dv-dir">← 上一款</span>
           <span class="dv-name">${escapeHtml(prev.title)}</span>
         </span>
       </a>`
    : '<span class="dv-link is-empty"></span>';

  var nextHtml = next
    ? `<a class="dv-link next" href="detail.html?id=${next.id}">
         <img class="dv-cover" src="${coverSrc(next.cover)}" alt="${escapeHtml(next.title)}" loading="lazy">
         <span class="dv-text">
           <span class="dv-dir">下一款 →</span>
           <span class="dv-name">${escapeHtml(next.title)}</span>
         </span>
       </a>`
    : '<span class="dv-link is-empty"></span>';

  return `<nav class="detail-nav" aria-label="游戏导航">${prevHtml}${nextHtml}</nav>`;
}

// ================= 相关推荐 =================
// 同类型里评分最高的 3 款（排除自己）
function renderRelated(id) {
  var current = GAMES.find(function (g) { return g.id === id; });
  if (!current) return '';

  var related = GAMES
    .filter(function (g) {
      if (g.id === id) return false;
      return g.genres.some(function (gen) {
        return current.genres.indexOf(gen) > -1;
      });
    })
    .sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); })
    .slice(0, 3);

  if (!related.length) return '';

  var items = related.map(function (g) {
    return `
      <a class="related-card" href="detail.html?id=${g.id}">
        <img src="${coverSrc(g.cover)}" alt="${escapeHtml(g.title)}" loading="lazy">
        <div class="related-info">
          <span class="related-name">${escapeHtml(g.title)}</span>
          <span class="related-meta">★ ${Number(g.rating).toFixed(1)} · ${g.hours} 小时</span>
        </div>
      </a>`;
  }).join('');

  return `
    <section class="related" aria-label="相关推荐">
      <h2 class="related-title">同类推荐</h2>
      <div class="related-list">${items}</div>
    </section>`;
}

// ================= 侧边目录滚动高亮 =================
function initTocSpy() {
  var links = [].slice.call(document.querySelectorAll('.toc-link'));
  if (!links.length) return;

  var map = {};
  links.forEach(function (a) {
    var hash = a.getAttribute('href') || '';
    if (hash.charAt(0) === '#') map[hash.slice(1)] = a;
  });

  var heads = [].slice.call(document.querySelectorAll('.game-body h2[id]'));
  if (!heads.length) return;

  function activate(id) {
    links.forEach(function (a) { a.classList.remove('active'); });
    if (map[id]) map[id].classList.add('active');
  }

  if (!('IntersectionObserver' in window)) {
    activate(heads[0].id);
    return;
  }

  // 进入页面时先高亮第一章，避免目录一开始没有任何选中项
  activate(heads[0].id);

  // 以"顶部往下 120px 到 视口 55% 处"作为触发带，
  // 保证高亮的是当前正在读的那一节，而不是刚露头的下一节
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) activate(entry.target.id);
    });
  }, { rootMargin: '-120px 0px -55% 0px', threshold: 0 });

  heads.forEach(function (h) { observer.observe(h); });
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

// ================= 阅读进度条 =================
(function initReadingProgress() {
  var bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    // 限制在 0~100，避免回弹时出现负值或超过
    percent = Math.max(0, Math.min(100, percent));
    bar.style.width = percent.toFixed(2) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // 窗口尺寸变化时重新计算（长文图片加载完成后高度会变）
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

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