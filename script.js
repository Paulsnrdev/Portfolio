// Theme toggle
const themeIcon = document.querySelector('.theme-icon');

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    themeIcon.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Apply saved theme on load
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeIcon.textContent = '🌙';
}

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Mobile menu
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });
}

// ---- Project rendering (shared by index.html and projects.html) ----
// Reads PROJECTS / PROJECT_CATEGORIES from projects-data.js

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.textContent;
}

function projectLinksHtml(project) {
    return `
        <div class="project-links">
            <a href="${project.live}" target="_blank" rel="noopener" class="project-link-icon" aria-label="${escapeHtml(project.name)} live demo" title="Live demo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <a href="${project.repo}" target="_blank" rel="noopener" class="project-link-icon" aria-label="${escapeHtml(project.name)} GitHub repository" title="GitHub repository">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
        </div>
    `;
}

function featuredCardHtml(project, index, isLead) {
    return `
        <article class="card project-card${isLead ? ' lead' : ''}" tabindex="0">
            <div class="project-card-top">
                <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
                ${projectLinksHtml(project)}
            </div>
            <h3>${escapeHtml(project.name)}</h3>
            <p class="project-tagline">${escapeHtml(project.tagline)}</p>
            ${isLead ? `<p class="project-problem">${escapeHtml(project.problem)}</p>` : ''}
            <p class="project-role">${escapeHtml(project.role)}</p>
            <div class="project-tags">
                ${project.stack.map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <ul class="project-features">
                ${project.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
        </article>
    `;
}

function compactCardHtml(project) {
    return `
        <article class="card project-card" data-categories="${project.categories.join(',')}" tabindex="0">
            <div class="project-card-top">
                <span class="project-index">${escapeHtml(project.categories[0])}</span>
                ${projectLinksHtml(project)}
            </div>
            <h3>${escapeHtml(project.name)}</h3>
            <p class="project-tagline">${escapeHtml(project.tagline)}</p>
            <p class="project-role">${escapeHtml(project.role)}</p>
            <div class="project-tags">
                ${project.stack.slice(0, 4).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
            <ul class="project-features">
                ${project.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
        </article>
    `;
}

function renderFeaturedProjects() {
    const target = document.getElementById('featured-projects');
    if (!target || typeof PROJECTS === 'undefined') return;
    const featured = PROJECTS.filter(p => p.featured);
    target.innerHTML = featured.map((p, i) => featuredCardHtml(p, i, i === 0)).join('');
}

function renderAllProjects(filter) {
    const target = document.getElementById('all-projects');
    if (!target || typeof PROJECTS === 'undefined') return;
    const list = filter && filter !== 'All'
        ? PROJECTS.filter(p => p.categories.includes(filter))
        : PROJECTS;
    target.innerHTML = list.map(compactCardHtml).join('');
}

function initProjectFilters() {
    const bar = document.getElementById('filter-bar');
    if (!bar || typeof PROJECT_CATEGORIES === 'undefined') return;
    bar.innerHTML = PROJECT_CATEGORIES.map((cat, i) =>
        `<button class="filter-btn${i === 0 ? ' active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');
    bar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAllProjects(btn.dataset.category);
    });
}

renderFeaturedProjects();
renderAllProjects();
initProjectFilters();
