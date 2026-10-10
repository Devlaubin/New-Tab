const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Pool } = require("@neondatabase/serverless");

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const fallbackStore = { total: 0, today_count: 0, last_reset: new Date().toISOString().slice(0, 10) };

const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;

app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());
app.use(express.static(__dirname));

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function getCounter() {
  if (!pool) {
    const currentDay = today();
    if (fallbackStore.last_reset !== currentDay) {
      fallbackStore.today_count = 0;
      fallbackStore.last_reset = currentDay;
    }
    return {
      total: fallbackStore.total,
      today_count: fallbackStore.today_count,
      last_reset: fallbackStore.last_reset,
    };
  }

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
  if (!pool) {
    const currentDay = today();
    if (fallbackStore.last_reset !== currentDay) {
      fallbackStore.today_count = 0;
      fallbackStore.last_reset = currentDay;
    }
    fallbackStore.total += 1;
    fallbackStore.today_count += 1;
    fallbackStore.last_reset = currentDay;
    return {
      total: fallbackStore.total,
      today_count: fallbackStore.today_count,
      last_reset: fallbackStore.last_reset,
    };
  }

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

function buildCounterPayload(row) {
  const currentDay = today();
  const isNewDay = row.last_reset !== currentDay;
  return {
    total: Number(row.total || 0),
    today: isNewDay ? 0 : Number(row.today_count || 0),
    date: currentDay,
  };
}

async function saveSearchQuery(payload = {}) {
  if (!pool) return;

  const { query, engine, source } = payload;
  if (query && typeof query === "string" && query.trim()) {
    await pool.query(
      `INSERT INTO search_queries (query, engine, source)
       VALUES ($1, $2, $3);`,
      [query.trim().slice(0, 500), engine || "unknown", source || "homepage"],
    );
  }
}

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "New-Tab counter server 🚀" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/count", async (req, res) => {
  try {
    const row = await getCounter();
    res.json(buildCounterPayload(row));
  } catch (e) {
    console.error("GET /count error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/count", async (req, res) => {
  try {
    const row = await getCounter();
    res.json(buildCounterPayload(row));
  } catch (e) {
    console.error("GET /api/count error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/count", async (req, res) => {
  try {
    await saveSearchQuery(req.body);
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

app.post("/api/count", async (req, res) => {
  try {
    await saveSearchQuery(req.body);
    const row = await incrementCounter();
    res.json({
      total: row.total,
      today: row.today_count,
      date: row.last_reset,
    });
  } catch (e) {
    console.error("POST /api/count error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/news", async (req, res) => {
  try {
    const candidates = [
      path.join(__dirname, "new.json"),
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
      throw new Error("new.json introuvable.");
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const updates = Array.isArray(parsed.updates) ? parsed.updates : [];
    updates.sort((a, b) => {
      const ta = Date.parse(a.updatedAt || a.updated_at || 0) || 0;
      const tb = Date.parse(b.updatedAt || b.updated_at || 0) || 0;
      return tb - ta;
    });

    res.json({ ok: true, updates, count: updates.length });
  } catch (e) {
    console.error("GET /news error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const candidates = [
      path.join(__dirname, "new.json"),
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
      throw new Error("new.json introuvable.");
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const updates = Array.isArray(parsed.updates) ? parsed.updates : [];
    updates.sort((a, b) => {
      const ta = Date.parse(a.updatedAt || a.updated_at || 0) || 0;
      const tb = Date.parse(b.updatedAt || b.updated_at || 0) || 0;
      return tb - ta;
    });

    res.json({ ok: true, updates, count: updates.length });
  } catch (e) {
    console.error("GET /api/news error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

if (!DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL absent : utilisation du mode local sans base Neon.");
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📄 Front-end: http://localhost:${PORT}/`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});
