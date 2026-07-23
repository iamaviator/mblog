import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPages, getAllPages, getPage, savePage, deletePage } from '@/lib/content/pages';
import { checkAdminAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = checkAdminAuth(request);
    const pages = isAdmin ? getAllPages() : getPublishedPages();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug, title, content, published, order } = await request.json();

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = savePage(slug, {
      title,
      content,
      published: published !== false,
      order: order || 0,
    });

    if (success) {
      const newPage = getPage(slug);
      return NextResponse.json(newPage, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
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

    const success = deletePage(slug);
    if (success) {
      return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
