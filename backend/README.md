# Couple Album Backend API

Backend API untuk website couple photo album dengan fitur upload, approval, timeline, dan monthly notes.

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
- Buka phpMyAdmin atau MySQL client
- Import file `database/schema.sql`
- Database `couple_album` akan otomatis dibuat

### 3. Environment Variables
Copy `.env.example` ke `.env` dan isi:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=couple_album

JWT_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

RELATIONSHIP_START_DATE=2025-10-29
FRONTEND_URL=http://localhost:5173
```

### 4. Cloudinary Setup
1. Daftar di https://cloudinary.com (gratis)
2. Copy Cloud Name, API Key, API Secret
3. Paste ke `.env`

### 5. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di http://localhost:5000

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # Database connection
│   └── cloudinary.js      # Cloudinary config
├── controllers/
│   ├── authController.js  # Login, register
│   ├── mediaController.js # Upload, approval
│   ├── milestoneController.js
│   ├── noteController.js
│   └── settingsController.js
├── middleware/
│   ├── auth.js            # JWT verification
│   └── upload.js          # Multer config
├── routes/
│   ├── authRoutes.js
│   ├── mediaRoutes.js
│   ├── milestoneRoutes.js
│   ├── noteRoutes.js
│   └── settingsRoutes.js
├── database/
│   └── schema.sql         # Database schema
├── .env.example
├── package.json
└── server.js
```

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)

### Media
- `POST /api/media/upload` - Upload foto/video (protected)
- `GET /api/media/approved` - Get approved media (public)
- `GET /api/media/pending` - Get pending approval (admin only)
- `PATCH /api/media/:id/status` - Approve/reject (admin only)
- `DELETE /api/media/:id` - Delete media (protected)

### Milestones
- `POST /api/milestones` - Create milestone (protected)
- `GET /api/milestones` - Get all milestones
- `PUT /api/milestones/:id` - Update (admin only)
- `DELETE /api/milestones/:id` - Delete (admin only)

### Monthly Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes/my-notes` - Get my notes (protected)
- `GET /api/notes/partner-notes` - Get partner's unlocked notes (protected)
- `POST /api/notes/unlock` - Unlock expired notes (protected)

### Settings
- `GET /api/settings/relationship-days` - Get days counter
- `POST /api/settings/download-album` - Download selected media
- `GET /api/settings/public/:token` - Public gallery

## 🔒 Roles

- **admin**: Upload langsung approved, bisa approve/reject partner uploads
- **partner**: Upload perlu approval dari admin

## 📝 Notes

- File upload max 100MB
- Supported: JPG, PNG, GIF, MP4, MOV, AVI
- Cloudinary free tier: 25GB storage
- Monthly notes auto-unlock di akhir bulan
