import matter from 'gray-matter';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { put, del, list } from '@vercel/blob';
import { Page, PageMetadata } from '@/lib/types';

const PAGES_DIR = join(process.cwd(), 'content/pages');
const BLOB_PREFIX = 'content/pages/';
const BLOB_DELETED_PREFIX = 'content/pages/_deleted/';

function parsePageFromMarkdown(slug: string, fileContent: string): Page | null {
  try {
    const { data, content } = matter(fileContent);
    return {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      content,
      published: data.published !== false,
      order: data.order || 0,
    };
  } catch {
    return null;
  }
}

function serializePage(slug: string, page: Omit<Page, 'slug'>): string {
  const { content, ...fm } = page;
  return `---\nslug: "${slug}"\ntitle: "${fm.title.replace(/"/g, '\\"')}"\npublished: ${fm.published}\norder: ${fm.order}\n---\n\n${content}`;
}

function getFsPage(slug: string): Page | null {
  try {
    const filePath = join(PAGES_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return parsePageFromMarkdown(slug, fileContent);
  } catch {
    return null;
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  const [contentList, deletedList] = await Promise.all([
    list({ prefix: `${BLOB_PREFIX}${slug}.md` }),
    list({ prefix: `${BLOB_DELETED_PREFIX}${slug}` }),
  ]);

  if (deletedList.blobs.length > 0) return null;

  if (contentList.blobs.length > 0) {
    try {
      const response = await fetch(contentList.blobs[0].url, { cache: 'no-store' });
      if (response.ok) {
        return parsePageFromMarkdown(slug, await response.text());
      }
    } catch {}
  }

  return getFsPage(slug);
}

export async function getPageMetadata(slug: string): Promise<PageMetadata | null> {
  const page = await getPage(slug);
  if (!page) return null;
  return { slug: page.slug, title: page.title, published: page.published, order: page.order };
}

export async function getAllPages(): Promise<Page[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });

  const contentBlobs = blobs.filter(
    (b) => b.pathname.endsWith('.md') && !b.pathname.startsWith(BLOB_DELETED_PREFIX)
  );
  const deletedSlugs = new Set(
    blobs
      .filter((b) => b.pathname.startsWith(BLOB_DELETED_PREFIX))
      .map((b) => b.pathname.slice(BLOB_DELETED_PREFIX.length))
  );

  const blobSlugMap = new Map(
    contentBlobs.map((b) => [b.pathname.slice(BLOB_PREFIX.length).replace(/\.md$/, ''), b.url])
  );

  let fsSlugs: string[] = [];
  if (existsSync(PAGES_DIR)) {
    fsSlugs = readdirSync(PAGES_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  }

  const allSlugs = [...new Set([...blobSlugMap.keys(), ...fsSlugs])].filter(
    (s) => !deletedSlugs.has(s)
  );

  const pages = await Promise.all(
    allSlugs.map(async (slug) => {
      const blobUrl = blobSlugMap.get(slug);
      if (blobUrl) {
        try {
          const response = await fetch(blobUrl, { cache: 'no-store' });
          if (response.ok) return parsePageFromMarkdown(slug, await response.text());
        } catch {}
      }
      return getFsPage(slug);
    })
  );

  return pages.filter((p): p is Page => p !== null).sort((a, b) => a.order - b.order);
}

export async function getPublishedPages(): Promise<Page[]> {
  return (await getAllPages()).filter((p) => p.published);
}

export async function savePage(slug: string, page: Omit<Page, 'slug'>): Promise<boolean> {
  try {
    await put(`${BLOB_PREFIX}${slug}.md`, serializePage(slug, page), {
      access: 'public',
      contentType: 'text/markdown',
    });
    return true;
  } catch (error) {
    console.error('Error saving page:', error);
    return false;
  }
}

export async function deletePage(slug: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.md` });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
    // Write tombstone so filesystem-seeded content is also hidden
    await put(`${BLOB_DELETED_PREFIX}${slug}`, 'deleted', {
      access: 'public',
      contentType: 'text/plain',
    });
    return true;
  } catch (error) {
    console.error('Error deleting page:', error);
    return false;
  }
}
