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
    address: {
      '@type': 'PostalAddress',
      ...site.address,
    },
    sameAs: Object.values(site.social),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone,
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
}) {
  const published = data.published.toISOString();
  const modified = (data.updated ?? data.published).toISOString();
  return {
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
}
