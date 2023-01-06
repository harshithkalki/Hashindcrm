import { router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
  userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
