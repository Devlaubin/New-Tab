CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  engine text NOT NULL DEFAULT 'google',
  source text DEFAULT 'homepage',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS searches (
  id integer PRIMARY KEY,
  total integer NOT NULL DEFAULT 0,
  today_count integer NOT NULL DEFAULT 0,
  last_reset date NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_queries_engine ON search_queries(engine);
