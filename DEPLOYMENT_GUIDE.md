# 🎉 Couple Album - Deployment Guide

Website untuk menyimpan kenangan dan foto bersama pasangan dengan sistem approval, timeline, dan monthly locked notes.

---

## 📋 Fitur Lengkap

✅ **Authentication & User Management**
- Login/Register dengan role (Admin/Partner)
- JWT-based authentication
- Role-based access control

✅ **Upload System**
- Admin: Upload langsung approved
- Partner: Upload perlu approval dari admin
- Support foto & video (max 100MB)
- Caption & date tagging
- Public/private toggle

✅ **Gallery & Lightbox**
- Masonry grid responsive
- Filter by type (photo/video)
- Lightbox dengan animasi smooth
- Timeline berdasarkan tanggal

✅ **Milestone Timeline**
- Catat momen penting
- Timeline view dengan connector line
- Add/Edit/Delete (admin only)
- Photo attachment

✅ **Monthly Notes (Locked)**
- Tulis pesan untuk partner
- Auto-lock sampai akhir bulan
- Unlock otomatis di akhir bulan
- Separate view untuk notes sendiri dan partner

✅ **Approval Panel (Admin)**
- Review pending uploads
- Approve/Reject dengan 1 klik
- Real-time update

✅ **Dashboard**
- Relationship days counter (dari 29 Oct 2025)
- Statistics: Total photos, videos, milestones
- Quick actions menu

✅ **Public Gallery**
- Shareable link untuk teman/keluarga
- Read-only access
- Hanya show media yang public

✅ **Download Album**
- Export selected media as ZIP
- Include captions.txt
- Filter by date/month/year

---

## 🚀 Setup Instructions

### 1️⃣ Database Setup (MySQL di Laragon)

1. Buka phpMyAdmin atau MySQL client
2. Import file: `backend/database/schema.sql`
3. Database `couple_album` akan otomatis dibuat dengan semua tables

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Edit file `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=couple_album

JWT_SECRET=ganti-dengan-secret-key-yang-aman-123456789
JWT_EXPIRE=7d

# Daftar di https://cloudinary.com (gratis)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

RELATIONSHIP_START_DATE=2025-10-29
FRONTEND_URL=http://localhost:5173
```

Run backend:
```bash
npm run dev
```

Backend akan running di: http://localhost:5000

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Edit file `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
```

Frontend akan running di: http://localhost:5173

---

## 👥 First Time Setup

1. Buka browser: http://localhost:5173
2. Register 2 akun:
   - **Admin** (Anda) - role: admin
   - **Partner** (Pacar) - role: partner

3. Login sebagai Admin untuk approve uploads dari partner

---

## 📦 Deployment ke Production

### Backend (Railway / Render)

1. **Railway** (Recommended):
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login & deploy
   railway login
   railway init
   railway up
   ```

2. Set environment variables di Railway dashboard:
   - Semua variable dari `.env`
   - `DATABASE_URL` dari Railway MySQL addon
   - `FRONTEND_URL` = URL Vercel Anda

### Frontend (Vercel)

1. Push code ke GitHub

2. Import di Vercel:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. Set environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app/api
   ```

4. Deploy!

---

## 🔧 Cloudinary Setup (Free)

1. Daftar di https://cloudinary.com
2. Free tier dapat:
   - 25GB storage
   - 25GB bandwidth/month
   - Unlimited transformations
3. Copy credentials ke `.env`

---

## 📁 Project Structure

```
album_foto/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & Upload middleware
│   ├── routes/          # API routes
│   ├── database/        # SQL schema
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # All pages
│   │   ├── utils/       # API client
│   │   └── App.jsx      # Routes
│   └── public/          # Static assets
│
└── README.md
```

---

## 🎨 Design System

**Colors:**
- Cream `#FAFAF9` - Background
- Rose `#D4A5A5` - Primary accent
- Charcoal `#1F1F1F` - Text

**Fonts:**
- Playfair Display - Headings
- Inter - Body

**Style:** Minimalist, Elegant, Clean

---

## 🔐 Security Features

- JWT token dengan expiry
- Password hashing (bcryptjs)
- CORS protection
- Input validation
- SQL injection prevention
- File type validation
- Role-based access control

---

## 📱 Responsive Design

✅ Mobile (320px - 768px)
✅ Tablet (768px - 1024px)
✅ Desktop (1024px+)

---

## 🐛 Troubleshooting

### Database Connection Failed
- Check MySQL service running di Laragon
- Pastikan credentials di `.env` benar

### Cloudinary Upload Failed
- Verify Cloudinary credentials
- Check file size (max 100MB)

### CORS Error
- Pastikan `FRONTEND_URL` di backend `.env` benar
- Backend harus running sebelum frontend

### Token Expired
- Logout dan login lagi
- Check `JWT_SECRET` konsisten

---

## 💡 Tips & Best Practices

1. **Backup Database** secara berkala
2. **Generate Strong JWT_SECRET**: `openssl rand -base64 32`
3. **Monitor Cloudinary Usage** untuk stay dalam free tier
4. **Set up HTTPS** di production
5. **Enable Vercel Analytics** untuk monitoring

---

## 📞 Support

Jika ada error atau pertanyaan:
1. Check browser console untuk error messages
2. Check backend terminal logs
3. Verify all `.env` variables
4. Make sure database tables created correctly

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Push notifications untuk unlock notes
- [ ] Email notifications
- [ ] Multiple album support
- [ ] Photo editing tools
- [ ] Comments on media
- [ ] Likes/reactions
- [ ] Share individual photos
- [ ] Print album feature
- [ ] Mobile app (React Native)

---

**Made with ❤️ for couples**

Start date: 29 Oktober 2025
Tech: React + Express + MySQL + Cloudinary
