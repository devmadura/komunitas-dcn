# Testing Push Notifications

## 🧪 Test Notification Endpoint

Endpoint khusus untuk admin untuk test push notification tanpa harus buat event baru.

### Endpoint
```
POST /api/push/test
```

### Authentication
Memerlukan login sebagai admin dengan permission `EVENTS`.

### Request Body (Optional)
```json
{
  "title": "Custom Title",
  "message": "Custom message",
  "url": "/custom-url"
}
```

Semua field optional. Kalau tidak diisi, akan pakai default values.

### Response Success
```json
{
  "success": true,
  "message": "Test notification sent successfully",
  "sent": 5,
  "failed": 0,
  "totalSubscribers": 5,
  "invalidSubscriptions": 0
}
```

### Response Error
```json
{
  "success": false,
  "error": "Failed to send test notification",
  "details": "Error details here"
}
```

---

## 📱 Cara Test di Production

### 1. Subscribe ke Notifications
1. Buka website di browser (Chrome/Edge/Firefox)
2. Tunggu popup "Aktifkan Notifikasi" muncul (atau refresh halaman)
3. Klik **"Aktifkan"**
4. Browser akan minta permission → Klik **"Allow"**
5. Subscription tersimpan di database

### 2. Test dengan cURL
```bash
curl -X POST https://dcnunira.dev/api/push/test \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_AUTH_TOKEN" \
  -d '{
    "title": "Test Notification",
    "message": "Halo dari production!",
    "url": "/"
  }'
```

### 3. Test dengan Postman/Thunder Client
1. **Method:** POST
2. **URL:** `https://dcnunira.dev/api/push/test`
3. **Headers:**
   - `Content-Type: application/json`
   - `Cookie: auth-token=YOUR_AUTH_TOKEN`
4. **Body (JSON):**
   ```json
   {
     "title": "Test dari Postman",
     "message": "Notifikasi berhasil!",
     "url": "/dashboard"
   }
   ```

### 4. Test dengan Browser Console
```javascript
fetch('/api/push/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Test Notification',
    message: 'Testing dari console',
    url: '/'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🔍 Troubleshooting

### Notification tidak muncul?

**1. Cek Permission:**
- Browser Settings → Site Settings → Notifications
- Pastikan dcnunira.dev **Allowed**

**2. Cek Subscription:**
```sql
SELECT COUNT(*) FROM push_subscriptions;
```
Harus ada minimal 1 subscription.

**3. Cek Browser Console:**
- F12 → Console tab
- Lihat error messages

**4. Cek Service Worker:**
- F12 → Application → Service Workers
- Pastikan status: **activated and running**

**5. Cek Response dari API:**
```json
{
  "sent": 0,
  "failed": 1
}
```
Kalau `failed > 0`, ada masalah dengan VAPID keys atau subscription.

### Common Issues

**Issue: "No subscribers found"**
- **Solution:** Subscribe dulu dengan klik "Aktifkan" pada popup

**Issue: "VAPID public key not configured"**
- **Solution:** Pastikan `.env` sudah ada `NEXT_PUBLIC_VAPID_PUBLIC_KEY` dan `VAPID_PRIVATE_KEY`

**Issue: "Failed to send notification"**
- **Solution:** Cek VAPID keys valid, cek network connection

**Issue: Notification muncul tapi klik tidak redirect**
- **Solution:** Cek service worker `notificationclick` handler, pastikan URL benar

---

## ✅ Success Checklist

- [ ] Subscribe berhasil (popup muncul dan allow)
- [ ] Database ada entry di `push_subscriptions`
- [ ] Test endpoint return `sent: 1` atau lebih
- [ ] Notification muncul di browser
- [ ] Klik notification redirect ke URL yang benar
- [ ] Test di multiple devices (desktop + mobile)
- [ ] Test di multiple browsers (Chrome, Firefox, Edge)

---

## 🚀 Production Testing Flow

1. **Deploy ke production** dengan VAPID keys di environment variables
2. **Buka website** di production URL
3. **Subscribe** ke notifications
4. **Call test endpoint** via Postman/cURL
5. **Verify** notification muncul
6. **Test real scenario:** Buat event baru dengan `is_published: true`
7. **Verify** notification muncul untuk event baru

---

## 📊 Monitoring

Untuk monitoring di production, cek:

1. **Subscription Count:**
   ```sql
   SELECT COUNT(*) as total_subscribers FROM push_subscriptions;
   ```

2. **Recent Subscriptions:**
   ```sql
   SELECT * FROM push_subscriptions 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Server Logs:**
   - Cek console logs untuk "Push notification sent: X success, Y failed"
   - Cek error logs untuk failed notifications

---

## 🔐 Security Notes

- ✅ Endpoint hanya bisa diakses oleh admin (require `EVENTS` permission)
- ✅ VAPID private key tidak pernah exposed ke frontend
- ✅ Invalid subscriptions otomatis di-cleanup
- ✅ Notification sending tidak block event creation (try-catch)
