'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { MicroPost } from '@/lib/types';

export default function EditMicropostPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    date: '',
    content: '',
    published: false,
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const authRes = await fetch('/api/admin/check');
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }

        setAuthenticated(true);

        const microposts = await fetch('/api/microposts').then((r) => r.json());
        const micropost = microposts.find((mp: MicroPost) => mp.id === id);

        if (!micropost) {
          setError('Micropost not found');
          setLoading(false);
          return;
        }

        setFormData({
          id: micropost.id,
          date: micropost.date,
          content: micropost.content,
          published: micropost.published,
        });
      } catch (err) {
        console.error('Error:', err);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      checkAuthAndFetch();
    }
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/microposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          date: formData.date,
          content: formData.content,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update micropost');
        return;
      }

      setSuccess('Micropost updated successfully!');
      setTimeout(() => {
        router.push('/admin/dashboard/microposts');
      }, 1500);
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this micropost? This cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/microposts?id=${encodeURIComponent(formData.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(`Delete failed: ${data.error || 'Unknown error'}`);
        setSubmitting(false);
        return;
      }

      setSuccess('Micropost deleted successfully! Redirecting...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/admin/dashboard/microposts');
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Error deleting micropost: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

  if (error && !formData.id) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/admin/dashboard/microposts" className="text-blue-600 hover:underline">
              ← Back to Microposts
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Micropost</h1>
            <Link href="/admin/dashboard/microposts" className="text-blue-600 hover:underline">
              ← Back to Microposts
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (max 280 characters) *</label>
            <textarea
              required
              maxLength={280}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">{formData.content.length}/280</div>
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
              href="/admin/dashboard/microposts"
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
