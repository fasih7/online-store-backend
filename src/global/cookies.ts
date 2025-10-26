import { Response } from 'express';
import { REFRESH_COOKIE } from '../auth/strategies/jwt-refresh.strategy';

export function setRtCookie(res: Response, token: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  console.dir(
    {
      httpOnly: true,
      secure: isProduction, // true in prod, false in local
      sameSite: isProduction ? 'none' : 'lax', // allow cross-origin in dev
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    { depth: null, colors: true },
  );

  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProduction, // true in prod, false in local
    sameSite: isProduction ? 'none' : 'lax', // allow cross-origin in dev
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearRtCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
}
