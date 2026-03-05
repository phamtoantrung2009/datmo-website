# SEO-Optimized Blog Post Template

## Template chuẩn cho bài viết blog Datmo

---

```yaml
---
title: "Tiêu đề bài viết (SEOt title, 50-60 ký tự)"
description: "Mô tả ngắn cho SEO (150-160 ký tự) - chứa từ khóa chính"
publishedAt: 2026-03-05
updatedAt: 2026-03-05
category: "kinh-nghiem-du-lich"  # hoặc: tin-tuc-cam-pha, lich-tau-gia-ve, cho-thue-xe, ve-tau-cao-toc, ve-may-bay
image: "/images/blog/slug-bai-viet/hinh-dai-dien.jpg"  # optional
tags: ["tag-1", "tag-2", "tag-3"]
canonical: "https://datmo.io.vn/blog/slug-bai-viet/"  # optional - nếu bài viết được đăng ở nơi khác
draft: false
---

## Giới thiệu (Introduction)

**Mở bài hấp dẫn, có hook**

Viết 1-2 đoạn giới thiệu ngắn gọn về chủ đề bài viết. Đặt từ khóa chính trong 100 ký tự đầu tiên.

**Ví dụ:**
> Xe 16 chỗ là lựa chọn quen thuộc cho gia đình, nhóm bạn hoặc đồng nghiệp cần di chuyển từ Cẩm Phả đi các tỉnh lân cận. Bài viết dưới đây tổng hợp những thông tin thực tế nhất giúp bạn thuê xe 16 chỗ ở Cẩm Phả nhanh chóng, đúng giá.

---

## Tên phần chính (H2)

Nội dung chi tiết của phần này. Viết từng đoạn ngắn (2-4 câu) để dễ đọc.

### Tiểu phần (H3)

Chi tiết thêm nếu cần.

- Sử dụng bullet points cho danh sách
- Giúp người đọc dễ quét mắt

**In đậm** các thông tin quan trọng.

---

## Tên phần chính 2 (H2)

Tiếp theo với nội dung phần thứ 2.

### Tiểu phần 2 (H3)

Nội dung chi tiết...

---

## Tên phần chính 3 (H2)

Tiếp tục với nội dung...

---

## Câu hỏi thường gặp (FAQ)

### Câu hỏi 1?

Trả lời ngắn gọn, 1-2 câu.

### Câu hỏi 2?

Trả lời...

### Câu hỏi 3?

Trả lời...

---

## Kết luận (Conclusion)

Tóm tắt lại các điểm chính của bài viết. Kết thúc bằng CTA (Call to Action).

**Ví dụ:**
> Trên đây là những thông tin về [chủ đề]. Nếu bạn cần tư vấn thêm, liên hệ Datmo ngay hôm nay!

---

📞 **Liên hệ đặt xe:** 0911 321 578 | [Nhắn Zalo](https://zalo.me/911321578) | [Xem dịch vụ](/thue-xe-du-lich/)
```

---

## Hướng Dẫn Chi Tiết

### 1. Frontmatter Fields

| Field | Bắt buộc | Mô tả | Ví dụ |
|-------|----------|-------|-------|
| `title` | ✅ | Tiêu đề bài viết, 50-60 ký tự | "Cho thuê xe 16 chỗ Cẩm Phả – Giá, tuyến & kinh nghiệm" |
| `description` | ✅ | Mô tả SEO, 150-160 ký tự | "Hướng dẫn thuê xe 16 chỗ tại Cẩm Phả: bảng giá, các tuyến phổ biến..." |
| `publishedAt` | ✅ | Ngày đăng bài | `2026-03-05` |
| `updatedAt` | ❌ | Ngày cập nhật (nếu có) | `2026-03-10` |
| `category` | ✅ | Danh mục (chọn 1 trong enum) | `cho-thue-xe` |
| `image` | ❌ | Đường dẫn hình đại diện | `/images/blog/slug-bai/hinh-dai-dien.jpg` |
| `tags` | ❌ | Mảng tags, mặc định rỗng | `["thue-xe", "cam-pha", "quang-ninh"]` |
| `canonical` | ❌ | URL gốc (nếu bài đăng nơi khác) | `https://example.com/post` |
| `draft` | ❌ | Mặc định `false` | `true` để ẩn bài |

### 2. Category Enum (bắt buộc)

Chọn **một** trong các giá trị sau:

- `kinh-nghiem-du-lich` – Kinh nghiệm du lịch
- `tin-tuc-cam-pha` – Tin tức Cẩm Phả
- `lich-tau-gia-ve` – Lịch tàu, giá vé
- `cho-thue-xe` – Cho thuê xe
- `ve-tau-cao-toc` – Vé tàu cao tốc
- `ve-may-bay` – Vé máy bay

### 3. Best Practices cho SEO

#### Title (Tiêu đề)
- **Độ dài:** 50-60 ký tự
- **Công thức:** [Chủ đề chính] + [Từ khóa địa phương] + [Mô tả ngắn]
- **Ví dụ:** "Cho thuê xe 16 chỗ Cẩm Phả – Giá & kinh nghiệm đặt xe"

#### Description (Mô tả)
- **Độ dài:** 150-160 ký tự
- **Công thức:** Mô tả 1-2 câu, chứa từ khóa chính, có CTA nhỏ
- **Ví dụ:** "Hướng dẫn thuê xe 16 chỗ tại Cẩm Phả, Quảng Ninh: bảng giá tham khảo, các tuyến phổ biến đi Hà Nội, Hạ Long, và mẹo đặt xe tiết kiệm."

#### Heading Structure (Cấu trúc heading)
- **Chỉ dùng 1 H1** (= title trong frontmatter, KHÔNG viết thêm H1 trong content)
- **H2** cho các phần chính (2-5 phần)
- **H3** cho tiểu phần trong mỗi phần
- **KHÔNG** nhảy level (H2 → H4)

#### Internal Linking
- Link đến các trang dịch vụ liên quan: `/thue-xe-du-lich/`, `/tour-du-lich/`
- Link đến các bài blog khác cùng chủ đề
- Format: `[Text hiển thị](/duong-dan/)`

#### Image SEO
- Thêm `alt` text mô tả hình
- Đặt tên file có ý nghĩa: `xe-16-cho-cam-pha.jpg`
- Nén hình dưới 200KB

### 4. Cấu Trúc File Blog

Blog posts được lưu dạng file phẳng trong `src/content/blog/`:

```
src/content/blog/
├── kinh-nghiem-ha-long.md    # File bài viết
├── cho-thue-xe-16-cho.md
└── du-thuyen-ha-long.md
```

**Lưu ý:** Không tạo thư mục con cho mỗi bài viết - chỉ cần 1 file `.md` duy nhất.

### 5. Checklist trước khi publish

- [ ] Title 50-60 ký tự
- [ ] Description 150-160 ký tự, chứa từ khóa
- [ ] Category đúng enum
- [ ] Có ít nhất 2-3 tags
- [ ] 1 H1 (từ title), nhiều H2, H3 nếu cần
- [ ] Internal links đến trang dịch vụ
- [ ] Hình ảnh có alt text
- [ ] FAQ section (tăng SEO)
- [ ] Kết luận có CTA
- [ ] `draft: false`

---

## Gợi ý Cải Tiến Kiến Trúc Blog

### 1. Thêm Schema.org Microdata

Cân nhắc thêm JSON-LD cho Rich Snippets:

```astro
// Trong BlogPostLayout.astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "image": post.data.image,
  "datePublished": post.data.publishedAt,
  "dateModified": post.data.updatedAt
}
</script>
```

### 2. Thêm Reading Time

Cân nhắc tính reading time tự động:

```typescript
// utils/reading-time.ts
export function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### 3. Thêm Open Graph Image tự động

Nếu muốn OG image tự động theo slug (không cần tạo thủ công), có thể dùng `og-image` package của Astro.

### 4. Thêm Related Posts

Hiển thị bài viết liên quan ở cuối mỗi bài:

```astro
// Trong [slug].astro
const relatedPosts = await getCollection('blog', ({ data }) =>
  data.category === post.data.category && post.slug !== slug
).slice(0, 3);
```

---

## Copy Template

Để copy nhanh, dùng đoạn dưới đây:

```yaml
---
title: ""
description: ""
publishedAt: 2026-
category: "kinh-nghiem-du-lich"
image: "/images/blog//"
tags: []
draft: false
---

## Giới thiệu



## 

### 

---

## Câu hỏi thường gặp

### ?

?

### ?

?

---

## Kết luận



---

📞 Liên hệ: **0911 321 578** | [Nhắn Zalo](https://zalo.me/911321578)
```
