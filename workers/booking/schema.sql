-- Datmo Bookings Database Schema
-- Run this after creating D1 database

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  route_label TEXT,
  travel_date TEXT NOT NULL,
  departure_time TEXT,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_email TEXT,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  kalong_booking_ref TEXT,
  ticket_url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  paid_at TEXT,
  issued_at TEXT,
  linked_booking_id TEXT,
  trip_type TEXT DEFAULT 'one-way'
);

CREATE TABLE IF NOT EXISTS pricing (
  route TEXT PRIMARY KEY,
  route_label TEXT,
  adult_price INTEGER NOT NULL,
  child_price INTEGER NOT NULL,
  operator TEXT NOT NULL DEFAULT 'kalong'
);

CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  vessel TEXT,
  days_of_week TEXT DEFAULT 'daily'
);

-- Insert pricing data
INSERT OR IGNORE INTO pricing VALUES
  ('ao-tien-co-to', 'Ao Tiên → Cô Tô', 280000, 140000, 'kalong'),
  ('co-to-ao-tien', 'Cô Tô → Ao Tiên', 280000, 140000, 'kalong'),
  ('ao-tien-quan-lan', 'Ao Tiên → Quan Lạn', 250000, 125000, 'kalong'),
  ('quan-lan-ao-tien', 'Quan Lạn → Ao Tiên', 250000, 125000, 'kalong'),
  ('ao-tien-minh-chau', 'Ao Tiên → Minh Châu', 250000, 125000, 'kalong'),
  ('minh-chau-ao-tien', 'Minh Châu → Ao Tiên', 250000, 125000, 'kalong');

-- Insert schedule data (outbound)
INSERT OR IGNORE INTO schedules (route, departure_time, vessel) VALUES
  ('ao-tien-co-to', '07:30', 'Ka Long 68'),
  ('ao-tien-co-to', '13:00', 'Ka Long 26'),
  ('co-to-ao-tien', '08:00', 'Ka Long 68'),
  ('co-to-ao-tien', '14:00', 'Ka Long 26'),
  ('ao-tien-quan-lan', '08:00', 'Ka Long 68'),
  ('ao-tien-minh-chau', '08:30', 'Ka Long 26'),
  ('minh-chau-ao-tien', '13:30', 'Ka Long 26');

-- Insert return schedules (reverse routes)
INSERT OR IGNORE INTO schedules (route, departure_time, vessel) VALUES
  ('co-to-ao-tien', '08:00', 'Ka Long 68'),
  ('co-to-ao-tien', '14:00', 'Ka Long 26'),
  ('quan-lan-ao-tien', '13:00', 'Ka Long 68'),
  ('minh-chau-ao-tien', '13:30', 'Ka Long 26');
