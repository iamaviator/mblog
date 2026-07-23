'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Post } from '@/lib/types';

export default function EditPostPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [post, setPost] = useState<Post | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    tags: '',
    excerpt: '',
    content: '',
    published: false,
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

        const postRes = await fetch(`/api/posts/${slug}`);
        if (!postRes.ok) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        const postData = await postRes.json();
        setPost(postData);
        setFormData({
          title: postData.title,
          slug: postData.slug,
          date: postData.date,
          tags: postData.tags.join(', '),
          excerpt: postData.excerpt,
          content: postData.content,
          published: postData.published,
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
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          date: formData.date,
          tags: tagsArray,
          excerpt: formData.excerpt,
          content: formData.content,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update post');
        return;
      }

      setSuccess('Post updated successfully!');
      setTimeout(() => {
        router.push('/admin/dashboard/posts');
      }, 1500);
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/posts?slug=${encodeURIComponent(formData.slug)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(`Delete failed: ${data.error || 'Unknown error'}`);
        setSubmitting(false);
        return;
      }

      setSuccess('Post deleted successfully! Redirecting...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/admin/dashboard/posts');
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Error deleting post: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/admin/dashboard/posts" className="text-blue-600 hover:underline">
              ← Back to Posts
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <Link href="/admin/dashboard/posts" className="text-blue-600 hover:underline">
              ← Back to Posts
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
            <input
              type="text"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
              href="/admin/dashboard/posts"
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
