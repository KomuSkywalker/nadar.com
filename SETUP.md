# Nadar Kartvizit — Kurulum Rehberi

## Durum: ✅ Çalışıyor (localhost:3000)

## Giriş Bilgileri
| Kullanıcı | Şifre | Rol | Panel |
|-----------|-------|-----|-------|
| felix | felix2026 | Admin | /admin |
| ahmetyilmaz | demo123 | Müşteri (demo) | /dashboard |

## Bağlantılar
- **Site:** http://localhost:3000
- **Sipariş:** http://localhost:3000/order
- **Giriş:** http://localhost:3000/login
- **Demo Kartvizit:** http://localhost:3000/card/a641d030-9b18-4b0b-b878-bd9433a6918c

---

## Yeni Kurulum (Başka Makine)

### 1. PostgreSQL Kur
```bash
brew install postgresql@16
brew services start postgresql@16
createdb nadar_kartvizit
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. `.env` Dosyasını Güncelle
```env
DATABASE_URL="postgresql://KULLANICI@localhost:5432/nadar_kartvizit"
JWT_SECRET="guclu-bir-secret-key"
ADMIN_PASSWORD="felix2026"
```

### 4. Veritabanını Kur
```bash
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 5. Başlat
```bash
npm run dev
```

---

## Deploy (Vercel + Supabase)
1. [supabase.com](https://supabase.com) → New Project → PostgreSQL oluştur
2. Connection string'i `.env.local`'e yaz
3. `npx prisma db push` çalıştır
4. `seed.ts` çalıştır
5. Vercel'e deploy et, env variables ekle
