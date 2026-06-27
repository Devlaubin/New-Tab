// ===================== SEARCH ENGINES =====================
const engines = [
  {
    id: "duckduckgo",
    name: "Duck",
    icon: "https://duckduckgo.com/favicon.ico",
    url: "https://duckduckgo.com/?q=",
  },
  {
    id: "google",
    name: "Google",
    icon: "https://www.google.com/favicon.ico",
    url: "https://www.google.com/search?q=",
  },
  {
    id: "startpage",
    name: "Start",
    icon: "https://www.startpage.com/favicon.ico",
    url: "https://www.startpage.com/sp/search?q=",
  },
];

// ===================== STATE =====================
let currentEngine = localStorage.getItem("engine") || "duckduckgo";

// ===================== SEARCH =====================
function renderEngine() {
  const e = engines.find((e) => e.id === currentEngine) || engines[0];
  document.getElementById("engineIcon").src = e.icon;
  document.getElementById("engineLabel").textContent = e.name;
}

function renderEngineModal() {
  const grid = document.getElementById("engineGrid");
  if (!grid) return;

  grid.innerHTML = "";

  engines.forEach((e) => {
    const btn = document.createElement("button");
    btn.className = "engine-option" + (e.id === currentEngine ? " active" : "");
    btn.innerHTML = `<img src="${e.icon}" alt=""> ${e.name}`;

    btn.onclick = () => {
      currentEngine = e.id;
      localStorage.setItem("engine", e.id);
      renderEngine();

      document
        .querySelectorAll(".engine-option")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");
    };

    grid.appendChild(btn);
  });
}

function doSearch(query) {
  if (!query.trim()) return;

  const e = engines.find((e) => e.id === currentEngine) || engines[0];

  if (query.match(/^https?:\/\//)) {
    window.location.href = query;
  } else if (
    query.match(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/) &&
    !query.includes(" ")
  ) {
    window.location.href = "https://" + query;
  } else {
    window.location.href = e.url + encodeURIComponent(query);
  }
}

function initSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      doSearch(input.value);
    }
  });
}

// ===================== START =====================
renderEngine();
renderEngineModal();
initSearch();
