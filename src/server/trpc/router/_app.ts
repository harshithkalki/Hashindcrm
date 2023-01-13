import { router } from '../trpc';
import { userRouter } from './user';
import { workflowRouter } from './workflow';

export const appRouter = router({
  userRouter,
  workflowRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
