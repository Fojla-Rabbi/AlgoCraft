// AlgoCraft — content store. All levels/topics/lesson content live here,
// persisted to localStorage, so admin edits are saved and read by every page.

const DB_KEY = 'algocraftDB';

function acSlugify(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'topic';
}

function buildSeedDB() {
  const db = {
    admin: { name: 'Admin', email: 'admin@algocraft.dev', password: 'admin123' },
    nextLevelId: 1,
    levels: {},
    topics: {}
  };
  Object.keys(SEED_LEVELS).forEach(id => {
    const n = Number(id);
    db.levels[n] = { id: n, name: SEED_LEVELS[id].name, label: SEED_LEVELS[id].label, tier: SEED_LEVELS[id].tier, image: SEED_LEVELS[id].image || '', topics: [...SEED_LEVELS[id].topics] };
    if (n >= db.nextLevelId) db.nextLevelId = n + 1;
  });
  Object.keys(SEED_TOPICS).forEach(slug => {
    const t = SEED_TOPICS[slug];
    db.topics[slug] = {
      slug, title: t.title, level: t.level, intro: t.intro,
      sections: t.sections.map(s => ({ h: s.h, body: s.body, code: s.code || '', language: s.language || '' }))
    };
  });
  return db;
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
  }
  const seeded = buildSeedDB();
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  return seeded;
}

let DB = loadDB();
function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(DB)); }

const AlgoCraftDB = {

  checkAdmin(idOrEmail, password) {
    return (idOrEmail === DB.admin.email || idOrEmail === DB.admin.name) && password === DB.admin.password;
  },
  getAdmin() { return DB.admin; },

  getLevels() { return DB.levels; },
  getLevelIds() { return Object.keys(DB.levels).map(Number).sort((a, b) => a - b); },
  getLevel(id) { return DB.levels[id]; },

  getTopic(slug) { return DB.topics[slug]; },
  getTopicsForLevel(id) {
    const lvl = DB.levels[id];
    if (!lvl) return [];
    return lvl.topics.map(s => DB.topics[s]).filter(Boolean);
  },

  addLevel({ name, label, tier, image }) {
    const id = DB.nextLevelId++;
    DB.levels[id] = { id, name, label, tier, image: image || '', topics: [] };
    saveDB();
    return id;
  },
  updateLevel(id, fields) {
    Object.assign(DB.levels[id], fields);
    saveDB();
  },
  deleteLevel(id) {
    const lvl = DB.levels[id];
    if (lvl) lvl.topics.forEach(slug => { delete DB.topics[slug]; });
    delete DB.levels[id];
    saveDB();
  },

  addTopic(levelId, title) {
    let base = acSlugify(title);
    let slug = base, n = 2;
    while (DB.topics[slug]) slug = `${base}-${n++}`;
    DB.topics[slug] = { slug, title, level: Number(levelId), intro: '', sections: [] };
    DB.levels[levelId].topics.push(slug);
    saveDB();
    return slug;
  },
  updateTopic(slug, fields) {
    Object.assign(DB.topics[slug], fields);
    saveDB();
  },
  deleteTopic(slug) {
    const t = DB.topics[slug];
    if (t) {
      const lvl = DB.levels[t.level];
      if (lvl) lvl.topics = lvl.topics.filter(s => s !== slug);
    }
    delete DB.topics[slug];
    saveDB();
  },

  addSection(slug, section) {
    DB.topics[slug].sections.push(section);
    saveDB();
    return DB.topics[slug].sections.length - 1;
  },
  updateSection(slug, index, fields) {
    Object.assign(DB.topics[slug].sections[index], fields);
    saveDB();
  },
  deleteSection(slug, index) {
    DB.topics[slug].sections.splice(index, 1);
    saveDB();
  },

  resetToDefaults() {
    localStorage.removeItem(DB_KEY);
    DB = loadDB();
  }
};
