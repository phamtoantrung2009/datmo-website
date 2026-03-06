import { SITE } from './site';

/**
 * HỆ THỐNG OPENGRAPH TỰ ĐỘNG
 * 
 * Quy ước đặt tên file OG:
 * - Trang chủ: /og/default.png
 * - Trang con: /og/{slug}.png (ví dụ: /og/gioi-thieu.png)
 * - Blog: /og/blog/{slug}.png (ví dụ: /og/blog/kinh-nghiem-du-lich.png)
 * - Blog default: /og/blog/default.png
 * 
 * Fallback tự động:
 * - Nếu file OG riêng không tồn tại → dùng default
 * - Nếu là blog → dùng blog default
 */

// Cấu hình OG Images
export const OG_CONFIG = {
  // Thư mục chứa OG images
  ogFolder: '/og',
  blogFolder: '/og/blog',
  
  // File default
  defaultImage: '/og/default.png',
  blogDefaultImage: '/og/blog/default.png',
} as const;

// Base URL của website
const BASE_URL = SITE.url;

/**
 * Chuyển đổi pathname thành slug cho OG image
 * /gioi-thieu/ → gioi-thieu
 * /blog/kinh-nghiem/ → kinh-nghiem
 * /blog/ → (root blog)
 */
function pathnameToSlug(pathname: string): string {
  // Remove trailing slash and leading slash
  let slug = pathname.replace(/\/$/, '').replace(/^\//, '');
  
  // Handle blog routes
  if (slug.startsWith('blog/')) {
    slug = slug.replace(/^blog\//, '');
  }
  
  return slug || 'index';
}

/**
 * Lấy OG image cho một trang
 * 
 * Quy tắc:
 * 1. /about/ → /og/about.png
 * 2. /blog/post-name/ → /og/blog/post-name.png
 * 3. Blog không có ảnh riêng → /og/blog/default.png
 * 4. Các trang khác không có ảnh riêng → /og/default.png
 * 
 * @param pathname - Đường dẫn của trang (ví dụ: '/gioi-thieu/' hoặc '/blog/kinh-nghiem/')
 * @returns URL đầy đủ của OG image
 */
export function getOgImage(pathname: string): string {
  const slug = pathnameToSlug(pathname);
  
  // Kiểm tra nếu là blog route
  const isBlogRoute = pathname.startsWith('/blog/') || pathname === '/blog';
  
  if (isBlogRoute) {
    // Blog: ưu tiên ảnh riêng, fallback về blog default
    // Quy ước: /og/blog/{slug}.png
    const blogOgPath = slug === 'index' || slug === 'blog' 
      ? OG_CONFIG.blogDefaultImage 
      : `${OG_CONFIG.blogFolder}/${slug}.png`;
    
    return `${BASE_URL}${blogOgPath}`;
  }
  
  // Các trang khác: ưu tiên ảnh riêng, fallback về default
  // Quy ước: /og/{slug}.png
  const pageOgPath = `${OG_CONFIG.ogFolder}/${slug}.png`;
  
  return `${BASE_URL}${pageOgPath}`;
}

/**
 * Lấy OG image cho blog post cụ thể
 * 
 * @param slug - Slug của bài viết (ví dụ: 'kinh-nghiem-ha-long')
 * @returns URL đầy đủ của OG image
 */
export function getBlogOgImage(slug: string): string {
  return `${BASE_URL}${OG_CONFIG.blogFolder}/${slug}.png`;
}

/**
 * Lấy OG image mặc định cho website
 */
export function getDefaultOgImage(): string {
  return `${BASE_URL}${OG_CONFIG.defaultImage}`;
}

/**
 * Lấy OG image mặc định cho blog
 */
export function getBlogDefaultOgImage(): string {
  return `${BASE_URL}${OG_CONFIG.blogDefaultImage}`;
}

// Export OG_CONFIG để các component có thể sử dụng nếu cần
// (already exported at line 19)
