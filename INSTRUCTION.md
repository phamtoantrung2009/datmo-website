# 📘 Hướng Dẫn Dự Án Datmo Website

> Tài liệu kỹ thuật cho developer维护 dự án website Datmo.io.vn

---

## 1. Tổng Quan Dự Án

### 1.1 Mục đích
Website giới thiệu dịch vụ du lịch & vận chuyển tại Cẩm Phả, Quảng Ninh. Các dịch vụ chính:
- Thuê xe du lịch (16–45 chỗ)
- Tour du lịch (trong nước & quốc tế)
- Vé tàu cao tốc (Ao Tiên/Vũng Đục → Cô Tô, Quan Lạn)
- Vé máy bay
- Khách sạn
- Visa – Hộ chiếu

### 1.2 Công nghệ sử dụng

| Công nghệ | Phiên bản | Ghi chú |
|-----------|------------|----------|
| **Astro** | 5.17.x | Static Site Generator |
| **TypeScript** | - | Type-safe |
| **@astrojs/sitemap** | 3.7.0 | SEO sitemap |

### 1.3 Cấu trúc thư mục

```
datmo-website/
├── public/                    # Static assets
│   ├── og/                   # OpenGraph images (1200x630px)
│   ├── favicon.svg           # Favicon
│   ├── logo.png              # Logo (360x104px)
│   └── robots.txt             # SEO robots.txt
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Breadcrumbs.astro
│   │   ├── CallToActions.astro
│   │   ├── ContactForm.astro
│   │   ├── FAQ.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── JsonLd.astro      # Schema.org JSON-LD component
│   │   ├── Pagination.astro  # Blog pagination
│   │   ├── QuoteForm.astro   # Báo giá form
│   │   └── ServiceCards.astro
│   ├── config/               # Site configuration
│   │   ├── og.ts            # OpenGraph image paths
│   │   └── site.ts          # Site metadata (SEO config)
│   ├── content/
│   │   └── blog/            # Blog posts (Markdown)
│   ├── data/
│   │   └── vietnam-provinces.json  # Province/district data for forms
│   ├── layouts/
│   │   ├── BaseLayout.astro # Main layout with SEO
│   │   └── BlogPostLayout.astro
│   ├── pages/                # Routes (file-based routing)
│   │   ├── index.astro      # Trang chủ
│   │   ├── 404.astro
│   │   ├── blog/
│   │   │   ├── index.astro      # Blog list (8 bài mới nhất)
│   │   │   ├── archive/          # Tất cả bài viết
│   │   │   ├── [slug].astro     # Chi tiết bài blog
│   │   │   ├── page/[page].astro # Pagination /blog/page/2/
│   │   │   └── */                   # Category pages
│   │   ├── thue-xe-du-lich/
│   │   ├── tour-du-lich/
│   │   ├── ve-tau-cao-toc/
│   │   ├── ve-may-bay/
│   │   ├── khach-san/
│   │   ├── visa-ho-chieu/
│   │   └── gioi-thieu/
│   │   └── lien-he/
│   ├── styles/
│   │   └── global.css       # Global styles
│   └── utils/
│       └── schema.ts        # Schema.org helpers
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 2. Cài Đặt và Chạy Dự Án

### 2.1 Yêu cầu
- **Node.js** >= 18.x (khuyên dùng LTS)
- **npm** >= 9.x

### 2.2 Cài đặt

```bash
# Clone repository (nếu chưa có)
git clone https://github.com/phamtoantrung2009/datmo-website.git
cd datmo-website

# Cài đặt dependencies
npm install
```

### 2.3 Chạy local

```bash
# Development server
npm run dev
# Truy cập: http://localhost:4321

# Preview production build
npm run preview
```

### 2.4 Build production

```bash
npm run build
# Output: dist/
```

### 2.5 Deployment (Cloudflare Pages)

Dự án đã được cấu hình tự động deploy qua GitHub Actions khi push lên branch `main`.

**Workflow:**
1. Push code lên GitHub: `git push origin main`
2. Cloudflare Pages tự động build
3. Deploy sau ~1-2 phút

**Manual deploy (nếu cần):**
```bash
# Cài wrangler
npm install -g wrangler

# Deploy
npx wrangler pages deploy dist
```

---

## 3. Cấu Trúc Routing

### 3.1 Nguyên tắc cơ bản

Astro sử dụng **file-based routing**. Mỗi file `.astro` trong `src/pages/` tương ứng với một URL.

| File | URL |
|------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/lien-he/index.astro` | `/lien-he/` |
| `src/pages/blog/[slug].astro` | `/blog/:slug` |

### 3.2 Dynamic Routes

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

### 3.3 Cách thêm trang mới

**Ví dụ: Thêm trang `/khuyen-mai/`**

1. Tạo file: `src/pages/khuyen-mai/index.astro`
2. Sử dụng BaseLayout:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';

const title = 'Khuyến mãi | Datmo';
const description = 'Các chương trình khuyến mãi từ Datmo.';

const crumbs = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Khuyến mãi', href: '/khuyen-mai/' },
];
---
<BaseLayout title={title} description={description} breadcrumb={crumbs}>
  <Breadcrumbs items={crumbs} />
  <section class="container section">
    <h1>{title}</h1>
    <!-- Nội dung -->
  </section>
</BaseLayout>
```

---

## 4. Hệ Thống Blog

### 4.1 Kiến trúc

| Thông số | Giá trị |
|----------|----------|
| **Render mode** | SSG (Static Site Generation) |
| **Content source** | Markdown files trong `src/content/blog/` |
| **Build time** | Tất cả bài được render thành HTML tại thời điểm build |

### 4.2 Dữ liệu blog

**Nơi lưu:** `src/content/blog/*.md`

**Frontmatter schema:**

```yaml
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn (SEO description)"
publishedAt: 2026-02-02
category: "lich-tau-gia-ve"  # Enum: kinh-nghiem-du-lich | tin-tuc-cam-pha | lich-tau-gia-ve | cho-thue-xe | ve-tau-cao-toc | ve-may-bay
image: "/images/blog/ten-anh.jpg"  # Optional
tags: ["tag1", "tag2"]           # Optional
canonical: "https://..."         # Optional
draft: false                    # Optional (hidden nếu true)
---
```

### 4.3 Cách thêm bài blog mới

**Bước 1: Tạo file Markdown**

Tạo file tại: `src/content/blog/ten-bai-viet.md`

```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn cho SEO (150-160 ký tự)"
publishedAt: 2026-03-04
category: "kinh-nghiem-du-lich"
tags: ["du-lich", "cam-pha"]
image: "/images/blog/ten-anh.jpg"
---

## Tiêu đề H2

Nội dung bài viết...

### Tiêu đề H3

Nội dung...
```

**Bước 2: Tuân thủ naming convention**

- Tên file: kebab-case (viết thường, dùng gạch ngang)
- Ví dụ: `kinh-nghiem-du-lich-co-to-2026.md`

**Bước 3: Build lại**

```bash
npm run build
git add .
git commit -m "Add: new blog post"
git push
```

### 4.4 Pagination

| Trang | URL | Số bài |
|-------|-----|--------|
| Blog chính | `/blog/` | 8 bài mới nhất |
| Trang phân trang | `/blog/page/2/` | 8 bài |
| Archive | `/blog/archive/` | 50 bài/trang |

**Tự động:**
- Khi thêm bài mới, pagination tự cập nhật
- Không cần config thêm

---

## 5. Hình Ảnh

### 5.1 Vị trí lưu ảnh

| Loại | Đường dẫn | Kích thước đề nghị |
|------|------------|----------------------|
| Logo | `public/logo.png` | 360x104px |
| OG Image (default) | `public/og.png` | 1200x630px |
| OG Image (page) | `public/og/{page}/{file}.png` | 1200x630px |
| Blog images | `public/images/blog/*.jpg` | 1200x675px (16:9) |

### 5.2 Thêm OG Image cho trang mới

**Cách 1: Thêm vào config (khuyên dùng)**

Edit `src/config/og.ts`:

```typescript
export const OG = {
  // ...existing pages...
  pages: {
    // ...existing entries...
    '/khuyen-mai/': `${SITE.url}/og/khuyen-mai.png`,
  },
};
```

**Cách 2: Truyền prop trực tiếp**

```astro
---
const ogImage = `${SITE.url}/og/khuyen-mai.png`;
---
<BaseLayout title={title} description={description} ogImage={ogImage}>
```

### 5.3 Thêm hình vào bài blog

```markdown
![Mô tả ảnh](/images/blog/ten-anh.jpg)
```

**Tối ưu:**
- Sử dụng WebP hoặc JPG nén
- Kích thước tối đa 200KB/ảnh
- Lazy loading: Astro tự động lazy load các ảnh trong markdown

---

## 6. Cấu Hình SEO

### 6.1 SEO có sẵn

| Thành phần | Trạng thái |
|------------|-------------|
| `<title>` | ✅ Tự động |
| Meta description | ✅ Từ props |
| Canonical URL | ✅ Tự động |
| Open Graph | ✅ Từ BaseLayout props |
| Twitter Card | ✅ Tự động |
| Schema.org (Organization, WebSite) | ✅ Tự động |
| BreadcrumbList Schema | ✅ Từ breadcrumb prop |
| Sitemap | ✅ Tự động (48 URLs) |
| robots.txt | ✅ Có sẵn |

### 6.2 SEO cho từng trang

**Trang thường:**

```astro
---
const title = 'Tiêu đề | Datmo';
const description = 'Mô tả cho SEO...';
const crumbs = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Tên trang', href: '/ten-trang/' },
];
---
<BaseLayout title={title} description={description} breadcrumb={crumbs}>
```

**Trang blog:**

```astro
---
// [slug].astro đã tự động thêm:
- ogType="article"
- article:published_time
- article:modified_time
- article:section
- BlogPosting schema
```

### 6.3 Local SEO (Geo Metadata)

BaseLayout tự động thêm:

```html
<meta name="geo.region" content="VN-QN">
<meta name="geo.placename" content="Cẩm Phả, Quảng Ninh">
<meta name="geo.position" content="21.01;107.31">
<meta name="ICBM" content="21.01, 107.31">
```

---

## 7. Các Điểm Quan Trọng

### 7.1 SEO

- ✅ Sitemap tự động generate với `lastmod`
- ✅ Canonical URLs cho mọi trang
- ✅ Breadcrumb schema cho tất cả trang
- ✅ Open Graph images cho từng trang (cấu hình trong `src/config/og.ts`)
- ✅ Schema.org đầy đủ (Organization, WebSite, BlogPosting)
- ⚠️ **Nên thêm**: Structured Data cho LocalBusiness (nếu muốn Google hiển thị thông tin doanh nghiệp trong SERP)

### 7.2 Performance

| Metric | Status | Ghi chú |
|--------|--------|----------|
| JS bundle | ✅ Tốt | Không có JS nặng |
| CSS | ✅ Tốt | 6KB (inline critical) |
| Images | ⚠️ Cần tối ưu | OG images là 300KB - nén lại |
| Font loading | ⚠️ System fonts | Không có custom fonts |

**Khuyến nghị:**
- Nén OG images xuống 100-150KB
- Sử dụng WebP format
- Thêm `loading="lazy"` cho ảnh dưới fold

### 7.3 Caching

Cloudflare đã tự động cache. Nếu cần purge:

1. Vào https://dash.cloudflare.com
2. Chọn domain **datmo.io.vn**
3. Caching → Configuration → Purge Everything

### 7.4 Deployment

| Phương thức | Status |
|-------------|--------|
| GitHub Push → Cloudflare Pages | ✅ Đang sử dụng |
| Manual wrangler | Cần cấu hình token |

### 7.5 Các lỗi dễ gặp

| Lỗi | Nguyên nhân | Cách fix |
|------|-------------|----------|
| Font Tiếng Việt hiển thị sai | Encoding file Markdown không đúng UTF-8 | Đảm bảo file .md lưu là UTF-8 |
| 404 trang mới | Chưa build sau khi thêm trang | Chạy `npm run build` |
| Sitemap không cập nhật | Cache Cloudflare | Purge cache |
| Hình không hiển thị | Sai đường dẫn | Kiểm tra `public/` vs `/images/` |

### 7.6 Best Practices

1. **Tuân thủ naming convention:**
   - File: `kebab-case-ten-bai.md`
   - Folder: `kebab-case-ten-folder/`

2. **SEO checklist trước khi commit:**
   - [ ] Title < 60 ký tự
   - [ ] Description 150-160 ký tự
   - [ ] OG image 1200x630px
   - [ ] Breadcrumb đúng cấu trúc

3. **Git workflow:**
   ```bash
   git add .
   git commit -m "Add: mô tả ngắn"
   git push origin main
   ```

4. **Test local trước khi push:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 8. Điểm Cần Cải Thiện

### 8.1 Ưu tiên cao

| Vấn đề | Đề xuất |
|---------|----------|
| OG Images (300KB) | Nén xuống 100-150KB, dùng WebP |
| Không có analytics | Thêm Google Analytics hoặc Plausible |
| Không có sitemap cho blog categories | Thêm dynamic sitemap |

### 8.2 Ưu tiên trung bình

| Vấn đề | Đề xuất |
|---------|----------|
| Chưa có RSS feed | Thêm `@astrojs/rss` |
| Form data inline trong HTML | Chuyển provinces JSON ra file riêng, lazy load |
| Không có error tracking | Thêm Sentry hoặc similar |

### 8.3 Ưu tiên thấp

- Thêm more OG images cho blog categories
- Dark mode
- Thêm search cho blog

---

## 9. Cấu Hình Nâng Cao

### 9.1 Thêm biến môi trường

Tạo `.env` (không commit):

```bash
# Public variables (có thể dùng trong code)
PUBLIC_SITE_URL=https://datmo.io.vn
```

### 9.2 Custom domain

Cloudflare Pages → Custom domains → Add domain

### 9.3 Analytics

**Google Analytics 4:**

Thêm vào `src/layouts/BaseLayout.astro` trước `</head>`:

```astro
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 10. Liên Hệ Hỗ Trợ

- **Email:** ctcpdulich.datmo@gmail.com
- **GitHub Issues:** https://github.com/phamtoantrung2009/datmo-website/issues

---

*Document version: 1.0*
*Last updated: 2026-03-04*
