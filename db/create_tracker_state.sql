-- Create table for storing a single tracker state record
-- Run this in your Supabase SQL editor or psql connected to the project database.

CREATE TABLE IF NOT EXISTS public.tracker_state (
  id text PRIMARY KEY,
  fxRate numeric,
  generalNotes jsonb,
  links jsonb,
  tasks jsonb,
  costRows jsonb,
  pensions jsonb,
  jobs jsonb,
  housing jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Insert an initial default row (optional)
INSERT INTO public.tracker_state (id, fxRate, generalNotes, links, tasks, costRows, pensions, jobs, housing, updated_at)
VALUES ('default', 1.6, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '[]'::jsonb, now())
ON CONFLICT (id) DO NOTHING;
