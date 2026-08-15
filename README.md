# 🎉 WEBSITE COUPLE ALBUM - READY TO USE!

Selamat! Website couple album Anda sudah berhasil dibuat dengan struktur yang rapi dan mudah di-maintain.

---

## ✅ Yang Sudah Dibuat

### **Backend (Express + MySQL + Cloudinary)**
✅ Authentication system (JWT, bcrypt)
✅ User management (Admin & Partner roles)
✅ Media upload dengan Cloudinary
✅ Approval system untuk partner uploads
✅ Milestone timeline
✅ Monthly notes dengan auto-lock system
✅ Relationship days counter
✅ Download album (ZIP)
✅ Public gallery dengan share link
✅ RESTful API dengan proper error handling

### **Frontend (React + Vite + Tailwind)**
✅ Login/Register dengan role selection
✅ Dashboard dengan statistics
✅ Gallery dengan lightbox & animations
✅ Upload page dengan preview
✅ Milestones timeline page
✅ Monthly notes page (locked/unlocked)
✅ Approval panel (admin only)
✅ Public gallery page
✅ Responsive design (mobile/tablet/desktop)
✅ Minimalist elegant design system

---

## 🚀 CARA MENJALANKAN

### 1️⃣ Setup Database
```bash
# Buka phpMyAdmin atau MySQL client di Laragon
# Import file: backend/database/schema.sql
# Database 'couple_album' akan otomatis dibuat
```

### 2️⃣ Setup Cloudinary (PENTING!)
1. Daftar di https://cloudinary.com (GRATIS)
2. Login → Dashboard
3. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Edit file `backend/.env` dan isi:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

### 3️⃣ Install Backend Dependencies (SUDAH DONE ✅)
Backend dependencies sudah terinstall!

### 4️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 5️⃣ Run Backend
```bash
cd backend
npm run dev
```
✅ Backend akan running di: **http://localhost:5000**

### 6️⃣ Run Frontend (Terminal Baru)
```bash
cd frontend
npm run dev
```
✅ Frontend akan running di: **http://localhost:5173**

---

## 👥 FIRST TIME SETUP

1. Buka browser: **http://localhost:5173**

2. **Register 2 akun**:
   
   **Akun 1 - ANDA (Admin)**
   - Username: (nama Anda)
   - Email: (email Anda)
   - Password: (password Anda)
   - Role: **Admin**
   
   **Akun 2 - PACAR (Partner)**
   - Username: (nama pacar)
   - Email: (email pacar)
   - Password: (password pacar)
   - Role: **Partner**

3. **Login sebagai Admin** untuk approve uploads dari partner

---

## 🎯 FITUR YANG BISA DICOBA

### ✅ Upload Media
- Login sebagai **Admin** → Upload foto/video → Langsung approved
- Login sebagai **Partner** → Upload foto/video → Status: Pending
- Login sebagai **Admin** → Ke Approval Panel → Approve/Reject

### ✅ Gallery
- Lihat semua foto/video yang sudah approved
- Filter by type (photo/video)
- Click untuk lightbox view

### ✅ Milestones
- Tambah milestone penting (First date, Anniversary, dll)
- Timeline view dengan connector line
- Edit/Delete (admin only)

### ✅ Monthly Notes
- Tulis pesan untuk partner
- Note akan locked sampai akhir bulan
- Partner bisa baca setelah unlock otomatis

### ✅ Dashboard
- Lihat counter: **X days together** (dari 29 Oct 2025)
- Statistics: Total photos, videos, milestones

### ✅ Public Gallery
- Admin → Settings → Copy public gallery link
- Share ke teman/keluarga (read-only)

---

## 📁 STRUKTUR FILE (RAPI & MAINTAINABLE)

```
album_foto/
├── backend/
│   ├── config/              # Database & Cloudinary config
│   ├── controllers/         # Business logic (terpisah per fitur)
│   ├── middleware/          # Auth & Upload middleware
│   ├── routes/              # API routes (terpisah per module)
│   ├── database/schema.sql  # Database schema
│   ├── .env                 # Environment variables
│   └── server.js            # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context (global state)
│   │   ├── pages/           # All pages (1 file per page)
│   │   ├── utils/           # API client & helpers
│   │   └── App.jsx          # Routes
│   ├── .env                 # Frontend env
│   └── tailwind.config.js   # Design system config
│
└── DEPLOYMENT_GUIDE.md      # Panduan lengkap deploy
```

---

## 🎨 DESIGN SYSTEM

**Colors:**
- Background: Cream `#FAFAF9`
- Primary: Rose `#D4A5A5`
- Text: Charcoal `#1F1F1F`

**Fonts:**
- Headings: Playfair Display (elegant serif)
- Body: Inter (clean sans-serif)

**Style:** Minimalist, Elegant, Romantic

---

## 🐛 TROUBLESHOOTING

### ❌ Database connection failed
**Solusi:** 
- Pastikan MySQL di Laragon sudah running (Start All)
- Import file `backend/database/schema.sql` ke MySQL

### ❌ Cloudinary upload failed
**Solusi:** 
- Daftar di cloudinary.com
- Isi credentials di `backend/.env`

### ❌ CORS Error
**Solusi:** 
- Pastikan backend running dulu sebelum frontend
- Check `FRONTEND_URL` di backend `.env` = `http://localhost:5173`

### ❌ Frontend tidak bisa connect ke backend
**Solusi:**
- Check `VITE_API_URL` di frontend `.env` = `http://localhost:5000/api`
- Restart frontend server setelah edit `.env`

---

## 📦 DEPLOYMENT KE PRODUCTION

Lihat panduan lengkap di: **DEPLOYMENT_GUIDE.md**

**Quick Steps:**
1. Backend → Railway/Render (dengan MySQL addon)
2. Frontend → Vercel
3. Set environment variables
4. Done! 🎉

---

## 🎯 NEXT STEPS

1. ✅ Import database schema
2. ✅ Setup Cloudinary credentials
3. ✅ Install frontend dependencies: `cd frontend && npm install`
4. ✅ Run backend: `cd backend && npm run dev`
5. ✅ Run frontend: `cd frontend && npm run dev`
6. ✅ Register 2 akun (Admin + Partner)
7. ✅ Mulai upload foto kenangan kalian!

---

## 💡 TIPS

- Backup database secara berkala
- Cloudinary free tier: 25GB storage (cukup untuk ribuan foto)
- Monthly notes akan auto-unlock setiap akhir bulan
- Admin bisa approve/reject semua uploads dari partner
- Public gallery link bisa di-share ke keluarga/teman

---

**Selamat menikmati website couple album Anda! ❤️**

Relationship start date: **29 Oktober 2025**
Built with: React + Express + MySQL + Cloudinary + Love 💕
