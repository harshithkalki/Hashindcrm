import { router } from '../trpc';
import { userRouter } from './user';
import { workflowRouter } from './workflow';
import { ticketRouter } from './ticket';
import { brandRouter } from './brand';

export const appRouter = router({
  userRouter,
  workflowRouter,
  ticketRouter,
  brandRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
