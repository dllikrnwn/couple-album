import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('=== EMAIL TRANSPORTER VERIFICATION FAILED ===');
    console.error('Error:', error.message);
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'MISSING');
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'MISSING');
    console.error('===============================================');
  } else {
    console.log('��� Email transporter verified successfully');
  }
});

// Send email notification
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Our Moments" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Email template: Note unlocked
export const noteUnlockedEmail = (username, month, year) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    subject: `💕 Your ${monthNames[month - 1]} Notes Are Unlocked!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAF9;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #E5E5E5;">
          <h1 style="color: #D4A5A5; font-size: 28px; margin-bottom: 10px; text-align: center;">💕 Notes Unlocked!</h1>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            Hi ${username},
          </p>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            Your monthly notes for <strong>${monthNames[month - 1]} ${year}</strong> are now unlocked! 🎉
          </p>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            You can now read each other's special messages from this month.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/notes" style="display: inline-block; background-color: #D4A5A5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Read Notes
            </a>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
            With love,<br>Our Moments ❤️
          </p>
        </div>
      </div>
    `
  };
};

// Email template: Reminder to write note
export const reminderToWriteEmail = (username, month, year, daysLeft) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    subject: `⏰ Reminder: Write Your ${monthNames[month - 1]} Note (${daysLeft} days left)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAF9;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #E5E5E5;">
          <h1 style="color: #D4A5A5; font-size: 28px; margin-bottom: 10px; text-align: center;">⏰ Don't Forget!</h1>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            Hi ${username},
          </p>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            Just a friendly reminder to write your monthly note for <strong>${monthNames[month - 1]} ${year}</strong>.
          </p>
          <p style="color: #1F1F1F; font-size: 16px; line-height: 1.6;">
            You have <strong>${daysLeft} days left</strong> before the month ends and notes are locked!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/notes" style="display: inline-block; background-color: #D4A5A5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Write Note
            </a>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
            With love,<br>Our Moments ❤️
          </p>
        </div>
      </div>
    `
  };
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error.message);
    return false;
  }
};
