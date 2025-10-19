import { Response } from 'express';
import { REFRESH_COOKIE } from '../auth/strategies/jwt-refresh.strategy';

export function setRtCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/', // or '/graphql
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30d
  });
}

export function clearRtCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/' });
}
