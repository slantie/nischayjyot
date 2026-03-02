-- Migration 00001: Create PostgreSQL ENUM Types for NishchayJyot
-- Run this FIRST before creating any tables

CREATE TYPE user_role AS ENUM ('citizen', 'admin', 'super_admin');

CREATE TYPE violation_type AS ENUM (
  'red_light',
  'overspeeding',
  'no_helmet',
  'no_seatbelt',
  'pillion_overload',
  'wrong_lane',
  'parking_violation',
  'signal_violation',
  'document_violation',
  'other'
);

CREATE TYPE payment_status AS ENUM ('paid', 'unpaid', 'disputed', 'waived');

CREATE TYPE vehicle_class AS ENUM ('two_wheeler', 'four_wheeler', 'commercial', 'other');

CREATE TYPE np_type AS ENUM ('standard', 'non_standard');

CREATE TYPE age_group AS ENUM ('below_18', '18_30', '30_45', 'above_45');

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

CREATE TYPE grievance_category AS ENUM (
  'false_challan',
  'wrong_amount',
  'wrong_vehicle',
  'duplicate_challan',
  'payment_issue',
  'other'
);

CREATE TYPE grievance_status AS ENUM (
  'open',
  'in_progress',
  'under_review',
  'resolved',
  'rejected',
  'escalated'
);

CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE lodging_method AS ENUM ('web', 'chatbot', 'api');

CREATE TYPE notification_type AS ENUM (
  'grievance_update',
  'challan_generated',
  'payment_reminder',
  'resolution',
  'system'
);
