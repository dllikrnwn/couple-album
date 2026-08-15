import { query } from '../config/db.js';

export const createMilestone = async (req, res) => {
  try {
    const { title, description, milestoneDate, photoUrl } = req.body;

    const result = await query(
      'INSERT INTO milestones (title, description, milestone_date, photo_url) VALUES (?, ?, ?, ?)',
      [title, description, milestoneDate, photoUrl]
    );

    res.status(201).json({
      message: 'Milestone created successfully',
      milestone: {
        id: result.insertId,
        title,
        description,
        milestoneDate,
        photoUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllMilestones = async (req, res) => {
  try {
    const milestones = await query('SELECT * FROM milestones ORDER BY milestone_date DESC');
    res.json({ milestones });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, milestoneDate, photoUrl } = req.body;

    await query(
      'UPDATE milestones SET title = ?, description = ?, milestone_date = ?, photo_url = ? WHERE id = ?',
      [title, description, milestoneDate, photoUrl, id]
    );

    res.json({ message: 'Milestone updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM milestones WHERE id = ?', [id]);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
