-- Rollback script for migration_add_location.sql
-- Use this if you need to revert the migration

-- Remove indexes
DROP INDEX IF EXISTS idx_media_location ON media;
DROP INDEX IF EXISTS idx_media_featured ON media;
DROP INDEX IF EXISTS idx_media_upload_date ON media;

-- Remove columns
ALTER TABLE media 
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS is_featured;

-- Rollback completed
