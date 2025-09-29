import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/server.js';
import { prisma } from '../src/lib/prisma.js';

const app = createApp();

describe('Auth routes', () => {
  it('registers and returns the user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'Password123!'
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('logs in an existing user', async () => {
    await prisma.user.create({
      data: {
        email: 'existing@example.com',
        password: '$2a$10$O1N8dz9eHjnYFQki71oKaeQ1BM8DT6vKrrO5gkP7FpC18JNpDutZ6' // Password123!
      }
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'existing@example.com',
      password: 'Password123!'
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('existing@example.com');
  });

  it('returns the authenticated user', async () => {
    const register = await request(app).post('/api/auth/register').send({
      email: 'me@example.com',
      password: 'Password123!'
    });

    const cookie = register.headers['set-cookie'];
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie as string[]);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });
});
