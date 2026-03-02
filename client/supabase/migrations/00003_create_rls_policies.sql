-- Migration 00003: Row Level Security (RLS) Policies
-- Requires: 00002_create_tables.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- ── Helper functions ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── Profiles Policies ─────────────────────────────────────────────────────────

-- Citizens can read/update only their own profile
CREATE POLICY "Citizens: read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Citizens: update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Citizens: insert own profile on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins: read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- ── Challans Policies ─────────────────────────────────────────────────────────

-- Citizens can read challans matching their vehicle_number or dl_number
CREATE POLICY "Citizens: read own challans"
  ON challans FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      vehicle_number = (SELECT vehicle_number FROM profiles WHERE id = auth.uid())
      OR dl_number = (SELECT dl_number FROM profiles WHERE id = auth.uid())
    )
  );

-- Admins can CRUD all challans
CREATE POLICY "Admins: all access on challans"
  ON challans FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── Grievances Policies ───────────────────────────────────────────────────────

-- Citizens can read and create their own grievances
CREATE POLICY "Citizens: read own grievances"
  ON grievances FOR SELECT
  USING (auth.uid() = citizen_id);

CREATE POLICY "Citizens: create grievances"
  ON grievances FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

-- Admins can read and update all grievances
CREATE POLICY "Admins: read all grievances"
  ON grievances FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins: update grievances"
  ON grievances FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── Grievance Timeline Policies ───────────────────────────────────────────────

-- Citizens can read timeline for their own grievances
CREATE POLICY "Citizens: read own grievance timelines"
  ON grievance_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grievances
      WHERE grievances.id = grievance_timeline.grievance_id
      AND grievances.citizen_id = auth.uid()
    )
  );

-- Admins can read/create all timeline entries
CREATE POLICY "Admins: all access on grievance_timeline"
  ON grievance_timeline FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- System (service role) can insert timeline entries
CREATE POLICY "Service: insert grievance timeline"
  ON grievance_timeline FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── Feedback Policies ─────────────────────────────────────────────────────────

-- Citizens can create their own feedback
CREATE POLICY "Citizens: create feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

-- Citizens can read their own feedback
CREATE POLICY "Citizens: read own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = citizen_id);

-- Admins can read all feedback
CREATE POLICY "Admins: read all feedback"
  ON feedback FOR SELECT
  USING (is_admin());

-- ── FAQs Policies ─────────────────────────────────────────────────────────────

-- Public read for published FAQs
CREATE POLICY "Public: read published FAQs"
  ON faqs FOR SELECT
  USING (is_published = true);

-- Admins can CRUD FAQs
CREATE POLICY "Admins: all access on FAQs"
  ON faqs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── Notifications Policies ────────────────────────────────────────────────────

-- Users can read/update only their own notifications
CREATE POLICY "Users: read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users: update own notifications (mark read)"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Chat Sessions Policies ────────────────────────────────────────────────────

-- Citizens can read/create their own chat sessions
CREATE POLICY "Citizens: read own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = citizen_id);

CREATE POLICY "Citizens: create chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

CREATE POLICY "Citizens: update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = citizen_id)
  WITH CHECK (auth.uid() = citizen_id);

-- ── Analytics Snapshots Policies ──────────────────────────────────────────────

-- Admins can read analytics
CREATE POLICY "Admins: read analytics"
  ON analytics_snapshots FOR SELECT
  USING (is_admin());
