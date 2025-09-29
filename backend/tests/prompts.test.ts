import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/server.js';

const app = createApp();

async function getAuthCookie() {
  const res = await request(app).post('/api/auth/register').send({
    email: 'owner@example.com',
    password: 'Password123!'
  });
  return res.headers['set-cookie'] as string[];
}

describe('Prompt routes', () => {
  it('creates and lists prompts', async () => {
    const cookie = await getAuthCookie();

    const createRes = await request(app)
      .post('/api/prompts')
      .set('Cookie', cookie)
      .send({
        title: 'Test Prompt',
        content: 'This is the content of the prompt',
        category: 'General'
      });

    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/prompts').set('Cookie', cookie);
    expect(listRes.status).toBe(200);
    expect(listRes.body.prompts).toHaveLength(1);
  });

  it('prevents access without authentication', async () => {
    const res = await request(app).get('/api/prompts');
    expect(res.status).toBe(401);
  });

  it('updates and deletes a prompt', async () => {
    const cookie = await getAuthCookie();

    const createRes = await request(app)
      .post('/api/prompts')
      .set('Cookie', cookie)
      .send({
        title: 'Another Prompt',
        content: 'Prompt content example',
        category: 'Sales'
      });

    const promptId = createRes.body.prompt.id as string;

    const updateRes = await request(app)
      .put(`/api/prompts/${promptId}`)
      .set('Cookie', cookie)
      .send({ title: 'Updated Prompt' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.prompt.title).toBe('Updated Prompt');

    const deleteRes = await request(app)
      .delete(`/api/prompts/${promptId}`)
      .set('Cookie', cookie);

    expect(deleteRes.status).toBe(204);
  });
});
