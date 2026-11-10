/* ========== index.js · 首页逻辑 ========== */
(function () {
  "use strict";

  const state = ensureState(getAllGames());

  let currentTab = "played";      // played | favorite
  let currentPlatform = "all";
  let currentGenre = "all";
  let keyword = "";

  const grid = document.getElementById("gameGrid");
  const emptyState = document.getElementById("emptyState");
  const resultInfo = document.getElementById("resultInfo");
  const searchInput = document.getElementById("searchInput");
  const playedCount = document.getElementById("playedCount");
  const favCount = document.getElementById("favCount");
  const platformFilter = document.getElementById("platformFilter");
  const genreFilter = document.getElementById("genreFilter");

  /* ---------- 数据过滤 ---------- */
  function getFilteredGames() {
    const idSet = new Set(currentTab === "played" ? state.played : state.favorites);
    const kw = keyword.toLowerCase();

    return getAllGames().filter(g => {
      if (!idSet.has(g.id)) return false;
      if (currentPlatform !== "all" && g.platform !== currentPlatform) return false;
      if (currentGenre !== "all" && g.genre !== currentGenre) return false;
      if (kw && !String(g.title).toLowerCase().includes(kw)) return false;
      return true;
    });
  }

  /* ---------- 卡片模板 ---------- */
  function cardHTML(g) {
    const isFav = state.favorites.includes(g.id);
    const isPlayed = state.played.includes(g.id);
    const firstChar = String(g.title).charAt(0);

    return `
      <article class="game-card" data-id="${g.id}" tabindex="0"
               role="button" aria-label="查看 ${escapeHTML(g.title)} 详情">
        <div class="cover" style="background:${g.cover}">
          <span>${escapeHTML(firstChar)}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(g.title)}</h3>
          <div class="tags">
            <span class="tag">${escapeHTML(g.platform)}</span>
            <span class="tag">${escapeHTML(g.genre)}</span>
            <span class="tag">${g.year}</span>
          </div>
          <p class="card-desc">${escapeHTML(g.description)}</p>
          <div class="card-foot">
            <span class="rating">★ ${Number(g.rating).toFixed(1)}</span>
            <span class="hours">${g.hours} 小时</span>
          </div>
          <div class="badges">
            ${isPlayed ? '<span class="badge badge-played">已玩过</span>' : ""}
            ${isFav ? '<span class="badge badge-fav">♥ 喜欢</span>' : ""}
          </div>
        </div>
      </article>
    `;
  }

  /* ---------- 渲染 ---------- */
  function render() {
    const list = getFilteredGames();

    grid.innerHTML = list.map(cardHTML).join("");
    emptyState.hidden = list.length > 0;

    resultInfo.textContent = list.length ? `共 ${list.length} 款游戏` : "";

    playedCount.textContent = state.played.length;
    favCount.textContent = state.favorites.length;
  }

  /* ---------- Tab 切换 ---------- */
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      document.querySelectorAll(".tab").forEach(b => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      render();
    });
  });

  /* ---------- 筛选栏：事件委托 ---------- */
  function bindFilterBar(bar, onSelect) {
    bar.addEventListener("click", e => {
      const btn = e.target.closest("[data-value]");
      if (!btn) return;
      bar.querySelectorAll("[data-value]").forEach(b => {
        b.classList.toggle("active", b === btn);
      });
      onSelect(btn.dataset.value);
      render();
    });
  }

  bindFilterBar(platformFilter, value => { currentPlatform = value; });
  bindFilterBar(genreFilter, value => { currentGenre = value; });

  /* ---------- 搜索 ---------- */
  searchInput.addEventListener("input", e => {
    keyword = e.target.value.trim();
    render();
  });

  /* ---------- 卡片点击：事件委托跳详情 ---------- */
  function goDetail(card) {
    if (!card) return;
    location.href = `pages/detail.html?id=${encodeURIComponent(card.dataset.id)}`;
  }

  grid.addEventListener("click", e => {
    goDetail(e.target.closest(".game-card"));
  });

  grid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".game-card");
    if (!card) return;
    e.preventDefault();
    goDetail(card);
  });

  /* ---------- 启动 ---------- */
  render();
})();