// AlgoCraft Admin CMS — frontend prototype with localStorage persistence.
const $ = id => document.getElementById(id);
const contentApi = window.AlgoCraftContent;
let content = contentApi.load();
let currentPage = 'Overview';

if (sessionStorage.getItem('algocraftAdminSession') !== '1') {
  window.location.href = 'index.html';
  throw new Error('Admin session required');
}

const navItems = [
  ['Overview','⌂'],
  ['Levels','◆'],
  ['Topics','▦']
];

function esc(v) { return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function persist() { content = contentApi.save(content); }
function toast(msg) { $('adminToast').textContent = msg; $('adminToast').classList.add('show'); clearTimeout(window.adminToastTimer); window.adminToastTimer=setTimeout(()=>$('adminToast').classList.remove('show'),2600); }
function levelById(id) { return content.levels.find(l => String(l.id) === String(id)); }
function topicBySlug(slug) { return content.topics.find(t => t.slug === slug); }
function nextLevelId() { return String(content.levels.reduce((m,l)=>Math.max(m,Number(l.id)||0),0)+1); }
function closeEditor() { $('editorModal').classList.add('hidden'); document.body.style.overflow=''; }
function openEditor(html, onReady) { $('editorBody').innerHTML=html; $('editorModal').classList.remove('hidden'); document.body.style.overflow='hidden'; if(onReady) onReady(); }

function renderNav() {
  $('adminNav').innerHTML = navItems.map(([label,icon]) => `<button class="${currentPage===label?'active':''}" data-page="${label}"><i>${icon}</i><span>${label}</span></button>`).join('');
  $('adminNav').querySelectorAll('button').forEach(b=>b.onclick=()=>{currentPage=b.dataset.page; render();});
}

function render() {
  renderNav();
  $('adminPageTitle').textContent=currentPage;
  if(currentPage==='Overview') renderOverview();
  if(currentPage==='Levels') renderLevels();
  if(currentPage==='Topics') renderTopics();
}

function renderOverview() {
  const published=content.levels.filter(l=>l.published!==false).length;
  $('adminContent').innerHTML=`<div class="admin-welcome"><div><span>CONTENT MANAGEMENT</span><h2>Welcome, Admin</h2><p>Manage the entire AlgoCraft learning path from one place.</p></div><div class="admin-seal">A</div></div>
    <div class="admin-stat-grid"><div class="admin-stat"><small>Programs</small><strong>${content.levels.length}</strong><span>${published} published</span></div><div class="admin-stat"><small>Topics</small><strong>${content.topics.length}</strong><span>Learning content</span></div><div class="admin-stat"><small>Storage</small><strong>Local</strong><span>Ready for API / database</span></div></div>
    <div class="admin-panel"><div class="admin-panel-head"><div><p class="eyebrow">QUICK ACTIONS</p><h2>Content</h2></div></div><div class="quick-actions"><button onclick="openLevelEditor()">+ Add Level</button><button onclick="openTopicEditor()">+ Add Topic</button><button onclick="currentPage='Levels';render()">Manage Levels</button><button onclick="currentPage='Topics';render()">Manage Topics</button></div></div>
    <div class="admin-panel"><div class="admin-panel-head"><div><p class="eyebrow">PERSISTENCE</p><h2>Frontend content storage</h2></div><button class="danger-outline" onclick="resetAllContent()">Reset Demo Content</button></div><p class="admin-muted">Changes made in this dashboard immediately update the public Levels, Topics and Lesson pages on this browser. For production, replace localStorage with your authenticated API and database.</p></div>`;
}

function renderLevels() {
  $('adminContent').innerHTML=`<div class="admin-list-panel"><div class="admin-list-head"><div><h2>All Levels</h2><p>Programs in the AlgoCraft learning path.</p></div><button class="admin-primary" onclick="openLevelEditor()">+ ADD LEVEL</button></div>
    <div class="level-admin-list">${content.levels.map(l=>`<div class="level-admin-row"><div class="level-admin-info"><div class="level-number">${esc(l.id)}</div><div><h3>${esc(l.name)}</h3><p>${esc(l.label)} · ${esc(l.tier)} · ${(l.topics||[]).length} topics</p></div></div><div class="row-actions"><button title="Edit" onclick="openLevelEditor('${esc(l.id)}')">✎</button><button title="Delete" onclick="deleteLevel('${esc(l.id)}')">♜</button></div></div>`).join('')}</div></div>`;
}

function renderTopics() {
  $('adminContent').innerHTML=`<div class="admin-list-panel"><div class="admin-list-head"><div><h2>All Topics</h2><p>Lessons and learning content published under each level.</p></div><button class="admin-primary" onclick="openTopicEditor()">+ ADD TOPIC</button></div>
    <div class="topic-admin-list">${content.topics.map(t=>{const l=levelById(t.level); return `<div class="topic-admin-row"><div class="topic-thumb" style="background-image:url('${esc(t.cover||'')}')"></div><div class="topic-admin-info"><span>${esc(t.badgeLabel||`LEVEL ${t.level}`)}</span><h3>${esc(t.title)}</h3><p>${esc(l?.name||`Level ${t.level}`)} · ${(t.sections||[]).length} sections</p></div><div class="row-actions"><button title="Edit" onclick="openTopicEditor('${esc(t.slug)}')">✎</button><button title="Delete" onclick="deleteTopic('${esc(t.slug)}')">♜</button></div></div>`}).join('')}</div></div>`;
}

function openLevelEditor(id='') {
  const existing=id?levelById(id):null;
  const l=existing||{id:nextLevelId(),name:`Level ${nextLevelId()}`,slug:`level-${nextLevelId()}`,label:'New Program',tier:'Beginner',description:'',banner:'',published:true,topics:[]};
  const topicOptions=content.topics.map(t=>`<option value="${esc(t.slug)}">${esc(t.title)}</option>`).join('');
  openEditor(`<p class="eyebrow">${existing?'EDIT LEVEL':'NEW LEVEL'}</p><h2>${existing?'Edit level':'Add level'}</h2><p class="editor-sub">Create or update a learning program and its banner.</p>
    <form id="levelForm" class="editor-form"><div class="editor-grid"><label>LEVEL ID<input id="fLevelId" class="form-input" value="${esc(l.id)}" ${existing?'readonly':''}></label><label>TITLE<input id="fLevelName" class="form-input" required value="${esc(l.name)}"></label><label>SLUG<input id="fLevelSlug" class="form-input" required value="${esc(l.slug)}"></label><label>PROGRAM LABEL<input id="fLevelLabel" class="form-input" required value="${esc(l.label)}"></label><label>DIFFICULTY<select id="fLevelTier" class="form-input"><option ${l.tier==='Beginner'?'selected':''}>Beginner</option><option ${l.tier==='Intermediate'?'selected':''}>Intermediate</option><option ${l.tier==='Advanced'?'selected':''}>Advanced</option></select></label><label>BANNER IMAGE URL<input id="fLevelBanner" class="form-input" value="${esc(l.banner)}" placeholder="https://..."></label></div>
    <label>DESCRIPTION<textarea id="fLevelDescription" class="form-input editor-textarea">${esc(l.description)}</textarea></label>
    <label class="editor-check"><input id="fLevelPublished" type="checkbox" ${l.published!==false?'checked':''}> Published on public site</label>
    <div class="editor-section"><div class="editor-section-head"><b>TOPICS IN THIS LEVEL</b><span>Select topics to show in order.</span></div><select id="fLevelTopics" class="form-input" multiple size="6">${topicOptions}</select><small>Hold Ctrl/Cmd to select multiple topics. Existing selections are restored automatically.</small></div>
    <div class="editor-actions"><button type="button" class="secondary-btn" onclick="closeEditor()">Cancel</button><button class="admin-primary">${existing?'Save Changes':'Create Level'}</button></div></form>`,()=>{
      const sel=$('fLevelTopics'); (l.topics||[]).forEach(slug=>{const o=[...sel.options].find(x=>x.value===slug);if(o)o.selected=true;});
      $('levelForm').onsubmit=e=>{e.preventDefault(); saveLevel(existing?.id||null);};
      $('fLevelName').addEventListener('input',()=>{if(!existing)$('fLevelSlug').value=contentApi.slugify($('fLevelName').value);});
    });
}

function saveLevel(oldId) {
  const id=$('fLevelId').value.trim(); const data={id,name:$('fLevelName').value.trim(),slug:$('fLevelSlug').value.trim(),label:$('fLevelLabel').value.trim(),tier:$('fLevelTier').value,description:$('fLevelDescription').value.trim(),banner:$('fLevelBanner').value.trim(),published:$('fLevelPublished').checked,topics:[...$('fLevelTopics').selectedOptions].map(o=>o.value)};
  if(!id||!data.name||!data.slug||!data.label){toast('Please complete the required level fields.');return;}
  if(!oldId && content.levels.some(l=>String(l.id)===id)){toast('That Level ID already exists.');return;}
  if(oldId){const old=levelById(oldId);Object.assign(old,data);}
  else content.levels.push(data);
  persist();closeEditor();render();toast(oldId?'Level updated successfully.':'Level created successfully.');
}

function openTopicEditor(slug='') {
  const existing=slug?topicBySlug(slug):null;
  const fallbackLevel=content.levels[0]?.id||'1';
  const t=existing||{slug:'new-topic',title:'New Topic',level:String(fallbackLevel),intro:'',badgeLabel:`LEVEL ${fallbackLevel}`,cover:'',sections:[{h:'Introduction',body:''}]};
  const levelOptions=content.levels.map(l=>`<option value="${esc(l.id)}" ${String(l.id)===String(t.level)?'selected':''}>${esc(l.name)} — ${esc(l.label)}</option>`).join('');
  openEditor(`<p class="eyebrow">${existing?'EDIT TOPIC':'NEW TOPIC'}</p><h2>${existing?'Edit topic':'Add topic'}</h2><p class="editor-sub">Add a lesson cover, title, description and structured learning sections.</p>
    <form id="topicForm" class="editor-form"><label>COVER PHOTO</label><div class="cover-preview-wrap"><div id="coverPreview" class="cover-preview" style="background-image:url('${esc(t.cover||'')}')">${t.cover?'':'No cover photo'}</div><div class="cover-controls"><input id="fTopicCover" class="form-input" value="${esc(t.cover||'')}" placeholder="Image URL"><label class="file-upload">Upload image<input id="fTopicCoverFile" type="file" accept="image/*"></label><small>Images are stored in this browser for the prototype.</small></div></div>
    <div class="editor-grid"><label>TITLE<input id="fTopicTitle" class="form-input" required value="${esc(t.title)}"></label><label>SLUG<input id="fTopicSlug" class="form-input" required value="${esc(t.slug)}"></label><label>BADGE LABEL<input id="fTopicBadge" class="form-input" value="${esc(t.badgeLabel||'')}"></label><label>LEVEL<select id="fTopicLevel" class="form-input">${levelOptions}</select></label></div>
    <label>DESCRIPTION<textarea id="fTopicIntro" class="form-input editor-textarea">${esc(t.intro||'')}</textarea></label>
    <div class="editor-section"><div class="editor-section-head"><b>LESSON CONTENT</b><button type="button" class="small-gold" onclick="addSectionField()">+ Add section</button></div><div id="sectionFields">${(t.sections||[]).map((s,i)=>sectionField(s,i)).join('')}</div></div>
    <div class="editor-actions"><button type="button" class="secondary-btn" onclick="closeEditor()">Cancel</button><button class="admin-primary">${existing?'Save Changes':'Create Topic'}</button></div></form>`,()=>{
      $('topicForm').onsubmit=e=>{e.preventDefault();saveTopic(existing?.slug||null);};
      $('fTopicTitle').addEventListener('input',()=>{if(!existing)$('fTopicSlug').value=contentApi.slugify($('fTopicTitle').value);});
      $('fTopicLevel').addEventListener('change',()=>{$('fTopicBadge').value=`LEVEL ${$('fTopicLevel').value}`;});
      $('fTopicCover').addEventListener('input',updateCoverPreview);
      $('fTopicCoverFile').addEventListener('change',handleCoverUpload);
    });
}
function sectionField(s,i){return `<div class="section-field" data-index="${i}"><div class="section-field-top"><b>SECTION ${i+1}</b><button type="button" onclick="this.closest('.section-field').remove()">Remove</button></div><input class="form-input sec-heading" value="${esc(s.h)}" placeholder="Section heading"><textarea class="form-input sec-body" placeholder="Explain this concept...">${esc(s.body)}</textarea></div>`;}
function addSectionField(){const wrap=$('sectionFields');wrap.insertAdjacentHTML('beforeend',sectionField({h:'New Section',body:''},wrap.children.length));}
function updateCoverPreview(){const v=$('fTopicCover').value.trim();$('coverPreview').style.backgroundImage=v?`url('${v.replace(/'/g,"%27")}')`:'';$('coverPreview').textContent=v?'':'No cover photo';}
function handleCoverUpload(e){const file=e.target.files?.[0];if(!file)return; if(file.size>1500000){toast('Please use an image smaller than 1.5 MB.');e.target.value='';return;} const r=new FileReader();r.onload=()=>{$('fTopicCover').value=r.result;updateCoverPreview();};r.readAsDataURL(file);}
function saveTopic(oldSlug) {
  const slug=$('fTopicSlug').value.trim(); const level=String($('fTopicLevel').value); const data={slug,title:$('fTopicTitle').value.trim(),level,intro:$('fTopicIntro').value.trim(),badgeLabel:$('fTopicBadge').value.trim()||`LEVEL ${level}`,cover:$('fTopicCover').value.trim(),sections:[...document.querySelectorAll('#sectionFields .section-field')].map(el=>({h:el.querySelector('.sec-heading').value.trim(),body:el.querySelector('.sec-body').value.trim()})).filter(s=>s.h||s.body)};
  if(!slug||!data.title){toast('Title and slug are required.');return;}
  if(!oldSlug && topicBySlug(slug)){toast('That topic slug already exists.');return;}
  if(oldSlug){const topic=topicBySlug(oldSlug); const idx=content.topics.indexOf(topic); Object.assign(topic,data); content.levels.forEach(l=>{if((l.topics||[]).includes(oldSlug))l.topics=l.topics.map(x=>x===oldSlug?slug:x);});}
  else {content.topics.push(data); const levelObj=levelById(level); if(levelObj){levelObj.topics=levelObj.topics||[]; if(!levelObj.topics.includes(slug))levelObj.topics.push(slug);}}
  persist();closeEditor();render();toast(oldSlug?'Topic updated successfully.':'Topic created successfully.');
}
function deleteLevel(id){const l=levelById(id);if(!l)return;if(!confirm(`Delete ${l.name}? Its topics will remain available but the program will be removed.`))return;content.levels=content.levels.filter(x=>String(x.id)!==String(id));persist();render();toast('Level deleted.');}
function deleteTopic(slug){const t=topicBySlug(slug);if(!t)return;if(!confirm(`Delete ${t.title}? This cannot be undone in the current browser.`))return;content.topics=content.topics.filter(x=>x.slug!==slug);content.levels.forEach(l=>l.topics=(l.topics||[]).filter(x=>x!==slug));persist();render();toast('Topic deleted.');}
function resetAllContent(){if(!confirm('Reset all programs and topics to the original demo content?'))return;content=contentApi.reset();render();toast('Demo content restored.');}

$('editorClose').onclick=closeEditor;
$('editorModal').onclick=e=>{if(e.target===$('editorModal'))closeEditor();};
$('adminLogout').onclick=()=>{sessionStorage.removeItem('algocraftAdminSession');window.location.href='index.html';};
$('adminClose').onclick=()=>window.location.href='index.html';
render();
