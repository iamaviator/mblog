export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const cleaned = content
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/[*_~`]/g, '') // Remove emphasis
    .trim();

  // Extract first paragraph or up to maxLength characters
  const paragraphs = cleaned.split('\n\n');
  let excerpt = paragraphs[0] || '';

  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).trim() + '...';
  }

  return excerpt;
}

export function truncateToMicroLength(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
