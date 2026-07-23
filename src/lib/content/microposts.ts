import matter from 'gray-matter';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { put, del, list } from '@vercel/blob';
import { MicroPost, MicroPostMetadata } from '@/lib/types';

const MICROPOSTS_DIR = join(process.cwd(), 'content/microposts');
const BLOB_PREFIX = 'content/microposts/';
const BLOB_DELETED_PREFIX = 'content/microposts/_deleted/';

function parseMicroPostFromMarkdown(id: string, fileContent: string): MicroPost | null {
  try {
    const { data, content } = matter(fileContent);
    return {
      id: data.id || id,
      sourcePostSlug: data.sourcePostSlug || null,
      date: data.date || new Date().toISOString().split('T')[0],
      content: content.trim(),
      published: data.published !== false,
    };
  } catch {
    return null;
  }
}

function serializeMicroPost(id: string, microPost: Omit<MicroPost, 'id'>): string {
  return `---\nid: "${id}"\nsourcePostSlug: ${microPost.sourcePostSlug ? `"${microPost.sourcePostSlug}"` : 'null'}\ndate: "${microPost.date}"\npublished: ${microPost.published}\n---\n\n${microPost.content}`;
}

function getFsMicroPost(id: string): MicroPost | null {
  try {
    const filePath = join(MICROPOSTS_DIR, `${id}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return parseMicroPostFromMarkdown(id, fileContent);
  } catch {
    return null;
  }
}

export async function getMicroPost(id: string): Promise<MicroPost | null> {
  const [contentList, deletedList] = await Promise.all([
    list({ prefix: `${BLOB_PREFIX}${id}.md` }),
    list({ prefix: `${BLOB_DELETED_PREFIX}${id}` }),
  ]);

  if (deletedList.blobs.length > 0) return null;

  if (contentList.blobs.length > 0) {
    try {
      const response = await fetch(contentList.blobs[0].url, { cache: 'no-store' });
      if (response.ok) return parseMicroPostFromMarkdown(id, await response.text());
    } catch {}
  }

  return getFsMicroPost(id);
}

export async function getMicroPostMetadata(id: string): Promise<MicroPostMetadata | null> {
  const mp = await getMicroPost(id);
  if (!mp) return null;
  return { id: mp.id, sourcePostSlug: mp.sourcePostSlug, date: mp.date, published: mp.published };
}

export async function getAllMicroPosts(): Promise<MicroPost[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });

  const contentBlobs = blobs.filter(
    (b) => b.pathname.endsWith('.md') && !b.pathname.startsWith(BLOB_DELETED_PREFIX)
  );
  const deletedIds = new Set(
    blobs
      .filter((b) => b.pathname.startsWith(BLOB_DELETED_PREFIX))
      .map((b) => b.pathname.slice(BLOB_DELETED_PREFIX.length))
  );

  const blobIdMap = new Map(
    contentBlobs.map((b) => [b.pathname.slice(BLOB_PREFIX.length).replace(/\.md$/, ''), b.url])
  );

  let fsIds: string[] = [];
  if (existsSync(MICROPOSTS_DIR)) {
    fsIds = readdirSync(MICROPOSTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  }

  const allIds = [...new Set([...blobIdMap.keys(), ...fsIds])].filter(
    (id) => !deletedIds.has(id)
  );

  const microposts = await Promise.all(
    allIds.map(async (id) => {
      const blobUrl = blobIdMap.get(id);
      if (blobUrl) {
        try {
          const response = await fetch(blobUrl, { cache: 'no-store' });
          if (response.ok) return parseMicroPostFromMarkdown(id, await response.text());
        } catch {}
      }
      return getFsMicroPost(id);
    })
  );

  return microposts
    .filter((mp): mp is MicroPost => mp !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPublishedMicroPosts(): Promise<MicroPost[]> {
  return (await getAllMicroPosts()).filter((mp) => mp.published);
}

export async function saveMicroPost(
  id: string,
  microPost: Omit<MicroPost, 'id'>
): Promise<boolean> {
  try {
    await put(`${BLOB_PREFIX}${id}.md`, serializeMicroPost(id, microPost), {
      access: 'public',
      contentType: 'text/markdown',
      allowOverwrite: true,
    });
    return true;
  } catch (error) {
    console.error('Error saving micro-post:', error);
    return false;
  }
}

export async function deleteMicroPost(id: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${id}.md` });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
    await put(`${BLOB_DELETED_PREFIX}${id}`, 'deleted', {
      access: 'public',
      contentType: 'text/plain',
      allowOverwrite: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting micro-post:', error);
    return false;
  }
}
