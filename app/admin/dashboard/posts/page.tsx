'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        // Check authentication via API
        const authRes = await fetch('/api/admin/check');
        
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }

        setAuthenticated(true);

        // Fetch all posts (including unpublished)
        const postsRes = await fetch('/api/posts');
        if (postsRes.ok) {
          setPosts(await postsRes.json());
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetch();
  }, [router]);

  if (!authenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Manage Blog Posts</h1>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/posts/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
          >
            + Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No posts yet.</p>
            <Link href="/admin/dashboard/posts/new" className="text-blue-600 hover:underline">
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/dashboard/posts/${post.slug}`}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-green-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
