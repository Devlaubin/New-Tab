// ===================== THEMES =====================
const themes = [
    { name: 'Défaut', gradient: 'linear-gradient(135deg, #888a96 0%, #71a5cf 100%)' },
    { name: 'Océan', gradient: 'linear-gradient(135deg, #1a3a5c 0%, #2980b9 100%)' },
    { name: 'Aurore', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
    { name: 'Forêt', gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)' },
    { name: 'Nuit', gradient: 'linear-gradient(135deg, #0F2027 0%, #2C5364 100%)' },
    { name: 'Rose', gradient: 'linear-gradient(135deg, #c94b9e 0%, #f8a5c2 100%)' },
    { name: 'Lavande', gradient: 'linear-gradient(135deg, #4a3f8c 0%, #9b59b6 100%)' },
    { name: 'Menthe', gradient: 'linear-gradient(135deg, #1abc9c 0%, #2ecc71 100%)' },
    { name: 'Cramoisi', gradient: 'linear-gradient(135deg, #900 0%, #e74c3c 100%)' },
    { name: 'Nuit étoilée', gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
    { name: 'Coucher de soleil', gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
    { name: 'Nord', gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)' },
    { name: 'Corail', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
];

// ===================== SEARCH ENGINES =====================
const engines = [
    { id: 'google', name: 'Google', icon: 'https://www.google.com/favicon.ico', url: 'https://www.google.com/search?q=' },
    { id: 'bing', name: 'Bing', icon: 'https://www.bing.com/favicon.ico', url: 'https://www.bing.com/search?q=' },
    { id: 'duckduckgo', name: 'Duck', icon: 'https://duckduckgo.com/favicon.ico', url: 'https://duckduckgo.com/?q=' },
    { id: 'brave', name: 'Brave', icon: 'https://brave.com/favicon.ico', url: 'https://search.brave.com/search?q=' },
    { id: 'qwant', name: 'Qwant', icon: 'images/qwant_logo.png', url: 'https://www.qwant.com/?q=' },
    { id: 'startpage', name: 'Start', icon: 'https://www.startpage.com/favicon.ico', url: 'https://www.startpage.com/sp/search?q=' },
    { id: 'Search', name: 'Search', icon: 'https://new-tab-devlaubin.netlify.app/images/search.png', url: '/search?q=' },
];

// ===================== DEFAULT SHORTCUTS =====================
const defaultShortcuts = [
    { name: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
    { name: 'GitHub', url: 'https://github.com/Devlaubin', icon: 'https://github.com/favicon.ico' },
    { name: 'Gmail', url: 'https://mail.google.com', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Netflix', url: 'https://netflix.com', icon: 'https://www.netflix.com/favicon.ico' },
    { name: 'Reddit', url: 'https://reddit.com', icon: 'https://www.reddit.com/favicon.ico' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://www.linkedin.com/favicon.ico' },
    { name: 'Amazon', url: 'https://amazon.com', icon: 'https://www.amazon.com/favicon.ico' },
];

// ===================== QUOTES =====================
const quotes = [
    { text: "Le seul moyen de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
    { text: "L'imagination est plus importante que la connaissance.", author: "Albert Einstein" },
    { text: "La vie est ce qui arrive quand tu es occupé à faire d'autres projets.", author: "John Lennon" },
    { text: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
    { text: "Soyez le changement que vous voulez voir dans le monde.", author: "Gandhi" },
    { text: "La créativité, c'est l'intelligence qui s'amuse.", author: "Albert Einstein" },
    { text: "Chaque jour est une nouvelle chance de changer votre vie.", author: "Anonyme" },
    { text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas. C'est parce que nous n'osons pas qu'elles sont difficiles.", author: "Sénèque" },
    { text: "Votre temps est limité, ne le gâchez pas en vivant la vie de quelqu'un d'autre.", author: "Steve Jobs" },
    { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", author: "Dalaï Lama" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "La meilleure façon de prédire l'avenir, c'est de le créer.", author: "Peter Drucker" },
];

// ===================== STATE =====================
let currentTheme = localStorage.getItem('theme') || themes[0].gradient;
let currentEngine = localStorage.getItem('engine') || 'google';
let userName = localStorage.getItem('userName') || '';
let showTime = localStorage.getItem('showTime') !== 'false';
let showWeather = localStorage.getItem('showWeather') !== 'false';
let showNotes = localStorage.getItem('showNotes') !== 'false';
let showShortcuts = localStorage.getItem('showShortcuts') !== 'false';
let showQuote = localStorage.getItem('showQuote') !== 'false';
let showTodos = localStorage.getItem('showTodos') !== 'false';
let secureMode = localStorage.getItem('secureMode') !== '0';
let shortcuts = JSON.parse(localStorage.getItem('shortcuts') || 'null') || defaultShortcuts;
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
let editingShortcutIndex = null;
let notes = localStorage.getItem('notes') || '';
let notesTimer = null;

// ===================== INIT =====================
function init() {
    applyTheme(currentTheme);
    applyVisibility();
    updateTime();
    setInterval(updateTime, 1000);
    renderEngine();
    renderShortcuts();
    renderThemeModal();
    renderEngineModal();
    initToggles();
    initSecurity();
    initSearch();
    initNotes();
    createParticles();
    updateWeather();
    renderQuote();
    renderTodos();
    initKeyboardShortcuts();

    if (!localStorage.getItem('visited')) {
        setTimeout(() => openModal('firstVisitModal'), 600);
    }
}

// ===================== BACKGROUND PARTICLES =====================
function createParticles() {
    const container = document.getElementById('bgParticles');
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 80 + 20;
        p.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 15}s;
            opacity: ${Math.random() * 0.08 + 0.02};
        `;
        container.appendChild(p);
    }
}

// ===================== THEME =====================
function applyTheme(gradient) {
    document.body.style.background = gradient;
    document.documentElement.style.setProperty('--bg', gradient);
    currentTheme = gradient;
    localStorage.setItem('theme', gradient);
}

function renderThemeModal() {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';
    themes.forEach(t => {
        const el = document.createElement('div');
        el.className = 'color-swatch' + (t.gradient === currentTheme ? ' active' : '');
        el.style.background = t.gradient;
        el.title = t.name;
        el.onclick = () => {
            applyTheme(t.gradient);
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            el.classList.add('active');
        };
        grid.appendChild(el);
    });

    // Custom color picker
    const customWrap = document.createElement('div');
    customWrap.style.cssText = 'width:100%;margin-top:12px;';
    customWrap.innerHTML = `
        <div style="font-size:12px;color:#999;margin-bottom:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Couleur personnalisée</div>
        <div style="display:flex;gap:10px;align-items:center;">
            <input type="color" id="color1" value="#888a96" style="width:50px;height:40px;border:none;border-radius:8px;cursor:pointer;">
            <span style="color:#999;">→</span>
            <input type="color" id="color2" value="#71a5cf" style="width:50px;height:40px;border:none;border-radius:8px;cursor:pointer;">
            <button onclick="applyCustomGradient()" style="flex:1;padding:10px;background:#71a5cf;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Appliquer</button>
        </div>
    `;
    grid.appendChild(customWrap);
}

function applyCustomGradient() {
    const c1 = document.getElementById('color1').value;
    const c2 = document.getElementById('color2').value;
    applyTheme(`linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`);
}

// ===================== TIME =====================
function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').textContent = `${h}:${m}`;

    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const ds = now.toLocaleDateString('fr-FR', opts);
    document.getElementById('date').textContent = ds.charAt(0).toUpperCase() + ds.slice(1);

    if (userName) {
        const hr = now.getHours();
        let greet = hr < 6 ? 'Bonne nuit' : hr < 12 ? 'Bonjour' : hr < 18 ? 'Bonjour' : 'Bonsoir';
        document.getElementById('greetingName').textContent = `${greet}, ${userName} 👋`;
    } else {
        document.getElementById('greetingName').textContent = '';
    }
}

// ===================== QUOTE OF THE DAY =====================
function renderQuote() {
    const quoteSection = document.getElementById('quoteSection');
    if (!quoteSection) return;
    quoteSection.style.display = showQuote ? '' : 'none';
    if (!showQuote) return;

    const dayIndex = Math.floor(Date.now() / 86400000) % quotes.length;
    const q = quotes[dayIndex];
    quoteSection.innerHTML = `
        <div class="quote-icon">💬</div>
        <div class="quote-content">
            <p class="quote-text">"${q.text}"</p>
            <p class="quote-author">— ${q.author}</p>
        </div>
    `;
}

// ===================== TODOS =====================
function renderTodos() {
    const section = document.getElementById('todosSection');
    if (!section) return;
    section.style.display = showTodos ? '' : 'none';
    if (!showTodos) return;

    const remaining = todos.filter(t => !t.done).length;
    const todoList = document.getElementById('todoList');
    const badge = document.getElementById('todoBadge');
    if (badge) badge.textContent = remaining > 0 ? remaining : '';

    if (!todoList) return;
    todoList.innerHTML = '';

    todos.forEach((todo, i) => {
        const item = document.createElement('div');
        item.className = 'todo-item' + (todo.done ? ' done' : '');
        item.innerHTML = `
            <div class="todo-check" onclick="toggleTodo(${i})">
                ${todo.done ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <span class="todo-text">${escHtml(todo.text)}</span>
            <button class="todo-del" onclick="deleteTodo(${i})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;
        todoList.appendChild(item);
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    renderTodos();
}

function toggleTodo(i) {
    todos[i].done = !todos[i].done;
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function deleteTodo(i) {
    todos.splice(i, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function clearDoneTodos() {
    todos = todos.filter(t => !t.done);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// ===================== SEARCH HISTORY =====================
function addToHistory(q) {
    searchHistory = searchHistory.filter(h => h !== q);
    searchHistory.unshift(q);
    searchHistory = searchHistory.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function clearHistory() {
    searchHistory = [];
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    showToast('Historique effacé');
}

// ===================== SEARCH =====================
function renderEngine() {
    const e = engines.find(e => e.id === currentEngine) || engines[0];
    document.getElementById('engineIcon').src = e.icon;
    document.getElementById('engineLabel').textContent = e.name;
}

function renderEngineModal() {
    const grid = document.getElementById('engineGrid');
    grid.innerHTML = '';
    engines.forEach(e => {
        const btn = document.createElement('button');
        btn.className = 'engine-option' + (e.id === currentEngine ? ' active' : '');
        btn.innerHTML = `<img src="${e.icon}" alt=""> ${e.name}`;
        btn.onclick = () => {
            currentEngine = e.id;
            localStorage.setItem('engine', e.id);
            renderEngine();
            document.querySelectorAll('.engine-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        grid.appendChild(btn);
    });
}

function doSearch(query) {
    if (!query.trim()) return;
    hideSuggestions();
    addToHistory(query.trim());
    if (query.match(/^https?:\/\//)) {
        window.location.href = query;
    } else if (query.match(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/) && !query.includes(' ')) {
        window.location.href = 'https://' + query;
    } else {
        const e = engines.find(e => e.id === currentEngine) || engines[0];
        window.location.href = e.url + encodeURIComponent(query);
    }
}

let suggestTimer = null;
function initSearch() {
    const input = document.getElementById('searchInput');
    const sugg = document.getElementById('suggestions');
    let activeSugg = -1;

    input.addEventListener('keydown', (e) => {
        const items = sugg.querySelectorAll('.suggestion-item');
        if (e.key === 'ArrowDown') {
            activeSugg = Math.min(activeSugg + 1, items.length - 1);
            items.forEach((it, i) => it.classList.toggle('active', i === activeSugg));
            if (items[activeSugg]) input.value = items[activeSugg].dataset.value;
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            activeSugg = Math.max(activeSugg - 1, -1);
            items.forEach((it, i) => it.classList.toggle('active', i === activeSugg));
            if (activeSugg >= 0 && items[activeSugg]) input.value = items[activeSugg].dataset.value;
            e.preventDefault();
        } else if (e.key === 'Enter') {
            doSearch(input.value);
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    input.addEventListener('input', () => {
        activeSugg = -1;
        const q = input.value.trim();
        if (!q) { hideSuggestions(); return; }
        clearTimeout(suggestTimer);
        suggestTimer = setTimeout(() => fetchSuggestions(q), 250);
    });

    // Show history on focus if input is empty
    input.addEventListener('focus', () => {
        setSearchActive(true);
        if (!input.value.trim() && searchHistory.length > 0) {
            showHistorySuggestions();
        }
    });

    input.addEventListener('blur', () => setTimeout(() => setSearchActive(false), 180));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) hideSuggestions();
    });
}

function showHistorySuggestions() {
    const sugg = document.getElementById('suggestions');
    sugg.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 20px 4px;font-size:11px;color:#aaa;font-weight:600;letter-spacing:1px;">
            <span>RÉCENT</span>
            <button onclick="clearHistory()" style="border:none;background:none;font-size:11px;color:#ccc;cursor:pointer;padding:0;">Effacer</button>
        </div>
    `;
    searchHistory.slice(0, 5).forEach(h => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.dataset.value = h;
        div.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#aaa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${escHtml(h)}`;
        div.onclick = () => doSearch(h);
        sugg.appendChild(div);
    });
    sugg.classList.add('visible');
}

const _searchToggleIds = ['weatherSection', 'shortcutsSection', 'notesSection', 'quoteSection', 'todosSection'];
function setSearchActive(active) {
    _searchToggleIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const cs = window.getComputedStyle(el);
        if (active) {
            if (cs.display !== 'none') {
                if (el.dataset.savedVisibility === undefined) el.dataset.savedVisibility = 'visible';
                el.classList.add('search-hidden');
            }
        } else {
            if (el.dataset.savedVisibility !== undefined) {
                el.classList.remove('search-hidden');
                delete el.dataset.savedVisibility;
            }
            if (id === 'weatherSection') el.style.display = showWeather ? '' : 'none';
            if (id === 'shortcutsSection') el.style.display = showShortcuts ? '' : 'none';
            if (id === 'notesSection') el.style.display = showNotes ? '' : 'none';
            if (id === 'quoteSection') el.style.display = showQuote ? '' : 'none';
            if (id === 'todosSection') el.style.display = showTodos ? '' : 'none';
        }
    });
}

function fetchSuggestions(q) {
    const old = document.getElementById('suggScript');
    if (old) old.remove();
    window._suggCallback = function(data) {
        const suggestions = data[1].slice(0, 6);
        showSuggestions(q, suggestions);
    };
    const script = document.createElement('script');
    script.id = 'suggScript';
    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}&callback=_suggCallback`;
    script.onerror = () => {};
    document.head.appendChild(script);
}

setTimeout(() => {
    if (!window._suggCallback) window._suggCallback = function() {};
}, 2000);

function showSuggestions(query, items) {
    const sugg = document.getElementById('suggestions');
    sugg.innerHTML = '';
    if (!items.length) { hideSuggestions(); return; }
    items.forEach(text => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.dataset.value = text;
        div.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> ${escHtml(text)}`;
        div.onclick = () => doSearch(text);
        sugg.appendChild(div);
    });
    sugg.classList.add('visible');
}

function hideSuggestions() {
    document.getElementById('suggestions').classList.remove('visible');
}

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===================== SHORTCUTS =====================
function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    grid.innerHTML = '';
    shortcuts.forEach((s, i) => {
        const a = document.createElement('a');
        a.className = 'shortcut';
        a.href = s.url;
        a.title = s.name;
        a.addEventListener('click', e => {
            if (e.target.closest('button')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        const iconDiv = document.createElement('div');
        iconDiv.className = 'shortcut-icon';
        iconDiv.innerHTML = `<img src="${s.icon}" alt="${escHtml(s.name)}" onerror="this.style.display='none';this.parentElement.textContent='${escHtml(s.name[0].toUpperCase())}'">`;
        a.appendChild(iconDiv);

        const label = document.createElement('span');
        label.className = 'shortcut-label';
        label.textContent = s.name;
        a.appendChild(label);

        const editBtn = document.createElement('button');
        editBtn.className = 'shortcut-edit';
        editBtn.setAttribute('aria-label','Modifier');
        editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>`;
        editBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openShortcutModal(i);
        });
        a.appendChild(editBtn);

        const delBtn = document.createElement('button');
        delBtn.className = 'shortcut-delete';
        delBtn.setAttribute('aria-label','Supprimer');
        delBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12"><line x1="4" y1="4" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="4" x2="4" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
        delBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            deleteShortcut(i);
        });
        a.appendChild(delBtn);

        grid.appendChild(a);
    });

    // Add button
    const add = document.createElement('div');
    add.className = 'shortcut-add';
    add.onclick = () => openShortcutModal();
    add.innerHTML = `<div class="shortcut-add-icon"><img src="images/plus_icon.png" alt="Ajouter"></div><span class="shortcut-add-label">Ajouter</span>`;
    grid.appendChild(add);

    // Import/Export buttons
    const io = document.createElement('div');
    io.className = 'shortcut-add';
    io.onclick = () => exportShortcuts();
    io.innerHTML = `<div class="shortcut-add-icon" style="font-size:18px;">📤</div><span class="shortcut-add-label">Exporter</span>`;
    grid.appendChild(io);

    const imp = document.createElement('div');
    imp.className = 'shortcut-add';
    imp.onclick = () => document.getElementById('importShortcutsFile').click();
    imp.innerHTML = `<div class="shortcut-add-icon" style="font-size:18px;">📥</div><span class="shortcut-add-label">Importer</span>`;
    grid.appendChild(imp);
}

function exportShortcuts() {
    const data = JSON.stringify(shortcuts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raccourcis-newtab.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Raccourcis exportés !');
}

function importShortcuts(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                shortcuts = data;
                localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
                renderShortcuts();
                showToast('Raccourcis importés !');
            }
        } catch {
            showToast('Fichier invalide !');
        }
    };
    reader.readAsText(file);
}

function deleteShortcut(index) {
    shortcuts.splice(index, 1);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    renderShortcuts();
}

function openShortcutModal(index = null) {
    editingShortcutIndex = index !== null ? index : null;
    const nameInput = document.getElementById('shortcutName');
    const urlInput = document.getElementById('shortcutUrl');
    const modalTitle = document.querySelector('#shortcutModal .modal-title');
    const primaryBtn = document.querySelector('#shortcutModal .btn-primary');
    if (editingShortcutIndex !== null) {
        const s = shortcuts[editingShortcutIndex];
        nameInput.value = s.name;
        urlInput.value = s.url;
        modalTitle.textContent = 'Modifier un raccourci';
        primaryBtn.textContent = 'Enregistrer';
    } else {
        nameInput.value = '';
        urlInput.value = '';
        modalTitle.textContent = 'Ajouter un raccourci';
        primaryBtn.textContent = 'Ajouter';
    }
    openModal('shortcutModal');
}

function saveShortcut() {
    let name = document.getElementById('shortcutName').value.trim();
    let url = document.getElementById('shortcutUrl').value.trim();
    if (!name || !url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    let domain = '';
    try { domain = new URL(url).hostname; } catch(e) {}
    const icon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
    if (editingShortcutIndex !== null) {
        shortcuts[editingShortcutIndex] = { name, url, icon };
        editingShortcutIndex = null;
    } else {
        shortcuts.push({ name, url, icon });
    }
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    renderShortcuts();
    closeModal('shortcutModal');
}

// ===================== WEATHER =====================
function getWeatherIcon(desc) {
    const d = desc.toLowerCase();
    if (d.includes('soleil') || d.includes('ensoleillé') || d.includes('sunny') || d.includes('clear')) return '☀️';
    if (d.includes('nuage') || d.includes('nuageux') || d.includes('cloud')) return '☁️';
    if (d.includes('pluie') || d.includes('rain') || d.includes('averse')) return '🌧️';
    if (d.includes('brume') || d.includes('brouillard') || d.includes('fog') || d.includes('mist')) return '🌫️';
    if (d.includes('neige') || d.includes('snow')) return '❄️';
    if (d.includes('orage') || d.includes('thunder')) return '⛈️';
    if (d.includes('couvert') || d.includes('overcast')) return '🌥️';
    if (d.includes('éclair') || d.includes('éclaircies') || d.includes('partly')) return '⛅';
    return '🌡️';
}

async function updateWeather() {
    if (!showWeather) return;
    try {
        const res = await fetch('https://wttr.in/Chambray-les-Tours?format=j1');
        const data = await res.json();
        const cur = data.current_condition[0];
        const temp = cur.temp_C;
        const feelsLike = cur.FeelsLikeC;
        const humidity = cur.humidity;
        const windSpeed = cur.windspeedKmph;
        const desc = cur.lang_fr?.[0]?.value || cur.weatherDesc[0].value;
        const icon = getWeatherIcon(desc);
        const uv = cur.uvIndex;

        document.getElementById('weatherIcon').textContent = icon;
        document.getElementById('weatherTemp').textContent = `${temp}°C`;
        document.getElementById('weatherDesc').textContent = desc;

        // Update extra weather details
        const extraEl = document.getElementById('weatherExtra');
        if (extraEl) {
            extraEl.innerHTML = `
                <span title="Ressenti">🌡️ ${feelsLike}°C</span>
                <span title="Humidité">💧 ${humidity}%</span>
                <span title="Vent">💨 ${windSpeed} km/h</span>
                <span title="UV">☀️ UV ${uv}</span>
            `;
        }

        // 3-day forecast
        const forecastEl = document.getElementById('weatherForecast');
        forecastEl.innerHTML = '';
        const days = data.weather.slice(0, 3);
        const dayNames = ['Aujourd\'hui', 'Demain', 'Après-dem.'];
        days.forEach((day, i) => {
            const maxT = day.maxtempC;
            const minT = day.mintempC;
            const dayDesc = day.hourly[4]?.lang_fr?.[0]?.value || day.hourly[4]?.weatherDesc?.[0]?.value || '';
            const dayIcon = getWeatherIcon(dayDesc);
            const el = document.createElement('div');
            el.className = 'forecast-day';
            el.innerHTML = `
                <div class="forecast-day-name">${dayNames[i]}</div>
                <div class="forecast-icon">${dayIcon}</div>
                <div class="forecast-temp">${maxT}° / ${minT}°</div>
            `;
            forecastEl.appendChild(el);
        });
    } catch (e) {
        document.getElementById('weatherDesc').textContent = 'Météo non disponible';
        document.getElementById('weatherIcon').textContent = '🌡️';
    }
}

// ===================== NOTES =====================
function initNotes() {
    const area = document.getElementById('notesArea');
    area.value = notes;
    area.addEventListener('input', () => {
        clearTimeout(notesTimer);
        notesTimer = setTimeout(() => {
            localStorage.setItem('notes', area.value);
        }, 500);
    });
}

// ===================== VISIBILITY =====================
function applyVisibility() {
    document.getElementById('timeSection').style.display = showTime ? '' : 'none';
    document.getElementById('weatherSection').style.display = showWeather ? '' : 'none';
    document.getElementById('notesSection').style.display = showNotes ? '' : 'none';
    document.getElementById('shortcutsSection').style.display = showShortcuts ? '' : 'none';
    const qs = document.getElementById('quoteSection');
    if (qs) qs.style.display = showQuote ? '' : 'none';
    const ts = document.getElementById('todosSection');
    if (ts) ts.style.display = showTodos ? '' : 'none';

    document.getElementById('toggleTime').checked = showTime;
    document.getElementById('toggleWeather').checked = showWeather;
    document.getElementById('toggleNotes').checked = showNotes;
    document.getElementById('toggleShortcuts').checked = showShortcuts;
    const tq = document.getElementById('toggleQuote');
    if (tq) tq.checked = showQuote;
    const tt = document.getElementById('toggleTodos');
    if (tt) tt.checked = showTodos;
}

function initToggles() {
    document.getElementById('toggleTime').addEventListener('change', e => {
        showTime = e.target.checked;
        localStorage.setItem('showTime', showTime);
        document.getElementById('timeSection').style.display = showTime ? '' : 'none';
    });
    document.getElementById('toggleWeather').addEventListener('change', e => {
        showWeather = e.target.checked;
        localStorage.setItem('showWeather', showWeather);
        document.getElementById('weatherSection').style.display = showWeather ? '' : 'none';
        if (showWeather) updateWeather();
    });
    document.getElementById('toggleNotes').addEventListener('change', e => {
        showNotes = e.target.checked;
        localStorage.setItem('showNotes', showNotes);
        document.getElementById('notesSection').style.display = showNotes ? '' : 'none';
    });
    document.getElementById('toggleShortcuts').addEventListener('change', e => {
        showShortcuts = e.target.checked;
        localStorage.setItem('showShortcuts', showShortcuts);
        document.getElementById('shortcutsSection').style.display = showShortcuts ? '' : 'none';
    });

    const toggleQuote = document.getElementById('toggleQuote');
    if (toggleQuote) {
        toggleQuote.addEventListener('change', e => {
            showQuote = e.target.checked;
            localStorage.setItem('showQuote', showQuote);
            const qs = document.getElementById('quoteSection');
            if (qs) qs.style.display = showQuote ? '' : 'none';
        });
    }

    const toggleTodos = document.getElementById('toggleTodos');
    if (toggleTodos) {
        toggleTodos.addEventListener('change', e => {
            showTodos = e.target.checked;
            localStorage.setItem('showTodos', showTodos);
            const ts = document.getElementById('todosSection');
            if (ts) ts.style.display = showTodos ? '' : 'none';
        });
    }

    const AUTOFOCUS_KEY = 'searchAutoFocusEnabled';
    const autoToggle = document.getElementById('toggleAutoFocus');
    if (autoToggle) {
        const saved = localStorage.getItem(AUTOFOCUS_KEY);
        const enabled = saved === null ? true : saved === 'true';
        autoToggle.checked = enabled;
        if (enabled) {
            const si = document.getElementById('searchInput');
            if (si) si.focus();
        }
        autoToggle.addEventListener('change', e => {
            const en = e.target.checked;
            localStorage.setItem(AUTOFOCUS_KEY, en ? 'true' : 'false');
            if (en) {
                const si = document.getElementById('searchInput');
                if (si) setTimeout(() => si.focus(), 50);
            }
        });
    }
}

// ===================== KEYBOARD SHORTCUTS =====================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;

        if (e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        // T = toggle todos
        if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
            const ts = document.getElementById('todosSection');
            if (ts) {
                showTodos = !showTodos;
                localStorage.setItem('showTodos', showTodos);
                ts.style.display = showTodos ? '' : 'none';
                const tt = document.getElementById('toggleTodos');
                if (tt) tt.checked = showTodos;
            }
        }
        // N = focus notes
        if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
            const na = document.getElementById('notesArea');
            if (na && showNotes) na.focus();
        }
        // Escape = close modals/sidebar
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            closeSidebar();
        }
    });
}

// ===================== SECURITY =====================
let _secureLinkHandler = null;

function applySecurityToNewLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        try {
            const u = new URL(a.href);
            if (u.origin !== location.origin) {
                if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
                const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
                if (!rel.includes('noopener')) rel.push('noopener');
                if (!rel.includes('noreferrer')) rel.push('noreferrer');
                a.setAttribute('rel', rel.join(' '));
            }
        } catch (e) {}
    });
}

function enableSecureMode() {
    if (_secureLinkHandler) return;
    _secureLinkHandler = function (e) {
        const a = e.target.closest && e.target.closest('a');
        if (!a || !a.getAttribute) return;
        const href = a.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        try {
            const url = new URL(href, location.href);
            if (url.protocol !== 'https:') {
                if (!confirm("Le lien que vous ouvrez n'est pas sécurisé (HTTP). Continuer ?")) {
                    e.preventDefault();
                    return;
                }
            }
            if (url.origin !== location.origin) {
                e.preventDefault();
                window.open(url.href, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {}
    };
    document.addEventListener('click', _secureLinkHandler, true);
    applySecurityToNewLinks();
}

function disableSecureMode() {
    if (!_secureLinkHandler) return;
    document.removeEventListener('click', _secureLinkHandler, true);
    _secureLinkHandler = null;
    document.querySelectorAll('a[rel]').forEach(a => {
        const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean).filter(t => t !== 'noopener' && t !== 'noreferrer');
        if (rel.length) a.setAttribute('rel', rel.join(' ')); else a.removeAttribute('rel');
        try {
            const u = new URL(a.href);
            if (u.origin !== location.origin && a.getAttribute('target') === '_blank') a.removeAttribute('target');
        } catch (e) {}
    });
}

function initSecurity() {
    const secToggle = document.getElementById('toggleSecurity');
    if (!secToggle) return;
    secToggle.checked = secureMode;
    secToggle.addEventListener('change', e => {
        secureMode = e.target.checked;
        localStorage.setItem('secureMode', secureMode ? '1' : '0');
        if (secureMode) enableSecureMode(); else disableSecureMode();
    });
    if (secureMode) enableSecureMode();
}

// ===================== TOAST =====================
function showToast(msg, duration = 2500) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.style.cssText = `
            position: fixed; bottom: 24px; left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(0,0,0,0.75); color: white;
            padding: 10px 20px; border-radius: 50px;
            font-size: 13px; font-weight: 500;
            opacity: 0; transition: all 0.3s;
            pointer-events: none; z-index: 9999;
            font-family: 'DM Sans', sans-serif;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, duration);
}

// ===================== MODALS =====================
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openThemeModal() { renderThemeModal(); openModal('themeModal'); closeSidebar(); }
function openNameModal() {
    document.getElementById('nameInput').value = userName;
    openModal('nameModal');
    closeSidebar();
}
function openEngineModal() { renderEngineModal(); openModal('engineModal'); closeSidebar(); }

// Keyboard shortcuts modal
function openShortcutsHelpModal() {
    openModal('shortcutsHelpModal');
    closeSidebar();
}

function saveName() {
    userName = document.getElementById('nameInput').value.trim();
    localStorage.setItem('userName', userName);
    updateTime();
    closeModal('nameModal');
}
function saveFirstName(save) {
    if (save) {
        userName = document.getElementById('firstNameInput').value.trim();
        localStorage.setItem('userName', userName);
    }
    localStorage.setItem('visited', '1');
    closeModal('firstVisitModal');
    updateTime();
}

document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
        if (e.target === o) o.classList.remove('active');
    });
});

// ===================== SIDEBAR =====================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}
menuToggle.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', closeSidebar);

// Enter on modal inputs
document.getElementById('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
document.getElementById('firstNameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveFirstName(true); });
document.getElementById('shortcutUrl').addEventListener('keydown', e => { if (e.key === 'Enter') saveShortcut(); });

// Import shortcuts file input
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('importShortcutsFile');
    if (fileInput) {
        fileInput.addEventListener('change', e => {
            if (e.target.files[0]) importShortcuts(e.target.files[0]);
        });
    }
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') addTodo();
        });
    }
});

// ===================== START =====================
init();