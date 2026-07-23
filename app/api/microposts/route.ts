import { NextRequest, NextResponse } from 'next/server';
import { getPublishedMicroPosts, getAllMicroPosts, getMicroPost, saveMicroPost, deleteMicroPost } from '@/lib/content/microposts';
import { checkAdminAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = checkAdminAuth(request);
    const microPosts = isAdmin ? getAllMicroPosts() : getPublishedMicroPosts();
    return NextResponse.json(microPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch micro-posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, sourcePostSlug, date, content, published } = await request.json();

    if (!id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = saveMicroPost(id, {
      sourcePostSlug: sourcePostSlug || null,
      date,
      content,
      published: published !== false,
    });

    if (success) {
      const newMicroPost = getMicroPost(id);
      return NextResponse.json(newMicroPost, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save micro-post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating micro-post:', error);
    return NextResponse.json({ error: 'Failed to create micro-post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const success = deleteMicroPost(id);
    if (success) {
      return NextResponse.json({ message: 'Micropost deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to delete micropost' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting micropost:', error);
    return NextResponse.json({ error: 'Failed to delete micropost' }, { status: 500 });
  }
}
