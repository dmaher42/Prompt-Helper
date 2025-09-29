import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { env } from './lib/env.js';
import { httpLogger, logger } from './lib/logger.js';
import { authRouter } from './routes/auth.js';
import { promptsRouter } from './routes/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use((req, res, next) => {
    const requestId = randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  });

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(httpLogger);

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/prompts', promptsRouter);

  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const status = err?.statusCode ?? err?.status ?? 500;
    const message = err?.message ?? 'Internal Server Error';
    logger.error({ err, requestId: req.requestId }, 'Unhandled error');
    res.status(status).json({ error: message, requestId: req.requestId });
  };

  app.use(errorHandler);

  return app;
}

if (import.meta.url === `file://${__filename}`) {
  const app = createApp();
  const port = env.PORT;
  app.listen(port, () => {
    logger.info({ port }, 'Server started');
  });
}

export { __dirname };
