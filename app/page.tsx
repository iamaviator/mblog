import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/utils/seo';
import HomeClient from './home-client';

export const metadata: Metadata = generateHomeMetadata();

export default function Home() {
  return <HomeClient />;
}
