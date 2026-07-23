import matter from 'gray-matter';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { put, del, list } from '@vercel/blob';
import { Post, PostMetadata } from '@/lib/types';

const POSTS_DIR = join(process.cwd(), 'content/blog');
const BLOB_PREFIX = 'content/posts/';
const BLOB_DELETED_PREFIX = 'content/posts/_deleted/';

function parsePostFromMarkdown(slug: string, fileContent: string): Post | null {
  try {
    const { data, content } = matter(fileContent);
    return {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      content,
      published: data.published !== false,
    };
  } catch {
    return null;
  }
}

function serializePost(slug: string, post: Omit<Post, 'slug'>): string {
  const { content, ...fm } = post;
  return `---\ntitle: "${fm.title.replace(/"/g, '\\"')}"\nslug: "${slug}"\ndate: "${fm.date}"\ntags: [${fm.tags.map((t) => `"${t}"`).join(', ')}]\nexcerpt: "${fm.excerpt.replace(/"/g, '\\"')}"\npublished: ${fm.published}\n---\n\n${content}`;
}

function getFsPost(slug: string): Post | null {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return parsePostFromMarkdown(slug, fileContent);
  } catch {
    return null;
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const [contentList, deletedList] = await Promise.all([
    list({ prefix: `${BLOB_PREFIX}${slug}.md` }),
    list({ prefix: `${BLOB_DELETED_PREFIX}${slug}` }),
  ]);

  if (deletedList.blobs.length > 0) return null;

  if (contentList.blobs.length > 0) {
    try {
      const response = await fetch(contentList.blobs[0].url, { cache: 'no-store' });
      if (response.ok) return parsePostFromMarkdown(slug, await response.text());
    } catch {}
  }

  return getFsPost(slug);
}

export async function getPostMetadata(slug: string): Promise<PostMetadata | null> {
  const post = await getPost(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    excerpt: post.excerpt,
    published: post.published,
  };
}

export async function getAllPosts(): Promise<Post[]> {
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
  if (existsSync(POSTS_DIR)) {
    fsSlugs = readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  }

  const allSlugs = [...new Set([...blobSlugMap.keys(), ...fsSlugs])].filter(
    (s) => !deletedSlugs.has(s)
  );

  const posts = await Promise.all(
    allSlugs.map(async (slug) => {
      const blobUrl = blobSlugMap.get(slug);
      if (blobUrl) {
        try {
          const response = await fetch(blobUrl, { cache: 'no-store' });
          if (response.ok) return parsePostFromMarkdown(slug, await response.text());
        } catch {}
      }
      return getFsPost(slug);
    })
  );

  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPublishedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.published);
}

export async function savePost(slug: string, post: Omit<Post, 'slug'>): Promise<boolean> {
  try {
    await put(`${BLOB_PREFIX}${slug}.md`, serializePost(slug, post), {
      access: 'public',
      contentType: 'text/markdown',
    });
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    return false;
  }
}

export async function deletePost(slug: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.md` });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
    await put(`${BLOB_DELETED_PREFIX}${slug}`, 'deleted', {
      access: 'public',
      contentType: 'text/plain',
    });
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}
