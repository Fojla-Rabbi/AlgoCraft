
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');
const adminModal = document.getElementById('adminModal');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  topBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior:'smooth'}));
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

/* ---------------- HOME: render Featured Levels from the live store ---------------- */
function renderHomeLevels() {
  const container = document.getElementById('levelCards');
  if (!container) return;
  const ids = AlgoCraftDB.getLevelIds();
  if (!ids.length) {
    container.innerHTML = `<p class="text-center text-sm text-stone-500 md:col-span-2 lg:col-span-3">No levels have been published yet.</p>`;
    return;
  }
  container.innerHTML = ids.map(id => {
    const level = AlgoCraftDB.getLevel(id);
    const topics = AlgoCraftDB.getTopicsForLevel(id);
    const desc = topics.length ? topics.map(t => escapeHtml(t.title)).join(', ') : 'Topics coming soon.';
    const imgStyle = level.image ? ` style="background-image:url('${escapeAttr(level.image)}')"` : '';
    return `
      <article class="program-card">
        <div class="program-img"${imgStyle}></div>
        <div class="p-6">
          <span class="tag">${escapeHtml(level.name.toUpperCase())}</span>
          <p class="mt-4 text-sm leading-7 text-stone-600">${desc}</p>
          <div class="program-meta"><span>${topics.length} Topic${topics.length === 1 ? '' : 's'}</span><span>${escapeHtml(level.tier)}</span></div>
          <button onclick="window.location.href='level.html?level=${id}'">View Details →</button>
        </div>
      </article>`;
  }).join('');
}
renderHomeLevels();

/* ---------------- AUTH (admin only) ---------------- */
function openLogin() {
  if (dashboard && !dashboard.classList.contains('hidden')) return;
  loginModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLogin() {
  loginModal.classList.add('hidden');
  document.body.style.overflow = '';
}
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLogin(); });

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!AlgoCraftDB.checkAdmin(id, password)) {
    showToast('Invalid admin credentials.');
    return;
  }
  closeLogin();
  document.getElementById('loginForm').reset();
  openDashboard();
});

function logout() {
  dashboard.classList.add('hidden');
  document.body.style.overflow = '';
  window.scrollTo({top:0, behavior:'smooth'});
  showToast('You have been logged out.');
}

/* ---------------- ADMIN DASHBOARD ---------------- */
function openDashboard() {
  dashboard.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const admin = AlgoCraftDB.getAdmin();
  document.getElementById('dashName').textContent = admin.name;
  document.getElementById('dashAvatar').textContent = admin.name.charAt(0).toUpperCase();
  const nav = document.getElementById('dashNav');
  nav.innerHTML = `<button class="active" onclick="showAdminLevels()">◆<span>Levels</span></button>`;
  showAdminLevels();
}

function setCrumb(text) { document.getElementById('dashCrumb').textContent = text; }
function setTitle(text) { document.getElementById('dashTitle').textContent = text; }

// -- Levels view --
function showAdminLevels() {
  setCrumb('AlgoCraft Admin');
  setTitle('Levels');
  const ids = AlgoCraftDB.getLevelIds();
  const content = document.getElementById('dashContent');
  content.innerHTML = `
    <div class="dash-panel">
      <div class="flex items-center justify-between">
        <h3>All Levels</h3>
        <button class="gold-btn" onclick="openLevelForm()">+ Add Level</button>
      </div>
      <div class="mt-6 space-y-3">
        ${ids.length ? ids.map(id => {
          const lvl = AlgoCraftDB.getLevel(id);
          const count = lvl.topics.length;
          return `
          <div class="admin-row">
            <button class="admin-row-main admin-row-main--with-thumb" onclick="showAdminTopics(${id})">
              <div class="admin-row-thumb"${lvl.image ? ` style="background-image:url('${escapeAttr(lvl.image)}')"` : ''}></div>
              <div><b>${escapeHtml(lvl.name)}</b><span>${escapeHtml(lvl.label)} · ${escapeHtml(lvl.tier)} · ${count} topic${count === 1 ? '' : 's'}</span></div>
            </button>
            <div class="admin-row-actions">
              <button onclick="openLevelForm(${id})" title="Edit">✎</button>
              <button onclick="confirmDeleteLevel(${id})" title="Delete">🗑</button>
            </div>
          </div>`;
        }).join('') : '<p class="text-sm text-stone-500">No levels yet. Click "Add Level" to create the first one.</p>'}
      </div>
    </div>`;
}

function openLevelForm(id) {
  const editing = id !== undefined;
  const lvl = editing ? AlgoCraftDB.getLevel(id) : null;
  const currentImage = editing ? (lvl.image || '') : '';
  document.getElementById('adminModalEyebrow').textContent = editing ? 'Edit Level' : 'Add Level';
  document.getElementById('adminModalTitle').textContent = editing ? 'Edit Level' : 'Add a New Level';
  document.getElementById('adminModalForm').innerHTML = `
    <input id="fLevelName" required type="text" placeholder="Level name (e.g. Level 7)" class="form-input" value="${editing ? escapeAttr(lvl.name) : ''}">
    <input id="fLevelLabel" required type="text" placeholder="Label (e.g. Advanced Graphs)" class="form-input" value="${editing ? escapeAttr(lvl.label) : ''}">
    <select id="fLevelTier" class="form-input">
      <option ${editing && lvl.tier === 'Beginner' ? 'selected' : ''}>Beginner</option>
      <option ${editing && lvl.tier === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
      <option ${editing && lvl.tier === 'Advanced' ? 'selected' : ''}>Advanced</option>
    </select>
    <div>
      <label class="form-label">Level Photo</label>
      <div id="fLevelImgPreview" class="admin-img-preview"></div>
      <input id="fLevelImageFile" type="file" accept="image/*" class="form-input">
      <input id="fLevelImageUrl" type="text" placeholder="...or paste an image URL" class="form-input mt-2" value="${editing && currentImage ? escapeAttr(currentImage) : ''}">
    </div>
    <button class="gold-btn w-full justify-center">${editing ? 'Save Changes' : 'Add Level'}</button>`;

  let pendingImage = currentImage;
  const preview = document.getElementById('fLevelImgPreview');
  const urlInput = document.getElementById('fLevelImageUrl');
  function setPreview(url) {
    preview.style.backgroundImage = url ? `url('${url}')` : '';
  }
  setPreview(pendingImage);
  document.getElementById('fLevelImageFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      pendingImage = ev.target.result;
      urlInput.value = '';
      setPreview(pendingImage);
    };
    reader.readAsDataURL(file);
  });
  urlInput.addEventListener('input', e => {
    pendingImage = e.target.value.trim();
    setPreview(pendingImage);
  });

  document.getElementById('adminModalForm').onsubmit = e => {
    e.preventDefault();
    const fields = {
      name: document.getElementById('fLevelName').value.trim(),
      label: document.getElementById('fLevelLabel').value.trim(),
      tier: document.getElementById('fLevelTier').value,
      image: pendingImage
    };
    if (editing) { AlgoCraftDB.updateLevel(id, fields); showToast('Level updated.'); }
    else { AlgoCraftDB.addLevel(fields); showToast('Level added.'); }
    closeAdminModal();
    showAdminLevels();
    renderHomeLevels();
  };
  adminModal.classList.remove('hidden');
}
function confirmDeleteLevel(id) {
  const lvl = AlgoCraftDB.getLevel(id);
  if (!confirm(`Delete "${lvl.name}" and all of its topics and lesson content? This can't be undone.`)) return;
  AlgoCraftDB.deleteLevel(id);
  showToast('Level deleted.');
  showAdminLevels();
  renderHomeLevels();
}

// -- Topics (banners) view --
function showAdminTopics(levelId) {
  const lvl = AlgoCraftDB.getLevel(levelId);
  if (!lvl) { showAdminLevels(); return; }
  setCrumb(`Levels / ${lvl.name}`);
  setTitle('Banners');
  const topics = AlgoCraftDB.getTopicsForLevel(levelId);
  const content = document.getElementById('dashContent');
  content.innerHTML = `
    <button class="back-link mb-2" onclick="showAdminLevels()">← All Levels</button>
    <div class="dash-panel mt-4">
      <div class="flex items-center justify-between">
        <h3>Banners in ${escapeHtml(lvl.name)}</h3>
        <button class="gold-btn" onclick="openTopicForm(${levelId})">+ Add Banner</button>
      </div>
      <div class="mt-6 space-y-3">
        ${topics.length ? topics.map(t => `
          <div class="admin-row">
            <button class="admin-row-main" onclick="showAdminContent('${t.slug}')">
              <b>${escapeHtml(t.title)}</b><span>${t.sections.length} section${t.sections.length === 1 ? '' : 's'}</span>
            </button>
            <div class="admin-row-actions">
              <button onclick="openTopicForm(${levelId}, '${t.slug}')" title="Edit">✎</button>
              <button onclick="confirmDeleteTopic('${t.slug}', ${levelId})" title="Delete">🗑</button>
            </div>
          </div>`).join('') : '<p class="text-sm text-stone-500">No banners yet. Click "Add Banner" to create the first one.</p>'}
      </div>
    </div>`;
}

function openTopicForm(levelId, slug) {
  const editing = slug !== undefined;
  const topic = editing ? AlgoCraftDB.getTopic(slug) : null;
  document.getElementById('adminModalEyebrow').textContent = editing ? 'Edit Banner' : 'Add Banner';
  document.getElementById('adminModalTitle').textContent = editing ? 'Edit Banner' : 'Add a New Banner';
  document.getElementById('adminModalForm').innerHTML = `
    <input id="fTopicTitle" required type="text" placeholder="Banner title (e.g. Binary Search)" class="form-input" value="${editing ? escapeAttr(topic.title) : ''}">
    <textarea id="fTopicIntro" placeholder="Short intro shown at the top of the lesson page" class="form-input" rows="3">${editing ? escapeHtml(topic.intro || '') : ''}</textarea>
    <button class="gold-btn w-full justify-center">${editing ? 'Save Changes' : 'Add Banner'}</button>`;
  document.getElementById('adminModalForm').onsubmit = e => {
    e.preventDefault();
    const title = document.getElementById('fTopicTitle').value.trim();
    const intro = document.getElementById('fTopicIntro').value.trim();
    if (editing) {
      AlgoCraftDB.updateTopic(slug, { title, intro });
      showToast('Banner updated.');
      closeAdminModal();
      showAdminTopics(levelId);
    } else {
      const newSlug = AlgoCraftDB.addTopic(levelId, title);
      AlgoCraftDB.updateTopic(newSlug, { intro });
      showToast('Banner added.');
      closeAdminModal();
      showAdminTopics(levelId);
    }
    renderHomeLevels();
  };
  adminModal.classList.remove('hidden');
}
function confirmDeleteTopic(slug, levelId) {
  const topic = AlgoCraftDB.getTopic(slug);
  if (!confirm(`Delete the banner "${topic.title}" and all of its content? This can't be undone.`)) return;
  AlgoCraftDB.deleteTopic(slug);
  showToast('Banner deleted.');
  showAdminTopics(levelId);
  renderHomeLevels();
}

// -- Content sections (incl. code) view --
function showAdminContent(slug) {
  const topic = AlgoCraftDB.getTopic(slug);
  if (!topic) { showAdminLevels(); return; }
  const lvl = AlgoCraftDB.getLevel(topic.level);
  setCrumb(`Levels / ${lvl ? lvl.name : ''} / ${topic.title}`);
  setTitle('Content');
  const content = document.getElementById('dashContent');
  content.innerHTML = `
    <button class="back-link mb-2" onclick="showAdminTopics(${topic.level})">← ${lvl ? escapeHtml(lvl.name) : 'Level'} Banners</button>
    <div class="dash-panel mt-4">
      <div class="flex items-center justify-between">
        <h3>Content for "${escapeHtml(topic.title)}"</h3>
        <button class="gold-btn" onclick="openSectionForm('${slug}')">+ Add Section</button>
      </div>
      <div class="mt-6 space-y-3">
        ${topic.sections.length ? topic.sections.map((s, i) => `
          <div class="admin-row admin-row--section">
            <div class="admin-row-main">
              <b>${escapeHtml(s.h)}</b>
              <span>${escapeHtml((s.body || '').slice(0, 90))}${(s.body || '').length > 90 ? '…' : ''}${s.code ? ' · includes code' : ''}</span>
            </div>
            <div class="admin-row-actions">
              <button onclick="openSectionForm('${slug}', ${i})" title="Edit">✎</button>
              <button onclick="confirmDeleteSection('${slug}', ${i})" title="Delete">🗑</button>
            </div>
          </div>`).join('') : '<p class="text-sm text-stone-500">No content sections yet. Click "Add Section" to write the first one.</p>'}
      </div>
    </div>`;
}

function openSectionForm(slug, index) {
  const editing = index !== undefined;
  const topic = AlgoCraftDB.getTopic(slug);
  const sec = editing ? topic.sections[index] : null;
  document.getElementById('adminModalEyebrow').textContent = editing ? 'Edit Section' : 'Add Section';
  document.getElementById('adminModalTitle').textContent = editing ? 'Edit Content Section' : 'Add Content Section';
  document.getElementById('adminModalForm').innerHTML = `
    <input id="fSecHeading" required type="text" placeholder="Section heading (e.g. Key Idea)" class="form-input" value="${editing ? escapeAttr(sec.h) : ''}">
    <textarea id="fSecBody" required placeholder="Written content for this section" class="form-input" rows="5">${editing ? escapeHtml(sec.body || '') : ''}</textarea>
    <input id="fSecLang" type="text" placeholder="Code language (optional, e.g. cpp, python)" class="form-input" value="${editing ? escapeAttr(sec.language || '') : ''}">
    <textarea id="fSecCode" placeholder="Code snippet (optional)" class="form-input" rows="6" style="font-family:monospace;font-size:13px;">${editing ? escapeHtml(sec.code || '') : ''}</textarea>
    <button class="gold-btn w-full justify-center">${editing ? 'Save Changes' : 'Add Section'}</button>`;
  document.getElementById('adminModalForm').onsubmit = e => {
    e.preventDefault();
    const fields = {
      h: document.getElementById('fSecHeading').value.trim(),
      body: document.getElementById('fSecBody').value.trim(),
      language: document.getElementById('fSecLang').value.trim(),
      code: document.getElementById('fSecCode').value.trim()
    };
    if (editing) { AlgoCraftDB.updateSection(slug, index, fields); showToast('Section updated.'); }
    else { AlgoCraftDB.addSection(slug, fields); showToast('Section added.'); }
    closeAdminModal();
    showAdminContent(slug);
  };
  adminModal.classList.remove('hidden');
}
function confirmDeleteSection(slug, index) {
  if (!confirm('Delete this content section? This can\'t be undone.')) return;
  AlgoCraftDB.deleteSection(slug, index);
  showToast('Section deleted.');
  showAdminContent(slug);
}

function closeAdminModal() {
  adminModal.classList.add('hidden');
  document.getElementById('adminModalForm').innerHTML = '';
}
adminModal.addEventListener('click', e => { if (e.target === adminModal) closeAdminModal(); });

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function escapeAttr(s) { return escapeHtml(s); }

/* ---------------- MISC (newsletter, toast, scroll-spy nav) ---------------- */
document.getElementById('newsletter').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  showToast('Thank you! You are subscribed to AlgoCraft updates.');
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => observer.observe(section));
