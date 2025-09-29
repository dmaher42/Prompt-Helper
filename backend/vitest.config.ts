import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8',
      lines: 70
    },
    env: {
      NODE_ENV: 'test',
      PORT: '0',
      CLIENT_ORIGIN: 'http://localhost:5173',
      DATABASE_PROVIDER: 'sqlite',
      DATABASE_URL: 'file:./src/db/test.db',
      JWT_SECRET: 'test-secret',
      SESSION_COOKIE_NAME: 'prompt_helper_token',
      SESSION_COOKIE_SECURE: 'false'
    }
  }
});
