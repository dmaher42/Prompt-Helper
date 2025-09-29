import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/auth.js';
import { env } from '../lib/env.js';
import { prisma } from '../lib/prisma.js';

export async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', requestId: req.requestId });
    }
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true }
    });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', requestId: req.requestId });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized', requestId: req.requestId });
  }
}
