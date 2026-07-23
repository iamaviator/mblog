'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MicroPost } from '@/lib/types';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function MicroblogPageClient() {
  const [microPosts, setMicroPosts] = useState<MicroPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMicroPosts() {
      try {
        const res = await fetch('/api/microposts', {
          cache: 'no-store',
        });
        if (res.ok) {
          setMicroPosts(await res.json());
        }
      } catch (error) {
        console.error('Error fetching micro-posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMicroPosts();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen font-sans md:flex">
      <aside style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }} className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 border-r flex-col justify-between px-6 py-8">
        <div>
          <Link href="/" className="text-2xl font-bold block mb-8">
            {process.env.NEXT_PUBLIC_SITE_TITLE}
          </Link>
          <nav className="space-y-3 text-sm">
            <Link href="/blog" className="block">Blog</Link>
            <Link href="/microblog" className="block font-semibold">Thoughts</Link>
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
            <Link href="/blog">Blog</Link>
            <Link href="/microblog" className="font-semibold">Thoughts</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-10 py-10">
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-2">Micro Blog</p>
          <h1 className="text-4xl font-bold mb-10">Thought Stream</h1>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : microPosts.length > 0 ? (
            <ul className="space-y-8">
              {microPosts.map((mp) => (
                <li key={mp.id} className="relative pl-8">
                  <span style={{ backgroundColor: 'var(--accent)' }} className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full" />
                  <span style={{ borderColor: 'var(--border-color)' }} className="absolute left-[4px] top-4 bottom-[-2.2rem] border-l" />
                  <p className="leading-relaxed">{mp.content}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-2">{mp.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No thoughts yet.</p>
          )}
        </main>
      </div>
    </div>
  );
}
