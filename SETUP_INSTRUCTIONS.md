# 🚀 SETUP INSTRUCTIONS - Couple Album

Follow these steps to get your couple album website running!

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Database Setup**

1. **Start Laragon** (make sure MySQL is running)

2. **Open phpMyAdmin:**
   - Click Laragon → Database → phpMyAdmin
   - Or visit: http://localhost/phpmyadmin

3. **Import Database Schema:**
   - Click "Import" tab
   - Click "Choose File"
   - Select: `C:\laragon\www\album_foto\backend\database\migration_add_location.sql`
   - Click "Import" button
   - ✅ Database `couple_album` created with all tables

---

### **STEP 2: Create User Account**

1. **Generate Password Hash:**
   ```bash
   cd C:\laragon\www\album_foto\backend
   node generate-hash.js
   ```
   
2. **Edit generate-hash.js first:**
   - Open `backend/generate-hash.js`
   - Change `PASSWORD_HERE` to actual password
   - Change `Partner Name` to actual name
   - Change `partner@example.com` to actual email
   - Save file

3. **Run the script:**
   ```bash
   node generate-hash.js
   ```

4. **Copy the SQL output** and run it in phpMyAdmin SQL tab

5. **DELETE generate-hash.js** after use (contains password!)

---

### **STEP 3: Configure Cloudinary**

1. **Sign up for Cloudinary:**
   - Visit: https://cloudinary.com/users/register_free
   - Create free account
   - Verify email

2. **Get Credentials:**
   - Login to Cloudinary Dashboard
   - Copy these 3 values:
     - Cloud Name
     - API Key
     - API Secret

3. **Update Backend .env:**
   - Open `backend/.env`
   - Replace:
     ```
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     ```
   - Save file

---

### **STEP 4: Configure Email Notifications**

1. **Enable Gmail App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Login with your Gmail
   - Generate "App Password" for "Mail"
   - Copy the 16-character password

2. **Update Backend .env:**
   - Open `backend/.env`
   - Replace:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-16-char-app-password
     ```
   - Save file

---

### **STEP 5: Install Backend Dependencies**

```bash
cd C:\laragon\www\album_foto\backend
npm install
```

✅ All backend packages installed

---

### **STEP 6: Install Frontend Dependencies**

```bash
cd C:\laragon\www\album_foto\frontend
npm install
```

✅ All frontend packages installed

---

### **STEP 7: Start Backend Server**

```bash
cd C:\laragon\www\album_foto\backend
npm run dev
```

✅ Backend running at: http://localhost:5000

**Keep this terminal window open!**

---

### **STEP 8: Start Frontend Server**

**Open NEW terminal window:**

```bash
cd C:\laragon\www\album_foto\frontend
npm run dev
```

✅ Frontend running at: http://localhost:5173

**Keep this terminal window open!**

---

### **STEP 9: Access Website**

1. **Open browser:** http://localhost:5173

2. **Login with:**
   - Email: (email you created in Step 2)
   - Password: (password you created in Step 2)

3. **Start using the website!** 🎉

---

## ✨ FEATURES TO TRY

### **✅ Upload Photos/Videos**
- Go to Upload page
- Select photo/video
- Add caption
- Add location (e.g., "Ancol Beach, Jakarta")
- Select date
- Upload!

### **✅ View Monthly Dashboard**
- Dashboard shows current month by default
- Use month selector to switch months
- See featured photo + 6 recent photos
- View monthly notes

### **✅ Write Monthly Notes**
- Go to Notes page
- Write note for current month
- Note will be locked until end of month
- Partner can read after unlock

### **✅ Add Milestones**
- Go to Milestones page
- Add important moments (first date, anniversary, etc.)
- Timeline view with photos

### **✅ Guest Access**
- Anyone can visit http://localhost:5173
- No login needed to view
- Can see photos, milestones, unlocked notes
- Cannot upload or write notes

---

## 🔧 TROUBLESHOOTING

### **❌ Database Connection Failed**
**Solution:**
- Check MySQL is running in Laragon
- Check database name in `.env` is `couple_album`

### **❌ Cloudinary Upload Failed**
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check internet connection

### **❌ Email Not Sending**
**Solution:**
- Verify Gmail app password in `.env`
- Check if Gmail account has 2FA enabled
- Try sending test email manually

### **❌ Frontend Cannot Connect to Backend**
**Solution:**
- Check backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env` is `http://localhost:5000/api`

---

## 📧 EMAIL NOTIFICATIONS

**Automatic emails will be sent for:**

1. **Note Unlocked** (end of month, 9 AM next day)
   - Both users receive email when monthly notes unlock

2. **Reminder to Write** (3 days before end of month, 9 AM)
   - Only sent to users who haven't written note yet

**Email Schedule:**
- Unlock check: Every hour
- Reminder check: Daily at 9 AM

---

## 🎯 IMPORTANT NOTES

### **Single User System:**
- Only ONE user can login (pacar account)
- Everyone else can view as guest (no login needed)
- No registration page

### **Auto-Approve:**
- All uploads are automatically approved
- No approval system needed

### **Monthly Notes Privacy:**
- You can always read your own notes
- Partner's notes are locked until end of month
- Guest can only see unlocked notes

### **Date Flexibility:**
- When uploading, you can select ANY date
- Good for uploading old photos with correct dates

---

## 🚀 DEPLOYMENT (Optional - For Production)

### **Backend → Railway/Render**
- Create account on Railway
- Connect GitHub repo
- Add MySQL database addon
- Set all environment variables
- Deploy!

### **Frontend → Vercel**
- Create account on Vercel
- Import GitHub repo
- Set `VITE_API_URL` to backend URL
- Deploy!

**Detailed deployment guide:** See `DEPLOYMENT_GUIDE.md`

---

## 📝 SUMMARY CHECKLIST

- [ ] Database created (Step 1)
- [ ] User account created (Step 2)
- [ ] Cloudinary configured (Step 3)
- [ ] Email configured (Step 4)
- [ ] Backend dependencies installed (Step 5)
- [ ] Frontend dependencies installed (Step 6)
- [ ] Backend server running (Step 7)
- [ ] Frontend server running (Step 8)
- [ ] Successfully logged in (Step 9)

---

**🎉 Congratulations! Your couple album is ready!**

Relationship Start Date: **29 October 2025**
Built with: React + Express + MySQL + Cloudinary
Features: Monthly Showcase, Location Tracking, Locked Notes, Guest Access

**Enjoy creating memories together! ❤️**
