import { router } from '../trpc';
import { userRouter } from './user';
import { workflowRouter } from './workflow';
import { ticketRouter } from './ticket';

export const appRouter = router({
  userRouter,
  workflowRouter,
  ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
