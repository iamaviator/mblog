'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    excerpt: '',
    content: '',
    published: false,
  });

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const authRes = await fetch('/api/admin/check');
        if (!authRes.ok) {
          router.push('/admin');
          return;
        }
        setAuthenticated(true);
      } catch (error) {
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

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
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          date: formData.date,
          tags: tagsArray,
          excerpt: formData.excerpt,
          content: formData.content,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
        return;
      }

      setSuccess('Post created successfully!');
      setTimeout(() => {
        router.push('/admin/dashboard/posts');
      }, 1500);
    } catch (err) {
      setError('An error occurred. Make sure all required fields are filled.');
    } finally {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
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
                placeholder="My Blog Post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="my-blog-post (auto-generated if empty)"
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
              placeholder="A short preview of the post"
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
              placeholder="# Your Title&#10;&#10;Write your content in Markdown..."
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
              Publish immediately (uncheck to save as draft)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Post'}
            </button>
            <Link
              href="/admin/dashboard/posts"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold mb-2">💡 Markdown Guide</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><code className="bg-white px-1 py-0.5 rounded"># Heading 1</code> - Main heading</li>
            <li><code className="bg-white px-1 py-0.5 rounded">## Heading 2</code> - Subheading</li>
            <li><code className="bg-white px-1 py-0.5 rounded">**bold**</code> - Bold text</li>
            <li><code className="bg-white px-1 py-0.5 rounded">*italic*</code> - Italic text</li>
            <li><code className="bg-white px-1 py-0.5 rounded">[link](url)</code> - Links</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
