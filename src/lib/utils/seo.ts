import { Metadata } from 'next';

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal blog and micro-blog';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Extract first 160 characters as description from markdown content
export function extractDescription(content: string, maxLength = 160): string {
  if (!content) return siteDescription;
  // Remove markdown formatting
  const plainText = content
    .replace(/^#+\s+/gm, '')
    .replace(/[*_~`\[\]()#]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plainText.substring(0, maxLength) + (plainText.length > maxLength ? '...' : '');
}

export interface StructuredDataParams {
  '@context'?: string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: { '@type': string; name: string };
}

export function generateStructuredData(data: StructuredDataParams) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}

interface PostMetadataParams {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
  image?: string;
}

export function generatePostMetadata({
  title,
  description,
  slug,
  date,
  tags = [],
  image,
}: PostMetadataParams): Metadata {
  const url = `${siteUrl}/blog/${slug}`;
  const keywords = [...tags, 'blog', 'article'];
  const authors = [{ name: siteTitle }];

  return {
    title: `${title} | Blog`,
    description,
    keywords,
    authors,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: image ? [{ url: image }] : [],
      publishedTime: date,
      modifiedTime: date,
      siteName: siteTitle,
      authors: [siteTitle],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
      creator: '@your_twitter', // Update with your Twitter handle
    },
  };
}

interface PageMetadataParams {
  title: string;
  description: string;
  slug: string;
}

export function generatePageMetadata({
  title,
  description,
  slug,
}: PageMetadataParams): Metadata {
  const url = `${siteUrl}/${slug}`;
  const keywords = ['page', slug.replace(/-/g, ' ')];

  return {
    title: `${title} | ${siteTitle}`,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: '@your_twitter', // Update with your Twitter handle
    },
  };
}

export function generateBlogListMetadata(): Metadata {
  return {
    title: 'Blog',
    description: 'Read my latest blog posts',
    openGraph: {
      type: 'website',
      url: `${siteUrl}/blog`,
      title: 'Blog',
      description: 'Read my latest blog posts',
      siteName: siteTitle,
    },
  };
}

export function generateMicroblogMetadata(): Metadata {
  return {
    title: 'Thoughts',
    description: 'Quick thoughts and ideas',
    openGraph: {
      type: 'website',
      url: `${siteUrl}/microblog`,
      title: 'Thoughts',
      description: 'Quick thoughts and ideas',
      siteName: siteTitle,
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return {
    title: siteTitle,
    description: siteDescription,
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: siteTitle,
      description: siteDescription,
      siteName: siteTitle,
    },
  };
}
