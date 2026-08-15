import cron from 'node-cron';
import { query } from '../config/db.js';
import { sendEmail, noteUnlockedEmail, reminderToWriteEmail } from '../services/emailService.js';

// Check and unlock notes that have passed their unlock date
export const checkAndUnlockNotes = async () => {
  try {
    console.log('🔍 Checking for notes to unlock...');
    
    const now = new Date();
    
    // Find notes that should be unlocked
    const notesToUnlock = await query(
      `SELECT mn.*, u.username, u.email 
       FROM monthly_notes mn 
       JOIN users u ON mn.user_id = u.id 
       WHERE mn.is_locked = TRUE 
         AND mn.unlock_date <= ?`,
      [now]
    );

    if (notesToUnlock.length === 0) {
      console.log('✅ No notes to unlock');
      return;
    }

    console.log(`🔓 Found ${notesToUnlock.length} notes to unlock`);

    // Unlock notes
    await query(
      'UPDATE monthly_notes SET is_locked = FALSE WHERE unlock_date <= ? AND is_locked = TRUE',
      [now]
    );

    // Group notes by month/year to send one email per month
    const notesByMonth = {};
    notesToUnlock.forEach(note => {
      const key = `${note.year}-${note.month}`;
      if (!notesByMonth[key]) {
        notesByMonth[key] = {
          month: note.month,
          year: note.year,
          users: new Set()
        };
      }
      notesByMonth[key].users.add(JSON.stringify({ username: note.username, email: note.email }));
    });

    // Send unlock notification emails
    for (const key in notesByMonth) {
      const { month, year, users } = notesByMonth[key];
      
      for (const userStr of users) {
        const user = JSON.parse(userStr);
        const emailContent = noteUnlockedEmail(user.username, month, year);
        
        await sendEmail(user.email, emailContent.subject, emailContent.html);
        console.log(`📧 Unlock notification sent to ${user.email}`);
      }
    }

    console.log('✅ Note unlock job completed');
  } catch (error) {
    console.error('❌ Error in checkAndUnlockNotes:', error.message);
  }
};

// Send reminder to write notes (3 days before month end)
export const sendNoteReminders = async () => {
  try {
    console.log('🔍 Checking for note reminders...');
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();
    
    // Get last day of current month
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysLeft = lastDayOfMonth - currentDay;

    // Only send reminder 3 days before end of month
    if (daysLeft !== 3) {
      console.log(`✅ Not reminder day (${daysLeft} days left in month)`);
      return;
    }

    console.log(`📅 3 days left in month - sending reminders`);

    // Get all users
    const users = await query('SELECT id, username, email FROM users');

    for (const user of users) {
      // Check if user already wrote note for this month
      const existingNotes = await query(
        'SELECT id FROM monthly_notes WHERE user_id = ? AND month = ? AND year = ?',
        [user.id, currentMonth, currentYear]
      );

      // Only send reminder if user hasn't written note yet
      if (existingNotes.length === 0) {
        const emailContent = reminderToWriteEmail(user.username, currentMonth, currentYear, daysLeft);
        await sendEmail(user.email, emailContent.subject, emailContent.html);
        console.log(`📧 Reminder sent to ${user.email}`);
      }
    }

    console.log('✅ Reminder job completed');
  } catch (error) {
    console.error('❌ Error in sendNoteReminders:', error.message);
  }
};

// Initialize cron jobs
export const initCronJobs = () => {
  // Check for notes to unlock every hour
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Running hourly note unlock check...');
    checkAndUnlockNotes();
  });

  // Send reminders at 9 AM every day
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Running daily reminder check...');
    sendNoteReminders();
  });

  console.log('✅ Cron jobs initialized');
  console.log('   - Note unlock check: Every hour');
  console.log('   - Reminder check: Daily at 9 AM');
};
