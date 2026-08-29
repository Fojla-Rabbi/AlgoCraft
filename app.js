
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  if (topBtn) topBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
});
topBtn?.addEventListener('click', () => window.scrollTo({top: 0, behavior:'smooth'}));
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

function openLogin() {
  if (!loginModal) return;
  loginModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('loginId')?.focus(), 50);
}
function closeLogin() {
  if (!loginModal) return;
  loginModal.classList.add('hidden');
  document.body.style.overflow = '';
}
if (loginModal) loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLogin(); });

const ADMIN_EMAIL = 'admin@algocraft.dev';
const ADMIN_PASSWORD = 'admin123';

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginId').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    showToast('Invalid administrator credentials.');
    return;
  }
  sessionStorage.setItem('algocraftAdminSession', '1');
  closeLogin();
  window.location.href = 'admin.html';
});

function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

function renderPublicPrograms() {
  const grid = document.getElementById('programGrid');
  if (!grid || !window.AlgoCraftContent) return;
  const content = AlgoCraftContent.load();
  const levels = content.levels.filter(l => l.published !== false);
  grid.innerHTML = levels.map(level => {
    const topics = level.topics.map(slug => content.topics.find(t => t.slug === slug)).filter(Boolean);
    const preview = topics.slice(0, 5).map(t => t.title).join(', ');
    return `<article class="program-card">
      <div class="program-img" style="background-image:url('${escapeHtml(level.banner || '')}')"></div>
      <div class="p-6">
        <span class="tag">${escapeHtml(level.name)}</span>
        <h3>${escapeHtml(level.label)}</h3>
        <p>${escapeHtml(preview || level.description || 'Explore the topics in this learning level.')}</p>
        <div class="program-meta"><span>${topics.length} Topics</span><span>${escapeHtml(level.tier)}</span></div>
        <button onclick="window.location.href='level.html?level=${encodeURIComponent(level.id)}'">View Details →</button>
      </div>
    </article>`;
  }).join('') || '<div class="dash-panel"><h3>No published programs</h3><p>The administrator has not published any programs yet.</p></div>';
}
renderPublicPrograms();

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
