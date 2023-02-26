import { router } from '../trpc';
import { userRouter } from './staffMem';
import { workflowRouter } from './workflow';
import { ticketRouter } from './ticket';
import { brandRouter } from './brand';
import { categoryRouter } from './category';
import { productRouter } from './product';
import { stockAdjustRouter } from './stockAdjust';
import { stockTransferRouter } from './stockTransfer';

export const appRouter = router({
  userRouter,
  workflowRouter,
  ticketRouter,
  brandRouter,
  categoryRouter,
  productRouter,
  stockAdjustRouter,
  stockTransferRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
