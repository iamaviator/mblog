'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MicroPost } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function MicropostsManagement() {
  const [microposts, setMicroposts] = useState<MicroPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const authRes = await fetch('/api/admin/check');
        
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }

        setAuthenticated(true);

        const micropostsRes = await fetch('/api/microposts');
        if (micropostsRes.ok) {
          setMicroposts(await micropostsRes.json());
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Micro-posts</h1>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/microposts/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
          >
            + Create New Micro-post
          </Link>
        </div>

        {microposts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No micro-posts yet.</p>
            <Link href="/admin/dashboard/microposts/new" className="text-blue-600 hover:underline">
              Create your first micro-post →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {microposts.map((mp) => (
                  <tr key={mp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {mp.content}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{mp.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          mp.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {mp.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/dashboard/microposts/${mp.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
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
