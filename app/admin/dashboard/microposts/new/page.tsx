'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewMicropostPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [charCount, setCharCount] = useState(0);

  const [formData, setFormData] = useState({
    content: '',
    sourcePostSlug: '',
    date: new Date().toISOString().split('T')[0],
    published: false,
  });

  const router = useRouter();
  const MAX_CHARS = 280;

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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData({ ...formData, content });
    setCharCount(content.length);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const id = `mp-${Date.now()}`;
      const response = await fetch('/api/microposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          content: formData.content,
          sourcePostSlug: formData.sourcePostSlug || null,
          date: formData.date,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create micro-post');
        return;
      }

      setSuccess('Micro-post created successfully!');
      setTimeout(() => {
        router.push('/admin/dashboard/microposts');
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please check your input.');
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Micro-post</h1>
            <Link href="/admin/dashboard/microposts" className="text-blue-600 hover:underline">
              ← Back to Micro-posts
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content * ({charCount}/{MAX_CHARS})
            </label>
            <textarea
              required
              value={formData.content}
              onChange={handleContentChange}
              maxLength={MAX_CHARS}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                charCount > MAX_CHARS * 0.9 ? 'border-orange-300' : 'border-gray-300'
              }`}
              rows={6}
              placeholder="Share a quick thought, update, or link (280 characters max)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {charCount > MAX_CHARS * 0.8 && (
                <span className={charCount > MAX_CHARS * 0.95 ? 'text-orange-600' : 'text-gray-500'}>
                  {MAX_CHARS - charCount} characters remaining
                </span>
              )}
            </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Blog Post (optional)
              </label>
              <input
                type="text"
                value={formData.sourcePostSlug}
                onChange={(e) => setFormData({ ...formData, sourcePostSlug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="blog-post-slug (if from a blog post)"
              />
            </div>
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
              disabled={submitting || formData.content.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Micro-post'}
            </button>
            <Link
              href="/admin/dashboard/microposts"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold mb-2">💡 Micro-post Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Keep it short and punchy (280 characters max)</li>
            <li>• Perfect for quick thoughts, updates, or links</li>
            <li>• Link to a blog post to show where it came from</li>
            <li>• Micro-posts appear on your feed sorted by date</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
