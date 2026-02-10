ALTER TABLE renter ADD COLUMN active_notifications BOOLEAN DEFAULT TRUE;
UPDATE renter SET active_notifications = TRUE WHERE active_notifications IS NULL;
