import { query } from '../config/db.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const uploadMedia = async (req, res) => {
  try {
    const { caption, uploadDate, isPublic, location } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);

    // Delete local file after upload
    fs.unlinkSync(file.path);

    // Determine media type
    const type = file.mimetype.startsWith('video') ? 'video' : 'photo';

    // Single user system: Always auto-approve
    const status = 'approved';

    const result = await query(
      'INSERT INTO media (user_id, cloudinary_url, cloudinary_public_id, type, caption, upload_date, location, status, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, cloudinaryResult.url, cloudinaryResult.publicId, type, caption, uploadDate, location || null, status, isPublic !== 'false']
    );

    res.status(201).json({
      message: 'Media uploaded successfully',
      media: {
        id: result.insertId,
        url: cloudinaryResult.url,
        type,
        caption,
        location: location || null,
        status
      }
    });
  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Request file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    } : 'No file');
    console.error('Request body:', req.body);
    console.error('User:', req.user);
    console.error('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
    });
    console.error('=== END UPLOAD ERROR ===');
    res.status(500).json({ message: 'Upload failed', error: error.message, details: error.stack });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let sql = 'SELECT m.*, u.username FROM media m JOIN users u ON m.user_id = u.id WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND m.status = ?';
      params.push(status);
    }

    if (type) {
      sql += ' AND m.type = ?';
      params.push(type);
    }

    sql += ' ORDER BY m.upload_date DESC, m.created_at DESC';

    const media = await query(sql, params);
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getApprovedMedia = async (req, res) => {
  try {
    const media = await query(
      'SELECT m.*, u.username FROM media m JOIN users u ON m.user_id = u.id WHERE m.status = ? ORDER BY m.upload_date DESC',
      ['approved']
    );
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPendingMedia = async (req, res) => {
  try {
    const media = await query(
      'SELECT m.*, u.username FROM media m JOIN users u ON m.user_id = u.id WHERE m.status = ? ORDER BY m.created_at DESC',
      ['pending']
    );
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMediaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await query('UPDATE media SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: `Media ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await query('SELECT cloudinary_public_id FROM media WHERE id = ?', [id]);

    if (media.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(media[0].cloudinary_public_id);

    // Delete from database
    await query('DELETE FROM media WHERE id = ?', [id]);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMediaVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    await query('UPDATE media SET is_public = ? WHERE id = ?', [isPublic, id]);

    res.json({ message: 'Media visibility updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get media filtered by month and year
export const getMonthlyMedia = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'Invalid month (1-12)' });
    }

    const media = await query(
      `SELECT m.*, u.username 
       FROM media m 
       JOIN users u ON m.user_id = u.id 
       WHERE m.status = 'approved' 
         AND YEAR(m.upload_date) = ? 
         AND MONTH(m.upload_date) = ?
       ORDER BY m.upload_date DESC, m.created_at DESC`,
      [yearNum, monthNum]
    );

    res.json({ 
      media,
      year: yearNum,
      month: monthNum,
      count: media.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available months (for month selector dropdown)
export const getAvailableMonths = async (req, res) => {
  try {
    const months = await query(
      `SELECT DISTINCT 
         YEAR(upload_date) as year, 
         MONTH(upload_date) as month,
         COUNT(*) as photo_count
       FROM media 
       WHERE status = 'approved'
       GROUP BY YEAR(upload_date), MONTH(upload_date)
       ORDER BY year DESC, month DESC`
    );

    res.json({ months });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
