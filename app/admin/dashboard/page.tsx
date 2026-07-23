'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, MicroPost, Page } from '@/lib/types';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, pages: 0, microposts: 0 });
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check authentication via API
        const authRes = await fetch('/api/admin/check');
        
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }

        setIsAuthenticated(true);
        
        // Fetch stats
        const [postsRes, pagesRes, micropostsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/pages'),
          fetch('/api/microposts'),
        ]);

        if (postsRes.ok && pagesRes.ok && micropostsRes.ok) {
          const posts: Post[] = await postsRes.json();
          const pages: Page[] = await pagesRes.json();
          const microposts: MicroPost[] = await micropostsRes.json();

          setStats({
            posts: posts.length,
            pages: pages.length,
            microposts: microposts.length,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  function handleLogout() {
    fetch('/api/admin/logout', { method: 'POST' }).then(() => {
      router.push('/admin');
    });
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Blog Posts</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.posts}</p>
            <Link href="/admin/dashboard/posts" className="text-blue-600 text-sm mt-4 block hover:underline">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Custom Pages</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.pages}</p>
            <Link href="/admin/dashboard/pages" className="text-blue-600 text-sm mt-4 block hover:underline">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Micro-posts</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.microposts}</p>
            <Link href="/admin/dashboard/microposts" className="text-blue-600 text-sm mt-4 block hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <p className="text-gray-600 mb-4">
            Welcome to the admin dashboard! Here you can manage all your content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">📝 Blog Posts</h3>
              <p className="text-sm text-gray-600 mb-3">Create, edit, and publish blog posts.</p>
              <Link href="/admin/dashboard/posts" className="text-blue-600 hover:underline text-sm">
                Create Post →
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">📄 Pages</h3>
              <p className="text-sm text-gray-600 mb-3">Manage custom pages like About and Contact.</p>
              <Link href="/admin/dashboard/pages" className="text-blue-600 hover:underline text-sm">
                Create Page →
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">💬 Micro-posts</h3>
              <p className="text-sm text-gray-600 mb-3">Share quick thoughts and updates.</p>
              <Link href="/admin/dashboard/microposts" className="text-blue-600 hover:underline text-sm">
                Create Micro-post →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-gray-700">
            You can also create content directly by adding Markdown files to the <code className="bg-white px-2 py-1 rounded">/content</code> folder and restarting the server.
          </p>
        </div>
      </main>

      <footer className="border-t mt-12 py-6 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Blog & Micro-blog Platform</p>
      </footer>
    </div>
  );
}
