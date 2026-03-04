import type { SITE } from '../config/site';

type SiteConfig = typeof SITE;

const orgId = (site: SiteConfig) => `${site.url}#organization`;
const websiteId = (site: SiteConfig) => `${site.url}#website`;

export const getOrganizationId = (site: SiteConfig) => orgId(site);

export function buildOrganizationSchema(site: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(site),
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo}`,
    image: `${site.url}${site.logo}`,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      ...site.address,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 21.01,
        longitude: 107.31,
      },
      geoRadius: '50000',
    },
    sameAs: Object.values(site.social),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone,
        email: site.email,
        contactType: 'customer service',
        areaServed: ['VN'],
        availableLanguage: ['vi'],
      },
    ],
  };
}

export function buildWebSiteSchema(site: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: site.url,
    name: site.name,
    inLanguage: 'vi-VN',
    publisher: { '@id': orgId(site) },
  };
}

export function buildBreadcrumbListSchema(site: SiteConfig, items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: site.url + it.href,
    })),
  };
}

export function buildBlogPostingSchema(site: SiteConfig, data: {
  title: string;
  description: string;
  slug: string;
  published: Date;
  updated?: Date | null;
  image?: string | null;
}) {
  const published = data.published.toISOString();
  const modified = (data.updated ?? data.published).toISOString();
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site.url}/blog/${data.slug}/`,
    },
    author: {
      '@type': 'Organization',
      '@id': orgId(site),
      name: site.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': orgId(site),
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}${site.logo}`,
      },
    },
  };
  if (data.image) {
    schema.image = {
      '@type': 'ImageObject',
      url: `${site.url}${data.image}`,
      width: 1200,
      height: 675,
    };
  }
  return schema;
}
