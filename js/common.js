/* ========== common.js · 公共工具 / 状态管理 ========== */

const STORAGE_KEY_STATE = "gv_state";
const STORAGE_KEY_CUSTOM = "gv_custom_games";

/* 防 XSS：渲染用户输入前先转义 */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[s]));
}

/* 读取用户自定义添加的游戏（manage 页写入，index 页合并渲染） */
function getCustomGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.warn("读取自定义游戏失败：", e);
    return [];
  }
}

/* 初始数据 + 用户自定义数据 */
function getAllGames() {
  return GAMES.concat(getCustomGames());
}

/* 读取“喜欢 / 玩过”状态 */
function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    const s = raw ? JSON.parse(raw) : null;
    if (s && Array.isArray(s.favorites) && Array.isArray(s.played)) {
      return s;
    }
  } catch (e) {
    console.warn("读取状态失败：", e);
  }
  return { favorites: [], played: [] };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
}

/* 首次访问：用 data.js 的默认 isPlayed / isFavorite 初始化 localStorage */
function ensureState(games) {
  if (localStorage.getItem(STORAGE_KEY_STATE)) {
    return getState();
  }
  const state = {
    favorites: games.filter(g => g.isFavorite).map(g => g.id),
    played: games.filter(g => g.isPlayed).map(g => g.id)
  };
  saveState(state);
  return state;
}