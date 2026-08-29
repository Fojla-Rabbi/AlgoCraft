// AlgoCraft — renders level.html and lesson.html from the shared content store.
function qs(name) { return new URLSearchParams(window.location.search).get(name); }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function siteContent() { return window.AlgoCraftContent ? AlgoCraftContent.load() : { levels: [], topics: [] }; }

if (document.getElementById('topicList')) {
  const content = siteContent();
  const levelId = qs('level') || '1';
  const level = content.levels.find(l => String(l.id) === String(levelId)) || content.levels[0];
  if (!level) {
    document.getElementById('levelHeading').textContent = 'No level available';
  } else {
    const topics = (level.topics || []).map(slug => content.topics.find(t => t.slug === slug)).filter(Boolean);
    document.getElementById('levelHeading').textContent = `${level.name} — ${level.label}`;
    document.getElementById('levelDesc').textContent = level.description || `Explore ${topics.length} topics in this level.`;
    document.title = `AlgoCraft | ${level.name} — ${level.label}`;
    const hero = document.querySelector('.level-hero');
    if (hero && level.banner) hero.style.backgroundImage = `linear-gradient(110deg,rgba(74,6,16,.92),rgba(124,17,30,.82)), url('${level.banner.replace(/'/g, "%27")}')`;
    const list = document.getElementById('topicList');
    list.innerHTML = topics.map((topic, i) => `<a class="topic-banner" href="lesson.html?level=${encodeURIComponent(level.id)}&topic=${encodeURIComponent(topic.slug)}">
      <div class="tb-index">${i + 1}</div><div class="tb-title">${escapeHtml(topic.title)}</div><div class="tb-arrow">→</div></a>`).join('') || '<div class="dash-panel"><h3>No topics yet</h3><p>The administrator can add topics from the admin dashboard.</p></div>';
  }
}

if (document.getElementById('lessonTitle')) {
  const content = siteContent();
  const levelId = qs('level') || '1';
  const level = content.levels.find(l => String(l.id) === String(levelId)) || content.levels[0];
  const requestedSlug = qs('topic');
  const topic = content.topics.find(t => t.slug === requestedSlug) || (level && content.topics.find(t => (level.topics || []).includes(t.slug)));
  if (!topic) {
    document.getElementById('lessonTitle').textContent = 'Content not found';
    document.getElementById('lessonIntro').textContent = 'This lesson may have been removed by the administrator.';
  } else {
    document.getElementById('levelBackLink').href = `level.html?level=${encodeURIComponent(level?.id || topic.level)}`;
    document.getElementById('levelBackLink').textContent = `← ${escapeHtml(level?.name || `Level ${topic.level}`)}`;
    document.getElementById('lessonLevelTag').textContent = level?.name || `Level ${topic.level}`;
    document.getElementById('lessonLevelLabel').textContent = level?.label || '';
    document.getElementById('lessonTitle').textContent = topic.title;
    document.getElementById('lessonIntro').textContent = topic.intro || '';
    document.title = `AlgoCraft | ${topic.title}`;
    const article = document.querySelector('article');
    const oldCover = document.getElementById('lessonCover');
    if (oldCover) oldCover.remove();
    if (topic.cover) {
      const cover = document.createElement('img');
      cover.id = 'lessonCover'; cover.className = 'lesson-cover'; cover.src = topic.cover; cover.alt = topic.title;
      article.insertBefore(cover, document.getElementById('lessonIntro'));
    }
    const sections = Array.isArray(topic.sections) ? topic.sections : [];
    const sectionsEl = document.getElementById('lessonSections');
    sectionsEl.innerHTML = sections.map(sec => `<div class="lesson-section" id="${slugify(sec.h)}"><h2>${escapeHtml(sec.h)}</h2><p>${escapeHtml(sec.body)}</p></div>`).join('');
    const tocEl = document.getElementById('tocNav');
    tocEl.innerHTML = sections.map(sec => `<a class="toc-link" href="#${slugify(sec.h)}">${escapeHtml(sec.h)}</a>`).join('');
    const tocLinks = [...tocEl.querySelectorAll('.toc-link')];
    const secEls = [...sectionsEl.querySelectorAll('.lesson-section')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }), { rootMargin: '-20% 0px -65% 0px' });
      secEls.forEach(el => observer.observe(el));
    }
  }
}
