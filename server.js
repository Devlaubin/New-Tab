const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ── SUPABASE ──
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ SUPABASE_URL et SUPABASE_KEY sont requis !");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── MIDDLEWARE ──
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());

// ── HELPERS ──
function today() {
  return new Date().toISOString().slice(0, 10);
}

async function getCounter() {
  const { data, error } = await supabase
    .from("searches")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
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

async function incrementCounter() {
  const row = await getCounter();
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
  if (error) throw new Error("Erreur update : " + error.message);
  return data;
}

// ── ROUTES ──

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "New-Tab counter server 🚀" });
});

app.get("/count", async (req, res) => {
  try {
    const row = await getCounter();
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

// ── UPDATES (news) ──
app.get("/news", async (req, res) => {
  try {
    const path = require("path");
    const fs = require("fs");

    // Cherche le fichier `new.json` dans le dossier du serveur (robuste)
    // puis fallback sur le dossier courant.
    const candidates = [
      path.join(__dirname, "new.json"),
      path.join(process.cwd(), "new.json"),
      path.join(process.cwd(), "new.json"),
    ];

    let filePath = null;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        filePath = c;
        break;
      }
    }

    if (!filePath) {
      throw new Error(
        "new.json introuvable. Vérifie que le fichier est présent à la racine du serveur (au même niveau que server.js) ou que le serveur est lancé depuis le bon dossier.",
      );
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    const updates = Array.isArray(parsed.updates) ? parsed.updates : [];

    // Sort by updatedAt DESC
    updates.sort((a, b) => {
      const ta = Date.parse(a.updatedAt || a.updated_at || 0) || 0;
      const tb = Date.parse(b.updatedAt || b.updated_at || 0) || 0;
      return tb - ta;
    });

    res.json({
      ok: true,
      updates,
      count: updates.length,
    });
  } catch (e) {
    console.error("GET /news error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});


// ── START ──
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

