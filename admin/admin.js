requireAuthOrRedirect();

const SECTION_META = {
  navbar: { title: 'Navbar', desc: 'Logo text and Hire Me button link' },
  hero: { title: 'Hero', desc: 'Headline, subtitle, and terminal preview text' },
  expertise: { title: 'Expertise', desc: 'Skill categories shown in the Stack section' },
  projects: { title: 'Projects', desc: 'Featured work shown on the site' },
  testimonials: { title: 'Testimonials', desc: 'Quotes from clients and collaborators' },
  faq: { title: 'FAQ', desc: 'Frequently asked questions' },
  footer: { title: 'Footer', desc: 'Footer branding, links, and contact details' },
  about: { title: 'About + Exp.', desc: 'About text, stats, highlights, and education' },
  analytics: { title: 'Analytics', desc: 'Page view activity' },
  messages: { title: 'Messages', desc: 'Contact form submissions' }
};

const state = {
  draft: {},
  unsavedPublish: false,
  messages: [],
  activeSection: 'navbar'
};

const els = {
  nav: document.getElementById('sectionNav'),
  title: document.getElementById('sectionTitle'),
  desc: document.getElementById('sectionDesc'),
  body: document.getElementById('sectionBody'),
  unsavedPill: document.getElementById('unsavedPill'),
  publishBtn: document.getElementById('publishBtn'),
  msgBadge: document.getElementById('msgBadge'),
  toast: document.getElementById('toast')
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function toast(message, isError) {
  els.toast.textContent = message;
  els.toast.classList.toggle('error', Boolean(isError));
  els.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => els.toast.classList.remove('show'), 2600);
}

function setUnsavedPublish(value) {
  state.unsavedPublish = value;
  els.unsavedPill.classList.toggle('show', value);
}

// ---- Field helpers ----
// schema field types: text, textarea, checkbox, list (comma-separated), lines (newline-separated)

function fieldToHtml(field, value) {
  const id = `f_${field.key}`;
  if (field.type === 'textarea') {
    return `<div class="field"><label>${escapeHtml(field.label)}</label><textarea data-key="${field.key}" data-type="${field.type}">${escapeHtml(value || '')}</textarea></div>`;
  }
  if (field.type === 'checkbox') {
    return `<div class="field"><label><input type="checkbox" data-key="${field.key}" data-type="${field.type}" ${value ? 'checked' : ''}> ${escapeHtml(field.label)}</label></div>`;
  }
  if (field.type === 'list') {
    return `<div class="field"><label>${escapeHtml(field.label)}</label><input type="text" data-key="${field.key}" data-type="${field.type}" value="${escapeHtml((value || []).join(', '))}"><p class="tag-input-hint">Comma-separated</p></div>`;
  }
  if (field.type === 'lines') {
    return `<div class="field"><label>${escapeHtml(field.label)}</label><textarea data-key="${field.key}" data-type="${field.type}">${escapeHtml((value || []).join('\n'))}</textarea><p class="tag-input-hint">One per line</p></div>`;
  }
  return `<div class="field"><label>${escapeHtml(field.label)}</label><input type="text" data-key="${field.key}" data-type="${field.type}" value="${escapeHtml(value)}"></div>`;
}

function readFieldEl(el) {
  const type = el.dataset.type;
  if (type === 'checkbox') return el.checked;
  if (type === 'list') return el.value.split(',').map((s) => s.trim()).filter(Boolean);
  if (type === 'lines') return el.value.split('\n').map((s) => s.trim()).filter(Boolean);
  return el.value;
}

function bindFields(container, target) {
  container.querySelectorAll('[data-key]').forEach((el) => {
    const evt = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      target[el.dataset.key] = readFieldEl(el);
    });
  });
}

// ---- Generic repeater for arrays of flat objects ----

function renderRepeater(containerEl, array, schema, itemLabel, defaults) {
  function paint() {
    containerEl.innerHTML = array
      .map(
        (item, i) => `
        <div class="repeat-item" data-index="${i}">
          <div class="repeat-item-head">
            <span>${escapeHtml(itemLabel)} ${i + 1}</span>
            <button type="button" class="icon-btn" data-remove="${i}">✕</button>
          </div>
          ${schema.map((f) => fieldToHtml(f, item[f.key])).join('')}
        </div>`
      )
      .join('') + `<button type="button" class="btn btn-ghost" id="addBtn_${itemLabel.replace(/\s+/g, '')}">+ Add ${escapeHtml(itemLabel)}</button>`;

    containerEl.querySelectorAll('.repeat-item').forEach((itemEl) => {
      const idx = Number(itemEl.dataset.index);
      bindFields(itemEl, array[idx]);
    });
    containerEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        array.splice(Number(btn.dataset.remove), 1);
        paint();
      });
    });
    const addBtn = containerEl.querySelector(`#addBtn_${itemLabel.replace(/\s+/g, '')}`);
    addBtn.addEventListener('click', () => {
      array.push({ ...defaults });
      paint();
    });
  }
  paint();
}

function saveSectionButtonHtml() {
  return `<button type="button" class="btn btn-primary" id="saveSectionBtn">Save Changes</button>`;
}

function wireSaveButton(section) {
  document.getElementById('saveSectionBtn').addEventListener('click', async () => {
    const btn = document.getElementById('saveSectionBtn');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      await api(`/api/content/${section}`, { method: 'PUT', body: JSON.stringify(state.draft[section]) });
      setUnsavedPublish(true);
      toast('Draft saved.');
    } catch (err) {
      toast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  });
}

// ---- Section renderers ----

function renderNavbar() {
  const data = state.draft.navbar;
  els.body.innerHTML = `<div class="panel">${[
    { key: 'logoText', label: 'Logo Text', type: 'text' },
    { key: 'hireLink', label: 'Hire Me Link (email or URL)', type: 'text' }
  ]
    .map((f) => fieldToHtml(f, data[f.key]))
    .join('')}${saveSectionButtonHtml()}</div>`;
  bindFields(els.body, data);
  wireSaveButton('navbar');
}

function renderHero() {
  const data = state.draft.hero;
  els.body.innerHTML = `<div class="panel">${[
    { key: 'badge', label: 'Badge Text', type: 'text' },
    { key: 'titleLine1', label: 'Title (line 1)', type: 'text' },
    { key: 'titleAccent', label: 'Title (accent word)', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'terminalLines', label: 'Terminal Preview Lines', type: 'lines' }
  ]
    .map((f) => fieldToHtml(f, data[f.key]))
    .join('')}${saveSectionButtonHtml()}</div>`;
  bindFields(els.body, data);
  wireSaveButton('hero');
}

function renderExpertise() {
  const data = state.draft.expertise;
  els.body.innerHTML = `<div class="panel"><h3>Skill Categories</h3><div id="repeaterHost"></div>${saveSectionButtonHtml()}</div>`;
  renderRepeater(
    document.getElementById('repeaterHost'),
    data.categories,
    [
      { key: 'name', label: 'Category Name', type: 'text' },
      { key: 'skills', label: 'Skills', type: 'list' }
    ],
    'Category',
    { name: '', skills: [] }
  );
  wireSaveButton('expertise');
}

function renderProjects() {
  els.body.innerHTML = `<div class="panel"><h3>Projects</h3><div id="repeaterHost"></div>${saveSectionButtonHtml()}</div>`;
  renderRepeater(
    document.getElementById('repeaterHost'),
    state.draft.projects,
    [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'stack', label: 'Stack', type: 'list' },
      { key: 'features', label: 'Features', type: 'lines' },
      { key: 'live', label: 'Live URL', type: 'text' },
      { key: 'repo', label: 'Repo URL', type: 'text' },
      { key: 'categories', label: 'Categories', type: 'list' },
      { key: 'featured', label: 'Featured on homepage', type: 'checkbox' }
    ],
    'Project',
    { name: '', tagline: '', problem: '', role: '', stack: [], features: [], live: '', repo: '', categories: [], featured: false, slug: '' }
  );
  wireSaveButton('projects');
}

function renderTestimonials() {
  els.body.innerHTML = `<div class="panel"><h3>Testimonials</h3><div id="repeaterHost"></div>${saveSectionButtonHtml()}</div>`;
  renderRepeater(
    document.getElementById('repeaterHost'),
    state.draft.testimonials,
    [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role / Company', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea' }
    ],
    'Testimonial',
    { name: '', role: '', quote: '' }
  );
  wireSaveButton('testimonials');
}

function renderFaq() {
  els.body.innerHTML = `<div class="panel"><h3>FAQ</h3><div id="repeaterHost"></div>${saveSectionButtonHtml()}</div>`;
  renderRepeater(
    document.getElementById('repeaterHost'),
    state.draft.faq,
    [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' }
    ],
    'Question',
    { question: '', answer: '' }
  );
  wireSaveButton('faq');
}

function renderFooter() {
  const data = state.draft.footer;
  els.body.innerHTML = `
    <div class="panel">${[
      { key: 'logoText', label: 'Footer Logo Text', type: 'text' },
      { key: 'roleText', label: 'Role Text', type: 'text' },
      { key: 'copyright', label: 'Copyright Line', type: 'text' }
    ]
      .map((f) => fieldToHtml(f, data[f.key]))
      .join('')}</div>
    <div class="panel"><h3>Footer Links</h3><div id="repeaterHost"></div></div>
    ${saveSectionButtonHtml()}
  `;
  bindFields(els.body, data);
  renderRepeater(
    document.getElementById('repeaterHost'),
    data.links,
    [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'href', label: 'Link', type: 'text' }
    ],
    'Link',
    { label: '', href: '' }
  );
  wireSaveButton('footer');
}

function renderAbout() {
  const data = state.draft.about;
  els.body.innerHTML = `
    <div class="panel">${fieldToHtml({ key: 'paragraphs', label: 'About Paragraphs', type: 'lines' }, data.paragraphs)}</div>
    <div class="panel"><h3>Stats</h3><div id="statsHost"></div></div>
    <div class="panel"><h3>Highlights</h3><div id="highlightsHost"></div></div>
    <div class="panel" id="educationPanel">
      <h3>Education</h3>
      <div class="grid-2">
        ${fieldToHtml({ key: 'school', label: 'School', type: 'text' }, data.education.school)}
        ${fieldToHtml({ key: 'degree', label: 'Degree', type: 'text' }, data.education.degree)}
      </div>
      ${fieldToHtml({ key: 'period', label: 'Period', type: 'text' }, data.education.period)}
      ${fieldToHtml({ key: 'coursework', label: 'Coursework', type: 'list' }, data.education.coursework)}
    </div>
    ${saveSectionButtonHtml()}
  `;
  els.body.querySelector('[data-key="paragraphs"]').addEventListener('input', (e) => {
    data.paragraphs = readFieldEl(e.target);
  });
  bindFields(document.getElementById('educationPanel'), data.education);

  renderRepeater(
    document.getElementById('statsHost'),
    data.stats,
    [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' }
    ],
    'Stat',
    { label: '', value: '' }
  );
  renderRepeater(
    document.getElementById('highlightsHost'),
    data.highlights,
    [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' }
    ],
    'Highlight',
    { title: '', subtitle: '' }
  );
  wireSaveButton('about');
}

async function renderAnalytics() {
  els.body.innerHTML = `<div class="empty-state">Loading…</div>`;
  try {
    const data = await api('/api/analytics');
    const max = Math.max(1, ...data.last7Days.map((d) => d.views));
    els.body.innerHTML = `
      <div class="stat-tiles">
        <div class="stat-tile"><div class="value">${data.totalViews}</div><div class="label">Total Views</div></div>
        <div class="stat-tile"><div class="value">${data.todayViews}</div><div class="label">Views Today</div></div>
      </div>
      <div class="panel">
        <h3>Last 7 Days</h3>
        <div class="bar-chart">
          ${data.last7Days
            .map(
              (d) => `<div class="bar-col"><div class="bar" style="height:${Math.max(4, (d.views / max) * 100)}%"></div><span class="day">${d.date.slice(5)}</span></div>`
            )
            .join('')}
        </div>
      </div>
      <div class="panel">
        <h3>Top Pages</h3>
        ${data.topPages.length ? data.topPages.map((p) => `<div class="repeat-item"><strong>${escapeHtml(p.path)}</strong> — ${p.views} views</div>`).join('') : '<div class="empty-state">No views recorded yet.</div>'}
      </div>
    `;
  } catch (err) {
    els.body.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

async function renderMessages() {
  els.body.innerHTML = `<div class="empty-state">Loading…</div>`;
  try {
    state.messages = await api('/api/messages');
    updateMsgBadge();
    if (!state.messages.length) {
      els.body.innerHTML = `<div class="panel"><div class="empty-state">No messages yet.</div></div>`;
      return;
    }
    els.body.innerHTML = `<div class="panel">${state.messages
      .map(
        (m) => `
        <div class="msg-row ${m.read ? '' : 'unread'}" data-id="${m._id}">
          <div class="msg-meta">
            <div class="top"><span class="name">${escapeHtml(m.name)}</span><span class="email">${escapeHtml(m.email)}</span><span class="date">${new Date(m.createdAt).toLocaleString()}</span></div>
            <p class="body">${escapeHtml(m.message)}</p>
          </div>
          <div class="msg-actions">
            <button type="button" class="icon-btn" data-toggle-read="${m._id}" title="${m.read ? 'Mark unread' : 'Mark read'}">${m.read ? '●' : '○'}</button>
            <button type="button" class="icon-btn" data-delete="${m._id}" title="Delete">✕</button>
          </div>
        </div>`
      )
      .join('')}</div>`;

    els.body.querySelectorAll('[data-toggle-read]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.toggleRead;
        const msg = state.messages.find((m) => m._id === id);
        await api(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ read: !msg.read }) });
        renderMessages();
      });
    });
    els.body.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await api(`/api/messages/${btn.dataset.delete}`, { method: 'DELETE' });
        renderMessages();
      });
    });
  } catch (err) {
    els.body.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

function updateMsgBadge() {
  const unread = state.messages.filter((m) => !m.read).length;
  els.msgBadge.hidden = unread === 0;
  els.msgBadge.textContent = unread;
}

const RENDERERS = {
  navbar: renderNavbar,
  hero: renderHero,
  expertise: renderExpertise,
  projects: renderProjects,
  testimonials: renderTestimonials,
  faq: renderFaq,
  footer: renderFooter,
  about: renderAbout,
  analytics: renderAnalytics,
  messages: renderMessages
};

function selectSection(section) {
  state.activeSection = section;
  els.nav.querySelectorAll('.nav-item').forEach((btn) => btn.classList.toggle('active', btn.dataset.section === section));
  els.title.textContent = SECTION_META[section].title;
  els.desc.textContent = SECTION_META[section].desc;
  RENDERERS[section]();
}

els.nav.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item');
  if (btn) selectSection(btn.dataset.section);
});

els.publishBtn.addEventListener('click', async () => {
  els.publishBtn.disabled = true;
  els.publishBtn.textContent = 'Publishing…';
  try {
    await api('/api/content/publish', { method: 'POST' });
    setUnsavedPublish(false);
    toast('Published to the live site.');
  } catch (err) {
    toast(err.message, true);
  } finally {
    els.publishBtn.disabled = false;
    els.publishBtn.textContent = 'Push to Live Site';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  window.location.href = 'login.html';
});

async function init() {
  try {
    state.draft = await api('/api/content');
    state.messages = await api('/api/messages');
    updateMsgBadge();
    selectSection('navbar');
  } catch (err) {
    toast(err.message, true);
  }
}

init();
