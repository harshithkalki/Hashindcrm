import { appRouter } from '@/server/trpc/router/_app';
import type { NextApiHandler } from 'next';
import { nextHandler } from 'trpc-playground/handlers/next';

const setupHandler = nextHandler({
  router: appRouter,
  trpcApiEndpoint: '/api/trpc',
  playgroundEndpoint: '/api/trpc-playground',
  polling: {
    interval: 4000,
  },

  request: {
    superjson: true,
  },
});

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler;
  await playgroundHandler(req, res);
};

export default handler;
