// Admin authentication utility
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) {
    console.warn('No admin password configured');
    return false;
  }

  try {
    return await compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

// Generate a hash for a given password (useful for setup)
// Run this once: node -e "require('bcryptjs').hash('your_password', 10).then(console.log)"
export async function generatePasswordHash(password: string): Promise<string> {
  return hashPassword(password);
}

// Check if request is from authenticated admin
export function checkAdminAuth(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return false;
  }

  const cookies = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies.admin_token === 'authenticated';
}
