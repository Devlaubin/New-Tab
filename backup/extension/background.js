// Simple background service worker to detect search result navigations
// Configure SERVER_URL to point to your running New-Tab counter server (POST /count)
const SERVER_URL = "http://localhost:3000/count"; // <-- change if needed

// Keep last query per tab to avoid double counting on same navigation
const lastQueryPerTab = new Map();

function extractSearchQuery(urlStr) {
  try {
    const url = new URL(urlStr);
    // Common engines: q parameter
    if (url.searchParams.has("q")) return url.searchParams.get("q");
    // Some engines use 'query' or 'p'
    if (url.searchParams.has("query")) return url.searchParams.get("query");
    if (url.searchParams.has("p")) return url.searchParams.get("p");
    // Fallback: if path includes '/search' and has a query-like part
    if (url.pathname.includes("/search") && url.search) return url.search;
  } catch (e) {}
  return null;
}

async function notifyServer(details) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
  } catch (e) {
    // silence failures
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab?.url;
  if (!url) return;
  const q = extractSearchQuery(url);
  if (!q) return;

  const last = lastQueryPerTab.get(tabId);
  if (last && last === q) return; // avoid duplicates
  lastQueryPerTab.set(tabId, q);

  // send engine and query
  let engine = "unknown";
  try {
    engine = new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {}

  notifyServer({ engine, query: q, source: "browser" });

  // expire stored query after short delay
  setTimeout(() => {
    const cur = lastQueryPerTab.get(tabId);
    if (cur === q) lastQueryPerTab.delete(tabId);
  }, 10_000);
});
