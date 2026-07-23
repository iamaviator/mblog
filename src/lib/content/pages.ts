import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Page, PageMetadata } from '@/lib/types';

const PAGES_DIR = join(process.cwd(), 'content/pages');

export function getPageMetadata(slug: string): PageMetadata | null {
  try {
    const filePath = join(PAGES_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      published: data.published !== false,
      order: data.order || 0,
    };
  } catch (error) {
    return null;
  }
}

export function getPage(slug: string): Page | null {
  try {
    const filePath = join(PAGES_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      content,
      published: data.published !== false,
      order: data.order || 0,
    };
  } catch (error) {
    return null;
  }
}

export function getAllPages(): Page[] {
  try {
    const files = readdirSync(PAGES_DIR).filter((file) => file.endsWith('.md'));

    return files
      .map((file) => {
        const slug = file.replace('.md', '');
        return getPage(slug);
      })
      .filter((page): page is Page => page !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    return [];
  }
}

export function getPublishedPages(): Page[] {
  return getAllPages().filter((page) => page.published);
}

export function savePage(slug: string, page: Omit<Page, 'slug'>): boolean {
  try {
    const filePath = join(PAGES_DIR, `${slug}.md`);
    const { content, ...frontmatter } = page;

    const fileContent = `---
slug: "${slug}"
title: "${frontmatter.title.replace(/"/g, '\\"')}"
published: ${frontmatter.published}
order: ${frontmatter.order}
---

${content}`;

    writeFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    console.error('Error saving page:', error);
    return false;
  }
}

export function deletePage(slug: string): boolean {
  try {
    const filePath = join(PAGES_DIR, `${slug}.md`);
    const { unlinkSync } = require('fs');
    unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting page:', error);
    return false;
  }
}
