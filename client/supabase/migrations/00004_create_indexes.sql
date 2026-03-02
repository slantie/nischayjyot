-- Migration 00004: Performance Indexes
-- Requires: 00002_create_tables.sql

-- Challans: most common lookups
CREATE INDEX idx_challans_vehicle_number ON challans(vehicle_number);
CREATE INDEX idx_challans_challan_number ON challans(challan_number);
CREATE INDEX idx_challans_dl_number ON challans(dl_number);
CREATE INDEX idx_challans_payment_status ON challans(payment_status);
CREATE INDEX idx_challans_violation_type ON challans(violation_type);
CREATE INDEX idx_challans_city ON challans(city);
CREATE INDEX idx_challans_challan_date ON challans(challan_date DESC);

-- Grievances: most common lookups
CREATE INDEX idx_grievances_citizen_id ON grievances(citizen_id);
CREATE INDEX idx_grievances_challan_id ON grievances(challan_id);
CREATE INDEX idx_grievances_status ON grievances(status);
CREATE INDEX idx_grievances_priority ON grievances(priority);
CREATE INDEX idx_grievances_assigned_admin ON grievances(assigned_admin_id);
CREATE INDEX idx_grievances_created_at ON grievances(created_at DESC);
CREATE UNIQUE INDEX idx_grievances_ticket_number ON grievances(ticket_number);

-- Grievance Timeline
CREATE INDEX idx_grievance_timeline_grievance_id ON grievance_timeline(grievance_id);
CREATE INDEX idx_grievance_timeline_created_at ON grievance_timeline(created_at ASC);

-- Notifications: realtime filtering
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Chat Sessions
CREATE INDEX idx_chat_sessions_citizen_id ON chat_sessions(citizen_id);

-- FAQs
CREATE INDEX idx_faqs_language ON faqs(language);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_display_order ON faqs(display_order ASC);

-- Analytics
CREATE INDEX idx_analytics_snapshot_date ON analytics_snapshots(snapshot_date DESC);
CREATE INDEX idx_analytics_metric_type ON analytics_snapshots(metric_type);
