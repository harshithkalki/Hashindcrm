import SaleReturn from '@/models/SaleReturn';
import { ZSaleReturnCreateInput } from '@/zobjs/saleReturn';
import { protectedProcedure, router } from '../trpc';
import checkPermission from '@/utils/checkPermission';
import Product from '@/models/Product';

export const saleReturnRouter = router({
  create: protectedProcedure
    .input(ZSaleReturnCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALE_RETURN',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create sale return"
      );

      const saleReturn = await SaleReturn.create({
        ...input,
        clientId: client.id,
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
              quantity: product.quantity,
            },
          });
        })
      );

      return saleReturn;
    }),
});
