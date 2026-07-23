'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post, MicroPost } from '@/lib/types';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function HomeClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [microPosts, setMicroPosts] = useState<MicroPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [postsRes, micropostsRes] = await Promise.all([
          fetch('/api/posts', { cache: 'no-store' }),
          fetch('/api/microposts', { cache: 'no-store' }),
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (micropostsRes.ok) setMicroPosts(await micropostsRes.json());
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const latestPost = posts[0];
  const morePosts = posts.slice(1, 7);
  const recentMicroPosts = microPosts.slice(0, 8);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen font-sans md:flex">
      <aside style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }} className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 border-r flex-col justify-between px-6 py-8">
        <div>
          <Link href="/" className="text-2xl font-bold block mb-8">
            {process.env.NEXT_PUBLIC_SITE_TITLE}
          </Link>
          <nav className="space-y-3 text-sm">
            <Link href="/blog" className="block">Blog</Link>
            <Link href="/microblog" className="block">Thoughts</Link>
            <Link href="/about" className="block">About</Link>
          </nav>
        </div>
        <div className="space-y-4">
          <ThemeSwitcher />
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs">Independent writing + micro notes.</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header style={{ borderColor: 'var(--border-color)' }} className="md:hidden border-b px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-xl font-bold">{process.env.NEXT_PUBLIC_SITE_TITLE}</Link>
            <ThemeSwitcher />
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/blog">Blog</Link>
            <Link href="/microblog">Thoughts</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-10 py-10">
          {latestPost && (
            <section className="mb-14">
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-3">Feature Story</p>
              <Link href={`/blog/${latestPost.slug}`} className="block">
                <article className="hover:opacity-85 transition-opacity">
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{latestPost.title}</h1>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3">{latestPost.date}</p>
                  <p className="text-lg md:text-xl leading-relaxed max-w-3xl">{latestPost.excerpt}</p>
                </article>
              </Link>
            </section>
          )}

          <div className="grid gap-12 md:grid-cols-3">
            <section className="md:col-span-2">
              <h2 style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-5">More Stories</h2>
              {morePosts.length > 0 ? (
                <ul className="space-y-8">
                  {morePosts.map((post) => (
                    <li key={post.slug} style={{ borderColor: 'var(--border-color)' }} className="border-b pb-6">
                      <Link href={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
                        <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3">{post.date}</p>
                        <p className="leading-relaxed">{post.excerpt}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No more posts yet.</p>
              )}
            </section>

            <section>
              <h2 style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-5">Quick Thoughts</h2>
              {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
              ) : recentMicroPosts.length > 0 ? (
                <ul className="space-y-4">
                  {recentMicroPosts.map((mp) => (
                    <li key={mp.id} style={{ borderColor: 'var(--border-color)' }} className="border-l pl-4">
                      <p className="text-sm leading-relaxed">{mp.content}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-2">{mp.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No thoughts yet.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
