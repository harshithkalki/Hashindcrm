import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env.test.local',
});

export default defineConfig({
  test: {
    globalSetup: './src/server/trpc/router/__test/setup/setup.ts',
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
});
