/* ========== detail.js · 详情页逻辑 ========== */
(function () {
  "use strict";

  const mainEl = document.getElementById("detailMain");
  const state = getState();

  // 1. 获取 URL 中的 id 参数
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("id");

  if (!gameId) {
    renderError("未找到游戏 ID，请从首页进入。");
    return;
  }

  // 2. 查找数据
  const allGames = getAllGames();
  const game = allGames.find(g => String(g.id) === String(gameId));

  if (!game) {
    renderError("游戏不存在或已被删除。");
    return;
  }

  // 3. 设置页面标题
  document.title = `${game.title} - GameVault`;

  // 4. 判断是否收藏
  const isFav = state.favorites.includes(game.id);

  // 5. 渲染页面
  // 如果没有写 detailContent，就使用默认的 description 兜底
  const articleContent = game.detailContent 
    ? game.detailContent 
    : `<p>${escapeHTML(game.description)}</p><br><p style="color:var(--text-dim)">（该游戏的详细评测正在编写中，敬请期待…）</p>`;

  const html = `
    <section class="hero-section">
      <div class="hero-cover" style="background:${game.cover}">
        <span>${escapeHTML(game.title.charAt(0))}</span>
      </div>
      <div class="hero-info">
        <h1 class="hero-title">${escapeHTML(game.title)}</h1>
        <div class="hero-tags">
          <span class="tag">${escapeHTML(game.platform)}</span>
          <span class="tag">${escapeHTML(game.genre)}</span>
          <span class="tag">${game.year} 年</span>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-label">综合评分</span>
            <span class="stat-value rating">★ ${Number(game.rating).toFixed(1)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">游玩时长</span>
            <span class="stat-value">${game.hours} 小时</span>
          </div>
        </div>

        <div class="hero-actions">
          <a href="../index.html" class="btn btn-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            返回首页
          </a>
          <button class="btn btn-fav ${isFav ? 'active' : ''}" id="favBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span id="favText">${isFav ? '已加入喜欢' : '加入喜欢'}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="article-section">
      <article class="prose">
        ${articleContent}
      </article>
    </section>
  `;

  mainEl.innerHTML = html;

  // 6. 绑定收藏按钮点击事件
  const favBtn = document.getElementById("favBtn");
  const favText = document.getElementById("favText");
  
  favBtn.addEventListener("click", () => {
    // 重新读取最新状态
    const currentState = getState();
    const idx = currentState.favorites.indexOf(game.id);
    
    if (idx > -1) {
      // 取消收藏
      currentState.favorites.splice(idx, 1);
      favBtn.classList.remove("active");
      favBtn.querySelector("svg").setAttribute("fill", "none");
      favText.textContent = "加入喜欢";
    } else {
      // 添加收藏
      currentState.favorites.push(game.id);
      favBtn.classList.add("active");
      favBtn.querySelector("svg").setAttribute("fill", "currentColor");
      favText.textContent = "已加入喜欢";
    }
    
    saveState(currentState);
  });

  // 错误提示
  function renderError(msg) {
    mainEl.innerHTML = `
      <div class="error-msg">
        <h2>⚠️ ${msg}</h2>
        <br>
        <a href="../index.html" class="btn btn-back" style="display:inline-flex; width:auto;">返回首页</a>
      </div>
    `;
  }
})();