# Hướng Dẫn Quản Lý Website Datmo

> Website: https://datmo.io.vn  
> Deploy: GitHub → Cloudflare Pages  
> Công nghệ: Astro 5.x

---

## 1. Cấu Trúc Project

### Thư mục quan trọng

| Thư mục | Mục đích |
|---------|----------|
| `src/pages/` | Chứa các trang web (route). Mỗi file `.astro` là một trang. |
| `src/components/` | Chứa các component tái sử dụng (header, footer, form,...) |
| `src/content/blog/` | Chứa các bài viết blog dạng Markdown |
| `src/layouts/` | Chứa layout chung (BaseLayout, BlogPostLayout) |
| `src/config/` | Cấu hình website (site.ts, og.ts) |
| `src/styles/` | File CSS chung (global.css) |
| `public/` | Thư mục chứa file tĩnh: logo, favicon, OG images |
| `public/og/` | Thư mục chứa hình ảnh chia sẻ mạng xã hội (OpenGraph) |

---

## 2. Cách Thêm Bài Viết Blog Mới

### Quy tắc đặt tên file (Slug)

**Rất quan trọng:** Tên file blog phải tuân theo format SEO:

- Chỉ dùng **chữ thường** (lowercase)
- Không dấu tiếng Việt
- Các từ cách nhau bằng dấu gạch ngang `-`
- Không có dấu cách (space)

**Ví dụ đúng:**

- `kinh-nghiem-thue-xe-ha-long.md`
- `gia-thue-xe-16-cho-quang-ninh.md`
- `du-thuyen-ha-long-gia-re.md`

**Ví dụ sai:**

- `Kinh nghiệm du lịch.md`
- `xe 16 chỗ.md`
- `Du-lịch-Hạ-Long.md`

**Tại sao nên làm vậy?**

- URL đẹp và thân thiện với Google: `datmo.io.vn/blog/kinh-nghiem-thue-xe-ha-long/`
- Không bị lỗi khi copy link
- Tốt cho SEO (Search Engine Optimization)

### Bước 1: Tạo file Markdown mới

Vào thư mục `src/content/blog/`, tạo file mới theo quy tắc slug ở trên:

```
kinh-nghiem-ha-long.md
```

### Bước 2: Thêm frontmatter (metadata)

Đặt đoạn này ở đầu file, giữa dấu `---`:

```yaml
---
title: "Tiêu đề bài viết hiển thị trên trình duyệt"
description: "Mô tả ngắn cho SEO (khoảng 150-160 ký tự)"
publishedAt: 2026-03-05
category: "cho-thue-xe"  # hoặc: kinh-nghiem, tin-tuc, du-thuyen, ...
tags: ["tag1", "tag2", "tag3"]
draft: false  # true nếu muốn ẩn bài viết
---
```

### Bước 3: Viết nội dung

Viết nội dung bình thường bằng Markdown. Ví dụ:

```markdown
## Tiêu đề phụ

Đây là đoạn văn.

- Danh sách item 1
- Danh sách item 2

[Liên kết](/thue-xe-du-lich/)
```

### Template mẫu đầy đủ

```yaml
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn cho SEO và hiển thị khi chia sẻ link"
publishedAt: 2026-03-05
category: "cho-thue-xe"
tags: ["thue-xe", "cam-pha", "quang-ninh"]
draft: false
---

## Giới thiệu

Nội dung bài viết...

## Mục 1

Nội dung...

## Kết luận

Nội dung kết luận...

---

📞 Liên hệ: **0911 321 578**
```

---

## 3. Cách Chèn Hình Ảnh Vào Bài Viết

### Cấu trúc thư mục hình ảnh

**Quan trọng:** Mỗi bài viết nên có **thư mục riêng** để tránh xung đột tên file.

```
public/
└── images/
    └── blog/
        └── kinh-nghiem-ha-long/
            ├── image-1.jpg
            └── image-2.jpg
```

Tên thư mục phải **giống tên file blog** (slug).

### Bước 1: Lưu hình vào thư mục riêng

1. Tạo thư mục mới trong `public/images/blog/` với tên = slug bài viết
2. Copy hình vào thư mục đó

**Ví dụ:** Bài viết `kinh-nghiem-ha-long.md` → thư mục `public/images/blog/kinh-nghiem-ha-long/`

### Bước 2: Chèn vào bài viết

Dùng đường dẫn bắt đầu bằng `/`:

```markdown
![Mô tả hình ảnh](/images/blog/kinh-nghiem-ha-long/image-1.jpg)
```

**Ví dụ đầy đủ:**

```markdown
## Hình ảnh xe

![Xe Hyundai Solati 16 chỗ](/images/blog/kinh-nghiem-ha-long/xe-16-cho.jpg)

![Du thuyền Hạ Long](/images/blog/kinh-nghiem-ha-long/du-thuyen.jpg)
```

### Lưu ý về hình ảnh

- **Định dạng:** Nên dùng `.jpg` hoặc `.webp` để tối ưu tốc độ
- **Kích thước:** Nên nén về dưới 200KB mỗi hình
- **Tên file:** Dùng tiếng Việt không dấu, cách nhau bằng dấu gạch ngang
  - ✅ `xe-16-cho-cam-pha.jpg`
  - ❌ `xe 16 chỗ.jpg`

---

## 4. Cách Thêm Hình Ảnh OpenGraph (OG Image)

### OpenGraph là gì?

Là hình hiển thị khi bạn chia sẻ link lên Facebook, Zalo, Twitter.

### Nơi lưu hình OG

Tất cả hình OG lưu trong `public/og/blog/`.

### Cách thêm OG cho bài blog (KHÔNG cần sửa code)

**Bước 1:** Tạo hình OG cho bài viết

- Kích thước khuyến nghị: **1200 x 630 pixel**
- Format: `.png`
- Đặt tên = slug bài viết (không cần thêm đường dẫn trong code)

**Bước 2:** Lưu vào `public/og/blog/`

```
public/og/blog/
├── default.png                        # Hình mặc định
└── kinh-nghiem-ha-long.png           # OG cho bài viết cụ thể
```

**Bước 3:** Xong! Không cần sửa gì thêm.

Hệ thống sẽ tự động tìm hình OG theo slug:

- Bài `kinh-nghiem-ha-long.md` → tự tìm `/og/blog/kinh-nghiem-ha-long.png`
- Nếu không có → dùng `/og/blog/default.png`

### Cách OG hoạt động (tự động)

1. Khi một bài viết được chia sẻ, hệ thống sẽ tìm hình OG theo slug: `/og/blog/{slug}.png`
2. Nếu file không tồn tại → dùng `/og/blog/default.png`
3. Nếu default cũng không có → dùng `og.png` ở thư mục gốc `public/`

---

## 5. Cấu Trúc Thư Mục Hình Ảnh Khuyến Nghị

```
public/
├── images/
│   └── blog/
│       ├── kinh-nghiem-ha-long/
│       │   ├── hinh-1.jpg
│       │   └── hinh-2.jpg
│       └── du-thuyen-ha-long/
│           └── thuyen.jpg
├── og/
│   ├── default.png
│   ├── blog/
│   │   ├── default.png
│   │   ├── kinh-nghiem-ha-long.png
│   │   └── du-thuyen-ha-long.png
│   └── thue-xe-du-lich/
│       └── index.png
├── favicon.svg
├── logo.png
└── og.png
```

---

## 6. Cách Deploy Thay Đổi Lên Website

### Bước 1: Chỉnh sửa local

Thực hiện các thay đổi trên máy tính của bạn (thêm bài viết, sửa nội dung, thêm hình).

### Bước 2: Commit thay đổi

Mở terminal tại thư mục project, chạy:

```bash
git add .
git commit -m "Thêm bài viết mới: Tên bài viết"
```

### Bước 3: Push lên GitHub

```bash
git push origin main
```

### Bước 4: Chờ Cloudflare deploy

- Cloudflare Pages sẽ tự động build và deploy sau khi nhận được code mới
- Thời gian: khoảng **1-3 phút**
- Kiểm tra trạng thái: vào Cloudflare Dashboard → Pages → datmo-website

### Bước 5: Kiểm tra website

- Vào https://datmo.io.vn để xem kết quả
- Nếu có lỗi, xem log build trong Cloudflare Pages

---

## 7. Các Lỗi Thường Gặp Cần Tránh

### ❌ Đặt hình sai thư mục

- **Sai:** `src/images/blog/hinh.jpg` (Astro không serve được)
- **Đúng:** `public/images/blog/hinh.jpg`

### ❌ Quên frontmatter bắt buộc

Mỗi bài viết phải có:
- `title`
- `description`
- `publishedAt`

Thiếu sẽ gây lỗi build.

### ❌ Đường dẫn hình sai

```markdown
<!-- Sai -->
![Hình](/src/images/abc.jpg)

<!-- Đúng -->
![Hình](/images/blog/ten-bai/hinh.jpg)
```

### ❌ Đặt tên file blog không đúng quy tắc

```markdown
<!-- Sai -->
Kinh nghiệm du lịch.md
xe 16 chỗ.md

<!-- Đúng -->
kinh-nghiem-du-lich.md
xe-16-cho-cam-pha.md
```

### ❌ Để draft: true khi muốn publish

```yaml
# Bài sẽ không hiển thị
draft: true
```

---

## 8. Checklist Đăng Bài Blog Mới

- [ ] Đặt tên file theo slug (ví dụ: `kinh-nghiem-ha-long.md`)
- [ ] Tạo thư mục hình trong `public/images/blog/{slug}/`
- [ ] Thêm frontmatter đầy đủ (title, description, publishedAt, category, tags)
- [ ] Viết nội dung bài viết
- [ ] Thêm hình ảnh vào thư mục riêng
- [ ] Chèn hình vào bài viết
- [ ] Tạo OG image (1200x630px) và lưu vào `public/og/blog/{slug}.png`
- [ ] Kiểm tra đường dẫn hình ảnh
- [ ] Commit và push lên GitHub
- [ ] Chờ deploy (1-3 phút)
- [ ] Kiểm tra website https://datmo.io.vn

---

## 9. Tóm Tắt Nhanh

| Task | Location |
|------|----------|
| Tạo bài viết mới | `src/content/blog/{slug}.md` |
| Thêm hình nội dung | `public/images/blog/{slug}/` |
| Thêm OG image | `public/og/blog/{slug}.png` |
| Deploy | `git push` → Cloudflare tự deploy |

---

## 10. Thông Tin Hỗ Trợ

- **Website:** https://datmo.io.vn
- **GitHub:** Kiểm tra repo của bạn
- **Cloudflare:** https://dash.cloudflare.com

Nếu cần hỗ trợ kỹ thuật, liên hệ người quản lý hoặc developer đã setup hệ thống này.
