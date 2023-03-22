import Sale from '@/models/Sale';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import type { ZSale } from '@/zobjs/sale';
import { ZSaleCreateInput, ZSaleUpdateInput } from '@/zobjs/sale';
import { z } from 'zod';
import type CompanyModel from '@/models/Company';
import WarehouseModel from '@/models/Warehouse';
import type { Warehouse } from '@/zobjs/warehouse';
import type { Company } from '@/zobjs/company';
import type { Product } from '@/zobjs/product';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import type { Category } from '@/zobjs/category';
import Customer from '@/models/Customer';
import mongoose from 'mongoose';

export const saleRouter = router({
  create: protectedProcedure
    .input(ZSaleCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create sales"
      );

      let invoiceId = '';

      const count = await Count.findOneAndUpdate(
        {
          company: client.company,
          name: 'invoice',
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
          name: 'invoice',
        });

        invoiceId = `${newCount.count}`;
      }

      const products = await Promise.all(
        input.products.map(async (element) => {
          const product = await ProductModel.findById(element._id);
          if (product) {
            if (product.quantity < element.quantity) {
              throw new Error('Not enough quantity');
            }
          }
          return product;
        })
      );

      await Promise.all(
        input.products.map(async (element) => {
          const product = products.find(
            (product) => product?._id.toString() == element._id
          );

          product?.quantity && (product.quantity -= element.quantity);

          await product?.save();
        })
      );

      const sale = await Sale.create({
        ...input,
        company: client.company,
        invoiceId,
        customer: !input.customer ? 'Walk in Customer' : input.customer,
      });

      return sale;
    }),

  update: protectedProcedure
    .input(ZSaleUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update sales"
      );

      const sale = await Sale.findOneAndUpdate(
        {
          _id: input.id,
          company: client.company,
        },
        input,
        {
          new: true,
        }
      );

      return sale;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete sales"
      );

      const sale = await Sale.findOneAndDelete({
        invoiceId: input._id,
        company: client.company,
      });

      return sale;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const sale = await Sale.findById(input._id);

      return sale;
    }),

  getByInvoiceId: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const sale = await Sale.findOne({
        invoiceId: input.invoiceId,
        company: client.company,
      });

      return {
        ...sale,
        customer: mongoose.isValidObjectId(sale?.customer)
          ? await Customer.findOne({
              _id: sale?.customer,
            }).lean()
          : 'Walk in Customer',
      };
    }),

  sales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
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

      const brands = await Sale.paginate(query, {
        ...options,
        lean: true,
      });

      const brandsWithCustomer = await Promise.all(
        brands.docs.map(async (brand) => {
          if (mongoose.isValidObjectId(brand.customer)) {
            const customer = await Customer.findOne({
              _id: brand.customer,
            }).lean();
            return { ...brand, customer: customer ?? 'Walk in Customer' };
          }

          return { ...brand, customer: 'Walk in Customer' };
        })
      );

      return {
        ...brands,
        docs: brandsWithCustomer,
      };
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(
      async ({
        input,
        ctx,
        // }): Promise<
        //   ModifyDeep<
        //     Omit<z.infer<typeof ZSale>, 'products' | 'warehouse'>,
        //     {
        //       company?: Company;
        //       // warehouse?: Warehouse;
        //       products: {
        //         _id: string;
        //         name: string;
        //         price: number;
        //         quantity: number;
        //       }[];
        //     }
        //   >
        // > => {
      }) => {
        const client = await checkPermission(
          'SALES',
          {
            read: true,
          },
          ctx.clientId,
          "You don't have permission to read sales"
        );

        const sale = await Sale.findById(input._id)
          .populate<{
            company: Company;
            products: {
              _id: Product & { _id: string };
              price: number;
              quantity: number;
            }[];
          }>('products._id company')
          .lean();

        if (!sale) {
          throw new Error('Sale not found');
        }

        const warehouse =
          (await WarehouseModel.findById(sale.warehouse).lean()) ?? undefined;

        return {
          ...sale,
          warehouse,
          products: sale.products.map((product) => ({
            ...product,
            ...product._id,
            quantity: product.quantity,
          })),
          customer: mongoose.isValidObjectId(sale?.customer)
            ? await Customer.findOne({
                _id: sale?.customer,
              }).lean()
            : 'Walk in Customer',
        };
      }
    ),

  getCashSales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'cash',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getCardSales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'card',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getUPISales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'upi',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getCategoriesForPos: protectedProcedure
    .input(
      z.object({
        warehouse: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'POS',
        {
          create: true,
          update: true,
        },
        ctx.clientId,
        "You don't have permission to read categories"
      );

      const products = await ProductModel.find({
        company: client.company,
        warehouse: input.warehouse,
      }).populate<{
        category: Category & { _id: string };
      }>('category');

      const categories = products
        .map((product) => product.category)
        .filter((category) => category !== null);

      return [...new Set(categories)];
    }),
});
