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
import { expenseCategoryRouter } from './expenseCategory';
import { expenseRouter } from './expense';
import { companyRouter } from './company';
import { warehouseRouter } from './warehouse';
import { saleRouter } from './sale';
import { purchaseRouter } from './purchase';
import { carRouter } from './car';
import { reports } from './report';
import { saleReturnRouter } from './salesReturn';
import { purchaseReturnRouter } from './purchaseReturn';
import { daashboardRouter } from './dashboard';
import { filesRouter } from './files';

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
  saleRouter,
  roleRouter,
  customerRouter,
  supplierRouter,
  expenseRouter,
  companyRouter,
  expenseCategoryRouter,
  warehouseRouter,
  purchaseRouter,
  carRouter,
  reports,
  saleReturnRouter,
  purchaseReturnRouter,
  daashboardRouter,
  filesRouter,
});
export type AppRouter = typeof appRouter;
