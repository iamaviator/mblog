import type { Metadata } from 'next';
import { generateMicroblogMetadata } from '@/lib/utils/seo';
import MicroblogPageClient from './client';

export const metadata: Metadata = generateMicroblogMetadata();

export default function MicroblogPage() {
  return <MicroblogPageClient />;
}
