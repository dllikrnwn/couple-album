-- Migration: Enhanced Notes Feature
-- Date: 2026-08-14
-- Description: Add theme, frame, and stickers support to monthly_notes

-- Add new columns to monthly_notes table
ALTER TABLE monthly_notes
ADD COLUMN theme VARCHAR(50) DEFAULT 'default' COMMENT 'Paper theme ID' AFTER content,
ADD COLUMN frame VARCHAR(50) DEFAULT 'none' COMMENT 'Frame style ID' AFTER theme,
ADD COLUMN stickers JSON DEFAULT NULL COMMENT 'Array of sticker positions' AFTER frame,
ADD COLUMN background_color VARCHAR(20) DEFAULT NULL COMMENT 'Optional custom background color' AFTER stickers;

-- Migration completed
-- Expected columns: id, user_id, month, year, content, theme (NEW), frame (NEW), stickers (NEW), background_color (NEW), is_locked, unlock_date, created_at
