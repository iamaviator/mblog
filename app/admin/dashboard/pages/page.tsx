'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Page } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
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

        const pagesRes = await fetch('/api/pages');
        if (pagesRes.ok) {
          setPages(await pagesRes.json());
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/pages/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
          >
            + Create New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No pages yet.</p>
            <Link href="/admin/dashboard/pages/new" className="text-blue-600 hover:underline">
              Create your first page →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pages.map((page) => (
                  <tr key={page.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{page.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{page.order}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          page.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/dashboard/pages/${page.slug}`}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <Link href={`/${page.slug}`} target="_blank" className="text-green-600 hover:underline">
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
