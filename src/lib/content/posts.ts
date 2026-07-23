import matter from 'gray-matter';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Post, PostMetadata } from '@/lib/types';

const POSTS_DIR = join(process.cwd(), 'content/blog');

export function getPostMetadata(slug: string): PostMetadata | null {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug: data.slug || slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      published: data.published !== false,
    };
  } catch (error) {
    return null;
  }
}

export function getPost(slug: string): Post | null {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
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
  } catch (error) {
    return null;
  }
}

export function getAllPosts(): Post[] {
  try {
    const files = readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));

    return files
      .map((file) => {
        const slug = file.replace('.md', '');
        return getPost(slug);
      })
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return [];
  }
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((post) => post.published);
}

export function savePost(slug: string, post: Omit<Post, 'slug'>): boolean {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const { content, ...frontmatter } = post;

    const fileContent = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${frontmatter.date}"
tags: [${frontmatter.tags.map((t) => `"${t}"`).join(', ')}]
excerpt: "${frontmatter.excerpt.replace(/"/g, '\\"')}"
published: ${frontmatter.published}
---

${content}`;

    writeFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    return false;
  }
}

export function deletePost(slug: string): boolean {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const { unlinkSync } = require('fs');
    unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}
