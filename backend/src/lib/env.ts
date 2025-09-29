import { config } from 'dotenv';
import { z } from 'zod';

config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().url(),
  DATABASE_URL: z.string(),
  DATABASE_PROVIDER: z.enum(['sqlite', 'postgresql']).default('sqlite'),
  JWT_SECRET: z.string().min(16),
  SESSION_COOKIE_NAME: z.string().default('prompt_helper_token'),
  SESSION_COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true')
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_PROVIDER: process.env.DATABASE_PROVIDER,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  SESSION_COOKIE_SECURE: process.env.SESSION_COOKIE_SECURE
});
