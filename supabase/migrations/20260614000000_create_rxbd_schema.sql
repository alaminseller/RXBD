-- RxBD Master Blueprint - Supabase PostgreSQL Schema
-- Version 2.0 — Comprehensive Rewrite
-- Run this in the Supabase SQL Editor

-- ============================================================
-- 1. DOCTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id            UUID PRIMARY KEY DEFAULT auth.uid(),
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  degrees       TEXT[] DEFAULT '{}',
  specialty     TEXT,
  bmdc_number   TEXT UNIQUE,
  phone         TEXT,
  chamber_name  TEXT,
  chamber_address TEXT,
  chamber_phone TEXT,
  chamber_email TEXT,
  avatar_url    TEXT,
  locale        TEXT DEFAULT 'en' CHECK (locale IN ('en', 'bn')),
  email_verified BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. DOCTOR_SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctor_settings (
  doctor_id         UUID PRIMARY KEY REFERENCES public.doctors(id) ON DELETE CASCADE,
  header_template   TEXT DEFAULT 'standard' CHECK (header_template IN ('standard', 'compact', 'custom')),
  footer_text       TEXT,
  logo_url          TEXT,
  signature_url     TEXT,
  show_qr_code      BOOLEAN DEFAULT true,
  prescription_theme TEXT DEFAULT 'classic' CHECK (prescription_theme IN ('classic', 'modern', 'minimal')),
  font_size         INTEGER DEFAULT 12 CHECK (font_size BETWEEN 10 AND 14),
  auto_save_interval INTEGER DEFAULT 10 CHECK (auto_save_interval BETWEEN 5 AND 60),
  brand_color       TEXT DEFAULT '#1a1a2e',
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. PATIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id       UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT,
  age_years       INTEGER,
  date_of_birth   DATE,
  gender          TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group     TEXT,
  address         TEXT,
  medical_notes   TEXT,
  allergies       TEXT,
  chronic_diseases TEXT,
  consent_given   BOOLEAN DEFAULT false,
  consent_date    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. PRESCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id         UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id        UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_date        DATE DEFAULT CURRENT_DATE NOT NULL,
  chief_complaints  TEXT[] DEFAULT '{}',
  vitals            JSONB DEFAULT '{}',
  on_examination    TEXT,
  investigations    TEXT[] DEFAULT '{}',
  diagnosis         TEXT[] DEFAULT '{}',
  diagnosis_details TEXT,
  medications       JSONB NOT NULL DEFAULT '[]',
  clinical_notes    TEXT,
  advice            TEXT,
  follow_up_date    DATE,
  pdf_url           TEXT,
  qr_code           TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  qr_verified_at    TIMESTAMPTZ,
  is_draft          BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  doctor_id                 UUID PRIMARY KEY REFERENCES public.doctors(id) ON DELETE CASCADE,
  plan                      TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  prescriptions_this_month  INTEGER DEFAULT 0,
  counter_reset_at          DATE NOT NULL DEFAULT CURRENT_DATE,
  premium_since             TIMESTAMPTZ,
  premium_expires_at        TIMESTAMPTZ,
  sslcommerz_tran_id        TEXT,
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. MEDICINE_FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.medicine_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id       UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  medicine_name   TEXT NOT NULL,
  feedback_type   TEXT NOT NULL CHECK (feedback_type IN ('missing', 'incorrect', 'duplicate', 'suggestion')),
  description     TEXT NOT NULL,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. AUDIT_LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 8. MEDICINE_HOTFIXES TABLE (Tier 1 hot update system)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.medicine_hotfixes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       TEXT,
  generic     TEXT,
  dosage_form TEXT,
  strength    TEXT,
  manufacturer TEXT,
  category    TEXT,
  tags        TEXT[] DEFAULT '{}',
  fix_type    TEXT NOT NULL CHECK (fix_type IN ('addition', 'correction', 'removal')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES (Section 3.4)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_patients_doctor_name ON public.patients(doctor_id, name);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_phone ON public.patients(doctor_id, phone);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_date ON public.prescriptions(doctor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_date ON public.prescriptions(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_qr_code ON public.prescriptions(qr_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_doctor ON public.subscriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medicine_feedback_status ON public.medicine_feedback(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_doctor ON public.audit_log(doctor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medications_gin ON public.prescriptions USING GIN (medications);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES (Section 3.3)
-- ============================================================
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_hotfixes ENABLE ROW LEVEL SECURITY;

-- Doctors
CREATE POLICY "Doctors can view own profile" ON public.doctors FOR SELECT USING (id = auth.uid());
CREATE POLICY "Doctors can update own profile" ON public.doctors FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Doctors can insert own profile" ON public.doctors FOR INSERT WITH CHECK (id = auth.uid());

-- Doctor Settings
CREATE POLICY "Doctors can view own settings" ON public.doctor_settings FOR SELECT USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can update own settings" ON public.doctor_settings FOR UPDATE USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can insert own settings" ON public.doctor_settings FOR INSERT WITH CHECK (doctor_id = auth.uid());

-- Patients
CREATE POLICY "Doctors can view own patients" ON public.patients FOR SELECT USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can insert own patients" ON public.patients FOR INSERT WITH CHECK (doctor_id = auth.uid());
CREATE POLICY "Doctors can update own patients" ON public.patients FOR UPDATE USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can delete own patients" ON public.patients FOR DELETE USING (doctor_id = auth.uid());

-- Prescriptions
CREATE POLICY "Doctors can view own prescriptions" ON public.prescriptions FOR SELECT USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can insert own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (doctor_id = auth.uid());
CREATE POLICY "Doctors can update own prescriptions" ON public.prescriptions FOR UPDATE USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can delete own prescriptions" ON public.prescriptions FOR DELETE USING (doctor_id = auth.uid());

-- Subscriptions
CREATE POLICY "Doctors can view own subscription" ON public.subscriptions FOR SELECT USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can update own subscription" ON public.subscriptions FOR UPDATE USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (doctor_id = auth.uid());

-- Medicine Feedback
CREATE POLICY "Doctors can view own feedback" ON public.medicine_feedback FOR SELECT USING (doctor_id = auth.uid());
CREATE POLICY "Doctors can submit feedback" ON public.medicine_feedback FOR INSERT WITH CHECK (doctor_id = auth.uid());

-- Audit Log: write-only for doctors
CREATE POLICY "Doctors can insert audit logs" ON public.audit_log FOR INSERT WITH CHECK (doctor_id = auth.uid());

-- Medicine Hotfixes: readable by all authenticated users
CREATE POLICY "Authenticated users can view hotfixes" ON public.medicine_hotfixes FOR SELECT USING (auth.role() = 'authenticated');

-- Public prescription verification (non-draft only)
CREATE POLICY "Public can verify prescriptions by QR code" ON public.prescriptions
  FOR SELECT USING (is_draft = false AND qr_code IS NOT NULL);

-- ============================================================
-- TRIGGER: Auto-create doctor_settings & subscription on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.doctor_settings (doctor_id) VALUES (NEW.id);
  INSERT INTO public.subscriptions (doctor_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_doctor_created
  AFTER INSERT ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_doctor();

-- ============================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_doctor_settings_updated_at BEFORE UPDATE ON public.doctor_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- TRIGGER: Prescription limit enforcement (Section 5.2)
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_prescription_limit()
RETURNS TRIGGER AS $$
DECLARE
  sub_plan TEXT;
  sub_count INTEGER;
  sub_reset DATE;
BEGIN
  SELECT plan, prescriptions_this_month, counter_reset_at
  INTO sub_plan, sub_count, sub_reset
  FROM public.subscriptions WHERE doctor_id = NEW.doctor_id;

  -- Auto-reset counter if 30+ days old
  IF sub_reset IS NOT NULL AND sub_reset < CURRENT_DATE - INTERVAL '30 days' THEN
    UPDATE public.subscriptions
    SET prescriptions_this_month = 0, counter_reset_at = CURRENT_DATE
    WHERE doctor_id = NEW.doctor_id;
    sub_count := 0;
  END IF;

  -- Check free tier limit (50/month)
  IF sub_plan = 'free' AND sub_count >= 50 THEN
    RAISE EXCEPTION 'Prescription limit reached. Upgrade to Premium for unlimited access.';
  END IF;

  -- Increment counter for completed prescriptions
  IF NEW.is_draft = false THEN
    UPDATE public.subscriptions
    SET prescriptions_this_month = prescriptions_this_month + 1
    WHERE doctor_id = NEW.doctor_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_prescription_limit
  BEFORE INSERT ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.check_prescription_limit();

-- ============================================================
-- ENABLE realtime for prescriptions
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
