import { protectedProcedure, router } from '../trpc';
import { z } from 'zod';
import Product from '@/models/Product';
import checkPermission from '@/utils/checkPermission';
import Sale from '@/models/Sale';
import Purchase from '@/models/Purchase';
import Expense from '@/models/Expense';

export const reports = router({
  paymentsReport: protectedProcedure
    .query(async ({ ctx, }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );



      const query = {
        company: client.company,
      };

      const report: {
        _id: string;
        paymentDate: string;
        referenceNo: string;
        paymentType: string;
        user: string;
        amount: number;
        type: 'sale' | 'purchase' | 'expense';
      }[] = [];

      const sales = await Sale.find(query).populate('customer', 'name');


      sales?.forEach((sale) => {
        report.push({
          _id: sale._id.toString(),
          paymentDate: sale.createdAt.toISOString(),
          referenceNo: sale.invoiceId,
          paymentType: sale.paymentMode,
          user: (sale.customer as unknown as { name: string }).name,
          amount: sale.total,
          type: 'sale',
        });
      });

      const purchases = await Purchase.find(query).populate(
        'supplier',
        'name'
      );



      purchases.forEach((purchase) => {
        report.push({
          _id: purchase._id.toString(),
          paymentDate: purchase.createdAt.toISOString(),
          referenceNo: purchase.invoiceId,
          paymentType: purchase.paymentMode,
          user: (purchase.supplier as unknown as { name: string }).name,
          amount: purchase.total,
          type: 'purchase',
        });
      });

      const expenses = await Expense.find(query);

      expenses?.forEach((expense) => {
        report.push({
          _id: expense._id.toString(),
          paymentDate: expense.createdAt.toISOString(),
          referenceNo: 'N/A',
          paymentType: 'N/A',
          user: 'N/A',
          amount: expense.amount,
          type: 'expense',
        });
      });

      return report;
    }),

  stockAlerts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
        $expr: { $lt: [{ $subtract: ['$quantity', '$quantityAlert'] }, 0] },
      };

      const products = await Product.paginate({ ...query }, options);

      return products;
    }),

  sales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'customer',
            select: 'name',
          },
          {
            path: 'staffMem',
            select: 'name',
          },
        ],
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const products = await Sale.paginate({ ...query }, options);

      return products;
    }),

  stockReport: protectedProcedure
    .query(async ({ ctx }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );


      const query = {
        company: client.company
      };

      const sales = await Sale.find({ ...query }).populate(
        'products._id customer',

      );

      const purchases = await Purchase.find({ ...query }).populate('supplier products._id', 'name');


      return [...sales, ...purchases]
    }),

  productSales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'products._id',
          },
        ],
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  profitAndLoss: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'REPORT',
      { read: true },
      ctx.clientId,
      'You are not permitted to read reports'
    );

    const sales = await Sale.find({ company: client.company });

    const purchases = await Purchase.find({ company: client.company });

    const expenses = await Expense.find({ company: client.company });

    const salesTotal = sales.reduce((acc, sale) => {
      return acc + sale.total;
    }, 0);

    const purchasesTotal = purchases.reduce((acc, purchase) => {
      return acc + purchase.total;
    }, 0);

    const expensesTotal = expenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);

    return {
      salesTotal,
      purchasesTotal,
      expensesTotal,
      profit: salesTotal - purchasesTotal - expensesTotal,
    };
  }),
});
