import { router } from '../trpc';
import { userRouter } from './user';
import { workflowRouter } from './workflow';
import { ticketRouter } from './ticket';
import { brandRouter } from './brand';
import { categoryRouter } from './category';
import { productRouter } from './product';

export const appRouter = router({
  userRouter,
  workflowRouter,
  ticketRouter,
  brandRouter,
  categoryRouter,
  productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
