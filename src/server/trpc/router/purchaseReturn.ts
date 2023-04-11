import Product from '@/models/Product';
import { protectedProcedure, router } from '../trpc';
import PurchaseReturn from '@/models/PurchaseReturn';
import checkPermission from '@/utils/checkPermission';
import { ZPurchaseReturnCreateInput } from '@/zobjs/purchaseReturn';
import { z } from 'zod';

export const purchaseReturnRouter = router({
    create: protectedProcedure.input(
        ZPurchaseReturnCreateInput
    ).mutation(async ({ input, ctx }) => {
        const client = await checkPermission(
            'PURCHASE_RETURN',
            {
                create: true,
            },
            ctx.clientId,
            "You don't have permission to create purchase returns"
        );

        const purchaseReturn = await PurchaseReturn.create({
            ...input,
            company: client.company,
        });

        await Promise.all(
            input.products.map(async (product) => {
                const productModel = await Product.findOne({
                    _id: product._id,
                });

                if (!productModel) {
                    throw new Error('Product not found');
                }

                await productModel.updateOne({
                    $inc: {
                        quantity: -product.quantity,
                    },
                });
            })
        );

        return purchaseReturn;
    }),

    purchaseReturns: protectedProcedure
        .input(z.object({
            cursor: z.number().optional(),
            limit: z.number().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const client = await checkPermission(
                'PURCHASE_RETURN',
                {
                    read: true,
                },
                ctx.clientId,
                "You don't have permission to read purchase returns"
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


            const purchaseReturns = await PurchaseReturn.paginate(query, {
                ...options,
                lean: true,
            });


            return purchaseReturns;

        }),


});



