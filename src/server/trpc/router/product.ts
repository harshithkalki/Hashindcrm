import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ProductModel from '@/models/Product';
import Warehouse from '@/models/Warehouse';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';

export const productRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        logo: z.string().optional(),
        warehouse: z.string(),
        slug: z.string(),
        quantity: z.number(),
        quantityAlert: z.number(),
        category: z.string(),
        brand: z.string(),
        barcodeSymbology: z.string(),
        itemCode: z.string(),
        openingStock: z.number(),
        openingStockDate: z.string(),
        purchasePrice: z.number(),
        salePrice: z.number(),
        mrp: z.number(),
        tax: z.string(),
        expireDate: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create product',
        });
      }

      const isPermitted = await checkPermission(
        'PRODUCT',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create product',
        });
      }

      const product = await ProductModel.create({
        ...input,
        companyId: client.companyId,
      });

      return product;
    }),

  createWarehouse: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create warehouse',
        });
      }

      const isPermitted = await checkPermission(
        'PRODUCT',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create warehouse',
        });
      }

      const warehouse = await Warehouse.create({
        ...input,
        companyId: client.companyId,
      });

      return warehouse;
    }),

  getAllWarehouse: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to access warehouse',
      });
    }

    const isPermitted = await checkPermission(
      'PRODUCT',
      'read',
      client?.toObject(),
      true
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to access warehouse',
      });
    }
    const warehouse = await Warehouse.find({
      companyId: client.companyId,
    });

    return warehouse;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
        quantity: z.number(),
        quantityAlert: z.number(),
        category: z.string(),
        product: z.string(),
        barcode: z.string(),
        itemCode: z.string(),
        openingStock: z.number(),
        openingStockDate: z.date(),
        purchasePrice: z.number(),
        salePrice: z.number(),
        tax: z.number(),
        mrp: z.number(),
        expiryDate: z.date(),
        description: z.string(),
        warehouse: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to update product',
        });
      }

      const isPermitted = await checkPermission(
        'PRODUCT',
        'update',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to update product',
        });
      }

      const product = await ProductModel.findByIdAndUpdate(input.id, input, {
        new: true,
      });

      return product;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete product',
        });
      }

      const isPermitted = await checkPermission(
        'PRODUCT',
        'delete',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete product',
        });
      }

      const product = await ProductModel.findByIdAndDelete(input.id);

      return product;
    }),

  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get products',
      });
    }

    const isPermitted = await checkPermission(
      'PRODUCT',
      'read',
      client?.toObject()
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get products',
      });
    }

    const products = await ProductModel.find({
      companyId: client.companyId,
    })
      .populate(['warehouse', 'category', 'brand'])
      .lean();

    return products.map((val) => ({
      ...val,
      openingStockDate: val.openingStockDate?.toISOString(),
      expiryDate: val.expiryDate?.toISOString(),
      brand: (val.brand as unknown as { name: string }).name as string,
      category: (val.category as unknown as { name: string }).name as string,
      warehouse: (val.warehouse as unknown as { name: string }).name as string,
    }));
  }),

  getProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to get product',
        });
      }

      const isPermitted = await checkPermission(
        'PRODUCT',
        'read',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to get product',
        });
      }

      const product = await ProductModel.findById(input.id).lean();

      return product;
    }),
});
