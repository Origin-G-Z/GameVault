// js/header.js
// 顶部导航栏的公共交互：滚动状态 + 高度回写

(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  if (!header) return;

  // ================= 1. 滚动状态 =================
  const THRESHOLD = 80;
  let ticking = false;

  function updateHeaderState() {
    header.classList.toggle('scrolled', window.scrollY > THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }, { passive: true });

  updateHeaderState();

  // ================= 2. 高度回写 =================
  // 把导航栏实际高度写入 CSS 变量 --header-h，
  // 首屏用 calc(100vh - var(--header-h)) 精确占满剩余视口。
  function syncHeaderHeight() {
    const h = header.offsetHeight;
    if (h > 0) {
      document.documentElement.style.setProperty('--header-h', h + 'px');
    }
  }

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);

  // 字体加载完成后高度可能微调，再校准一次
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight).catch(function () {});
  }
})();
