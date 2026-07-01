/*
# Create search_queries table for tracking user searches

1. New Tables
- `search_queries`
  - `id` (uuid, primary key)
  - `query` (text, not null) - the search term entered
  - `engine` (text, not null) - the search engine used (google, duckduckgo, etc.)
  - `source` (text) - source of search (homepage, browser extension)
  - `created_at` (timestamp) - when the search occurred

2. Security
- Enable RLS on `search_queries`.
- Allow anon + authenticated CRUD because the app has no sign-in and data is intentionally tracked for analytics.

3. Notes
- This table stores search queries for analytics purposes
- No user identification is stored - just queries and metadata
- The table supports both homepage searches and browser extension searches
*/

CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  engine text NOT NULL DEFAULT 'google',
  source text DEFAULT 'homepage',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Policies for anon + authenticated (no sign-in app)
DROP POLICY IF EXISTS "anon_select_search_queries" ON search_queries;
CREATE POLICY "anon_select_search_queries" ON search_queries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_search_queries" ON search_queries;
CREATE POLICY "anon_insert_search_queries" ON search_queries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at DESC);

-- Index for querying by engine
CREATE INDEX IF NOT EXISTS idx_search_queries_engine ON search_queries(engine);