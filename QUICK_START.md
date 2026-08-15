# ⚡ QUICK START GUIDE

## 🚀 First Time Setup (5 Minutes)

### 1. Database
```bash
# Open phpMyAdmin and import:
backend/database/migration_add_location.sql
```

### 2. Create User Account
```bash
cd backend
# Edit generate-hash.js (change email/password/name)
node generate-hash.js
# Copy SQL output → Run in phpMyAdmin
# DELETE generate-hash.js after use!
```

### 3. Configure .env Files

**Backend (.env):**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install & Run
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 5. Access
Open: http://localhost:5173

---

## 📋 FEATURES OVERVIEW

### ✅ Monthly Dashboard
- Auto-displays current month photos
- Month selector to browse past months
- Featured photo (largest) + 6 grid photos
- Monthly notes section

### ✅ Location Tracking
- Add location when uploading
- Shows location on photo cards
- Filter/search by location (future)

### ✅ Monthly Locked Notes
- Write notes for each month
- Locked until end of month
- Auto-unlock + email notification
- Can always read own notes

### ✅ Guest Access
- Public can view without login
- See: Photos, Milestones, Unlocked Notes
- Cannot: Upload, Write Notes, Edit

### ✅ Email Notifications
- Note unlocked (end of month)
- Reminder to write (3 days before)
- Automatic cron jobs

---

## 🎯 USER FLOW

### Logged-in User:
```
Login → Dashboard → 
├─ Upload Photo (with location + date)
├─ Write Monthly Note
├─ View All Features
└─ Logout
```

### Guest:
```
Visit Site → Dashboard (public) →
├─ View Photos
├─ View Unlocked Notes
├─ View Milestones
└─ Browse Months
```

---

## ⚙️ KEY CONFIGURATIONS

### Email Notifications:
- **Unlock Check:** Every hour (cron)
- **Reminder:** Daily at 9 AM (cron)
- **Service:** Gmail SMTP

### Upload Settings:
- **Max Size:** 100MB
- **Formats:** JPG, PNG, GIF, MP4, MOV, AVI
- **Storage:** Cloudinary (25GB free)
- **Status:** Auto-approved

### Monthly Notes:
- **Lock:** Until end of month 23:59:59
- **Unlock:** Automatic (next day 9 AM notification)
- **Privacy:** Can read own, partner's locked

---

## 🐛 Common Issues

### Backend won't start:
```bash
# Check MySQL running
# Check .env file exists
# Run: npm install
```

### Frontend shows blank:
```bash
# Check backend is running
# Check VITE_API_URL in .env
# Hard refresh: Ctrl+Shift+R
```

### Upload fails:
```bash
# Check Cloudinary credentials
# Check file size < 100MB
# Check internet connection
```

### Email not sending:
```bash
# Check Gmail app password
# Enable 2FA on Gmail first
# Visit: https://myaccount.google.com/apppasswords
```

---

## 📞 Tech Stack

- **Frontend:** React 19 + Vite + Tailwind + Framer Motion
- **Backend:** Node.js + Express
- **Database:** MySQL (Laragon)
- **Storage:** Cloudinary
- **Email:** Nodemailer + Gmail SMTP
- **Cron:** node-cron

---

## 🔑 Important Files

```
backend/
├── .env                    # Configure this!
├── generate-hash.js        # Create user account
├── server.js               # Entry point
├── database/
│   └── migration_add_location.sql  # Import this!
├── jobs/noteJobs.js        # Cron jobs
└── services/emailService.js # Email templates

frontend/
├── .env                    # Configure this!
├── src/
│   ├── pages/Dashboard.jsx # Main page
│   ├── components/
│   │   ├── MonthSelector.jsx
│   │   ├── MemoryCard.jsx
│   │   └── NoteCard.jsx
│   └── context/AuthContext.jsx
```

---

## 📅 Relationship Info

- **Start Date:** 29 October 2025
- **Counter:** Auto-updates daily
- **Displayed:** Dashboard stats card

---

**Need detailed help?** See `SETUP_INSTRUCTIONS.md`

**Ready to deploy?** See `DEPLOYMENT_GUIDE.md`
