import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { PurchaseReturnCreateInput } from '@/zobjs/purchaseReturn';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IPurchaseReturn = ModifyDeep<PurchaseReturnCreateInput, { date: Date }> & {
    company: mongoose.Types.ObjectId;
    createdAt: Date;
};

export type PurchaseReturnDocument = mongoose.Document & IPurchaseReturn;

type PurchaseReturnModel = Model<IPurchaseReturn, Record<string, never>>;

const PurchaseReturnSchema: Schema = new Schema<IPurchaseReturn, PurchaseReturnModel>(
    {
        supplier: { type: String, required: true },
        date: { type: Date, required: true },
        products: [
            {
                _id: { type: Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        status: { type: String, required: true },
        orderTax: { type: Number, required: true },
        shipping: { type: Number, required: true },
        discount: { type: Number, required: true },
        total: { type: Number, required: true },
        notes: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
        company: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
        warehouse: {
            type: Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        paymentMode: { type: String, required: true },
    },
    { versionKey: false }
);

PurchaseReturnSchema.plugin(mongoosePaginate);


export default (mongoose.models.PurchaseReturn as ReturnType<
    typeof mongoose.model<IPurchaseReturn, mongoose.PaginateModel<IPurchaseReturn>>
>) ||
    mongoose.model<IPurchaseReturn, mongoose.PaginateModel<IPurchaseReturn>>(
        'PurchaseReturn',
        PurchaseReturnSchema
    );
