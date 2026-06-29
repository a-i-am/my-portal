const biomedProjects = [
    {
        title: "상지 근골격계 해부도 시리즈",
        subtitle: "Upper Limb Musculoskeletal Series",
        year: "2026",
        tags: ["해부학", "근골격계", "상지", "일러스트"],
        thumb: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=300&fit=crop",
        desc: "어깨에서 손목까지 이어지는 상지 전체 근골격계를 레이어 기반 구조로 시각화. 기시와 정지의 해부학적 정확성을 최우선으로 했으며, 총 14장의 시리즈로 구성.",
        tools: ["Procreate", "ZBrush", "Adobe Illustrator"],
        color: "#8d9568",
    },
    {
        title: "심장 판막 수술 절차 삽화",
        subtitle: "Cardiac Valve Surgery Procedure Illustration",
        year: "2025",
        tags: ["심장", "외과수술", "절차도", "의학삽화"],
        thumb: "https://images.unsplash.com/photo-1715111965644-3d885beb3a44?w=400&h=300&fit=crop",
        desc: "심장 외과의와의 협업으로 완성된 판막 치환 수술 절차 시각화. 수술 단계별 절개 방향, 봉합 위치, 카테터 경로를 정밀하게 도해.",
        tools: ["Adobe Illustrator", "Photoshop", "Blender"],
        color: "#f2fedc",
    },
    {
        title: "신경계 교육용 3D 인터랙티브 모델",
        subtitle: "Nervous System Educational 3D Model",
        year: "2025",
        tags: ["신경계", "3D모델링", "교육용", "인터랙티브"],
        thumb: "https://images.unsplash.com/photo-1715529134960-b49e99668dcc?w=400&h=300&fit=crop",
        desc: "중추신경계와 말초신경계를 레이어별로 분해 가능한 3D 교육 모델. 의대생 대상 실습 자료로 개발되었으며, 뇌간에서 척수와 말초 분지까지 포함.",
        tools: ["ZBrush", "Blender", "Substance Painter"],
        color: "#c5ee3b",
    },
    {
        title: "척추 디스크 병리학 비교 시각화",
        subtitle: "Spinal Disc Pathology Comparison",
        year: "2024",
        tags: ["척추", "병리학", "비교도", "MRI참조"],
        thumb: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=300&fit=crop&crop=bottom",
        desc: "정상 디스크와 탈출, 협착 상태의 단계별 진행을 나란히 배치한 비교 삽화. 실제 MRI 이미지를 참조해 각 조직의 형태 변화를 반영.",
        tools: ["Adobe Illustrator", "Procreate"],
        color: "#8d9568",
    },
];

const gameProjects = [
    {
        title: "커스텀 DirectX 12 렌더러",
        subtitle: "Custom DirectX 12 Renderer",
        year: "2026",
        tags: ["DirectX12", "C++", "렌더링", "HLSL"],
        thumb: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=260&fit=crop",
        desc: "DX12 기반의 경량 렌더링 엔진. Descriptor Heap 풀 관리, Bindless 텍스처, PSO 캐싱 시스템을 자체 구현.",
        stats: [{ label: "드로우콜 감소", value: "68%" }, { label: "FPS 향상", value: "2.4x" }],
        lang: "C++ / HLSL",
        color: "#c5ee3b",
    },
    {
        title: "메모리 풀 관리 시스템",
        subtitle: "Custom Memory Pool Manager",
        year: "2025",
        tags: ["메모리관리", "C++", "최적화", "풀링"],
        thumb: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=260&fit=crop",
        desc: "게임 런타임 힙 단편화를 최소화하는 계층형 메모리 풀. 프레임 단위 스택 할당자와 오브젝트 풀을 결합한 방식.",
        stats: [{ label: "단편화 감소", value: "82%" }, { label: "할당 속도", value: "15x" }],
        lang: "C++17",
        color: "#f2fedc",
    },
    {
        title: "C++ ECS 프레임워크",
        subtitle: "Entity Component System Framework",
        year: "2025",
        tags: ["ECS", "C++", "아키텍처", "DOD"],
        thumb: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=260&fit=crop",
        desc: "데이터 지향 설계 원칙에 따라 설계된 경량 ECS. Archetype 기반 컴포넌트 저장으로 캐시 효율을 높였습니다.",
        stats: [{ label: "엔티티 처리", value: "100K/frame" }, { label: "캐시 히트율", value: "94%" }],
        lang: "C++20",
        color: "#c5ee3b",
    },
    {
        title: "언리얼 엔진 플러그인 - AI LOD",
        subtitle: "Unreal Engine AI LOD Plugin",
        year: "2024",
        tags: ["언리얼엔진", "C++", "LOD", "AI"],
        thumb: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=260&fit=crop&crop=left",
        desc: "카메라 거리, 각도, 현재 FPS를 종합 판단하여 LOD 레벨을 동적으로 조정하는 UE5 플러그인.",
        stats: [{ label: "GPU 부하 절감", value: "30%" }, { label: "지원 언리얼", value: "UE5.4+" }],
        lang: "C++ / Blueprint",
        color: "#8d9568",
    },
];

let blogPosts = [
    {
        id: "drawcall-optimization",
        category: "game",
        categoryLabel: "게임 클라이언트",
        title: "드로우콜 최적화: Instancing과 배칭의 이론과 실전",
        date: "2026년 6월 25일",
        readMin: 12,
        tags: ["DirectX12", "최적화", "렌더링"],
        thumb: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=200&h=140&fit=crop",
        excerpt: "대규모 오픈월드 씬에서 동일 메시를 효율적으로 렌더링하려면 드로우콜 수를 줄여야 합니다.",
        body: "# 드로우콜 최적화\n\nInstancing과 배칭은 동일 렌더 상태를 묶어 CPU 제출 비용을 낮추는 기본 전략입니다.\n\n## 핵심\n\n- 동일 메시와 머티리얼을 먼저 묶기\n- 상태 변경을 줄이기\n- 측정 후 병목만 최적화하기",
        color: "#c5ee3b",
    },
    {
        id: "upper-limb-origin-insertion",
        category: "biomed",
        categoryLabel: "바이오 메디컬 아트",
        title: "상지 해부학 시각화의 기준점 설정법: Origin과 Insertion",
        date: "2026년 6월 12일",
        readMin: 8,
        tags: ["해부학", "근골격계", "일러스트"],
        thumb: "https://images.unsplash.com/photo-1715111965644-3d885beb3a44?w=200&h=140&fit=crop",
        excerpt: "해부학 일러스트에서 근육의 기시와 정지는 형태보다 먼저 검증해야 하는 기준점입니다.",
        body: "# 상지 해부학 시각화\n\n근육 표현은 기시와 정지를 먼저 고정한 뒤 부피와 방향성을 잡는 순서가 안정적입니다.\n\n## 작업 순서\n\n1. 기준 골격 배치\n2. 기시와 정지 확인\n3. 근섬유 방향 정리",
        color: "#8d9568",
    },
    {
        id: "descriptor-heap",
        category: "game",
        categoryLabel: "게임 클라이언트",
        title: "DirectX 12에서의 Descriptor Heap 관리 전략",
        date: "2026년 5월 30일",
        readMin: 15,
        tags: ["DirectX12", "GPU", "C++"],
        thumb: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=200&h=140&fit=crop",
        excerpt: "DX12의 Descriptor 관리는 렌더링 성능과 안정성에 직접 영향을 주는 저수준 책임입니다.",
        body: "# Descriptor Heap 관리\n\nDescriptor Heap은 프레임 수명과 리소스 수명을 분리해 관리하면 단순해집니다.\n\n## 원칙\n\n- 프레임 임시 할당은 링 버퍼\n- 장기 리소스는 고정 슬롯\n- 재사용은 fence 이후",
        color: "#c5ee3b",
    },
    {
        id: "medical-art-validation",
        category: "biomed",
        categoryLabel: "바이오 메디컬 아트",
        title: "의학 삽화 제작 시 해부학적 고증 방법론",
        date: "2026년 5월 18일",
        readMin: 10,
        tags: ["의학삽화", "고증", "방법론"],
        thumb: "https://images.unsplash.com/photo-1715529134960-b49e99668dcc?w=200&h=140&fit=crop",
        excerpt: "의학 삽화는 커뮤니케이션 도구입니다. 정확성 검증은 미감보다 먼저 끝내야 합니다.",
        body: "# 해부학적 고증 방법론\n\n작업 전 참고 문헌, 의료 영상, 전문가 피드백을 한 흐름으로 묶어 오류를 줄입니다.\n\n## 체크\n\n- 구조 이름\n- 위치 관계\n- 임상적 맥락",
        color: "#8d9568",
    },
    {
        id: "memory-pool",
        category: "game",
        categoryLabel: "게임 클라이언트",
        title: "C++ 메모리 단편화와 풀 할당자 구현",
        date: "2026년 4월 22일",
        readMin: 14,
        tags: ["메모리", "C++", "최적화"],
        thumb: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=200&h=140&fit=crop",
        excerpt: "게임 런타임에서 예측 가능한 할당 시간은 프레임 안정성을 지키는 기본 조건입니다.",
        body: "# 메모리 풀 할당자\n\n고정 크기 객체가 많다면 범용 힙보다 풀 할당자가 단순하고 빠릅니다.\n\n## 적용 기준\n\n- 크기가 일정한 객체\n- 생성과 파괴가 잦은 객체\n- 프레임 타임 흔들림이 문제인 구간",
        color: "#c5ee3b",
    },
];

const navLabels = {
    home: "집 (Home)",
    biomed: "바이오 메디컬 아트",
    game: "게임 클라이언트",
    blog: "블로그",
    reader: "블로그",
    contact: "연락하다",
};

document.addEventListener("DOMContentLoaded", () => {
    bindNavigation();
    bindFilters();
    bindContactForm();
    renderProjects("biomed-grid", biomedProjects, "biomed");
    renderProjects("game-grid", gameProjects, "game");
    loadManifestPosts();
    route(location.hash.replace("#", "") || "home", false);
});

async function loadManifestPosts() {
    try {
        const response = await fetch("posts/posts.json", { cache: "no-store" });
        if (!response.ok) throw new Error("missing manifest");
        const manifest = await response.json();
        const normalized = manifest.map((post) => ({
            id: post.id || post.file || post.title,
            category: normalizeCategory(post.category),
            categoryLabel: post.category || "Blog",
            title: post.title,
            date: post.date,
            readMin: post.readMin || 5,
            tags: post.tags || [],
            thumb: post.thumb || "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=200&h=140&fit=crop",
            excerpt: post.summary || "",
            file: post.file,
            body: post.body,
            color: normalizeCategory(post.category) === "biomed" ? "#8d9568" : "#c5ee3b",
        }));
        const knownIds = new Set(normalized.map((post) => post.id));
        blogPosts = [...normalized, ...blogPosts.filter((post) => !knownIds.has(post.id))];
    } catch (error) {
        // ponytail: static fallback keeps the site useful without a manifest.
    }
    renderHomePosts();
    renderBlogPosts("all");
}

function normalizeCategory(category = "") {
    const text = category.toLowerCase();
    if (text.includes("bio") || text.includes("의학") || text.includes("해부")) return "biomed";
    if (text.includes("game") || text.includes("dev") || text.includes("til") || text.includes("c++")) return "game";
    return "all";
}

function bindNavigation() {
    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-route]");
        if (!trigger) return;
        event.preventDefault();
        route(trigger.dataset.route);
    });

    const toggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    toggle.addEventListener("click", () => {
        const open = mobileNav.hidden;
        mobileNav.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
    });
}

function bindFilters() {
    document.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-filter]").forEach((el) => el.classList.remove("active"));
            button.classList.add("active");
            renderBlogPosts(button.dataset.filter);
        });
    });
}

function bindContactForm() {
    const form = document.getElementById("contact-form");
    const result = document.getElementById("contact-result");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.reset();
        result.textContent = "메시지를 전송했습니다. 1-2 영업일 내로 회신드리겠습니다.";
    });
}

function route(view, updateHash = true) {
    const target = document.getElementById(`view-${view}`) ? view : "home";
    document.querySelectorAll(".view-section").forEach((section) => section.classList.remove("active"));
    document.getElementById(`view-${target}`).classList.add("active");

    const activeRoute = target === "reader" ? "blog" : target;
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.route === activeRoute);
    });

    document.getElementById("mobile-nav-label").textContent = navLabels[target] || navLabels.home;
    document.getElementById("mobile-nav").hidden = true;
    document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");

    if (updateHash && target !== "reader") history.replaceState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHomePosts() {
    const container = document.getElementById("recent-posts");
    container.innerHTML = blogPosts.slice(0, 3).map((post) => postPreview(post)).join("");
    container.querySelectorAll("[data-post]").forEach((card) => {
        card.addEventListener("click", () => openPost(card.dataset.post));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") openPost(card.dataset.post);
        });
    });
}

function renderProjects(containerId, projects, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = projects.map((project, index) => projectCard(project, index, type)).join("");
    container.querySelectorAll("[data-project]").forEach((card) => {
        card.addEventListener("click", () => {
            const project = projects[Number(card.dataset.project)];
            openProjectModal(project, type);
        });
    });
}

function projectCard(project, index, type) {
    const details = type === "game"
        ? `<div class="project-stats">${project.stats.map((stat) => `<span>${stat.value} ${stat.label}</span>`).join("")}</div>`
        : `<div class="mini-tags">${project.tags.slice(0, 3).map((tag) => `<span>#${tag}</span>`).join("")}</div>`;

    return `
        <button class="project-card box" type="button" data-project="${index}">
            <div class="project-media">
                <img src="${project.thumb}" alt="${project.title}">
                <span class="project-chip" style="background:${project.color}">${project.year}</span>
            </div>
            <div class="project-body">
                <h3>${project.title}</h3>
                <small>${project.subtitle}</small>
                <p>${project.desc}</p>
                ${details}
            </div>
        </button>
    `;
}

function renderBlogPosts(filter) {
    const posts = filter === "all" ? blogPosts : blogPosts.filter((post) => post.category === filter);
    const container = document.getElementById("blog-list");
    container.innerHTML = posts.map((post) => blogCard(post)).join("") || `<p class="box markdown-body">게시물이 없습니다.</p>`;
    container.querySelectorAll("[data-post]").forEach((card) => {
        card.addEventListener("click", () => openPost(card.dataset.post));
    });
}

function postPreview(post) {
    return `
        <button class="post-preview" type="button" data-post="${post.id}">
            <img src="${post.thumb}" alt="${post.title}">
            <span class="post-copy">
                <span class="post-meta">
                    <span class="category-chip" style="background:${post.color}">${post.categoryLabel}</span>
                    <span>${post.date}</span>
                </span>
                <h3>${post.title}</h3>
                <span>${post.excerpt}</span>
            </span>
        </button>
    `;
}

function blogCard(post) {
    return `
        <article class="blog-card" data-post="${post.id}" tabindex="0" role="button">
            <img src="${post.thumb}" alt="${post.title}">
            <div class="blog-copy">
                <div class="blog-meta">
                    <span class="category-chip" style="background:${post.color}">${post.categoryLabel}</span>
                    <span>${post.readMin}분 읽기</span>
                    <time>${post.date}</time>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-tags">${post.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            </div>
        </article>
    `;
}

async function openPost(id) {
    const post = blogPosts.find((item) => item.id === id);
    if (!post) return;

    route("reader", false);
    const body = document.getElementById("post-body");
    body.innerHTML = "<p>게시글을 불러오는 중...</p>";

    let markdown = post.body || `# ${post.title}\n\n${post.excerpt}`;
    if (post.file) {
        try {
            const response = await fetch(post.file);
            if (response.ok) markdown = await response.text();
        } catch (error) {
            markdown = post.body || markdown;
        }
    }

    markdown = markdown.replace(/^---[\s\S]*?---/, "").trim();
    body.innerHTML = window.marked ? marked.parse(markdown) : markdown;
    if (window.hljs) hljs.highlightAll();
    renderToc(body);
}

function renderToc(body) {
    const headings = body.querySelectorAll("h1, h2, h3");
    const toc = document.getElementById("reader-toc");
    const links = document.getElementById("toc-links");
    links.innerHTML = "";
    toc.hidden = headings.length === 0;

    headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        links.appendChild(link);
    });
}

function openProjectModal(project, type) {
    const root = document.getElementById("modal-root");
    const stats = project.stats
        ? `<div class="modal-stats">${project.stats.map((stat) => `<div><strong>${stat.value}</strong><span>${stat.label}</span></div>`).join("")}</div>`
        : "";
    const tools = project.tools
        ? `<div class="mini-tags">${project.tools.map((tool) => `<span>${tool}</span>`).join("")}</div>`
        : "";

    root.innerHTML = `
        <div class="modal-backdrop" role="presentation">
            <section class="modal" role="dialog" aria-modal="true" aria-label="${project.title}">
                <div class="modal-head" style="background:${project.color}">
                    <span>${type === "game" ? "프로젝트 상세" : "프로젝트 상세"}</span>
                    <button type="button" aria-label="닫기" data-close-modal>x</button>
                </div>
                <div class="modal-body">
                    <img src="${project.thumb}" alt="${project.title}">
                    <h2>${project.title}</h2>
                    <p class="modal-subtitle">${project.subtitle} · ${project.year}</p>
                    <p>${project.desc}</p>
                    ${stats}
                    ${tools}
                    <div class="mini-tags">${project.tags.map((tag) => `<span>#${tag}</span>`).join("")}</div>
                </div>
            </section>
        </div>
    `;

    root.querySelector(".modal-backdrop").addEventListener("click", (event) => {
        if (event.target.classList.contains("modal-backdrop") || event.target.matches("[data-close-modal]")) {
            closeProjectModal();
        }
    });
    document.addEventListener("keydown", closeOnEscape);
}

function closeProjectModal() {
    document.getElementById("modal-root").innerHTML = "";
    document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(event) {
    if (event.key === "Escape") closeProjectModal();
}
