import { query } from '../config/db.js';

export const createNote = async (req, res) => {
  try {
    const { month, year, content, theme, frame, stickers } = req.body;

    const unlockDate = new Date(year, month, 0, 23, 59, 59);

    const stickersJSON = stickers ? JSON.stringify(stickers) : null;

    const result = await query(
      `INSERT INTO monthly_notes 
       (user_id, month, year, content, theme, frame, stickers, unlock_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       content = ?, theme = ?, frame = ?, stickers = ?, unlock_date = ?`,
      [req.user.id, month, year, content, theme || 'default', frame || 'none', stickersJSON, unlockDate,
       content, theme || 'default', frame || 'none', stickersJSON, unlockDate]
    );

    res.status(201).json({
      message: 'Note saved successfully',
      note: {
        id: result.insertId,
        month,
        year,
        content,
        theme: theme || 'default',
        frame: frame || 'none',
        stickers: stickers || [],
        unlockDate,
        isLocked: true
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyNotes = async (req, res) => {
  try {
    const notes = await query(
      'SELECT * FROM monthly_notes WHERE user_id = ? ORDER BY year DESC, month DESC',
      [req.user.id]
    );
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPartnerNotes = async (req, res) => {
  try {
    // Get partner's unlocked notes only
    const now = new Date();
    const notes = await query(
      'SELECT mn.*, u.username FROM monthly_notes mn JOIN users u ON mn.user_id = u.id WHERE mn.user_id != ? AND (mn.is_locked = FALSE OR mn.unlock_date <= ?) ORDER BY mn.year DESC, mn.month DESC',
      [req.user.id, now]
    );
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const unlockNotes = async (req, res) => {
  try {
    const now = new Date();
    
    const result = await query(
      'UPDATE monthly_notes SET is_locked = FALSE WHERE unlock_date <= ? AND is_locked = TRUE',
      [now]
    );

    res.json({ 
      message: 'Notes unlocked successfully',
      unlockedCount: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('DELETE FROM monthly_notes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notes filtered by month and year (for Dashboard)
export const getMonthlyNotes = async (req, res) => {
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

    const notes = await query(
      `SELECT mn.*, u.username 
       FROM monthly_notes mn 
       JOIN users u ON mn.user_id = u.id 
       WHERE mn.year = ? AND mn.month = ?
       ORDER BY mn.created_at DESC`,
      [yearNum, monthNum]
    );

    const parsedNotes = notes.map(note => ({
      ...note,
      stickers: note.stickers ? JSON.parse(note.stickers) : []
    }));

    res.json({ 
      notes: parsedNotes,
      year: yearNum,
      month: monthNum,
      count: parsedNotes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available note assets (themes, frames, stickers)
export const getNoteAssets = async (req, res) => {
  try {
    const assets = {
      themes: [
        { id: 'default', name: 'Default White', preview: '/assets/themes/previews/default.png' },
        { id: 'lined_paper', name: 'Lined Paper', preview: '/assets/themes/previews/lined-paper.png' },
        { id: 'grid_paper', name: 'Grid Paper', preview: '/assets/themes/previews/grid-paper.png' },
        { id: 'kraft_paper', name: 'Kraft Paper', preview: '/assets/themes/previews/kraft-paper.png' },
        { id: 'pastel_pink', name: 'Pastel Pink', preview: '/assets/themes/previews/pastel-pink.png' },
        { id: 'pastel_blue', name: 'Pastel Blue', preview: '/assets/themes/previews/pastel-blue.png' },
        { id: 'pastel_purple', name: 'Pastel Purple', preview: '/assets/themes/previews/pastel-purple.png' },
        { id: 'pastel_green', name: 'Pastel Green', preview: '/assets/themes/previews/pastel-green.png' },
        { id: 'floral_pink', name: 'Floral Pink', preview: '/assets/themes/previews/floral-pink.png' },
        { id: 'floral_blue', name: 'Floral Blue', preview: '/assets/themes/previews/floral-blue.png' },
        { id: 'polka_dots', name: 'Polka Dots', preview: '/assets/themes/previews/polka-dots.png' },
        { id: 'watercolor', name: 'Watercolor', preview: '/assets/themes/previews/watercolor.png' },
        { id: 'vintage', name: 'Vintage', preview: '/assets/themes/previews/vintage.png' },
        { id: 'gradient_sunset', name: 'Gradient Sunset', preview: '/assets/themes/previews/gradient-sunset.png' },
        { id: 'kawaii', name: 'Kawaii', preview: '/assets/themes/previews/kawaii.png' }
      ],
      frames: [
        { id: 'none', name: 'No Frame', preview: null },
        { id: 'simple_black', name: 'Simple Black', preview: '/assets/frames/previews/simple-black.png' },
        { id: 'simple_white', name: 'Simple White', preview: '/assets/frames/previews/simple-white.png' },
        { id: 'polaroid_white', name: 'Polaroid White', preview: '/assets/frames/previews/polaroid-white.png' },
        { id: 'polaroid_black', name: 'Polaroid Black', preview: '/assets/frames/previews/polaroid-black.png' },
        { id: 'wood_light', name: 'Light Wood', preview: '/assets/frames/previews/wood-light.png' },
        { id: 'wood_dark', name: 'Dark Wood', preview: '/assets/frames/previews/wood-dark.png' },
        { id: 'gold_classic', name: 'Gold Classic', preview: '/assets/frames/previews/gold-classic.png' },
        { id: 'tape', name: 'Washi Tape', preview: '/assets/frames/previews/tape.png' },
        { id: 'hearts_border', name: 'Hearts Border', preview: '/assets/frames/previews/hearts-border.png' }
      ],
      stickers: {
        emoji: [
          { id: 'heart', unicode: '❤️', category: 'love' },
          { id: 'heart_suit', unicode: '💕', category: 'love' },
          { id: 'sparkling_heart', unicode: '💖', category: 'love' },
          { id: 'growing_heart', unicode: '💗', category: 'love' },
          { id: 'beating_heart', unicode: '💓', category: 'love' },
          { id: 'revolving_hearts', unicode: '💞', category: 'love' },
          { id: 'heart_decoration', unicode: '💘', category: 'love' },
          { id: 'heart_ribbon', unicode: '💝', category: 'love' },
          { id: 'smiling_face', unicode: '😊', category: 'faces' },
          { id: 'heart_eyes', unicode: '😍', category: 'faces' },
          { id: 'smiling_face_hearts', unicode: '🥰', category: 'faces' },
          { id: 'face_blowing_kiss', unicode: '😘', category: 'faces' },
          { id: 'pleading_face', unicode: '🥺', category: 'faces' },
          { id: 'loudly_crying', unicode: '😭', category: 'faces' },
          { id: 'rolling_laughing', unicode: '😂', category: 'faces' },
          { id: 'rolling_floor', unicode: '🤣', category: 'faces' },
          { id: 'star', unicode: '⭐', category: 'sparkles' },
          { id: 'sparkles', unicode: '✨', category: 'sparkles' },
          { id: 'glowing_star', unicode: '🌟', category: 'sparkles' },
          { id: 'dizzy', unicode: '💫', category: 'sparkles' },
          { id: 'ribbon', unicode: '🎀', category: 'sparkles' },
          { id: 'cherry_blossom', unicode: '🌸', category: 'sparkles' },
          { id: 'white_flower', unicode: '💮', category: 'sparkles' },
          { id: 'hibiscus', unicode: '🌺', category: 'sparkles' },
          { id: 'balloon', unicode: '🎈', category: 'objects' },
          { id: 'party_popper', unicode: '🎉', category: 'objects' },
          { id: 'confetti_ball', unicode: '🎊', category: 'objects' },
          { id: 'wrapped_gift', unicode: '🎁', category: 'objects' },
          { id: 'shortcake', unicode: '🍰', category: 'objects' },
          { id: 'birthday_cake', unicode: '🎂', category: 'objects' },
          { id: 'doughnut', unicode: '🍩', category: 'objects' },
          { id: 'ice_cream', unicode: '🍦', category: 'objects' },
          { id: 'cat_face', unicode: '🐱', category: 'animals' },
          { id: 'dog_face', unicode: '🐶', category: 'animals' },
          { id: 'rabbit_face', unicode: '🐰', category: 'animals' },
          { id: 'bear_face', unicode: '🐻', category: 'animals' },
          { id: 'panda_face', unicode: '🐼', category: 'animals' }
        ],
        memes: [
          { id: 'pepe_happy', src: '/assets/stickers/memes/pepe-happy.png', name: 'Pepe Happy' },
          { id: 'pepe_sad', src: '/assets/stickers/memes/pepe-sad.png', name: 'Pepe Sad' },
          { id: 'pepe_smug', src: '/assets/stickers/memes/pepe-smug.png', name: 'Pepe Smug' },
          { id: 'pepe_cry', src: '/assets/stickers/memes/pepe-cry.png', name: 'Pepe Cry' },
          { id: 'pepe_love', src: '/assets/stickers/memes/pepe-love.png', name: 'Pepe Love' },
          { id: 'wojak_crying', src: '/assets/stickers/memes/wojak-crying.png', name: 'Wojak Crying' },
          { id: 'wojak_boomer', src: '/assets/stickers/memes/wojak-boomer.png', name: 'Wojak Boomer' },
          { id: 'wojak_doomer', src: '/assets/stickers/memes/wojak-doomer.png', name: 'Wojak Doomer' },
          { id: 'chad_yes', src: '/assets/stickers/memes/chad-yes.png', name: 'Chad Yes' },
          { id: 'chad_giga', src: '/assets/stickers/memes/chad-giga.png', name: 'Giga Chad' },
          { id: 'stonks', src: '/assets/stickers/memes/stonks.png', name: 'Stonks' },
          { id: 'stonks_down', src: '/assets/stickers/memes/stonks-down.png', name: 'Not Stonks' },
          { id: 'doge', src: '/assets/stickers/memes/doge.png', name: 'Doge' },
          { id: 'doge_surprise', src: '/assets/stickers/memes/doge-surprise.png', name: 'Doge Surprise' },
          { id: 'distracted_boyfriend', src: '/assets/stickers/memes/distracted-boyfriend.png', name: 'Distracted BF' },
          { id: 'drake_yes', src: '/assets/stickers/memes/drake-yes.png', name: 'Drake Yes' },
          { id: 'drake_no', src: '/assets/stickers/memes/drake-no.png', name: 'Drake No' },
          { id: 'spiderman_point', src: '/assets/stickers/memes/spiderman-point.png', name: 'Spiderman Point' },
          { id: 'this_is_fine', src: '/assets/stickers/memes/this-is-fine.png', name: 'This Is Fine' },
          { id: 'hide_pain', src: '/assets/stickers/memes/hide-pain.png', name: 'Hide Pain Harold' },
          { id: 'woman_yell_cat', src: '/assets/stickers/memes/woman-yell-cat.png', name: 'Woman Yell Cat' },
          { id: 'surprised_pikachu', src: '/assets/stickers/memes/surprised-pikachu.png', name: 'Surprised Pikachu' },
          { id: 'pogchamp', src: '/assets/stickers/memes/pogchamp.png', name: 'PogChamp' },
          { id: 'kek', src: '/assets/stickers/memes/kek.png', name: 'KEK' },
          { id: 'based', src: '/assets/stickers/memes/based.png', name: 'Based' },
          { id: 'pog', src: '/assets/stickers/memes/pog.png', name: 'POG' },
          { id: 'bruh', src: '/assets/stickers/memes/bruh.png', name: 'Bruh' },
          { id: 'skull', src: '/assets/stickers/memes/skull.png', name: '💀 Skull' },
          { id: 'fire', src: '/assets/stickers/memes/fire.png', name: '🔥 Fire' }
        ]
      }
    };

    res.json({ assets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
