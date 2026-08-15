CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'partner') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  cloudinary_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  type ENUM('photo', 'video') NOT NULL,
  caption TEXT,
  upload_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE milestones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monthly_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  content TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT TRUE,
  unlock_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_month (user_id, month, year)
);

CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO settings (setting_key, setting_value) VALUES 
('relationship_start_date', '2025-10-29'),
('public_gallery_token', '8f3a2b1c9d4e5f6a7b8c9d0e1f2a3b4c');

CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_user ON media(user_id);
CREATE INDEX idx_notes_unlock ON monthly_notes(unlock_date, is_locked);
