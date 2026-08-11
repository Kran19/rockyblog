import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cgi-bin/', '/admin/'],
    },
    sitemap: 'https://stock-247.com/sitemap.xml',
  };
}

