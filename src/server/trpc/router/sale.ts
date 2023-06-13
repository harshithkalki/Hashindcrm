import Sale from '@/models/Sale';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import { ZSaleCreateInput, ZSaleUpdateInput } from '@/zobjs/sale';
import { z } from 'zod';
import WarehouseModel from '@/models/Warehouse';
import type { Company } from '@/zobjs/company';
import type { Product } from '@/zobjs/product';
import ProductModel from '@/models/Product';
import type { Category } from '@/zobjs/category';
import Customer from '@/models/Customer';
import mongoose from 'mongoose';
import { TRPCError } from '@trpc/server';

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
              throw new TRPCError({
                code: "BAD_REQUEST",
                cause: "Quantity not available",
                message: "Quantity not available",
              })
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

      const customer: { name: string } = { name: "Walk in Customer" };
      if (input.customer) {
        const { _id, name } = await Customer.findOne({
          _id: input.customer,
        }) ?? {};
        if (_id && name) {
          customer.name = name;
        }
      }


      const sale = await Sale.create({
        ...input,
        company: client.company,
        invoiceId,
        customer: {
          ...(input.customer && { _id: input.customer }),
          name: customer.name,
        }
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
        startDate: z.string().optional(),
        endDate: z.string().optional(),
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
        ...((input.startDate || input.endDate) && {
          createdAt: {
            ...(input.startDate && { $gte: new Date(input.startDate) }),
            ...(input.endDate && { $lt: new Date(input.endDate) }),
          },
        }),
      };

      const sales = await Sale.paginate(query, {
        ...options,
        lean: true,
      });

      const salesWithCustomer = await Promise.all(
        sales.docs.map(async (sale) => {

          return {
            ...sale, customer: sale.customer._id
              ? await Customer.findOne({
                _id: sale?.customer._id,
              }).lean()
              : 'Walk in Customer',
          };
        })
      );

      return {
        ...sales,
        docs: salesWithCustomer,
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
          customer: sale.customer._id
            ? await Customer.findOne({
              _id: sale?.customer._id,
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
        populate: {
          path: 'customer',
          select: 'name',
        },
        sort: {
          createdAt: -1,
        },
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
        sort: {
          createdAt: -1,
        },
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
        sort: {
          createdAt: -1,
        },
      };

      const query = {
        company: client.company,
        paymentMode: 'upi',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getAllUPISales: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'SALES',
      {
        read: true,
      },
      ctx.clientId,
      "You don't have permission to read sales"
    );
    const query = {
      company: client.company,
      paymentMode: 'upi',
    };

    const data = await Sale.find(query).lean();
    const sales = data.map((sale) => {
      return {
        Date: sale.date.toISOString(),
        invoiceId: sale.invoiceId,
        Customer: sale.customer.name,
        Discount: sale.discount,
        Shipping: sale.shipping,
        Amount: sale.total,
      };
    });

    return sales;
  }),

  getAllCardSales: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'SALES',
      {
        read: true,
      },
      ctx.clientId,
      "You don't have permission to read sales"
    );
    const query = {
      company: client.company,
      paymentMode: 'card',
    };
    const data = await Sale.find(query).lean();
    const sales = data.map((sale) => {
      return {
        Date: sale.date.toString(),
        invoiceId: sale.invoiceId,
        Customer: sale.customer.name,
        Discount: sale.discount,
        Shipping: sale.shipping,
        Amount: sale.total,
      };
    });
    return sales;
  }),

  getAllCashSales: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'SALES',
      {
        read: true,
      },
      ctx.clientId,
      "You don't have permission to read sales"
    );
    const query = {
      company: client.company,
      paymentMode: 'cash',
    };

    const data = await Sale.find(query).lean();
    const sales = data.map((sale) => {
      return {
        Date: sale.date.toString(),
        invoiceId: sale.invoiceId,
        Customer: sale.customer.name,
        Discount: sale.discount,
        Shipping: sale.shipping,
        Amount: sale.total,
      };
    });
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

  getAllSales: protectedProcedure.input(
    z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).query(async ({ input, ctx }) => {
    const client = await checkPermission(
      'SALES',
      {
        read: true,
      },
      ctx.clientId,
      "You don't have permission to read sales"
    );

    const { startDate, endDate } = input || {};

    const query = {
      company: client.company,
      ...(
        (startDate || endDate) && {
          date: {
            ...(startDate && { $gte: new Date(startDate) }),
            ...(endDate && { $lte: new Date(endDate) }),
          },
        }
      )
    };

    const func = Sale.find(query).populate<
      {
        customer: {
          _id: string;
          name: string;
        }
      }>({
        path: 'customer',
        select: 'name',
      }).sort({ date: -1 })
      .lean();

    if (!startDate && !endDate) {
      func.limit(10);
    }

    const sales = (await func).map((sale) => {
      return {
        Date: sale.date.toString(),
        invoiceId: sale.invoiceId,
        CustomerId: sale.customer._id,
        Discount: sale.discount,
        Shipping: sale.shipping,
        Amount: sale.total,
        CustomerName: sale.customer.name,
      };
    });

    return sales;
  }),

});
