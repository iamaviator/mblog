import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/content/posts';
import { checkAdminAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Allow admins to see unpublished posts
    if (!post.published) {
      const isAdmin = checkAdminAuth(request);
      if (!isAdmin) {
        return NextResponse.json({ error: 'Post not published' }, { status: 403 });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
