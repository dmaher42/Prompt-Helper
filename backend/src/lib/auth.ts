import jwt from 'jsonwebtoken';
import type { User } from '../db/types.js';
import { env } from './env.js';

interface TokenPayload {
  sub: string;
  email: string;
}

export function signToken(user: User) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
