-- ============================================
-- SmaranAI — Database Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create sample_data table
CREATE TABLE IF NOT EXISTS sample_data (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 2. Insert sample records
INSERT INTO sample_data (title, description) VALUES
  ('Getting Started with Supabase', 'Supabase is an open-source Firebase alternative. It provides a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.'),
  ('React + Vite Setup', 'Vite is a next-generation build tool that provides an extremely fast development experience. Combined with React, it offers hot module replacement and optimized builds.'),
  ('JWT Authentication Flow', 'JSON Web Tokens (JWT) are used to securely transmit information between parties. Supabase uses JWTs to authenticate users and authorize access to protected resources.'),
  ('Edge Functions Overview', 'Supabase Edge Functions are server-side TypeScript functions distributed globally at the edge. They can be used to create APIs, webhooks, and custom server-side logic.'),
  ('Building Secure APIs', 'Securing APIs involves validating JWT tokens, implementing role-based access control, and following the principle of least privilege. Always verify the Authorization header on protected endpoints.');

-- 3. Enable Row Level Security (RLS)
ALTER TABLE sample_data ENABLE ROW LEVEL SECURITY;

-- 4. Create a policy that allows authenticated users to read data
CREATE POLICY "Allow authenticated read access"
  ON sample_data
  FOR SELECT
  TO authenticated
  USING (true);
