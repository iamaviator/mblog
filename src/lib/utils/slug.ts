import slugify from 'slugify';

export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function generateMicroPostId(): string {
  return `mp-${Date.now()}`;
}
