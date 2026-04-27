-- ============================================================
-- For Her Wellbeing — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PATIENTS TABLE
--    Populated automatically when a patient pays on the homepage.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name                 TEXT        NOT NULL,
  email                TEXT,
  phone                TEXT,
  program              TEXT,
  condition            TEXT,
  consult_notes        TEXT,
  payment_status       TEXT        DEFAULT 'Paid',
  amount_paid          NUMERIC     DEFAULT 1000,
  payment_mode         TEXT        DEFAULT 'Online / Razorpay',
  payment_date         DATE,
  razorpay_payment_id  TEXT,
  razorpay_order_id    TEXT,
  patient_status       TEXT        DEFAULT 'Active',
  consultation_status  TEXT        DEFAULT 'Pending',
  diet_status          TEXT        DEFAULT 'Pending',
  doctor               TEXT        DEFAULT 'Dr. Raga Deepthi',
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROW LEVEL SECURITY
-- ------------------------------------------------------------
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Homepage booking form (uses anon key) can INSERT
CREATE POLICY "public_insert" ON patients
  FOR INSERT TO anon WITH CHECK (true);

-- Dashboard (uses anon key for now) can SELECT all patients
CREATE POLICY "public_select" ON patients
  FOR SELECT TO anon USING (true);

-- Dashboard staff can UPDATE patients
CREATE POLICY "public_update" ON patients
  FOR UPDATE TO anon USING (true);

-- Dashboard staff can DELETE patients
CREATE POLICY "public_delete" ON patients
  FOR DELETE TO anon USING (true);


-- ============================================================
-- NEXT STEPS (after MVP):
-- 1. Add Supabase Auth so only logged-in staff can read/write.
-- 2. Replace anon policies with:
--    USING (auth.role() = 'authenticated')
-- ============================================================
