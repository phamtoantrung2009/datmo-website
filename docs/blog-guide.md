# 📖 Hướng Dẫn Quản Lý Blog (Thêm / Xoá Bài Viết)

Hệ thống blog của website Datmo hiện tại đang chạy trên chuẩn **Astro Content Collections**. Quản lý rất dễ dàng chỉ qua việc tạo và sửa các file Markdown (`.md`).

---

## 📂 Nơi lưu trữ bài viết
Toàn bộ các bài viết blog được lưu ở một thư mục duy nhất:
👉 **Đường dẫn:** `d:\datmo-website\src\content\blog\`

Bạn sẽ thấy có sẵn nhiều file `.md` tại đây (vd: `cam-nang-du-lich-dao-co-to-2026.md`). Tên file (lược bỏ đuôi `.md`) sẽ chính là đường dẫn URL của bài viết. (Ví dụ file trên sẽ thành đường dẫn `datmo.io.vn/blog/cam-nang-du-lich-dao-co-to-2026/`).

---

## ✍️ Cách THÊM (Viết Mới) một bài Blog

Để viết một bài mới, bạn chỉ cần tạo một file `.md` mới trong thư mục `src/content/blog/` và làm theo cấu trúc 2 phần sau:

### Phần 1: Frontmatter (Cấu hình hiển thị)
Bất kỳ file bài viết nào cũng PHẢI bắt đầu bằng cụm thông tin được bọc giữa hai rào xoẹt `---` gọi là **Frontmatter**. 

Mẫu chuẩn chuẩn bị sẵn cho bạn copy:

```markdown
---
title: "Kinh nghiệm du lịch Cô Tô 3 ngày 2 đêm tự túc"
description: "Chia sẻ chi tiết lịch trình, chi phí, ăn ở và phương tiện di chuyển khi đi du lịch đảo Cô Tô xuất phát từ Cẩm Phả."
publishedAt: 2026-04-15
category: "kinh-nghiem-du-lich"
image: "/images/blog/co-to-view.webp"
tags: ["Cô Tô", "Du lịch biển", "Cẩm Phả"]
draft: false
---
```

> [!IMPORTANT]
> **Giải thích các trường:**
> - `title`: Tiêu đề bài viết (hiển thị trên thẻ bài viết và Thẻ H1).
> - `description`: Mô tả ngắn gọn (Rất quan trọng cho SEO và phần tóm tắt).
> - `publishedAt`: Ngày xuất bản (Định dạng YYYY-MM-DD).
> - `category`: Bắt buộc phải là 1 trong các chữ sau để vào đúng phần danh mục: `"kinh-nghiem-du-lich"`, `"tin-tuc-cam-pha"`, `"lich-tau-gia-ve"`, `"cho-thue-xe"`, `"ve-tau-cao-toc"`, `"ve-may-bay"`.
> - `image`: Đường dẫn ảnh bìa của bài (Ảnh phải đưa vào mục `public/images/blog/`). Có thể bỏ trống (xóa dòng này) nếu chưa có hình.
> - `draft`: Nếu bằng `true`, bài viết đó gọi là "Bản nháp", sẽ bị ẩn đi, khách không thấy. Sửa thành `false` thì bài sẽ công khai.

### Phần 2: Nội dung bài viết (Markdown)
Ngay dưới rào chắn `---` cuối cùng, bạn gõ nội dung tùy ý dựa trên định dạng của Markdown. 

```markdown
---
[Frontmatter ở trên]
---

## 1. Phương tiện di chuyển đến Cô Tô
Để đi đến Cô Tô từ Cẩm Phả bạn có thể đi từ bến cảng...

### Giá vé tàu cao tốc
| Tàu | Giá vé | Giờ chạy |
| --- | --- | --- |
| Mạnh Quang | 250k | 8:00 AM |

**Lưu ý:** Vui lòng tới sớm 30 phút...
```

---

## 🗑️ Cách SỬA hoặc XOÁ bài viết

- **Để Sửa (Edit):** Bạn chỉ cần mở file `.md` của bài mong muốn trong VS Code (hoặc Text Editor bất kỳ), vào sửa lại chữ và lưu (`Ctrl+S`). Website sẽ lập tức cập nhật lại chữ đó trên hệ thống.
- **Để Xoá (Delete):** Bạn nhấp chuột phải vào file `.md` đó chọn **Xoá (Delete)**. Xong! Toàn hệ thống từ danh sách bài tự động tới đường dẫn đều sẽ biến mất.
- **Ẩn bài viết không muốn xoá vĩnh viễn:** Chỉnh giá trị sửa dòng `draft: false` thành `draft: true` trong phần Frontmatter. Bài sẽ bị ẩn khỏi website nhưng vẫn còn lưu trong máy bạn cho sau này.

---

## 🖼️ Quản lý hình ảnh trong Blog
- Nên cho tất cả ảnh dành cho bài viết vào chung thư mục: `d:\datmo-website\public\images\blog\`
- Khi sử dụng trong bài viết Markdown, bạn gọi ảnh ra bằng cú pháp: 
  `![Chú thích ảnh ở đây](/images/blog/ten-anh-cua-ban.jpg)`
- Định dạng nên dùng: Tốt nhất là **.webp**, hoặc .jpg tối ưu, không vượt quá quá 300KB/ảnh cho tốc độ trải nghiệm nhanh nhất.
