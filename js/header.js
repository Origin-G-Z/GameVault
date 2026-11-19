// js/header.js
// 顶部导航栏的公共交互：滚动时切换导航栏状态

(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  if (!header) return;

  // 触发阈值：滚动超过 80px 后导航栏加深
  const THRESHOLD = 80;
  let ticking = false;

  function updateHeaderState() {
    const scrolled = window.scrollY > THRESHOLD;
    header.classList.toggle('scrolled', scrolled);
    ticking = false;
  }

  // 用 requestAnimationFrame 节流，避免滚动时高频触发
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }, { passive: true });

  // 初始化一次，防止刷新页面时已经在滚动位置
  updateHeaderState();
})();
