// AlgoCraft — renders level.html and lesson.html from data.js

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------- level.html ----------
if (document.getElementById('topicList')) {
  const levelNum = parseInt(qs('level'), 10) || 1;
  const level = LEVELS[levelNum] || LEVELS[1];

  document.getElementById('levelHeading').textContent = `${level.name} — ${level.label}`;
  document.getElementById('levelDesc').textContent =
    `Work through these ${level.topics.length} topics in order to build a solid ${level.tier.toLowerCase()} foundation before moving to the next level.`;
  document.title = `AlgoCraft | ${level.name} — ${level.label}`;

  const list = document.getElementById('topicList');
  list.innerHTML = level.topics.map((slug, i) => {
    const topic = TOPICS[slug];
    if (!topic) return '';
    return `
      <a class="topic-banner" href="lesson.html?level=${levelNum}&topic=${encodeURIComponent(slug)}">
        <div class="tb-index">${i + 1}</div>
        <div class="tb-title">${escapeHtml(topic.title)}</div>
        <div class="tb-arrow">→</div>
      </a>`;
  }).join('');
}

// ---------- lesson.html ----------
if (document.getElementById('lessonTitle')) {
  const levelNum = parseInt(qs('level'), 10) || 1;
  const level = LEVELS[levelNum] || LEVELS[1];
  const slug = qs('topic');
  const topic = TOPICS[slug] || TOPICS[level.topics[0]];

  document.getElementById('levelBackLink').href = `level.html?level=${levelNum}`;
  document.getElementById('levelBackLink').textContent = `← ${level.name}`;
  document.getElementById('lessonLevelTag').textContent = level.name;
  document.getElementById('lessonLevelLabel').textContent = level.label;
  document.getElementById('lessonTitle').textContent = topic.title;
  document.getElementById('lessonIntro').textContent = topic.intro;
  document.title = `AlgoCraft | ${topic.title}`;

  const sectionsEl = document.getElementById('lessonSections');
  sectionsEl.innerHTML = topic.sections.map(sec => {
    const id = slugify(sec.h);
    return `
      <div class="lesson-section" id="${id}">
        <h2>${escapeHtml(sec.h)}</h2>
        <p>${escapeHtml(sec.body)}</p>
      </div>`;
  }).join('');

  const tocEl = document.getElementById('tocNav');
  tocEl.innerHTML = topic.sections.map(sec => {
    const id = slugify(sec.h);
    return `<a class="toc-link" href="#${id}">${escapeHtml(sec.h)}</a>`;
  }).join('');

  const tocLinks = [...tocEl.querySelectorAll('.toc-link')];
  const secEls = [...sectionsEl.querySelectorAll('.lesson-section')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-20% 0px -65% 0px' });
  secEls.forEach(el => observer.observe(el));
}
