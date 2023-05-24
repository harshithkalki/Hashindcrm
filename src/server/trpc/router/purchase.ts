import Purchase from '@/models/Purchase';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import type { ZPurchase } from '@/zobjs/purchase';
import { ZPurchaseCreateInput, ZPurchaseUpdateInput } from '@/zobjs/purchase';
import { z } from 'zod';
import type CompanyModel from '@/models/Company';
import WarehouseModel from '@/models/Warehouse';
import type { Warehouse } from '@/zobjs/warehouse';
import type { Company } from '@/zobjs/company';
import type { Product } from '@/zobjs/product';
import ProductModel from '@/models/Product';

export const purchaseRouter = router({
  create: protectedProcedure
    .input(ZPurchaseCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create purchases"
      );

      let invoiceId = '';

      const count = await Count.findOneAndUpdate(
        {
          company: client.company,
          name: 'purchase',
        },
        {
          $inc: {
            count: 1,
          },
        },
        {
          new: true,
        }
      );

      if (count) {
        invoiceId = `${count.count}`;
      } else {
        const newCount = await Count.create({
          count: 1,
          company: client.company,
          name: 'purchase',
        });

        invoiceId = `${newCount.count}`;
      }

      const purchase = await Purchase.create({
        ...input,
        company: client.company,
        invoiceId,
        supplier: input.supplier,
      });

      await Promise.all(
        input.products.map(async (product) => {
          await ProductModel.findOneAndUpdate(
            {
              _id: product._id,
              company: client.company,
            },
            {
              $inc: {
                quantity: product.quantity,
              },
            }
          );
        })
      );

      return purchase;
    }),

  update: protectedProcedure
    .input(ZPurchaseUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update purchases"
      );

      const purchase = await Purchase.findOneAndUpdate(
        {
          invoiceId: input.id,
          company: client.company,
        },
        input,
        {
          new: true,
        }
      );

      return purchase;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete purchases"
      );

      const purchase = await Purchase.findOneAndDelete({
        invoiceId: input._id,
        company: client.company,
      });

      return purchase;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findById(input._id);

      return purchase;
    }),

  getByInvoiceId: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findOne({
        invoiceId: input.invoiceId,
        company: client.company,
      });

      return purchase;
    }),

  purchases: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
        sort: {
          createdAt: -1,
        },
      };

      const query = {
        company: client.company,
      };

      const brands = await Purchase.paginate(query, {
        ...options,
        populate: ['supplier'],
      });

      return brands;
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findById(input._id)
        .populate<{
          company: Company;
          products: {
            _id: Product & { _id: string };
            price: number;
            quantity: number;
          }[];
        }>('products._id company')
        .lean();

      if (!purchase) {
        throw new Error('Purchase not found');
      }

      const warehouse =
        (await WarehouseModel.findById(purchase.warehouse).lean()) ?? undefined;

      return {
        ...purchase,
        warehouse,
        products: purchase.products.map((product) => ({
          ...product,
          ...product._id,
          quantity: product.quantity,
        })),
      };
    }),

  getAllPurchases: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const { startDate, endDate } = input || {};

      const query = {
        company: client.company,
        ...((startDate || endDate) && {
          date: {
            ...(startDate && { $gte: new Date(startDate) }),
            ...(endDate && { $lte: new Date(endDate) }),
          },
        }),
      };

      const func = Purchase.find(query)
        .populate<{
          supplier: {
            _id: string;
            name: string;
          };
        }>({
          path: 'supplier',
          select: 'name',
        })
        .sort({ date: -1 })
        .lean();

      if (!startDate && !endDate) {
        func.limit(10);
      }

      const sales = (await func).map((sale) => {
        return {
          Date: sale.date.toString(),
          invoiceId: sale.invoiceId,
          CustomerId: sale.supplier._id,
          Discount: sale.discount,
          Shipping: sale.shipping,
          Amount: sale.total,
          SupplierName: sale.supplier.name,
        };
      });

      return sales;
    }),
});
