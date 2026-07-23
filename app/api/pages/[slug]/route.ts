import { NextRequest, NextResponse } from 'next/server';
import { getPage } from '@/lib/content/pages';
import { checkAdminAuth } from '@/lib/utils/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = getPage(slug);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Allow admins to see unpublished pages
    if (!page.published) {
      const isAdmin = checkAdminAuth(request);
      if (!isAdmin) {
        return NextResponse.json({ error: 'Page not published' }, { status: 403 });
      }
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
