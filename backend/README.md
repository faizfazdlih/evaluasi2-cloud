# Backend - Sistem Pelayanan Publik Desa/Kelurahan

Backend untuk sistem pelayanan publik desa/kelurahan menggunakan Express.js

## Setup

1. Install dependencies
```
npm install
```

2. Copy file .env.example ke .env dan sesuaikan konfigurasi database
```
cp .env.example .env
```

3. Update file .env dengan konfigurasi MySQL Anda

4. Jalankan server
```
npm start
```

Atau dengan nodemon untuk development:
```
npm run dev
```

## API Endpoints

### Auth
- POST /api/auth/register - Registrasi pengguna
- POST /api/auth/login - Login pengguna
- GET /api/auth/profile - Dapatkan profil user (memerlukan token)

### Services
- GET /api/services - Dapatkan semua layanan
- GET /api/services/:id - Dapatkan layanan berdasarkan ID
- GET /api/services/category/:category - Dapatkan layanan berdasarkan kategori
- POST /api/services - Buat layanan baru (memerlukan token)
- PUT /api/services/:id - Perbarui layanan (memerlukan token)
- DELETE /api/services/:id - Hapus layanan (memerlukan token)

### Applications
- GET /api/applications - Dapatkan semua permohonan (memerlukan token)
- GET /api/applications/my-applications - Dapatkan permohonan saya (memerlukan token)
- GET /api/applications/:id - Dapatkan permohonan berdasarkan ID (memerlukan token)
- POST /api/applications - Buat permohonan baru (memerlukan token)
- PUT /api/applications/:id - Perbarui permohonan (memerlukan token)
- DELETE /api/applications/:id - Hapus permohonan (memerlukan token)

## Database Schema

Lihat file database.sql untuk membuat tabel yang diperlukan.
