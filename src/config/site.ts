export const SITE = {
  name: 'Datmo.io.vn',
  url: 'https://datmo.io.vn',
  locale: 'vi_VN',
  titleDefault: 'Datmo.io.vn – Dịch vụ du lịch & vận chuyển tại Cẩm Phả – Quảng Ninh',
  descriptionDefault:
    'Thuê xe du lịch 16–45 chỗ, tour xuất phát từ Cẩm Phả, vé tàu cao tốc Ao Tiên/Vũng Đục đi Cô Tô – Quan Lạn, vé máy bay, khách sạn, visa – hộ chiếu. Hỗ trợ nhanh, giá tốt.',
  phone: '+84-911-321-578',
  phoneDisplay: '0911 321 578',
  zaloUrl: 'https://zalo.me/911321578',
  address: {
    streetAddress: 'Cẩm Phả, Quảng Ninh',
    addressLocality: 'Cẩm Phả',
    addressRegion: 'Quảng Ninh',
    addressCountry: 'VN',
  },
  social: {
    facebook: 'https://facebook.com/datmotravel2024',
  },
} as const;

export const NAV = [
  { label: 'Thuê xe', href: '/thue-xe-du-lich/' },
  { label: 'Tour', href: '/tour-du-lich/' },
  { label: 'Vé tàu cao tốc', href: '/ve-tau-cao-toc/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Liên hệ', href: '/lien-he/' },
] as const;
