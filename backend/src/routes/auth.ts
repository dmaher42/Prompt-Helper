import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';
import { env } from '../lib/env.js';
import { ensureAuth } from '../middleware/ensure-auth.js';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authRouter = Router();

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.SESSION_COOKIE_SECURE,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password } = CredentialsSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered', requestId: req.requestId });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      },
      select: { id: true, email: true }
    });

    const token = signToken(user);
    setAuthCookie(res, token);
    return res.status(201).json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid credentials', requestId: req.requestId });
    }
    return next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = CredentialsSchema.parse(req.body);

    const userRecord = await prisma.user.findUnique({ where: { email } });
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid email or password', requestId: req.requestId });
    }

    const valid = await bcrypt.compare(password, userRecord.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password', requestId: req.requestId });
    }

    const user = { id: userRecord.id, email: userRecord.email };
    const token = signToken(user);
    setAuthCookie(res, token);
    return res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid credentials', requestId: req.requestId });
    }
    return next(error);
  }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(env.SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.SESSION_COOKIE_SECURE,
    sameSite: 'lax'
  });
  res.status(204).send();
});

authRouter.get('/me', ensureAuth, async (req, res) => {
  res.json({ user: req.user });
});
