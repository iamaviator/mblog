'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post } from '@/lib/types';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function BlogPageClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts', {
          cache: 'no-store',
        });
        if (res.ok) {
          setPosts(await res.json());
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

        <main className="max-w-5xl mx-auto px-4 md:px-10 py-10">
          <div className="md:flex md:items-end md:justify-between mb-8 gap-6">
            <div>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-2">All Writing</p>
              <h1 className="text-4xl font-bold">Blog Archive</h1>
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }}
              className="w-full md:w-72 px-3 py-2 border text-sm focus:outline-none"
            />
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : filteredPosts.length > 0 ? (
            <ul className="space-y-8">
              {filteredPosts.map((post) => (
                <li key={post.slug} style={{ borderColor: 'var(--border-color)' }} className="border-b pb-8">
                  <Link href={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
                    <div className="md:flex md:items-start md:gap-8">
                      <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-widest md:w-28 md:pt-2">{post.date}</p>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
                        <p className="leading-relaxed mb-3">{post.excerpt}</p>
                        {post.tags.length > 0 && (
                          <p style={{ color: 'var(--text-secondary)' }} className="text-xs">{post.tags.join(' • ')}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No posts found.</p>
          )}
        </main>
      </div>
    </div>
  );
}

