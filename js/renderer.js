// 渲染器：把游戏数据对象转成 HTML 字符串。

const slug = (s) =>
  s.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

// 极简行内语法：**粗** / *斜*z
const inline = (s = '') =>
  String(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

function renderTable(b) {
  const head = b.headers
    ? `<thead><tr>${b.headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`
    : '';
  const body = `<tbody>${b.rows
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;
  return `<div class="table-wrap"><table>${head}${body}</table></div>`;
}

function renderBlock(b, toc) {
  switch (b.type) {
    case 'h2': {
      const id = b.id || slug(b.text);
      toc.push({ id, text: b.text, level: 2 });
      return `<h2 id="${id}">${inline(b.text)}</h2>`;
    }
    case 'h3': {
      const id = b.id || slug(b.text);
      toc.push({ id, text: b.text, level: 3 });
      return `<h3 id="${id}">${inline(b.text)}</h3>`;
    }
    case 'p':
      return `<p>${inline(b.text ?? b.html)}</p>`;
    case 'quote':
      return `<blockquote>${inline(b.text ?? b.html)}</blockquote>`;
    case 'ul':
      return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
    case 'table':
      return renderTable(b);
    case 'callout': {
      const title = b.title ? `<div class="callout-title">${inline(b.title)}</div>` : '';
      return `<aside class="callout ${b.tone || ''}">${title}<div>${inline(b.text ?? b.html)}</div></aside>`;
    }
    // 新增：支持正文内部插图
    case 'image': {
      const caption = b.caption ? `<div class="image-caption">${inline(b.caption)}</div>` : '';
      return `<figure class="article-image"><img src="${b.src}" alt="${b.alt || ''}" loading="lazy" />${caption}</figure>`;
    }
    case 'hr':
      return '<hr />';
    default:
      console.warn('未知 block 类型：', b.type);
      return '';
  }
}

// 修改：增加了 meta 参数，用于接收 registry 里的封面图等数据
function renderGame(game, meta) {
  const toc = [];
  const body = game.blocks.map((b) => renderBlock(b, toc)).join('\n');

  const tocHtml = toc
    .filter((t) => t.level === 2)
    .map((t) => `<a href="#${t.id}" class="toc-link">${t.text}</a>`)
    .join('');

  const tags = (game.tags || [])
    .map((t) => `<span class="tag">${inline(t)}</span>`)
    .join('');

  // 获取大图（如果没有专属横幅，就用首页的封面图）
  const bannerImage = meta.cover || '';

  return `
    <article class="game">
      <!-- 新增：顶部大图 Hero 区 -->
      <header class="game-hero" style="background-image: url('.${bannerImage}')">
        <div class="hero-overlay">
          <div class="game-en">${game.en || ''}</div>
          <h1 class="game-title">${game.title}</h1>
          <p class="game-tagline">${inline(game.tagline || '')}</p>
          <div class="tags">${tags}</div>
        </div>
      </header>

      <!-- 正文与侧边目录 -->
      <div class="layout">
        <div class="game-body">${body}</div>
        ${tocHtml ? `<nav class="toc"><div class="toc-title">目录导航</div>${tocHtml}</nav>` : ''}
      </div>
    </article>
  `;
}