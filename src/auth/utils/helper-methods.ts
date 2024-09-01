import * as crypto from 'crypto';
import { Token } from '../../user/utils/constants';

export const generateRandomToken = (length: number) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const isNotExpired = (expirationTime: string) => {
  const currentTime = new Date().valueOf();
  return +expirationTime > currentTime;
};

export const getTokenValues = (): Token => {
  const value = generateRandomToken(6).toUpperCase();
  const expiration = new Date()
    .setMinutes(new Date().getMinutes() + 3)
    .toString();
  return { value, expiration, tries: 2 };
};
