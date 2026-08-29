// AlgoCraft — renders level.html and lesson.html from the live content store (storage.js)

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function slugifyHeading(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------- level.html ----------
if (document.getElementById('topicList')) {
  const levelNum = parseInt(qs('level'), 10) || AlgoCraftDB.getLevelIds()[0];
  const level = AlgoCraftDB.getLevel(levelNum);
  const list = document.getElementById('topicList');

  if (!level) {
    document.getElementById('levelHeading').textContent = 'Level not found';
    document.getElementById('levelDesc').textContent = 'This level may have been removed. Head back home to see the current levels.';
    list.innerHTML = '';
  } else {
    const topics = AlgoCraftDB.getTopicsForLevel(levelNum);
    document.getElementById('levelHeading').textContent = `${level.name} — ${level.label}`;
    document.getElementById('levelDesc').textContent = topics.length
      ? `Work through these ${topics.length} topics in order to build a solid ${level.tier.toLowerCase()} foundation before moving to the next level.`
      : `No topics have been added to this level yet.`;
    document.title = `AlgoCraft | ${level.name} — ${level.label}`;

    list.innerHTML = topics.map((topic, i) => `
      <a class="topic-banner" href="lesson.html?level=${levelNum}&topic=${encodeURIComponent(topic.slug)}">
        <div class="tb-index">${i + 1}</div>
        <div class="tb-title">${escapeHtml(topic.title)}</div>
        <div class="tb-arrow">→</div>
      </a>`).join('');
  }
}

// ---------- lesson.html ----------
if (document.getElementById('lessonTitle')) {
  const slug = qs('topic');
  const topic = AlgoCraftDB.getTopic(slug);
  const levelNum = topic ? topic.level : (parseInt(qs('level'), 10) || AlgoCraftDB.getLevelIds()[0]);
  const level = AlgoCraftDB.getLevel(levelNum);

  document.getElementById('levelBackLink').href = `level.html?level=${levelNum}`;
  document.getElementById('levelBackLink').textContent = `← ${level ? level.name : 'Level'}`;
  document.getElementById('lessonLevelTag').textContent = level ? level.name : '';
  document.getElementById('lessonLevelLabel').textContent = level ? level.label : '';

  if (!topic) {
    document.getElementById('lessonTitle').textContent = 'Lesson not found';
    document.getElementById('lessonIntro').textContent = 'This lesson may have been removed by the admin.';
    document.getElementById('lessonSections').innerHTML = '';
    document.getElementById('tocNav').innerHTML = '';
  } else {
    document.getElementById('lessonTitle').textContent = topic.title;
    document.getElementById('lessonIntro').textContent = topic.intro || '';
    document.title = `AlgoCraft | ${topic.title}`;

    const sectionsEl = document.getElementById('lessonSections');
    sectionsEl.innerHTML = topic.sections.map(sec => {
      const id = slugifyHeading(sec.h);
      const codeBlock = sec.code
        ? `<pre>${sec.language ? `<span class="code-lang">${escapeHtml(sec.language)}</span>\n` : ''}${escapeHtml(sec.code)}</pre>`
        : '';
      return `
        <div class="lesson-section" id="${id}">
          <h2>${escapeHtml(sec.h)}</h2>
          <p>${escapeHtml(sec.body)}</p>
          ${codeBlock}
        </div>`;
    }).join('') || '<p class="text-sm text-stone-500">No content has been added to this lesson yet.</p>';

    const tocEl = document.getElementById('tocNav');
    tocEl.innerHTML = topic.sections.map(sec =>
      `<a class="toc-link" href="#${slugifyHeading(sec.h)}">${escapeHtml(sec.h)}</a>`
    ).join('');

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
}
