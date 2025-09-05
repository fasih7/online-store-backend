import * as crypto from 'crypto';
import { Token } from '../../user/utils/constants';
import { Status } from 'src/user/utils/enums';
import { UnprocessableEntityException } from '@nestjs/common';

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
//TODO: move to global
export const getTokenValues = (): Token => {
  const value = generateRandomToken(6).toUpperCase();
  const expiration = new Date()
    .setMinutes(new Date().getMinutes() + 3)
    .toString();
  return { value, expiration, tries: 5 };
};

export const checkStatus = (status: string) => {
  if (status === Status.pending)
    throw new UnprocessableEntityException('User has not been verified yet');
  if (status === Status.blocked)
    throw new UnprocessableEntityException('User has been blocked');
  return status === Status.active;
};
