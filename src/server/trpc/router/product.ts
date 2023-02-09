import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ProductModel, { ProductDocument } from '@/models/Product';
import type { WarehouseDocument } from '@/models/Warehouse';
import WarehouseModel from '@/models/Warehouse';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';
import type { CategoryDocument } from '@/models/Category';
import CategoryModel from '@/models/Category';
import type { BrandDocument } from '@/models/Brand';

const getAllChildCategories = async (
  category: string
): Promise<
  {
    _id: string;
    name: string;
    slug: string;
    parentCategory: string;
  }[]
> => {
  const categories = await CategoryModel.find({
    parentCategory: category,
  }).lean();

  if (categories.length === 0) {
    return [];
  }

  const childCategories = await Promise.all(
    categories.map(async (category) => {
      const child = await getAllChildCategories(category._id.toString());
      return child;
    })
  );

  return [
    ...childCategories.flat(),
    ...categories.map((category) => {
      return {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        parentCategory: category.parentCategory as unknown as string,
      };
    }),
  ];
};

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

      const warehouse = await WarehouseModel.create({
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
    const warehouse = await WarehouseModel.find({
      companyId: client.companyId,
    });

    return warehouse;
  }),

  getProductsByCategory: protectedProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to access product',
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
          message: 'You are not permitted to access product',
        });
      }

      if (input.category === '') {
        return [];
      }

      const products = await ProductModel.find({
        companyId: client.companyId,
        category: input.category,
      }).lean();

      if (products.length === 0) {
        const childCategories = await getAllChildCategories(input.category);

        console.log(childCategories, 'childCategories');

        const products = await ProductModel.find({
          companyId: client.companyId,
          category: {
            $in: childCategories.map((category) => category._id),
          },
        }).lean();

        return products;
      }

      return products;
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
      .populate<{
        warehouse: WarehouseDocument;
        category: CategoryDocument;
        brand: BrandDocument;
      }>(['warehouse', 'category', 'brand'])
      .lean();

    await Promise.all(
      products.map(async (product) => {
        if (
          !product.category ||
          !(product.category as unknown as { name: string }).name
        ) {
          await ProductModel.deleteOne({ _id: product._id });
        }
      })
    );

    return products.map((val) => ({
      ...val,
      openingStockDate: val.openingStockDate?.toISOString(),
      expiryDate: val.expiryDate?.toISOString(),
      brand: val.brand.name,
      category: val.category.name,
      warehouse: val.warehouse.name,
    }));
  }),

  getProducts: protectedProcedure
    .input(
      z
        .object({
          page: z.number(),
          limit: z.number().optional(),

          category: z.string().optional(),
        })
        .optional()
    )

    .query(async ({ input, ctx }) => {
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

      const { page, limit } = input || {};

      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: {
          name: 1,
        },
        populate: [
          {
            path: 'category',
            select: 'name',
          },
          {
            path: 'brand',
            select: 'name',
          },
          {
            path: 'warehouse',
            select: 'name',
          },
        ],
      };

      const query = {
        companyId: client.companyId,
        ...(input?.category && { category: input.category }),
      };

      const products = await ProductModel.paginate(query, options);

      return products;
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
