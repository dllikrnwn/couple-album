# Couple Album Frontend

Frontend aplikasi untuk website couple photo album dengan fitur upload, gallery, milestones, dan monthly notes.

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` ke `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Untuk production (Vercel), set environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend akan berjalan di http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Gallery.jsx
│   │   ├── Upload.jsx
│   │   ├── Milestones.jsx
│   │   ├── MonthlyNotes.jsx
│   │   ├── ApprovalPanel.jsx (admin only)
│   │   └── PublicGallery.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎨 Design System

### Colors
- **Cream**: `#FAFAF9` - Background
- **Rose**: `#D4A5A5` - Primary accent
- **Charcoal**: `#1F1F1F` - Text
- **Border**: `#E5E5E5` - Borders & dividers

### Fonts
- **Playfair Display** - Headings
- **Inter** - Body text

### Components
- Buttons: `.btn-primary`, `.btn-secondary`
- Cards: `.card`
- Inputs: `.input-field`

## 📱 Pages

### Public Routes
- `/login` - Login & Register
- `/public/:token` - Public gallery (shareable link)

### Protected Routes (Login Required)
- `/dashboard` - Dashboard dengan stats
- `/gallery` - Gallery foto & video dengan lightbox
- `/upload` - Upload media baru
- `/milestones` - Timeline milestone penting
- `/notes` - Monthly notes (locked sampai akhir bulan)

### Admin Only Routes
- `/approval` - Approval panel untuk review partner uploads

## 🔐 Features

### Authentication
- JWT-based authentication
- Role-based access (admin/partner)
- Protected routes
- Auto-redirect on token expiry

### Upload System
- Admin: Auto-approved
- Partner: Perlu approval
- Support foto & video
- Preview before upload
- Caption & date tagging
- Public/private toggle

### Gallery
- Masonry grid layout
- Filter by type (photo/video)
- Lightbox view
- Smooth animations (Framer Motion)

### Milestones
- Timeline view dengan line connector
- Add/Edit/Delete (admin only)
- Photo attachment support
- Date-based sorting

### Monthly Notes
- Write notes untuk partner
- Auto-lock sampai akhir bulan
- Unlock otomatis di akhir bulan
- Separate view: My Notes vs Partner Notes

### Dashboard
- Relationship days counter
- Media statistics
- Quick actions menu

## 🚀 Deployment (Vercel)

1. Push code ke GitHub repository

2. Connect ke Vercel:
   - Import repository
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. Set environment variables di Vercel:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. Deploy!

## 📦 Dependencies

- **React** - UI framework
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## 🎯 Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router v6
- Framer Motion
- Lucide Icons

## 💡 Tips

1. **Development**: Backend harus running di port 5000
2. **Images**: All images hosted di Cloudinary
3. **Responsive**: Fully responsive untuk mobile, tablet, desktop
4. **Performance**: Lazy loading & code splitting
5. **Animations**: Smooth transitions dengan Framer Motion

## 🐛 Troubleshooting

### CORS Error
Pastikan backend CORS settings sudah benar:
```js
cors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### API Connection Failed
Check `.env` file dan pastikan `VITE_API_URL` benar

### Token Expired
Logout dan login lagi untuk refresh token

---

Made with ❤️ for couples
