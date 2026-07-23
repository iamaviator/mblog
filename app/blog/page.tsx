import type { Metadata } from 'next';
import { generateBlogListMetadata } from '@/lib/utils/seo';
import BlogPageClient from './client';

export const metadata: Metadata = generateBlogListMetadata();

export default function BlogPage() {
  return <BlogPageClient />;
}
