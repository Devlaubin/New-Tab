// ===================== THEMES =====================
const themes = [
  {
    name: "Défaut",
    gradient: "linear-gradient(135deg, #888a96 0%, #71a5cf 100%)",
  },
  {
    name: "Océan",
    gradient: "linear-gradient(135deg, #1a3a5c 0%, #2980b9 100%)",
  },
  {
    name: "Aurore",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    name: "Forêt",
    gradient: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)",
  },
  {
    name: "Nuit",
    gradient: "linear-gradient(135deg, #0F2027 0%, #2C5364 100%)",
  },
  {
    name: "Rose",
    gradient: "linear-gradient(135deg, #c94b9e 0%, #f8a5c2 100%)",
  },
  {
    name: "Lavande",
    gradient: "linear-gradient(135deg, #4a3f8c 0%, #9b59b6 100%)",
  },
  {
    name: "Menthe",
    gradient: "linear-gradient(135deg, #1abc9c 0%, #2ecc71 100%)",
  },
  {
    name: "Cramoisi",
    gradient: "linear-gradient(135deg, #900 0%, #e74c3c 100%)",
  },
  {
    name: "Nuit étoilée",
    gradient: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  },
];

// ===================== SEARCH ENGINES =====================
const engines = [
  {
    id: "google",
    name: "Google",
    description: "Le moteur généraliste de Google, pratique pour trouver rapidement des réponses, des sites et des images.",
    icon: "https://www.google.com/favicon.ico",
    url: "https://www.google.com/search?q=",
  },
  {
    id: "bing",
    name: "Bing",
    description: "Une alternative à Google avec une recherche d’images performante et des réponses enrichies.",
    icon: "https://www.bing.com/favicon.ico",
    url: "https://www.bing.com/search?q=",
  },
  {
    id: "duckduckgo",
    name: "Duck",
    description: "Une recherche axée sur la confidentialité, sans personnalisation basée sur votre historique.",
    icon: "https://duckduckgo.com/favicon.ico",
    url: "https://duckduckgo.com/?q=",
  },
  {
    id: "brave",
    name: "Brave",
    description: "Une recherche indépendante qui limite le suivi et favorise une expérience plus privée.",
    icon: "https://brave.com/favicon.ico",
    url: "https://search.brave.com/search?q=",
  },
  {
    id: "qwant",
    name: "Qwant",
    description: "Un moteur européen qui met l’accent sur la confidentialité et une recherche non filtrée par profil.",
    icon: "images/qwant_logo.png",
    url: "https://www.qwant.com/?q=",
  },
  {
    id: "startpage",
    name: "Start",
    description: "Les résultats de Google avec une couche supplémentaire de confidentialité et sans profilage.",
    icon: "https://www.startpage.com/favicon.ico",
    url: "https://www.startpage.com/sp/search?q=",
  },
];

// ===================== DEFAULT SHORTCUTS =====================
const defaultShortcuts = [
  {
    name: "YouTube",
    url: "https://youtube.com",
    icon: "https://www.youtube.com/favicon.ico",
  },
  {
    name: "GitHub",
    url: "https://github.com/Devlaubin",
    icon: "https://github.com/favicon.ico",
  },
  {
    name: "Gmail",
    url: "https://mail.google.com",
    icon: "https://www.google.com/favicon.ico",
  },
  {
    name: "Netflix",
    url: "https://netflix.com",
    icon: "https://www.netflix.com/favicon.ico",
  },
  {
    name: "Reddit",
    url: "https://reddit.com",
    icon: "https://www.reddit.com/favicon.ico",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: "https://www.linkedin.com/favicon.ico",
  },
  {
    name: "Amazon",
    url: "https://amazon.com",
    icon: "https://www.amazon.com/favicon.ico",
  },
];

// ===================== STATE =====================
let currentTheme = localStorage.getItem("theme") || themes[0].gradient;
let currentEngine = localStorage.getItem("engine") || "google";
let userName = localStorage.getItem("userName") || "";
let showTime = localStorage.getItem("showTime") !== "false";
let showWeather = localStorage.getItem("showWeather") === "true";
let showNotes = localStorage.getItem("showNotes") === "true";
let showShortcuts = localStorage.getItem("showShortcuts") === "true";
let suggestionsEnabled = localStorage.getItem("showSuggestions") === "true";
let showCounter = localStorage.getItem("showCounter") !== "false";
let secureMode = localStorage.getItem("secureMode") !== "0";
let blockServer = localStorage.getItem("blockServer") === "true";
let shortcuts =
  JSON.parse(localStorage.getItem("shortcuts") || "null") || defaultShortcuts;

let editingShortcutIndex = null;
let notes = localStorage.getItem("notes") || "";
let notesTimer = null;

// ===================== COMPTEUR GLOBAL =====================
const API_BASE = "/api";

function fmtCount(n) {
  return Number(n || 0).toLocaleString("fr-FR");
}

// Incrémenter côté serveur après chaque recherche
async function trackSearch(query) {
  try {
    // Check if server tracking is blocked by user
    if (localStorage.getItem("blockServer") === "true") return;

    await fetch(`${API_BASE}/count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query || "",
        engine: currentEngine || "google",
        source: "homepage",
      }),
    });
  } catch (e) {
    /* silencieux — pas critique */
  }
}

// Charger et afficher le compteur dans la sidebar
async function loadSidebarCounter() {
  const el = document.getElementById("sidebar-search-count");
  const todayEl = document.getElementById("sidebar-count-today");
  if (!el) return;
  try {
    const res = await fetch(`${API_BASE}/count`);
    if (!res.ok) throw new Error();
    const d = await res.json();
    el.textContent = fmtCount(d.total);
    if (todayEl) todayEl.textContent = fmtCount(d.today) + " aujourd'hui";
  } catch (e) {
    el.textContent = "—";
  }
}

// ===================== INIT =====================
function init() {
  applyTheme(currentTheme);
  initThemeMode();
  applyVisibility();
  updateTime();

  setInterval(updateTime, 1000);
  renderEngine();
  renderShortcuts();
  renderThemeModal();
  initEngineDropdown();
  initToggles();
  initSecurity();
  initSearch();
  initNotes();
  createParticles();
  updateWeather();
  loadSidebarCounter();

  // Update search input padding after fonts load
  setTimeout(() => renderEngine(), 100);

  if (!localStorage.getItem("visited")) {
    setTimeout(() => openModal("firstVisitModal"), 600);
  }
}

// ===================== BACKGROUND PARTICLES =====================
function createParticles() {
  const container = document.getElementById("bgParticles");
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
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
  document.documentElement.style.setProperty("--bg", gradient);
  currentTheme = gradient;
  localStorage.setItem("theme", gradient);
}

function initThemeMode() {
  const saved = localStorage.getItem("themeMode");
  const isDark = saved === "dark";
  if (isDark) document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");

  const toggle = document.getElementById("toggleDarkMode");
  if (toggle) toggle.checked = isDark;

  if (toggle) {
    toggle.addEventListener("change", (e) => {
      const dark = e.target.checked;
      if (dark) document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("themeMode", dark ? "dark" : "light");
    });
  }
}

function renderThemeModal() {
  const grid = document.getElementById("colorGrid");
  grid.innerHTML = "";
  themes.forEach((t) => {
    const el = document.createElement("div");
    el.className =
      "color-swatch" + (t.gradient === currentTheme ? " active" : "");
    el.style.background = t.gradient;
    el.title = t.name;
    el.onclick = () => {
      applyTheme(t.gradient);
      document
        .querySelectorAll(".color-swatch")
        .forEach((s) => s.classList.remove("active"));
      el.classList.add("active");
    };
    grid.appendChild(el);
  });
}

// ===================== TIME =====================
function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("time").textContent = `${h}:${m}`;

  const opts = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const ds = now.toLocaleDateString("fr-FR", opts);
  document.getElementById("date").textContent =
    ds.charAt(0).toUpperCase() + ds.slice(1);

  if (userName) {
    const hr = now.getHours();
    let greet =
      hr < 6
        ? "Bonne nuit"
        : hr < 12
          ? "Bonjour"
          : hr < 18
            ? "Bonjour"
            : "Bonsoir";
    document.getElementById("greetingName").textContent =
      `${greet}, ${userName} 👋`;
  } else {
    document.getElementById("greetingName").textContent = "";
  }
}

// ===================== SEARCH =====================
function renderEngine() {
  const e = engines.find((e) => e.id === currentEngine) || engines[0];
  document.getElementById("engineIcon").src = e.icon;
  document.getElementById("engineLabel").textContent = e.name;

  // Adjust search input padding based on dropdown button width
  const btn = document.getElementById("engineBtn");
  const input = document.getElementById("searchInput");
}

// ===================== ENGINE DROPDOWN =====================
function initEngineDropdown() {
  const dropdown = document.getElementById("engineDropdown");
  const btn = document.getElementById("engineBtn");
  const menu = document.getElementById("engineDropdownMenu");

  if (!dropdown || !btn || !menu) return;

  // Populate dropdown menu
  menu.innerHTML = "";
  engines.forEach((e) => {
    const item = document.createElement("div");
    item.className =
      "engine-dropdown-item" + (e.id === currentEngine ? " active" : "");
    item.dataset.engineId = e.id;
    item.innerHTML = `
      <img src="${e.icon}" alt="">
      <span class="engine-dropdown-name">${e.name}</span>
      <button class="engine-info" type="button" aria-label="À propos de ${e.name}" title="${e.description}">
        i
      </button>`;
    item.querySelector(".engine-info").addEventListener("click", (ev) => {
      ev.stopPropagation();
    });
    item.addEventListener("click", (ev) => {
      ev.stopPropagation();
      currentEngine = e.id;
      localStorage.setItem("engine", e.id);
      renderEngine();
      updateDropdownActive();
      closeEngineDropdown();
    });
    menu.appendChild(item);
  });

  // Toggle dropdown on button click
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      closeEngineDropdown();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEngineDropdown();
  });
}

function closeEngineDropdown() {
  const dropdown = document.getElementById("engineDropdown");
  const btn = document.getElementById("engineBtn");
  if (dropdown) dropdown.classList.remove("open");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function updateDropdownActive() {
  const items = document.querySelectorAll(".engine-dropdown-item");
  items.forEach((item) => {
    item.classList.toggle("active", item.dataset.engineId === currentEngine);
  });
}

// Keep for compatibility with sidebar button
function renderEngineModal() {
  openEngineDropdown();
}

function openEngineDropdown() {
  const dropdown = document.getElementById("engineDropdown");
  const btn = document.getElementById("engineBtn");
  if (dropdown) {
    dropdown.classList.add("open");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
}

function doSearch(query) {
  if (!query.trim()) return;
  hideSuggestions();

  // ── COMPTEUR : incrémenter avant de naviguer ──
  trackSearch(query).finally(() => {
    // Mise à jour optimiste du badge dans la sidebar
    const el = document.getElementById("sidebar-search-count");
    if (el && el.textContent !== "—") {
      const cur = parseInt(el.textContent.replace(/\s/g, "")) || 0;
      el.textContent = fmtCount(cur + 1);
    }
  });

  if (query.match(/^https?:\/\//)) {
    window.location.href = query;
  } else if (
    query.match(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/) &&
    !query.includes(" ")
  ) {
    window.location.href = "https://" + query;
  } else {
    const e = engines.find((e) => e.id === currentEngine) || engines[0];
    let url = e.url + encodeURIComponent(query);
    if (e.tbm) url += "&tbm=" + e.tbm;
    window.location.href = url;
  }
}

function startVoiceSearch() {
  const input = document.getElementById("searchInput");
  const voiceButton = document.getElementById("voiceSearchBtn");
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    input.placeholder = "La recherche vocale n'est pas disponible";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voiceButton.classList.add("is-listening");
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    doSearch(input.value);
  };
  recognition.onerror = () => {
    input.placeholder = "Impossible d'utiliser le microphone";
  };
  recognition.onend = () => voiceButton.classList.remove("is-listening");
  recognition.start();
}

function searchByImage() {
  const imageInput = document.getElementById("lensImageInput");
  if (!imageInput) return;

  imageInput.onchange = () => {
    const image = imageInput.files && imageInput.files[0];
    if (!image) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://lens.google.com/v3/upload?ep=gisbubb&hl=fr";
    form.enctype = "multipart/form-data";
    form.target = "_blank";
    form.hidden = true;
    imageInput.name = "encoded_image";
    form.appendChild(imageInput);
    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      form.remove();
      document.querySelector(".search-box").appendChild(imageInput);
      imageInput.value = "";
    }, 1000);
  };

  imageInput.click();
}

let suggestTimer = null;
function initSearch() {
  const input = document.getElementById("searchInput");
  const sugg = document.getElementById("suggestions");
  let activeSugg = -1;

  input.addEventListener("keydown", (e) => {
    const items = sugg.querySelectorAll(".suggestion-item");
    if (e.key === "ArrowDown") {
      activeSugg = Math.min(activeSugg + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle("active", i === activeSugg));
      if (items[activeSugg]) input.value = items[activeSugg].dataset.value;
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      activeSugg = Math.max(activeSugg - 1, -1);
      items.forEach((it, i) => it.classList.toggle("active", i === activeSugg));
      if (activeSugg >= 0 && items[activeSugg])
        input.value = items[activeSugg].dataset.value;
      e.preventDefault();
    } else if (e.key === "Enter") {
      doSearch(input.value);
    } else if (e.key === "Escape") {
      hideSuggestions();
    }
  });

  input.addEventListener("input", () => {
    activeSugg = -1;
    const q = input.value.trim();
    if (!suggestionsEnabled || !q) {
      hideSuggestions();
      return;
    }
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => fetchSuggestions(q), 250);
  });

  const _searchToggleIds = [
    "weatherSection",
    "shortcutsSection",
    "notesSection",
  ];

  function setSearchActive(active) {
    _searchToggleIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const cs = window.getComputedStyle(el);
      if (active) {
        if (cs.display !== "none") {
          if (el.dataset.savedVisibility === undefined)
            el.dataset.savedVisibility = "visible";
          el.classList.add("search-hidden");
        }
      } else {
        if (el.dataset.savedVisibility !== undefined) {
          el.classList.remove("search-hidden");
          delete el.dataset.savedVisibility;
        }
        if (id === "weatherSection")
          el.style.display = showWeather ? "" : "none";
        if (id === "shortcutsSection")
          el.style.display = showShortcuts ? "" : "none";
        if (id === "notesSection") el.style.display = showNotes ? "" : "none";
      }
    });
  }

  // Check if we need to hide elements based on input content
  function checkSearchContent() {
    const hasContent = input.value.trim().length > 0;
    if (hasContent) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  }

  // Hide elements when there's text in search bar
  input.addEventListener("input", () => {
    checkSearchContent();
  });

  input.addEventListener("focus", () => {
    // Only hide if there's content, or keep focus behavior minimal
    if (input.value.trim()) {
      setSearchActive(true);
    }
  });

  input.addEventListener("blur", () => {
    // Only show elements again if no text
    if (!input.value.trim()) {
      setTimeout(() => setSearchActive(false), 180);
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) hideSuggestions();
  });
}

function fetchSuggestions(q) {
  if (!suggestionsEnabled) return;
  const old = document.getElementById("suggScript");
  if (old) old.remove();
  window._suggCallback = function (data) {
    if (!suggestionsEnabled) return;
    const suggestions = data[1].slice(0, 6);
    showSuggestions(q, suggestions);
  };
  const script = document.createElement("script");
  script.id = "suggScript";
  script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}&callback=_suggCallback`;
  script.onerror = () => {};
  document.head.appendChild(script);
}

setTimeout(() => {
  if (!window._suggCallback) window._suggCallback = function () {};
}, 2000);

function showSuggestions(query, items) {
  if (!suggestionsEnabled) return;
  const sugg = document.getElementById("suggestions");
  sugg.innerHTML = "";
  if (!items.length) {
    hideSuggestions();
    return;
  }
  items.forEach((text) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.dataset.value = text;
    div.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> ${escHtml(text)}`;
    div.onclick = () => doSearch(text);
    sugg.appendChild(div);
  });
  sugg.classList.add("visible");
}

function hideSuggestions() {
  document.getElementById("suggestions").classList.remove("visible");
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ===================== SHORTCUTS =====================
function renderShortcuts() {
  const grid = document.getElementById("shortcutsGrid");
  grid.innerHTML = "";
  shortcuts.forEach((s, i) => {
    const a = document.createElement("a");
    a.className = "shortcut";
    a.href = s.url;
    a.title = s.name;
    a.addEventListener("click", (e) => {
      if (e.target.closest("button")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    const iconDiv = document.createElement("div");
    iconDiv.className = "shortcut-icon";
    iconDiv.innerHTML = `<img src="${s.icon}" alt="${escHtml(s.name)}" onerror="this.style.display='none';this.parentElement.textContent='${escHtml(s.name[0].toUpperCase())}'">`;
    a.appendChild(iconDiv);

    const label = document.createElement("span");
    label.className = "shortcut-label";
    label.textContent = s.name;
    a.appendChild(label);

    const editBtn = document.createElement("button");
    editBtn.className = "shortcut-edit";
    editBtn.setAttribute("aria-label", "Modifier");
    editBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>`;
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openShortcutModal(i);
    });
    a.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.className = "shortcut-delete";
    delBtn.setAttribute("aria-label", "Supprimer");
    delBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12"><line x1="4" y1="4" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="4" x2="4" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
    delBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteShortcut(i);
    });
    a.appendChild(delBtn);

    grid.appendChild(a);
  });

  const add = document.createElement("div");
  add.className = "shortcut-add";
  add.onclick = () => openShortcutModal();
  add.innerHTML = `<div class="shortcut-add-icon"><img src="images/plus_icon.png" alt="Ajouter"></div><span class="shortcut-add-label">Ajouter</span>`;
  grid.appendChild(add);
}

function deleteShortcut(index) {
  shortcuts.splice(index, 1);
  localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
  renderShortcuts();
}

function openShortcutModal(index = null) {
  editingShortcutIndex = index !== null ? index : null;
  const nameInput = document.getElementById("shortcutName");
  const urlInput = document.getElementById("shortcutUrl");
  const modalTitle = document.querySelector("#shortcutModal .modal-title");
  const primaryBtn = document.querySelector("#shortcutModal .btn-primary");
  if (editingShortcutIndex !== null) {
    const s = shortcuts[editingShortcutIndex];
    nameInput.value = s.name;
    urlInput.value = s.url;
    modalTitle.textContent = "Modifier un raccourci";
    primaryBtn.textContent = "Enregistrer";
  } else {
    nameInput.value = "";
    urlInput.value = "";
    modalTitle.textContent = "Ajouter un raccourci";
    primaryBtn.textContent = "Ajouter";
  }
  openModal("shortcutModal");
}

function saveShortcut() {
  let name = document.getElementById("shortcutName").value.trim();
  let url = document.getElementById("shortcutUrl").value.trim();
  if (!name || !url) return;
  if (!url.startsWith("http")) url = "https://" + url;
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch (e) {}
  const icon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    : "";
  if (editingShortcutIndex !== null) {
    shortcuts[editingShortcutIndex] = { name, url, icon };
    editingShortcutIndex = null;
  } else {
    shortcuts.push({ name, url, icon });
  }
  localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
  renderShortcuts();
  document.getElementById("shortcutName").value = "";
  document.getElementById("shortcutUrl").value = "";
  document.querySelector("#shortcutModal .modal-title").textContent =
    "Ajouter un raccourci";
  document.querySelector("#shortcutModal .btn-primary").textContent = "Ajouter";
  closeModal("shortcutModal");
}

// ===================== WEATHER =====================
function getWeatherIcon(desc) {
  const d = desc.toLowerCase();
  if (
    d.includes("soleil") ||
    d.includes("ensoleillé") ||
    d.includes("sunny") ||
    d.includes("clear")
  )
    return "☀️";
  if (d.includes("nuage") || d.includes("nuageux") || d.includes("cloud"))
    return "☁️";
  if (d.includes("pluie") || d.includes("rain") || d.includes("averse"))
    return "🌧️";
  if (
    d.includes("brume") ||
    d.includes("brouillard") ||
    d.includes("fog") ||
    d.includes("mist")
  )
    return "🌫️";
  if (d.includes("neige") || d.includes("snow")) return "❄️";
  if (d.includes("orage") || d.includes("thunder")) return "⛈️";
  if (d.includes("couvert") || d.includes("overcast")) return "🌥️";
  if (d.includes("éclair") || d.includes("éclaircies") || d.includes("partly"))
    return "⛅";
  return "🌡️";
}

async function updateWeather() {
  if (!showWeather) return;

  const section = document.getElementById("weatherSection");
  if (section) section.classList.add("weather-loading");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      "https://wttr.in/Chambray-les-Tours?format=j1&lang=fr",
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const cur = data.current_condition[0];
    const temp = cur.temp_C;
    const desc = cur.lang_fr?.[0]?.value || cur.weatherDesc[0].value;
    const icon = getWeatherIcon(desc);
    document.getElementById("weatherIcon").textContent = icon;
    document.getElementById("weatherTemp").textContent = `${temp}°C`;
    document.getElementById("weatherDesc").textContent = desc;

    const forecastEl = document.getElementById("weatherForecast");
    forecastEl.innerHTML = "";
    const days = data.weather.slice(0, 3);
    const dayNames = ["Aujourd'hui", "Demain", "Après-dem."];
    days.forEach((day, i) => {
      const maxT = day.maxtempC;
      const minT = day.mintempC;
      const dayDesc =
        day.hourly[4]?.lang_fr?.[0]?.value ||
        day.hourly[4]?.weatherDesc?.[0]?.value ||
        "";
      const dayIcon = getWeatherIcon(dayDesc);
      const el = document.createElement("div");
      el.className = "forecast-day";
      el.innerHTML = `
                <div class="forecast-day-name">${dayNames[i]}</div>
                <div class="forecast-icon">${dayIcon}</div>
                <div class="forecast-temp">${maxT}° / ${minT}°</div>
            `;
      forecastEl.appendChild(el);
    });
    if (section) section.classList.remove("weather-loading");
  } catch (e) {
    document.getElementById("weatherDesc").textContent = "Météo non disponible";
    document.getElementById("weatherIcon").textContent = "🌡️";
    if (section) section.classList.remove("weather-loading");
  }
}

// ===================== NOTES =====================
function initNotes() {
  const area = document.getElementById("notesArea");
  area.value = notes;
  area.addEventListener("input", () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      localStorage.setItem("notes", area.value);
    }, 500);
  });
}

function applyVisibility() {
  document.getElementById("timeSection").style.display = showTime ? "" : "none";
  document.getElementById("weatherSection").style.display = showWeather
    ? ""
    : "none";
  document.getElementById("notesSection").style.display = showNotes
    ? ""
    : "none";
  document.getElementById("shortcutsSection").style.display = showShortcuts
    ? ""
    : "none";
  document.getElementById("toggleTime").checked = showTime;
  document.getElementById("toggleWeather").checked = showWeather;
  document.getElementById("toggleNotes").checked = showNotes;
  document.getElementById("toggleShortcuts").checked = showShortcuts;
  document.getElementById("toggleSuggestions").checked = suggestionsEnabled;
}

function initToggles() {
  document.getElementById("toggleTime").addEventListener("change", (e) => {
    showTime = e.target.checked;
    localStorage.setItem("showTime", showTime);
    document.getElementById("timeSection").style.display = showTime
      ? ""
      : "none";
  });
  document.getElementById("toggleWeather").addEventListener("change", (e) => {
    showWeather = e.target.checked;
    localStorage.setItem("showWeather", showWeather);
    document.getElementById("weatherSection").style.display = showWeather
      ? ""
      : "none";
  });
  document.getElementById("toggleNotes").addEventListener("change", (e) => {
    showNotes = e.target.checked;
    localStorage.setItem("showNotes", showNotes);
    document.getElementById("notesSection").style.display = showNotes
      ? ""
      : "none";
  });
  document.getElementById("toggleShortcuts").addEventListener("change", (e) => {
    showShortcuts = e.target.checked;
    localStorage.setItem("showShortcuts", showShortcuts);
    document.getElementById("shortcutsSection").style.display = showShortcuts
      ? ""
      : "none";
  });

  const counterToggle = document.getElementById("toggleCounter");
  if (counterToggle) {
    const savedCounter = localStorage.getItem("showCounter");
    showCounter = savedCounter !== "false";
    counterToggle.checked = showCounter;
    document.getElementById("counterSection").style.display = showCounter
      ? ""
      : "none";
    counterToggle.addEventListener("change", (e) => {
      showCounter = e.target.checked;
      localStorage.setItem("showCounter", showCounter);
      document.getElementById("counterSection").style.display = showCounter
        ? ""
        : "none";
    });
  }

  const AUTOFOCUS_KEY = "searchAutoFocusEnabled";
  const autoToggle = document.getElementById("toggleAutoFocus");
  if (autoToggle) {
    const saved = localStorage.getItem(AUTOFOCUS_KEY);
    const enabled = saved === null ? true : saved === "true";
    autoToggle.checked = enabled;
    if (enabled) {
      const si = document.getElementById("searchInput");
      if (si) si.focus();
    }
    autoToggle.addEventListener("change", (e) => {
      const en = e.target.checked;
      localStorage.setItem(AUTOFOCUS_KEY, en ? "true" : "false");
      if (en) {
        const si = document.getElementById("searchInput");
        if (si) setTimeout(() => si.focus(), 50);
      }
    });
  }

  const suggestionsToggle = document.getElementById("toggleSuggestions");
  if (suggestionsToggle) {
    suggestionsToggle.checked = suggestionsEnabled;
    suggestionsToggle.addEventListener("change", (e) => {
      suggestionsEnabled = e.target.checked;
      localStorage.setItem("showSuggestions", suggestionsEnabled);
      if (!suggestionsEnabled) {
        hideSuggestions();
        return;
      }
      const query = document.getElementById("searchInput")?.value.trim();
      if (query) fetchSuggestions(query);
    });
  }

  // Block server tracking toggle
  const blockServerToggle = document.getElementById("toggleBlockServer");
  if (blockServerToggle) {
    blockServerToggle.checked = blockServer;
    blockServerToggle.addEventListener("change", (e) => {
      blockServer = e.target.checked;
      localStorage.setItem("blockServer", blockServer ? "true" : "false");
    });
  }
}

// ===================== SECURITY =====================
let _secureLinkHandler = null;

function applySecurityToNewLinks() {
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    try {
      const u = new URL(a.href);
      if (u.origin !== location.origin) {
        if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
        const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
        if (!rel.includes("noopener")) rel.push("noopener");
        if (!rel.includes("noreferrer")) rel.push("noreferrer");
        a.setAttribute("rel", rel.join(" "));
      }
    } catch (e) {}
  });
}

function enableSecureMode() {
  if (_secureLinkHandler) return;
  _secureLinkHandler = function (e) {
    const a = e.target.closest && e.target.closest("a");
    if (!a || !a.getAttribute) return;
    const href = a.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;
    try {
      const url = new URL(href, location.href);
      if (url.protocol !== "https:") {
        if (
          !confirm(
            "Le lien que vous ouvrez n'est pas sécurisé (HTTP). Continuer ?",
          )
        ) {
          e.preventDefault();
          return;
        }
      }
      if (url.origin !== location.origin) {
        e.preventDefault();
        window.open(url.href, "_blank", "noopener,noreferrer");
      }
    } catch (err) {}
  };
  document.addEventListener("click", _secureLinkHandler, true);
  applySecurityToNewLinks();
}

function disableSecureMode() {
  if (!_secureLinkHandler) return;
  document.removeEventListener("click", _secureLinkHandler, true);
  _secureLinkHandler = null;
  document.querySelectorAll("a[rel]").forEach((a) => {
    const rel = (a.getAttribute("rel") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => t !== "noopener" && t !== "noreferrer");
    if (rel.length) a.setAttribute("rel", rel.join(" "));
    else a.removeAttribute("rel");
    try {
      const u = new URL(a.href);
      if (u.origin !== location.origin && a.getAttribute("target") === "_blank")
        a.removeAttribute("target");
    } catch (e) {}
  });
}

function initSecurity() {
  const secToggle = document.getElementById("toggleSecurity");
  if (!secToggle) return;
  secToggle.checked = secureMode;
  secToggle.addEventListener("change", (e) => {
    secureMode = e.target.checked;
    localStorage.setItem("secureMode", secureMode ? "1" : "0");
    if (secureMode) enableSecureMode();
    else disableSecureMode();
  });
  if (secureMode) enableSecureMode();
}

// ===================== MODALS =====================
function openModal(id) {
  document.getElementById(id).classList.add("active");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// ===================== NEWS / UPDATES =====================
async function loadNews() {
  const container = document.getElementById("newsContainer");
  const loading = document.getElementById("newsLoading");
  if (!container || !loading) return;

  container.style.display = "none";
  loading.style.display = "block";

  try {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const updates = Array.isArray(data.updates) ? data.updates : [];

    updates.sort((a, b) => {
      const ta = Date.parse(a.updatedAt || a.updated_at || 0) || 0;
      const tb = Date.parse(b.updatedAt || b.updated_at || 0) || 0;
      return tb - ta;
    });

    if (!updates.length) {
      loading.textContent = "Aucune nouveauté pour le moment.";
      container.innerHTML = "";
      container.style.display = "none";
      return;
    }

    container.innerHTML = updates
      .map((u) => {
        const title = u.title || u.name || u.id || "Mise à jour";
        const source = u.source || "Changelog";
        const updatedAt = u.updatedAt || u.updated_at || "";
        const dateLabel = updatedAt
          ? new Date(updatedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : "";
        const url = u.url || "#";

        const right = dateLabel
          ? `<div class="news-source">${source} • ${dateLabel}</div>`
          : `<div class="news-source">${source}</div>`;

        return `
          <a class="news-item" href="${url}" target="_blank" rel="noopener noreferrer">
            <div class="news-title">${escHtml(title)}</div>
            ${right}
          </a>
        `;
      })
      .join("");

    loading.style.display = "none";
    container.style.display = "block";
  } catch (e) {
    loading.textContent = "Impossible de charger les nouveautés.";
    container.innerHTML = "";
    container.style.display = "none";
  }
}

function openNewsModal() {
  const el = document.getElementById("newsModal");
  if (!el) return;
  openModal("newsModal");
  loadNews();
  closeSidebar();
}

function openThemeModal() {
  renderThemeModal();
  openModal("themeModal");
  closeSidebar();
}
function openNameModal() {
  document.getElementById("nameInput").value = userName;
  openModal("nameModal");
  closeSidebar();
}
function openEngineModal() {
  renderEngineModal();
  openModal("engineModal");
  closeSidebar();
}
function openPrivateSearch() {
  const query =
    document.getElementById("searchInput")?.value.trim() || "navigation privée";
  const engine = engines.find((e) => e.id === "duckduckgo") || engines[0];
  const url = `${engine.url}${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  closeSidebar();
}
function clearNotes() {
  if (!confirm("Effacer toutes les notes enregistrées ?")) return;
  notes = "";
  localStorage.setItem("notes", notes);
  const area = document.getElementById("notesArea");
  if (area) area.value = "";
  closeSidebar();
}
function resetPreferences() {
  if (!confirm("Réinitialiser les paramètres à leurs valeurs par défaut ?"))
    return;
  const keys = [
    "theme",
    "themeMode",
    "engine",

    "userName",
    "showTime",
    "showWeather",
    "showNotes",
    "showShortcuts",
    "secureMode",
    "searchAutoFocusEnabled",
    "notes",
    "shortcuts",
    "visited",
  ];
  keys.forEach((key) => localStorage.removeItem(key));
  location.reload();
}

function saveName() {
  userName = document.getElementById("nameInput").value.trim();
  localStorage.setItem("userName", userName);
  updateTime();
  closeModal("nameModal");
}
function saveFirstName(save) {
  if (save) {
    userName = document.getElementById("firstNameInput").value.trim();
    localStorage.setItem("userName", userName);
  }
  localStorage.setItem("visited", "1");
  closeModal("firstVisitModal");
  updateTime();
}

// Export shortcuts to JSON file
function exportShortcuts() {
  const data = JSON.stringify(shortcuts, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "raccourcis-newtab.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import shortcuts from JSON file
function importShortcuts(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        shortcuts = imported;
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
        renderShortcuts();
        alert("Raccourcis imported avec succes !");
      } else {
        alert("Format invalide");
      }
    } catch {
      alert("Erreur lors de l'import");
    }
  };
  reader.readAsText(file);
  input.value = "";
}

document.querySelectorAll(".modal-overlay").forEach((o) => {
  o.addEventListener("click", (e) => {
    if (e.target === o) o.classList.remove("active");
  });
});

// ===================== SIDEBAR =====================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function toggleSidebar() {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  // Rafraîchir le compteur à chaque ouverture de la sidebar
  if (sidebar.classList.contains("active")) loadSidebarCounter();
}
function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}
menuToggle.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (e) => {
  if (
    e.target.tagName.toLowerCase() === "input" ||
    e.target.tagName.toLowerCase() === "textarea"
  )
    return;
  if (
    e.key === "/" ||
    (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))
  ) {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

document.getElementById("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveName();
});
document.getElementById("firstNameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveFirstName(true);
});
document.getElementById("shortcutUrl").addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveShortcut();
});

// ===================== START =====================
// Update search input padding on resize
window.addEventListener("resize", () => renderEngine());

// Detect AdBlock
(function detectAdBlock() {
  const ad = document.getElementById("adDetector");
  if (!ad) return;
  const rect = ad.getBoundingClientRect();
  if (rect.height === 0 || rect.width === 0) {
    // AdBlock detected - can show modal if needed
    console.log("AdBlock detected!");
  }
})();

init();
