import { protectedProcedure, router } from '../trpc';
import { z } from 'zod';
import Product from '@/models/Product';
import checkPermission from '@/utils/checkPermission';
import Sale from '@/models/Sale';
import Purchase from '@/models/Purchase';
import Expense from '@/models/Expense';

export const reports = router({
  paymentsReport: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'REPORT',
        { read: true },
        ctx.clientId,
        'You are not permitted to read reports'
      );

      const { cursor: page = 1, limit = 10 } = input || {};

      if (page === null) return null;

      const options = {
        page: page ?? 1,
        limit: limit,
        sort: { createdAt: -1 },
      };

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

      const sales = await Sale.paginate(query, {
        ...options,
        limit: options.limit / 3,
        populate: [
          {
            path: 'customer',
            select: 'name',
          },
        ],
      });

      sales.docs.forEach((sale) => {
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

      const purchases = await Purchase.paginate(query, {
        ...options,
        limit: options.limit / 3,
        populate: [
          {
            path: 'supplier',
            select: 'name',
          },
        ],
      });

      purchases.docs.forEach((purchase) => {
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

      const expenses = await Expense.paginate(query, {
        ...options,
        limit: options.limit / 3,
      });

      expenses.docs.forEach((expense) => {
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

      return {
        docs: report,
        totalDocs: sales.totalDocs + purchases.totalDocs + expenses.totalDocs,
        limit: options.limit,
        totalPages:
          sales.totalPages + purchases.totalPages + expenses.totalPages,
        page: options.page,
        nextPage:
          page * limit <
          sales.totalDocs + purchases.totalDocs + expenses.totalDocs
            ? page + 1
            : null,
        prevPage:
          page > 1
            ? page >
              sales.totalPages + purchases.totalPages + expenses.totalPages
              ? sales.totalPages + purchases.totalPages + expenses.totalPages
              : page - 1
            : null,
      };
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

      const { cursor: page = 1, limit = 10, search } = input || {};

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

      const sales = await Sale.paginate(
        { ...query },
        {
          ...options,
          populate: [
            {
              path: 'customer',
              select: 'name',
            },
            ...options.populate,
          ],
        }
      );
      const purchases = await Purchase.paginate(
        { ...query },
        {
          ...options,
          populate: [
            {
              path: 'supplier',
              select: 'name',
            },
            ...options.populate,
          ],
        }
      );

      return {
        docs: [...sales.docs, ...purchases.docs],
        totalDocs: sales.totalDocs + purchases.totalDocs,
        limit: options.limit,
        totalPages:
          sales.totalPages > purchases.totalPages
            ? sales.totalPages
            : purchases.totalPages,
        page: options.page,
        nextPage:
          sales.totalPages > purchases.totalPages
            ? sales.nextPage
            : purchases.nextPage,
        prevPage:
          sales.totalPages > purchases.totalPages
            ? sales.prevPage
            : purchases.prevPage,
      };
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
