// AlgoCraft — shared content store for the public site and admin CMS.
// Frontend prototype: content is persisted in localStorage until an API/database is connected.
(function () {
  const KEY = 'algocraftContentV1';
  const DEFAULT_BANNERS = [
    'https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85'
  ];

  function buildDefault() {
    const levels = Object.entries(LEVELS).map(([id, l], i) => ({
      id: String(id),
      name: l.name,
      slug: slugify(l.name),
      label: l.label,
      tier: l.tier,
      description: `Work through these ${l.topics.length} topics in order to build a solid ${l.tier.toLowerCase()} foundation before moving to the next level.`,
      banner: DEFAULT_BANNERS[i % DEFAULT_BANNERS.length],
      published: true,
      topics: [...l.topics]
    }));

    const topics = Object.entries(TOPICS).map(([slug, t]) => ({
      slug,
      title: t.title,
      level: String(t.level),
      intro: t.intro,
      badgeLabel: `LEVEL ${t.level}`,
      cover: DEFAULT_BANNERS[(Number(t.level) - 1) % DEFAULT_BANNERS.length],
      sections: t.sections.map(s => ({ h: s.h, body: s.body }))
    }));

    return { levels, topics, updatedAt: new Date().toISOString() };
  }

  function slugify(value) {
    return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    const fallback = buildDefault();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!saved || !Array.isArray(saved.levels) || !Array.isArray(saved.topics)) return fallback;
      return {
        levels: saved.levels,
        topics: saved.topics,
        updatedAt: saved.updatedAt || fallback.updatedAt
      };
    } catch (_) {
      return fallback;
    }
  }

  function save(content) {
    const normalized = {
      levels: Array.isArray(content.levels) ? content.levels : [],
      topics: Array.isArray(content.topics) ? content.topics : [],
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(normalized));
    return normalized;
  }

  function reset() {
    const fresh = buildDefault();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return clone(fresh);
  }

  window.AlgoCraftContent = {
    KEY,
    load,
    save,
    reset,
    slugify,
    clone
  };
})();
