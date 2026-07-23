import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { MicroPost, MicroPostMetadata } from '@/lib/types';

const MICROPOSTS_DIR = join(process.cwd(), 'content/microposts');

export function getMicroPostMetadata(id: string): MicroPostMetadata | null {
  try {
    const filePath = join(MICROPOSTS_DIR, `${id}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      id: data.id || id,
      sourcePostSlug: data.sourcePostSlug || null,
      date: data.date || new Date().toISOString().split('T')[0],
      published: data.published !== false,
    };
  } catch (error) {
    return null;
  }
}

export function getMicroPost(id: string): MicroPost | null {
  try {
    const filePath = join(MICROPOSTS_DIR, `${id}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      id: data.id || id,
      sourcePostSlug: data.sourcePostSlug || null,
      date: data.date || new Date().toISOString().split('T')[0],
      content: content.trim(),
      published: data.published !== false,
    };
  } catch (error) {
    return null;
  }
}

export function getAllMicroPosts(): MicroPost[] {
  try {
    const files = readdirSync(MICROPOSTS_DIR).filter((file) => file.endsWith('.md'));

    return files
      .map((file) => {
        const id = file.replace('.md', '');
        return getMicroPost(id);
      })
      .filter((mp): mp is MicroPost => mp !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return [];
  }
}

export function getPublishedMicroPosts(): MicroPost[] {
  return getAllMicroPosts().filter((mp) => mp.published);
}

export function saveMicroPost(
  id: string,
  microPost: Omit<MicroPost, 'id'>
): boolean {
  try {
    const filePath = join(MICROPOSTS_DIR, `${id}.md`);

    const fileContent = `---
id: "${id}"
sourcePostSlug: ${microPost.sourcePostSlug ? `"${microPost.sourcePostSlug}"` : 'null'}
date: "${microPost.date}"
published: ${microPost.published}
---

${microPost.content}`;

    writeFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    console.error('Error saving micro-post:', error);
    return false;
  }
}

export function deleteMicroPost(id: string): boolean {
  try {
    const filePath = join(MICROPOSTS_DIR, `${id}.md`);
    const { unlinkSync } = require('fs');
    unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting micro-post:', error);
    return false;
  }
}
