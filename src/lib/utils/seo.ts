import { Metadata } from 'next';

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Blog';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal blog and micro-blog';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: image ? [{ url: image }] : [],
      publishedTime: date,
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
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

  return {
    title,
    description,
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
