import { query } from '../config/db.js';
import archiver from 'archiver';
import { Readable } from 'stream';
import fetch from 'node-fetch';

export const getSettings = async (req, res) => {
  try {
    const settings = await query('SELECT * FROM settings');
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;

    await query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRelationshipDays = async (req, res) => {
  try {
    const settings = await query('SELECT setting_value FROM settings WHERE setting_key = ?', ['relationship_start_date']);
    
    if (settings.length === 0) {
      return res.status(404).json({ message: 'Relationship start date not found' });
    }

    const startDate = new Date(settings[0].setting_value);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    res.json({ 
      startDate: settings[0].setting_value,
      days: diffDays 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const downloadAlbum = async (req, res) => {
  try {
    const { mediaIds } = req.body;

    if (!mediaIds || mediaIds.length === 0) {
      return res.status(400).json({ message: 'No media selected' });
    }

    const placeholders = mediaIds.map(() => '?').join(',');
    const media = await query(
      `SELECT * FROM media WHERE id IN (${placeholders}) AND status = 'approved'`,
      mediaIds
    );

    if (media.length === 0) {
      return res.status(404).json({ message: 'No media found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=couple-album.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    // Add media files
    for (const item of media) {
      try {
        const response = await fetch(item.cloudinary_url);
        const buffer = await response.buffer();
        const ext = item.type === 'video' ? '.mp4' : '.jpg';
        archive.append(buffer, { name: `${item.id}-${item.upload_date}${ext}` });
      } catch (error) {
        console.error(`Failed to download ${item.id}:`, error.message);
      }
    }

    // Add captions file
    const captionsText = media.map(m => `${m.id} - ${m.upload_date}\n${m.caption || 'No caption'}\n\n`).join('');
    archive.append(captionsText, { name: 'captions.txt' });

    await archive.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
};

export const getPublicGallery = async (req, res) => {
  try {
    const { token } = req.params;

    const settings = await query('SELECT setting_value FROM settings WHERE setting_key = ?', ['public_gallery_token']);

    if (settings.length === 0 || settings[0].setting_value !== token) {
      return res.status(404).json({ message: 'Invalid gallery token' });
    }

    const media = await query(
      'SELECT m.*, u.username FROM media m JOIN users u ON m.user_id = u.id WHERE m.status = ? AND m.is_public = TRUE ORDER BY m.upload_date DESC',
      ['approved']
    );

    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a test email to verify notification configuration
export const sendTestEmail = async (req, res) => {
  try {
    const { sendEmail } = await import('../services/emailService.js');

    if (!process.env.EMAIL_USER) {
      return res.status(400).json({ message: 'EMAIL_USER not configured in .env' });
    }

    const result = await sendEmail(
      process.env.EMAIL_USER,
      '✅ Test Email - Our Moments',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAF9;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #E5E5E5;">
            <h1 style="color: #D4A5A5; font-size: 28px; margin-bottom: 10px; text-align: center;">📧 Email Notifications Working!</h1>
            <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
              Hello! This is a test email from <strong>Our Moments</strong>.
            </p>
            <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
              Your email notification settings are working correctly. You will now receive notifications when:
            </p>
            <ul style="color: #1F1F1F; font-size: 16px; line-height: 1.8;">
              <li>💌 Monthly notes are unlocked</li>
              <li>⏰ Reminders to write your monthly note</li>
            </ul>
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
              With love,<br>Our Moments ❤️
            </p>
          </div>
        </div>
      `
    );

    if (result.success) {
      res.json({ message: 'Test email sent successfully!', messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Failed to send test email', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
