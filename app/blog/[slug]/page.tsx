'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Post } from '@/lib/types';
import { markdownToHtml } from '@/lib/utils/markdown';
import { extractDescription } from '@/lib/utils/seo';
import { PageSEO } from '@/components/PageSEO';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: Props) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const postData = await res.json();
          setPost(postData);
          const html = await markdownToHtml(postData.content);
          setHtmlContent(html);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen font-sans flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" style={{ color: 'var(--accent)' }} className="hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title={post.title}
        description={post.excerpt || extractDescription(post.content, 160)}
        url={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/blog/${slug}`}
        type="BlogPosting"
        datePublished={post.date}
        author={process.env.NEXT_PUBLIC_SITE_TITLE}
        tags={post.tags}
      />
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen font-sans md:flex">

      <aside style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }} className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 border-r flex-col justify-between px-6 py-8">
        <div>
          <Link href="/" className="text-2xl font-bold block mb-8">
            {process.env.NEXT_PUBLIC_SITE_TITLE}
          </Link>
          <nav className="space-y-3 text-sm">
            <Link href="/blog" className="block font-semibold">Blog</Link>
            <Link href="/microblog" className="block">Thoughts</Link>
            <Link href="/about" className="block">About</Link>
          </nav>
        </div>
        <ThemeSwitcher />
      </aside>

      <div className="flex-1 min-w-0">
        <header style={{ borderColor: 'var(--border-color)' }} className="md:hidden border-b px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-xl font-bold">{process.env.NEXT_PUBLIC_SITE_TITLE}</Link>
            <ThemeSwitcher />
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/blog" className="font-semibold">Blog</Link>
            <Link href="/microblog">Thoughts</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-10 py-10">
          <Link href="/blog" style={{ color: 'var(--accent)' }} className="text-sm mb-6 inline-block">
            ← Back to blog
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold mb-3">{post.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">{post.date}</p>

          {post.tags.length > 0 && (
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mb-8">
              {post.tags.join(' • ')}
            </p>
          )}

          <article className="prose prose-sm max-w-none">
            <div
              style={{ color: 'var(--text-primary)' }}
              className="leading-relaxed
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-6
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-4 [&_h2]:mt-8
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-3 [&_h3]:mt-6
                [&_p]:my-4
                [&_strong]:font-bold
                [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:p-4 [&_pre]:rounded [&_pre]:my-4 [&_pre]:overflow-x-auto
                [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
                [&_li]:my-1
                [&_hr]:border-t [&_hr]:my-6
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                [&_th]:p-3 [&_th]:border [&_th]:text-left [&_th]:font-bold
                [&_td]:p-3 [&_td]:border
                [&_tr:nth-child(even)]:bg-gray-50 dark:[&_tr:nth-child(even)]:bg-gray-900 matrix:[&_tr:nth-child(even)]:bg-gray-900 techno:[&_tr:nth-child(even)]:bg-gray-900"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </main>
      </div>
    </>
  );
}
