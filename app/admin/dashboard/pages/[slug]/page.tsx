'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Page } from '@/lib/types';

export default function EditPagePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState<Page | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    published: false,
    order: 0,
  });

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const authRes = await fetch('/api/admin/check');
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }

        setAuthenticated(true);

        const pageRes = await fetch(`/api/pages/${slug}`);
        if (!pageRes.ok) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        const pageData = await pageRes.json();
        setPage(pageData);
        setFormData({
          slug: pageData.slug,
          title: pageData.title,
          content: pageData.content,
          published: pageData.published,
          order: pageData.order || 0,
        });
      } catch (err) {
        console.error('Error:', err);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      checkAuthAndFetch();
    }
  }, [slug, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          title: formData.title,
          content: formData.content,
          published: formData.published,
          order: formData.order,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update page');
        return;
      }

      setSuccess('Page updated successfully!');
      setTimeout(() => {
        router.push('/admin/dashboard/pages');
      }, 1500);
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this page? This cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/pages?slug=${encodeURIComponent(formData.slug)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(`Delete failed: ${data.error || 'Unknown error'}`);
        setSubmitting(false);
        return;
      }

      setSuccess('Page deleted successfully! Redirecting...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/admin/dashboard/pages');
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Error deleting page: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setSubmitting(false);
    }
  }

  if (!authenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error && !page) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/admin/dashboard/pages" className="text-blue-600 hover:underline">
              ← Back to Pages
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
            <Link href="/admin/dashboard/pages" className="text-blue-600 hover:underline">
              ← Back to Pages
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown) *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              rows={12}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              id="published"
            />
            <label htmlFor="published" className="ml-2 text-sm text-gray-700">
              Published
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
            <Link
              href="/admin/dashboard/pages"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
