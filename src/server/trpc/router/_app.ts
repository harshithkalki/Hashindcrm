import { router } from '../trpc';
import { staffRouter } from './staffMem';
import { workflowRouter } from './workflow';
import { ticketRouter } from './ticket';
import { brandRouter } from './brand';
import { categoryRouter } from './category';
import { productRouter } from './product';
import { stockAdjustRouter } from './stockAdjust';
import { stockTransferRouter } from './stockTransfer';
import { auth } from './auth';
import { roleRouter } from './role';
import { customerRouter } from './customer';
import { supplierRouter } from './supplier';

export const appRouter = router({
  staffRouter,
  workflowRouter,
  ticketRouter,
  brandRouter,
  categoryRouter,
  productRouter,
  stockAdjustRouter,
  stockTransferRouter,
  auth,
  roleRouter,
  customerRouter,
  supplierRouter,
});
export type AppRouter = typeof appRouter;
