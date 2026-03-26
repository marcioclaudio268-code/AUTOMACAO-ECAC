import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'ecac_token';
const AUTH_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
}

export function getClearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
}

export function readCookieValue(
  cookieHeader: string | undefined,
  cookieName: string
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const cookiePair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookiePair) {
    return undefined;
  }

  const rawValue = cookiePair.slice(cookieName.length + 1);

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}
