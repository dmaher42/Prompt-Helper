import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { ensureAuth } from '../middleware/ensure-auth.js';

const PromptSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(10),
  category: z.string().min(2).max(50)
});

export const promptsRouter = Router();

promptsRouter.use(ensureAuth);

promptsRouter.post('/', async (req, res, next) => {
  try {
    const data = PromptSchema.parse(req.body);
    const prompt = await prisma.prompt.create({
      data: {
        ...data,
        ownerId: req.user!.id
      }
    });
    return res.status(201).json({ prompt });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid prompt data', requestId: req.requestId });
    }
    return next(error);
  }
});

promptsRouter.get('/', async (req, res) => {
  const prompts = await prisma.prompt.findMany({
    where: { ownerId: req.user!.id },
    orderBy: { updatedAt: 'desc' }
  });
  res.json({ prompts });
});

promptsRouter.get('/:id', async (req, res) => {
  const prompt = await prisma.prompt.findFirst({
    where: { id: req.params.id, ownerId: req.user!.id }
  });
  if (!prompt) {
    return res.status(404).json({ error: 'Not found', requestId: req.requestId });
  }
  res.json({ prompt });
});

promptsRouter.put('/:id', async (req, res, next) => {
  try {
    const data = PromptSchema.partial().refine((val) => Object.keys(val).length > 0, {
      message: 'No fields provided'
    }).parse(req.body);

    const existing = await prisma.prompt.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Not found', requestId: req.requestId });
    }

    const prompt = await prisma.prompt.update({
      where: { id: existing.id },
      data: data
    });
    res.json({ prompt });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid prompt data', requestId: req.requestId });
    }
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Not found', requestId: req.requestId });
    }
    return next(error);
  }
});

promptsRouter.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.prompt.findFirst({
      where: { id: req.params.id, ownerId: req.user!.id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Not found', requestId: req.requestId });
    }

    await prisma.prompt.delete({
      where: { id: existing.id }
    });
    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Not found', requestId: req.requestId });
    }
    return next(error);
  }
});
