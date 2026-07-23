import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, getAllPosts, getPost, savePost, deletePost } from '@/lib/content/posts';
import { checkAdminAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = checkAdminAuth(request);
    const posts = isAdmin ? getAllPosts() : getPublishedPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug, title, date, tags, excerpt, content, published } = await request.json();

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = savePost(slug, {
      title,
      date,
      tags: tags || [],
      excerpt,
      content,
      published: published !== false,
    });

    if (success) {
      const newPost = getPost(slug);
      return NextResponse.json(newPost, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const success = deletePost(slug);
    if (success) {
      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
