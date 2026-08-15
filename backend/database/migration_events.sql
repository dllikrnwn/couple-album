-- Migration: Events (Kalender)
-- Date: 2026-08-16
-- Description: Tabel event untuk fitur kalender + stiker penanda tanggal

USE test;

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  emoji VARCHAR(16) DEFAULT '📅',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_event_date (event_date)
);

-- Migration completed
-- Expected columns: id, user_id, title, description, event_date, emoji, created_at
