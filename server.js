const express = require("express");
const cors = require("cors");
const { Pool } = require("@neondatabase/serverless");

const app = express();
const PORT = process.env.PORT || 3000;

// ── NEON ──
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL est requis !");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// ── MIDDLEWARE ──
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());

// ── HELPERS ──
function today() {
  return new Date().toISOString().slice(0, 10);
}

async function getCounter() {
  const result = await pool.query(`
    INSERT INTO searches (id, total, today_count, last_reset)
    VALUES (1, 0, 0, CURRENT_DATE)
    ON CONFLICT (id) DO NOTHING;

    SELECT total, today_count, last_reset::text AS last_reset
    FROM searches
    WHERE id = 1;
  `);
  return result[result.length - 1]?.rows[0];
}

async function incrementCounter() {
  const result = await pool.query(`
    INSERT INTO searches (id, total, today_count, last_reset)
    VALUES (1, 1, 1, CURRENT_DATE)
    ON CONFLICT (id) DO UPDATE SET
      total = searches.total + 1,
      today_count = CASE
        WHEN searches.last_reset = CURRENT_DATE THEN searches.today_count + 1
        ELSE 1
      END,
      last_reset = CURRENT_DATE
    RETURNING total, today_count, last_reset::text AS last_reset;
  `);
  return result.rows[0];
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
    // Save search query to database
    const { query, engine, source } = req.body;
    if (query && typeof query === "string" && query.trim()) {
      await pool.query(
        `INSERT INTO search_queries (query, engine, source)
         VALUES ($1, $2, $3);`,
        [query.trim().slice(0, 500), engine || "unknown", source || "homepage"],
      );
    }

    // Increment counter
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
