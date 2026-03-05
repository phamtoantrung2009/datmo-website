# Hướng Dẫn Sử Dụng Hệ Thống OpenGraph (OG Images)

## 1. Giới Thiệu

Hệ thống OG Images của Datmo đã được tối ưu hóa để **tự động phát hiện** hình ảnh dựa trên đường dẫn trang. Bạn **không cần** chỉnh sửa code khi thêm trang mới.

---

## 2. Cấu Trúc Thư Mục Khuyến Nghị

```
public/
└── og/
    ├── default.png              ← OG mặc định cho website
    ├── gioi-thieu.png           ← OG cho trang /gioi-thieu/
    ├── lien-he.png              ← OG cho trang /lien-he/
    ├── thue-xe-du-lich.png      ← OG cho trang /thue-xe-du-lich/
    └── blog/
        ├── default.png           ← OG mặc định cho blog
        ├── kinh-nghiem-ha-long.png
        ├── cho-thue-xe.png
        └── ...
```

---

## 3. Quy Tắc Đặt Tên OG Image

| Loại trang | Đường dẫn trang | Tên file OG | Ví dụ |
|------------|-----------------|-------------|--------|
| **Trang chủ** | `/` | `default.png` | `/og/default.png` |
| **Trang con** | `/gioi-thieu/` | `gioi-thieu.png` | `/og/gioi-thieu.png` |
| **Trang blog** | `/blog/kinh-nghiem/` | `kinh-nghiem.png` | `/og/blog/kinh-nghiem.png` |
| **Blog category** | `/blog/cho-thue-xe/` | `cho-thue-xe.png` | `/og/blog/cho-thue-xe.png` |

### Quy tắc:
1. **Chữ thường** (lowercase)
2. **Không dấu tiếng Việt**
3. **Không có dấu cách** – dùng dấu gạch ngang `-`
4. **Định dạng**: `.png` (khuyến nghị) hoặc `.jpg`
5. **Kích thước**: 1200 x 630 pixel (tiêu chuẩn)

---

## 4. Cách Thêm OG Image Cho Trang Mới

### Bước 1: Tạo hình OG Image
- Kích thước: **1200 x 630 pixel**
- Định dạng: PNG hoặc JPG
- Nén file dưới 500KB để tối ưu tốc độ tải

### Bước 2: Lưu vào thư mục đúng

**Ví dụ 1: Thêm OG cho trang "/lien-he/"**
```
public/og/lien-he.png
```

**Ví dụ 2: Thêm OG cho bài blog "/blog/kinh-nghiem-ha-long/"**
```
public/og/blog/kinh-nghiem-ha-long.png
```

### Bước 3: Xong! (Không cần sửa code)

Hệ thống sẽ **tự động** phát hiện hình ảnh theo quy tắc:
- `/lien-he/` → tìm `/og/lien-he.png`
- `/blog/kinh-nghiem-ha-long/` → tìm `/og/blog/kinh-nghiem-ha-long.png`

---

## 5. Cách Hoạt Động (Fallback Tự Động)

### Logic xác định OG Image:

```
1. Trang /gioi-thieu/
   → Tìm /og/gioi-thieu.png
   → Nếu có → Dùng ảnh này
   → Nếu không → Dùng /og/default.png

2. Trang /blog/kinh-nghiem-ha-long/
   → Tìm /og/blog/kinh-nghiem-ha-long.png
   → Nếu có → Dùng ảnh này
   → Nếu không → Dùng /og/blog/default.png

3. Trang /blog/ (danh mục blog)
   → Tìm /og/blog/index.png
   → Nếu có → Dùng ảnh này  
   → Nếu không → Dùng /og/blog/default.png
```

### Nếu không có OG Image riêng:
- Hệ thống sẽ tự động sử dụng ảnh mặc định:
  - Trang thường: `/og/default.png`
  - Trang blog: `/og/blog/default.png`

---

## 6. Ví Dụ Thực Tế

### Ví dụ 1: Thêm trang giới thiệu mới `/about/`

1. Tạo hình 1200x630 pixel
2. Lưu tại: `public/og/about.png`
3. Xong! Không cần sửa code.

### Ví dụ 2: Thêm bài viết blog mới `/blog/du-lich-ha-long/`

1. Tạo hình 1200x630 pixel
2. Lưu tại: `public/og/blog/du-lich-ha-long.png`
3. Xong! Hệ thống tự động detect.

### Ví dụ 3: Trang không có OG riêng

Nếu bạn **không tạo** file OG riêng:
- `/about/` sẽ dùng `/og/default.png`
- `/blog/post-moi/` sẽ dùng `/og/blog/default.png`

---

## 7. Kiểm Tra OG Image

Sau khi thêm OG image, bạn có thể kiểm tra bằng:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

Nhập URL của trang và xem OG image hiển thị đúng chưa.

---

## 8. Danh Sách OG Images Hiện Có

### OG Images đang tồn tại:
- `public/og/default.png` ✅
- `public/og/thue-xe-du-lich/index.png` ✅ (file cũ - vẫn hoạt động nhưng nên đổi tên)

### OG Images cần tạo thêm (nếu muốn):
- `public/og/gioi-thieu.png` - cho trang /gioi-thieu/
- `public/og/lien-he.png` - cho trang /lien-he/
- `public/og/khach-san.png` - cho trang /khach-san/
- `public/og/visa-ho-chieu.png` - cho trang /visa-ho-chieu/
- `public/og/ve-may-bay.png` - cho trang /ve-may-bay/
- `public/og/ve-tau-cao-toc.png` - cho trang /ve-tau-cao-toc/
- `public/og/blog/default.png` - OG mặc định cho blog
- Và các trang khác...

### Lưu ý về file cũ:
File `public/og/thue-xe-du-lich/index.png` đang tồn tại nhưng không theo naming convention mới. Hệ thống mới expect file là `public/og/thue-xe-du-lich.png`. Nên đổi tên hoặc tạo file mới theo đúng convention.

---

## 9. Tóm Tắt

| Hành động | Cách làm |
|-----------|----------|
| Thêm OG cho trang mới | Tạo file tại `public/og/{slug}.png` |
| Thêm OG cho blog mới | Tạo file tại `public/og/blog/{slug}.png` |
| OG mặc định cho web | `public/og/default.png` |
| OG mặc định cho blog | `public/og/blog/default.png` |
| Sửa code | **Không cần** ✓ |

---

## 10. Mã Nguồn (Tham Khảo)

Hệ thống OG được quản lý trong file: `src/config/og.ts`

```typescript
// Cách sử dụng trong component:
import { getOgImage } from '../config/og';

// Tự động detect OG dựa trên pathname
const ogImage = getOgImage('/blog/kinh-nghiem-ha-long/');
// → /og/blog/kinh-nghiem-ha-long.png (nếu tồn tại)
// → /og/blog/default.png (nếu không tồn tại)
```

---

**Lưu ý:** Vì đây là static site (Astro), hệ thống sử dụng quy ước đặt tên để xác định OG image. Nếu file không tồn tại tại đường dẫn được xây dựng, trình duyệt/mạng xã hội sẽ sử dụng ảnh mặc định.
