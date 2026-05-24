const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ── SUPABASE ──
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "❌ SUPABASE_URL et SUPABASE_KEY sont requis en variables d'environnement !",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── MIDDLEWARE ──
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// ── HELPERS ──

// Retourne la date du jour au format YYYY-MM-DD
function today() {
  return new Date().toISOString().slice(0, 10);
}

// Récupère (ou initialise) la ligne compteur depuis Supabase
async function getCounter() {
  const { data, error } = await supabase
    .from("searches")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    // Première fois : on crée la ligne
    const { data: newRow, error: insertError } = await supabase
      .from("searches")
      .insert([{ id: 1, total: 0, today_count: 0, last_reset: today() }])
      .select()
      .single();

    if (insertError)
      throw new Error(
        "Impossible de créer le compteur : " + insertError.message,
      );
    return newRow;
  }

  return data;
}

// Met à jour le compteur dans Supabase
async function incrementCounter() {
  const row = await getCounter();

  // Réinitialise le compteur "aujourd'hui" si on est un nouveau jour
  const needsReset = row.last_reset !== today();

  const updates = {
    total: (row.total || 0) + 1,
    today_count: needsReset ? 1 : (row.today_count || 0) + 1,
    last_reset: today(),
  };

  const { data, error } = await supabase
    .from("searches")
    .update(updates)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw new Error("Erreur update Supabase : " + error.message);
  return data;
}

// ── ROUTES ──

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "New-Tab counter server 🚀",
    db: "supabase",
  });
});

// GET /count — récupérer les stats
app.get("/count", async (req, res) => {
  try {
    const row = await getCounter();

    // Si c'est un nouveau jour, today_count est affiché à 0 (pas besoin d'écrire)
    const isNewDay = row.last_reset !== today();

    res.json({
      total: row.total || 0,
      today: isNewDay ? 0 : row.today_count || 0,
      date: today(),
    });
  } catch (e) {
    console.error("GET /count error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /count — incrémenter après une recherche
app.post("/count", async (req, res) => {
  try {
    const row = await incrementCounter();
    res.json({
      total: row.total,
      today: row.today_count,
      date: row.last_reset,
    });
  } catch (e) {
    console.error("POST /count error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /autocompleter — proxy SearXNG
app.get("/autocompleter", async (req, res) => {
  const q = req.query.q || "";
  if (!q) return res.json([]);
  try {
    const SEARX = process.env.SEARX_URL || "https://searx.be";
    const url = `${SEARX}/autocompleter?q=${encodeURIComponent(q)}&format=json`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "New-Tab/2.2 (https://github.com/Devlaubin/New-Tab)",
      },
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.json([]);
  }
});

// GET /search — proxy SearXNG
app.get("/search", async (req, res) => {
  const params = new URLSearchParams(req.query);
  params.set("format", "json");
  try {
    const SEARX = process.env.SEARX_URL || "https://searx.be";
    const url = `${SEARX}/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "New-Tab/2.2 (https://github.com/Devlaubin/New-Tab)",
      },
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: "SearXNG unreachable", results: [] });
  }
});

// ── START ──
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Supabase connecté : ${SUPABASE_URL}`);
});
