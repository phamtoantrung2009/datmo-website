import { SITE } from './site';

export const OG = {
  default: `${SITE.url}/og.png`,
  blogDefault: `${SITE.url}/og/blog/default.png`,
  pages: {
    '/': `${SITE.url}/og/default.png`,
    '/gioi-thieu/': `${SITE.url}/og/gioi-thieu/index.png`,
    '/lien-he/': `${SITE.url}/og/lien-he/index.png`,
    '/thue-xe-du-lich/': `${SITE.url}/og/thue-xe-du-lich/index.png`,
    '/thue-xe-du-lich/thue-xe-16-cho-cam-pha/': `${SITE.url}/og/thue-xe-du-lich/thue-xe-16-cho.png`,
    '/thue-xe-du-lich/thue-xe-29-cho-cam-pha/': `${SITE.url}/og/thue-xe-du-lich/thue-xe-29-cho.png`,
    '/thue-xe-du-lich/thue-xe-45-cho-cam-pha/': `${SITE.url}/og/thue-xe-du-lich/thue-xe-45-cho.png`,
    '/tour-du-lich/': `${SITE.url}/og/tour-du-lich/index.png`,
    '/tour-du-lich/tour-doan/': `${SITE.url}/og/tour-du-lich/tour-doan.png`,
    '/tour-du-lich/tour-noi-dia/': `${SITE.url}/og/tour-du-lich/tour-noi-dia.png`,
    '/tour-du-lich/tour-quoc-te/': `${SITE.url}/og/tour-du-lich/tour-quoc-te.png`,
    '/ve-tau-cao-toc/': `${SITE.url}/og/ve-tau-cao-toc/index.png`,
    '/ve-tau-cao-toc/ao-tien-co-to/': `${SITE.url}/og/ve-tau-cao-toc/ao-tien-co-to.png`,
    '/ve-tau-cao-toc/ao-tien-quan-lan/': `${SITE.url}/og/ve-tau-cao-toc/ao-tien-quan-lan.png`,
    '/ve-tau-cao-toc/vung-duc-co-to/': `${SITE.url}/og/ve-tau-cao-toc/vung-duc-co-to.png`,
    '/ve-may-bay/': `${SITE.url}/og/ve-may-bay/index.png`,
    '/khach-san/': `${SITE.url}/og/khach-san/index.png`,
    '/visa-ho-chieu/': `${SITE.url}/og/visa-ho-chieu/index.png`,
    '/blog/': `${SITE.url}/og/blog/index.png`,
    '/blog/kinh-nghiem-du-lich/': `${SITE.url}/og/blog/kinh-nghiem-du-lich.png`,
    '/blog/tin-tuc-cam-pha/': `${SITE.url}/og/blog/tin-tuc-cam-pha.png`,
    '/blog/lich-tau-gia-ve/': `${SITE.url}/og/blog/lich-tau-gia-ve.png`,
  },
} as const;

export function getOgImage(pathname: string) {
  return OG.pages[pathname as keyof typeof OG.pages] ?? OG.default;
}
