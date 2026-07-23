export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  published: boolean;
}

export interface MicroPost {
  id: string;
  sourcePostSlug: string | null;
  date: string;
  content: string;
  published: boolean;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  published: boolean;
  order: number;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  published: boolean;
}

export interface MicroPostMetadata {
  id: string;
  sourcePostSlug: string | null;
  date: string;
  published: boolean;
}

export interface PageMetadata {
  slug: string;
  title: string;
  published: boolean;
  order: number;
}
