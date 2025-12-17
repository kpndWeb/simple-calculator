CREATE TABLE IF NOT EXISTS calculations (
  id SERIAL PRIMARY KEY,
  expression VARCHAR(255) NOT NULL,
  result NUMERIC(15, 6) NOT NULL,  -- supports large & decimal results
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- index for faster time-based queries
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);