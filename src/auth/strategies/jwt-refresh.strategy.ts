// strategies/jwt-refresh.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

export const REFRESH_COOKIE = 'refreshToken';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.[REFRESH_COOKIE];
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.[REFRESH_COOKIE];
    return { ...payload, refreshToken };
  }
}
