import checkPermission from '@/utils/checkPermission';
import { router, protectedProcedure } from "../trpc"
import type { ISale } from "@/models/Sale";
import Sale from "@/models/Sale";
import Purchase from "@/models/Purchase";
import Expense from '@/models/Expense';
import { z } from 'zod';
import Product from '@/models/Product';
import SaleReturn from '@/models/SaleReturn';
import PurchaseReturn from '@/models/PurchaseReturn';

export const daashboardRouter = router({
    dashboard: protectedProcedure.input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    })).query(async ({ ctx, input }) => {
        const client = await checkPermission(
            'DASHBOARD',
            { read: true },
            ctx.clientId,
            'You are not permitted to create car'
        );



        const sales = await Sale.find({
            company: client.company,

            ...((input.startDate || input.endDate) && {
                createdAt: {
                    ...(input.startDate && { $gte: new Date(input.startDate) }),
                    ...(input.endDate && { $lt: new Date(input.endDate) }),
                },
            }),


        }).lean();

        let totalSalesUpi = 0;
        let totalSalesCash = 0;
        let totalSalesBank = 0;

        const totalSales = sales.reduce((acc, sale) => {

            if (sale.paymentMode === "upi") {
                totalSalesUpi += sale.total;
            } else if (sale.paymentMode === "cash") {
                totalSalesCash += sale.total;
            } else {
                totalSalesBank += sale.total;
            }

            return acc + sale.total;
        }, 0);

        const totalPurchases = await Purchase.find({
            company: client.company,
            ...((input.startDate || input.endDate) && {
                createdAt: {
                    ...(input.startDate && { $gte: new Date(input.startDate) }),
                    ...(input.endDate && { $lt: new Date(input.endDate) }),
                },
            }),

        }).lean();


        const totalPurchase = totalPurchases.reduce((acc, purchase) => {
            return acc + purchase.total;
        }, 0);


        const totalExpenses = await Expense.find({
            company: client.company,
            ...((input.startDate || input.endDate) && {
                createdAt: {
                    ...(input.startDate && { $gte: new Date(input.startDate) }),
                    ...(input.endDate && { $lt: new Date(input.endDate) }),
                },
            }),

        }).lean();

        const totalExpense = totalExpenses.reduce((acc, expense) => {
            return acc + expense.amount;
        }, 0);



        const totalQtyPerProduct = await getTotalQtyPerProduct(sales);



        const salesPerMonth = sales.reduce((acc, sale) => {
            const month = new Date(sale.createdAt).getMonth();
            const accMonth = acc[month];
            if (accMonth) {
                acc[month] = accMonth + sale.total;
            } else {
                acc[month] = sale.total;
            }

            return acc;
        }, new Array<number>(12).fill(0));


        const purchasesPerMonth = totalPurchases.reduce((acc, purchase) => {
            const month = new Date(purchase.createdAt).getMonth();
            const accMonth = acc[month];
            if (accMonth) {
                acc[month] = accMonth + purchase.total;
            } else {
                acc[month] = purchase.total;
            }

            return acc;
        }
            , new Array<number>(12).fill(0));

        let totalSaleItems = 0;

        totalQtyPerProduct?.forEach(product => {
            totalSaleItems += product.totalQuantity;
        }
        )

        const totalPurchaseItems = totalPurchases.reduce((acc, purchase) => {
            return acc + purchase.products.length;
        }
            , 0);

        const totalSaleReturns = await SaleReturn.find({
            company: client.company,
            ...((input.startDate || input.endDate) && {
                createdAt: {
                    ...(input.startDate && { $gte: new Date(input.startDate) }),
                    ...(input.endDate && { $lt: new Date(input.endDate) }),
                },
            }),

        }).lean();

        const totalSaleReturnItems = totalSaleReturns.reduce((acc, saleReturn) => {
            return acc + saleReturn.products.length;
        }
            , 0);



        const totalPUrchaseReturn = await PurchaseReturn.find({
            company: client.company,
            ...((input.startDate || input.endDate) && {
                createdAt: {
                    ...(input.startDate && { $gte: new Date(input.startDate) }),
                    ...(input.endDate && { $lt: new Date(input.endDate) }),
                },
            }),

        }).lean();


        const totalPurchaseReturnItems = totalPUrchaseReturn.reduce((acc, purchaseReturn) => {
            return acc + purchaseReturn.products.length;
        }
            , 0);

        const top5SellingProducts = Array.from(totalQtyPerProduct.values()).sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 5);


        return {
            totalSales,
            totalPurchase,
            totalExpense,
            totalSaleItems,
            totalPurchaseItems,
            totalSaleReturnItems,
            totalPurchaseReturnItems,
            salesPerMonth,
            purchasesPerMonth,
            totalQuantitySold: Array.from(totalQtyPerProduct.values()),
            top5SellingProducts,
            salesByPaymentMode: {
                totalSalesUpi,
                totalSalesCash,
                totalSalesBank
            }
        }

    })
})

async function getTotalQtyPerProduct(sales: ISale[],) {

    const totalQtyPerProduct: Map<string, {
        _id: string,
        name: string,
        totalQuantity: number,
    }> = new Map();


    for (const sale of sales) {
        for (const product of sale.products) {
            const existingProduct = totalQtyPerProduct.get(product._id.toString());
            if (existingProduct) {
                totalQtyPerProduct.set(product._id.toString(), {
                    ...existingProduct,
                    totalQuantity: existingProduct.totalQuantity + product.quantity
                })
            } else {

                const { name } = await Product.findById(product._id).select('name')
                    .lean() ?? {};

                if (!name) continue;
                totalQtyPerProduct.set(product._id.toString(), {
                    _id: product._id.toString(),
                    name,
                    totalQuantity: product.quantity
                })
            }
        }
    }


    return totalQtyPerProduct;

}