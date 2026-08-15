import { query } from '../config/db.js';
import { sendEmail } from '../services/emailService.js';

export const getMonthEvents = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ message: 'year & month required' });

    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    const events = await query(
      `SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id
       WHERE e.event_date BETWEEN ? AND ? ORDER BY e.event_date ASC`,
      [start, end]
    );
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDayEvents = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date required' });

    const events = await query(
      `SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id
       WHERE e.event_date = ? ORDER BY e.created_at ASC`,
      [date]
    );
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, emoji } = req.body;
    if (!title || !eventDate) return res.status(400).json({ message: 'title & eventDate required' });

    const result = await query(
      'INSERT INTO events (user_id, title, description, event_date, emoji) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, eventDate, emoji || '📅']
    );
    res.status(201).json({ message: 'Event created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, emoji } = req.body;

    const result = await query(
      'UPDATE events SET title = ?, description = ?, event_date = ?, emoji = ? WHERE id = ? AND user_id = ?',
      [title, description || null, eventDate, emoji || '📅', id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM events WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkRemindersCron = async (req, res) => {
  try {
    const dateStr = new Date().toISOString().slice(0, 10);

    const events = await query(
      `SELECT e.*, u.email, u.username FROM events e JOIN users u ON e.user_id = u.id
       WHERE e.event_date = ?`,
      [dateStr]
    );

    if (events.length === 0) {
      return res.json({ message: 'No events today', count: 0 });
    }

    const users = await query('SELECT id, username, email FROM users');
    const todayLabel = new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    for (const u of users) {
      const lines = events
        .map((e) => `• ${e.emoji || '📅'} <strong>${e.title}</strong>${e.description ? ' — ' + e.description : ''}`)
        .join('<br/>');
      await sendEmail(
        u.email,
        '📅 Event Hari Ini - Our Moments',
        `
          <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;background:#FAFAF9">
            <div style="background:white;padding:30px;border-radius:12px;border:1px solid #E5E5E5">
              <h1 style="color:#D4A5A5;text-align:center">🎉 Event Hari Ini!</h1>
              <p>Hai ${u.username}, ada event hari ini (${todayLabel}):</p>
              <div style="background:#fff5f8;padding:16px;border-radius:8px">${lines}</div>
            </div>
          </div>
        `
      );
    }

    res.json({ message: 'Reminders sent', count: events.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
