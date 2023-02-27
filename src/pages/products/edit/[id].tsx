import React from 'react';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { ScrollArea } from '@mantine/core';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

const Add = () => {
  //   const createProduct = trpc.productRouter.create.useMutation();
  const updateProduct = trpc.productRouter.update.useMutation();
  const router = useRouter();
  const { id } = router.query;
  const getProduct = trpc.productRouter.getProduct.useQuery(
    { id: id as string },
    { refetchOnWindowFocus: false }
  );
  console.log(getProduct.data);
  const product = getProduct.data;

  const initialValues = {
    id: id as string,
    name: product?.name as string,
    logo: product?.logo as string,
    warehouse: product?.warehouse as unknown as string,
    category: product?.category as unknown as string,
    brand: product?.brand as unknown as string,
    salePrice: product?.salePrice as unknown as number,
    purchasePrice: product?.purchasePrice as unknown as number,
    quantity: product?.quantity as unknown as number,
    description: product?.description as string,
    quantityAlert: product?.quantityAlert as unknown as number,
    barcodeSymbology: product?.barcodeSymbology as string,
    itemCode: product?.itemCode as string,
    mrp: product?.mrp as unknown as number,
    openingStock: product?.openingStock as unknown as number,
    openingStockDate: product?.openingStockDate as unknown as string,
    slug: product?.slug as string,
    tax: product?.tax as unknown as number,
    expireDate: (product?.expiryDate as unknown as string) || '',
  };
  return (
    <Layout>
      {product && (
        <div
          style={{ display: 'flex', height: '100%', flexDirection: 'column' }}
        >
          <ScrollArea style={{ height: '100%' }}>
            <ProductForm
              formInputs={initialValues}
              onSubmit={(values) => {
                return updateProduct.mutateAsync(values).then(() => {
                  router.push('/products');
                });
              }}
            />
          </ScrollArea>
        </div>
      )}
    </Layout>
  );
};

export default Add;
