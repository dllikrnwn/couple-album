-- Migration: Add location and featured fields to media table
-- Date: 2026-08-14
-- Description: Support location tracking and featured photo system for monthly dashboard

USE couple_album;

-- Step 1: Add new columns to media table
ALTER TABLE media 
ADD COLUMN location VARCHAR(255) DEFAULT NULL COMMENT 'Location where photo/video was taken' AFTER upload_date,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE COMMENT 'Mark as featured for dashboard' AFTER is_public;

-- Step 2: Add indexes for performance
CREATE INDEX idx_media_location ON media(location);
CREATE INDEX idx_media_featured ON media(is_featured);
CREATE INDEX idx_media_upload_date ON media(upload_date);
CREATE INDEX idx_media_month_year ON media((YEAR(upload_date)), (MONTH(upload_date)));

-- Step 3: Verify structure
DESCRIBE media;

-- Step 4: Show sample data (will be empty if no data yet)
SELECT id, caption, location, upload_date, is_featured, status 
FROM media 
LIMIT 5;

-- Migration completed successfully
-- Expected columns: id, user_id, cloudinary_url, cloudinary_public_id, type, caption, 
--                   upload_date, location (NEW), status, is_public, is_featured (NEW), created_at
