let POSTS_MANIFEST = [];

window.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('portal_theme');
    if (savedTheme) setTheme(savedTheme);

    try {
        const res = await fetch('posts/posts.json');
        POSTS_MANIFEST = await res.json();
        renderBlogList('ALL');
    } catch (e) {
        console.error("게시글 목록을 불러오지 못했습니다.", e);
    }
});

function route(viewName, filter = null) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));

    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add('active');

    document.getElementById('right-toc').style.display = 'none';

    if (viewName === 'blog') {
        renderBlogList(filter || 'ALL');
        event?.currentTarget?.classList.add('active');
    }
}

function renderBlogList(category) {
    const container = document.getElementById('post-list-container');
    container.innerHTML = '';

    const filtered = category === 'ALL' 
        ? POSTS_MANIFEST 
        : POSTS_MANIFEST.filter(p => p.category === category);

    filtered.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post-item';
        div.onclick = () => loadMarkdownPost(post);
        div.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span style="color:var(--accent)">[${post.category}]</span>
                <span>${post.date}</span>
                <span>${post.summary || ''}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function filterCat(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBlogList(cat);
}

async function loadMarkdownPost(post) {
    route('reader');
    const reader = document.getElementById('post-body');
    reader.innerHTML = '<p style="color:var(--text-sub)">게시글을 불러오는 중...</p>';

    try {
        const res = await fetch(post.file);
        const mdText = await res.text();
        
        reader.innerHTML = marked.parse(mdText);
        hljs.highlightAll();

        // 목차(TOC) 파싱
        const headers = reader.querySelectorAll('h1, h2, h3');
        const tocContainer = document.getElementById('toc-links');
        tocContainer.innerHTML = '';

        if (headers.length > 0 && window.innerWidth > 768) {
            document.getElementById('right-toc').style.display = 'block';
            headers.forEach((h, idx) => {
                h.id = `heading-${idx}`;
                const a = document.createElement('a');
                a.href = `#heading-${idx}`;
                a.innerText = h.innerText;
                if (h.tagName === 'H3') a.className = 'h3';

                a.onclick = (e) => {
                    e.preventDefault();
                    h.scrollIntoView({ behavior: 'smooth' });
                };
                tocContainer.appendChild(a);
            });
        }
    } catch (e) {
        reader.innerHTML = '<p style="color:#ec4899">마크다운 파일을 읽어오지 못했습니다.</p>';
    }
}

function setTheme(color) {
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('portal_theme', color);
}