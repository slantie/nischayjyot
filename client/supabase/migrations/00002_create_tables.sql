-- Migration 00002: Create all application tables
-- Requires: 00001_create_enums.sql

-- ── Trigger function for updated_at ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Profiles (extends auth.users) ────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  permanent_address TEXT,
  vehicle_number TEXT,            -- Primary vehicle (GJ01UV9043 format)
  dl_number TEXT,                 -- Driving license number
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Challans ─────────────────────────────────────────────────────────────────

CREATE TABLE challans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challan_number TEXT UNIQUE NOT NULL,        -- e.g., GJ4171692230721024061
  notice_number TEXT,                          -- e.g., DIA115_20220304154115_D1EB4
  vehicle_number TEXT NOT NULL,
  dl_number TEXT,
  owner_name TEXT,
  owner_contact TEXT,
  owner_address TEXT,
  violation_date TIMESTAMPTZ NOT NULL,
  challan_date TIMESTAMPTZ NOT NULL,
  violation_type violation_type NOT NULL,
  violation_place TEXT NOT NULL,               -- e.g., DIAMOND-DIAMOND_P2_L1
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Gujarat',
  fine_amount DECIMAL(10,2) NOT NULL,
  applicable_section TEXT,                     -- e.g., 194C
  payment_status payment_status DEFAULT 'unpaid',
  payment_date TIMESTAMPTZ,
  vehicle_class vehicle_class,
  vehicle_make TEXT,                           -- e.g., Activa 5G
  cctv_image_urls TEXT[],                      -- Array of Supabase Storage paths
  documents_impounded BOOLEAN DEFAULT FALSE,
  is_onoc BOOLEAN DEFAULT FALSE,
  engine_number TEXT,
  chassis_number TEXT,
  number_plate_type np_type DEFAULT 'standard',
  offender_age_group age_group,
  offender_gender gender_type,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER challans_updated_at
  BEFORE UPDATE ON challans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Grievances ────────────────────────────────────────────────────────────────

CREATE TABLE grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL UNIQUE,                -- Human-readable auto-increment
  citizen_id UUID NOT NULL REFERENCES profiles(id),
  challan_id UUID REFERENCES challans(id),    -- NULL if general grievance
  challan_number TEXT,                         -- Denormalized for quick display
  category grievance_category NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],                        -- Citizen-uploaded evidence
  status grievance_status DEFAULT 'open',
  priority priority_level DEFAULT 'medium',
  assigned_admin_id UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  lodged_via lodging_method DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER grievances_updated_at
  BEFORE UPDATE ON grievances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Grievance Timeline ────────────────────────────────────────────────────────

CREATE TABLE grievance_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id UUID NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                        -- e.g., 'Status changed to in_progress'
  actor_id UUID REFERENCES profiles(id),       -- NULL if system-generated
  actor_role user_role,
  details JSONB,                               -- Extra context
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Feedback ──────────────────────────────────────────────────────────────────

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES profiles(id),
  grievance_id UUID REFERENCES grievances(id),
  satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
  difficulties_faced TEXT,
  suggestions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── FAQs ──────────────────────────────────────────────────────────────────────

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Notifications ─────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL,
  reference_id UUID,                           -- Links to grievance, challan, etc.
  reference_type TEXT,                         -- 'grievance' | 'challan'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Chat Sessions ─────────────────────────────────────────────────────────────

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES profiles(id),
  messages JSONB[] DEFAULT '{}',               -- Array of {role, content, timestamp}
  resulted_in_grievance BOOLEAN DEFAULT FALSE,
  grievance_id UUID REFERENCES grievances(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Analytics Snapshots (pre-computed for dashboard) ───────────────────────

CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  metric_type TEXT NOT NULL,                   -- 'daily_summary' | 'violation_breakdown' | 'geographic' | 'demographic'
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
