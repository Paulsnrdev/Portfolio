// Fetches published content from the admin backend and overlays it onto the
// static markup already in the page. If the backend is unreachable, the
// hardcoded HTML that's already in the DOM stays as-is — nothing breaks.

const API_BASE = 'http://localhost:4000';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}

function resolveHref(href) {
  // Footer links are authored for the home page. On other pages, a bare "#section"
  // link needs to point back at the home page instead of anchoring on the current page.
  const onIndex = /(^|\/)index\.html$/.test(location.pathname) || location.pathname === '/' || location.pathname.endsWith('/');
  if (!onIndex && href && href.startsWith('#')) return '/' + href;
  return href;
}

function populateNavbar(live) {
  if (!live.navbar) return;
  setText('navLogo', live.navbar.logoText);
  const cta = document.getElementById('navCta');
  if (cta && live.navbar.hireLink) {
    const link = live.navbar.hireLink;
    cta.href = link.includes('@') && !/^https?:\/\//.test(link) ? `mailto:${link}` : link;
  }
}

function populateHero(live) {
  if (!live.hero) return;
  const badgeText = document.getElementById('heroBadgeText');
  if (badgeText) badgeText.textContent = live.hero.badge;
  setText('heroTitleLine1', live.hero.titleLine1);
  setText('heroTitleAccent', live.hero.titleAccent);
  setText('heroSubtitle', live.hero.subtitle);
  setText('heroDescription', live.hero.description);

  const term = document.getElementById('terminalBody');
  const lines = live.hero.terminalLines;
  if (term && Array.isArray(lines) && lines.length === 3) {
    const [whoami, stack, status] = lines;
    term.innerHTML = `
      <div class="terminal-line"><span class="terminal-prompt">$</span>whoami</div>
      <span class="terminal-output"><strong>${escapeHtml(whoami)}</strong></span>
      <div class="terminal-line"><span class="terminal-prompt">$</span>stack --list</div>
      <span class="terminal-output">${escapeHtml(stack)}</span>
      <div class="terminal-line"><span class="terminal-prompt">$</span>status</div>
      <span class="terminal-output">${escapeHtml(status).replace(/\n/g, '<br>')}<span class="terminal-cursor"></span></span>
    `;
  }
}

function populateExpertise(live) {
  const grid = document.getElementById('skillsGrid');
  if (!grid || !live.expertise || !Array.isArray(live.expertise.categories)) return;
  grid.innerHTML = live.expertise.categories
    .map(
      (cat) => `
      <div class="card skill-category">
        <div class="skill-cat-header"><h3>${escapeHtml(cat.name)}</h3></div>
        <div class="skill-pills">${(cat.skills || []).map((s) => `<span class="skill-pill">${escapeHtml(s)}</span>`).join('')}</div>
      </div>`
    )
    .join('');
}

function populateAbout(live) {
  if (!live.about) return;
  const paras = document.getElementById('aboutParagraphs');
  if (paras && Array.isArray(live.about.paragraphs)) {
    paras.innerHTML = live.about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  }
  const stats = document.getElementById('aboutStats');
  if (stats && Array.isArray(live.about.stats)) {
    stats.innerHTML = live.about.stats
      .map((s) => `<div class="stat-block"><h4>${escapeHtml(s.label)}</h4><p>${escapeHtml(s.value)}</p></div>`)
      .join('');
  }
  const highlights = document.getElementById('aboutHighlights');
  if (highlights && Array.isArray(live.about.highlights)) {
    highlights.innerHTML = live.about.highlights
      .map(
        (h) => `
        <div class="highlight-item">
          <div class="highlight-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg></div>
          <h4>${escapeHtml(h.title)}</h4>
          <p>${escapeHtml(h.subtitle)}</p>
        </div>`
      )
      .join('');
  }
  const edu = live.about.education;
  if (edu) {
    setText('eduSchool', edu.school);
    setText('eduDegree', edu.degree);
    setText('eduPeriod', edu.period);
    const tags = document.getElementById('courseTags');
    if (tags && Array.isArray(edu.coursework)) {
      tags.innerHTML = edu.coursework.map((c) => `<span class="course-tag">${escapeHtml(c)}</span>`).join('');
    }
  }
}

function populateFooter(live) {
  if (!live.footer) return;
  setText('footerLogo', live.footer.logoText);
  setText('footerRole', live.footer.roleText);
  const links = document.getElementById('footerLinksEl');
  if (links && Array.isArray(live.footer.links)) {
    links.innerHTML = live.footer.links
      .map((l) => `<a href="${escapeHtml(resolveHref(l.href))}">${escapeHtml(l.label)}</a>`)
      .join('');
  }
  setText('footerCopy', live.footer.copyright);
}

function populateTestimonials(live) {
  const section = document.getElementById('testimonials');
  const grid = document.getElementById('testimonialsGrid');
  if (!section || !grid || !Array.isArray(live.testimonials)) return;
  if (!live.testimonials.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  grid.innerHTML = live.testimonials
    .map(
      (t) => `
      <div class="card testimonial-card">
        <p class="testimonial-quote">&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
        <div class="testimonial-author"><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.role)}</span></div>
      </div>`
    )
    .join('');
}

function populateFaq(live) {
  const section = document.getElementById('faq');
  const list = document.getElementById('faqList');
  if (!section || !list || !Array.isArray(live.faq)) return;
  if (!live.faq.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  list.innerHTML = live.faq
    .map((f) => `<div class="card faq-item"><h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p></div>`)
    .join('');
}

function populateProjects(live) {
  if (!Array.isArray(live.projects) || !live.projects.length) return;
  if (typeof PROJECTS === 'undefined') return;
  PROJECTS.length = 0;
  PROJECTS.push(...live.projects);
  if (typeof renderFeaturedProjects === 'function') renderFeaturedProjects();
  if (typeof renderAllProjects === 'function') renderAllProjects();
  if (typeof initProjectFilters === 'function') initProjectFilters();
}

function pingAnalytics() {
  fetch(API_BASE + '/api/analytics/view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: location.pathname }),
    keepalive: true
  }).catch(() => {});
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  const name = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const type = document.getElementById('cf-type').value;
  const messageText = document.getElementById('cf-message').value;

  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    const res = await fetch(API_BASE + '/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: `[${type}] ${messageText}` })
    });
    if (!res.ok) throw new Error('Send failed');
    btn.textContent = 'Message sent ✓';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
    }, 3000);
  } catch {
    btn.textContent = 'Failed — try again';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  }
}
window.handleContactSubmit = handleContactSubmit;

async function initSiteContent() {
  pingAnalytics();
  try {
    const res = await fetch(API_BASE + '/api/content/live');
    if (!res.ok) return;
    const live = await res.json();
    populateNavbar(live);
    populateHero(live);
    populateExpertise(live);
    populateAbout(live);
    populateFooter(live);
    populateTestimonials(live);
    populateFaq(live);
    populateProjects(live);
  } catch {
    // Backend unreachable — the hardcoded content already rendered stays as-is.
  }
}

initSiteContent();
