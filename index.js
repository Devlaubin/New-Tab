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
];

// ===================== SEARCH ENGINES =====================
const engines = [
    { id: 'google', name: 'Google', icon: 'https://www.google.com/favicon.ico', url: 'https://www.google.com/search?q=' },
    { id: 'bing', name: 'Bing', icon: 'https://www.bing.com/favicon.ico', url: 'https://www.bing.com/search?q=' },
    { id: 'duckduckgo', name: 'Duck', icon: 'https://duckduckgo.com/favicon.ico', url: 'https://duckduckgo.com/?q=' },
    { id: 'brave', name: 'Brave', icon: 'https://brave.com/favicon.ico', url: 'https://search.brave.com/search?q=' },
    { id: 'qwant', name: 'Qwant', icon: 'images/qwant_logo.png', url: 'https://www.qwant.com/?q=' },
    { id: 'startpage', name: 'Start', icon: 'https://www.startpage.com/favicon.ico', url: 'https://www.startpage.com/sp/search?q=' },
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

// ===================== STATE =====================
let currentTheme = localStorage.getItem('theme') || themes[0].gradient;
let currentEngine = localStorage.getItem('engine') || 'google';
let userName = localStorage.getItem('userName') || '';
let showTime = localStorage.getItem('showTime') !== 'false';
let showWeather = localStorage.getItem('showWeather') !== 'false';
let showNews = localStorage.getItem('showNews') !== 'false';
let showNotes = localStorage.getItem('showNotes') !== 'false';
let showShortcuts = localStorage.getItem('showShortcuts') !== 'false';
let secureMode = localStorage.getItem('secureMode') !== '0';
let shortcuts = JSON.parse(localStorage.getItem('shortcuts') || 'null') || defaultShortcuts;

// index of shortcut being edited (null when adding new)
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
    updateNews();

    // First visit
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

    // Greeting based on hour
    if (userName) {
        const hr = now.getHours();
        let greet = hr < 6 ? 'Bonne nuit' : hr < 12 ? 'Bonjour' : hr < 18 ? 'Bonjour' : 'Bonsoir';
        document.getElementById('greetingName').textContent = `${greet}, ${userName} 👋`;
    } else {
        document.getElementById('greetingName').textContent = '';
    }
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
    
    // During search: hide other sections (weather, shortcuts, notes)
    const _searchToggleIds = ['weatherSection', 'newsSection', 'shortcutsSection', 'notesSection'];
    function setSearchActive(active) {
        _searchToggleIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const cs = window.getComputedStyle(el);
            if (active) {
                // only visually hide if currently rendered (display != 'none')
                if (cs.display !== 'none') {
                    if (el.dataset.savedVisibility === undefined) el.dataset.savedVisibility = 'visible';
                    el.classList.add('search-hidden');
                }
            } else {
                // restore only those we visually hid
                if (el.dataset.savedVisibility !== undefined) {
                    el.classList.remove('search-hidden');
                    delete el.dataset.savedVisibility;
                }
                // ensure permanent user toggles are respected
                if (id === 'weatherSection') el.style.display = showWeather ? '' : 'none';
                if (id === 'newsSection') el.style.display = showNews ? '' : 'none';
                if (id === 'shortcutsSection') el.style.display = showShortcuts ? '' : 'none';
                if (id === 'notesSection') el.style.display = showNotes ? '' : 'none';
            }
        });
    }

    input.addEventListener('focus', () => setSearchActive(true));
    input.addEventListener('blur', () => setTimeout(() => setSearchActive(false), 180));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) hideSuggestions();
    });
}

function fetchSuggestions(q) {
    // Use a CORS-friendly approach via script tag (Google suggestions)
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

// Fallback: if suggestions fail, just show the query itself
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
        // if a button inside is clicked, cancel navigation
        a.addEventListener('click', e => {
            if (e.target.closest('button')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'shortcut-icon';
        iconDiv.innerHTML = `<img src="${s.icon}" alt="${escHtml(s.name)}" onerror="this.style.display='none';this.parentElement.textContent='${escHtml(s.name[0].toUpperCase())}'">`;
        a.appendChild(iconDiv);

        // label
        const label = document.createElement('span');
        label.className = 'shortcut-label';
        label.textContent = s.name;
        a.appendChild(label);

        // edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'shortcut-edit';
        editBtn.setAttribute('aria-label','Modifier');
        editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
            </svg>`;
        editBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openShortcutModal(i);
        });
        a.appendChild(editBtn);

        // delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'shortcut-delete';
        delBtn.setAttribute('aria-label','Supprimer');
        delBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
                    <line x1="4" y1="4" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="20" y1="4" x2="4" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
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
}

function deleteShortcut(index) {
    // index already validated by caller
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
    document.getElementById('shortcutName').value = '';
    document.getElementById('shortcutUrl').value = '';
    const modalTitle = document.querySelector('#shortcutModal .modal-title');
    const primaryBtn = document.querySelector('#shortcutModal .btn-primary');
    modalTitle.textContent = 'Ajouter un raccourci';
    primaryBtn.textContent = 'Ajouter';
    closeModal('shortcutModal');
}

// ===================== WEATHER =====================
const weatherIcons = {
    sunny: '☀️', clear: '🌙', cloudy: '☁️', overcast: '☁️',
    rain: '🌧️', drizzle: '🌦️', snow: '❄️', sleet: '🌨️',
    thunder: '⛈️', fog: '🌫️', mist: '🌫️', haze: '🌫️',
    default: '🌡️'
};

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
        const desc = cur.lang_fr?.[0]?.value || cur.weatherDesc[0].value;
        const icon = getWeatherIcon(desc);

        document.getElementById('weatherIcon').textContent = icon;
        document.getElementById('weatherTemp').textContent = `${temp}°C`;
        document.getElementById('weatherDesc').textContent = desc;

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

// ===================== NEWS =====================
async function updateNews() {
    if (!showNews) return;
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '<div class="news-loading">📰 Chargement des actualités...</div>';

    // Votre clé fournie — gardez-la secrète pour production (proxy côté serveur recommandé)
    const API_KEY = 'cead96b540354b94bf4ab0bfa9a52c0d';

    try {
        // Utilise NewsData (ex: https://newsdata.io/) pour récupérer des actualités en français
        const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=fr&country=fr&page=1`;
        const res = await fetch(url);

        if (!res.ok) {
            console.warn('Request to NewsData failed with status', res.status);
            // fallback to RSS
            return fetchRSSFallback();
        }

        const data = await res.json();

        if (data && data.results && data.results.length > 0) {
            newsContainer.innerHTML = '';
            data.results.slice(0, 8).forEach(item => {
                const newsItem = document.createElement('a');
                newsItem.className = 'news-item';
                newsItem.href = item.link || item.source_url || '#';
                newsItem.target = '_blank';
                newsItem.rel = 'noopener noreferrer';

                const title = item.title || item.description || 'Sans titre';
                const source = item.source_id || item.source || '';
                const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString('fr-FR') : '';
                const image = item.image_url || item.image || '';

                newsItem.innerHTML = `
                    ${image ? `<div class="news-thumb"><img src="${image}" alt=""></div>` : ''}
                    <div class="news-body">
                        <div class="news-title">${escHtml(title)}</div>
                        <div class="news-source">📰 ${escHtml(source)}${pubDate ? ' • ' + pubDate : ''}</div>
                    </div>
                `;

                newsContainer.appendChild(newsItem);
            });
            applySecurityToNewLinks();
        } else {
            console.info('NewsData returned no results, falling back to RSS');
            fetchRSSFallback();
        }
    } catch (err) {
        console.error('Erreur chargement actualités:', err);
        // probablement CORS ou réseau — essayer le fallback RSS
        fetchRSSFallback();
    }
}

// Fallback: récupérer un flux RSS via rss2json si l'API principale échoue
async function fetchRSSFallback() {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '<div class="news-loading">📰 Chargement via flux RSS...</div>';
    try {
        // Flux RSS français (ex: Le Monde) — rss2json offre un endpoint simple
        const rssUrl = 'https://www.lemonde.fr/rss/une.xml';
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
            newsContainer.innerHTML = '';
            data.items.slice(0, 8).forEach(item => {
                const newsItem = document.createElement('a');
                newsItem.className = 'news-item';
                newsItem.href = item.link;
                newsItem.target = '_blank';
                newsItem.rel = 'noopener noreferrer';
                const title = item.title || 'Sans titre';
                const source = item.source?.title || '';
                const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString('fr-FR') : '';
                newsItem.innerHTML = `
                    <div class="news-title">${escHtml(title)}</div>
                    <div class="news-source">📰 ${source}${pubDate ? ' • ' + pubDate : ''}</div>
                `;
                newsContainer.appendChild(newsItem);
            });
            applySecurityToNewLinks();
        } else {
            newsContainer.innerHTML = '<div class="news-loading">Aucune actualité disponible</div>';
        }
    } catch (e) {
        console.error('Fallback RSS failed:', e);
        newsContainer.innerHTML = '<div class="news-loading">Actualités non disponibles</div>';
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
function applyVisibility() {
    document.getElementById('timeSection').style.display = showTime ? '' : 'none';
    document.getElementById('weatherSection').style.display = showWeather ? '' : 'none';
    document.getElementById('newsSection').style.display = showNews ? '' : 'none';
    document.getElementById('notesSection').style.display = showNotes ? '' : 'none';
    document.getElementById('shortcutsSection').style.display = showShortcuts ? '' : 'none';
    document.getElementById('toggleTime').checked = showTime;
    document.getElementById('toggleWeather').checked = showWeather;
    document.getElementById('toggleNews').checked = showNews;
    document.getElementById('toggleNotes').checked = showNotes;
    document.getElementById('toggleShortcuts').checked = showShortcuts;
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
    });
    document.getElementById('toggleNews').addEventListener('change', e => {
        showNews = e.target.checked;
        localStorage.setItem('showNews', showNews);
        document.getElementById('newsSection').style.display = showNews ? '' : 'none';
        if (showNews) updateNews();
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
}

// ===================== SECURITY: navigation hardening =====================
// Intercepts clicks on links when enabled, forces external links to open
// in a new tab with noopener/noreferrer, and warns for non-HTTPS links.
let _secureLinkHandler = null;

function applySecurityToNewLinks() {
    // pro-actively set rel/target on external links
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
            // warn on non-HTTPS
            if (url.protocol !== 'https:') {
                if (!confirm("Le lien que vous ouvrez n'est pas sécurisé (HTTP). Continuer ?")) {
                    e.preventDefault();
                    return;
                }
            }
            // open external links in a new tab safely
            if (url.origin !== location.origin) {
                e.preventDefault();
                window.open(url.href, '_blank', 'noopener,noreferrer');
            }
            // same-origin links are left to behave normally
        } catch (err) {
            // if URL parsing fails, do nothing
        }
    };
    document.addEventListener('click', _secureLinkHandler, true);
    applySecurityToNewLinks();
}

function disableSecureMode() {
    if (!_secureLinkHandler) return;
    document.removeEventListener('click', _secureLinkHandler, true);
    _secureLinkHandler = null;

    // try to remove noopener/noreferrer we may have added (leave other rel tokens intact)
    document.querySelectorAll('a[rel]').forEach(a => {
        const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean).filter(t => t !== 'noopener' && t !== 'noreferrer');
        if (rel.length) a.setAttribute('rel', rel.join(' ')); else a.removeAttribute('rel');
        // remove target for external links set by us
        try {
            const u = new URL(a.href);
            if (u.origin !== location.origin && a.getAttribute('target') === '_blank') a.removeAttribute('target');
        } catch (e) {}
    });
}

function initSecurity() {
    const secToggle = document.getElementById('toggleSecurity');
    if (!secToggle) return;
    
    // Set checked state based on secureMode variable
    secToggle.checked = secureMode;
    
    // Add change listener
    secToggle.addEventListener('change', e => {
        secureMode = e.target.checked;
        localStorage.setItem('secureMode', secureMode ? '1' : '0');
        if (secureMode) enableSecureMode(); else disableSecureMode();
    });
    
    // Initialize secure mode if enabled
    if (secureMode) enableSecureMode();
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

// Close modals on overlay click
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

 // directement aller sur la barre de recherche quand on appuie sur "/" ou "Ctrl+K"
document.addEventListener('keydown', e => {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
    if (e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Enter on modal inputs
document.getElementById('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
document.getElementById('firstNameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveFirstName(true); });
document.getElementById('shortcutUrl').addEventListener('keydown', e => { if (e.key === 'Enter') saveShortcut(); });

// ===================== START =====================
init();