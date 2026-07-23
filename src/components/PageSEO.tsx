'use client';

import { useEffect } from 'react';

interface PageSEOProps {
  title: string;
  description: string;
  url: string;
  type?: 'WebPage' | 'BlogPosting';
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  tags?: string[];
}

/**
 * Client-side SEO component that updates page metadata dynamically
 * Used for client-rendered pages to improve search engine optimization
 */
export function PageSEO({
  title,
  description,
  url,
  type = 'WebPage',
  image,
  datePublished,
  dateModified,
  author,
  tags,
}: PageSEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', tags ? tags.join(', ') : 'blog, article');
    
    // Open Graph tags
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:url', url);
    updateOGTag('og:type', type === 'BlogPosting' ? 'article' : 'website');
    
    if (image) {
      updateOGTag('og:image', image);
    }

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) {
      updateMetaTag('twitter:image', image);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Add JSON-LD structured data
    let script = document.querySelector(
      'script[type="application/ld+json"][data-page-seo]'
    ) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-seo', 'true');
      document.head.appendChild(script);
    }

    const structuredData =
      type === 'BlogPosting'
        ? {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            url,
            image: image ? { '@type': 'ImageObject', url: image } : undefined,
            datePublished,
            dateModified: dateModified || datePublished,
            author: author
              ? {
                  '@type': 'Person',
                  name: author,
                }
              : undefined,
            keywords: tags?.join(', '),
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url,
            image: image ? { '@type': 'ImageObject', url: image } : undefined,
          };

    script.innerHTML = JSON.stringify(structuredData);
  }, [title, description, url, type, image, datePublished, dateModified, author, tags]);

  return null;
}
