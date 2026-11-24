-- Optional (Supabase only): private bucket for staff ID card uploads.
-- Run in the Supabase SQL editor after schema.sql. The Express server uses the
-- service connection string, so no anon policies are needed.

INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', false)
ON CONFLICT (id) DO NOTHING;





