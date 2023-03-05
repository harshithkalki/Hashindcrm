import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { ScrollArea } from '@mantine/core';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

const Edit = () => {
  //   const createProduct = trpc.productRouter.create.useMutation();
  const updateProduct = trpc.productRouter.update.useMutation();
  const router = useRouter();
  const { id } = router.query;
  const product = trpc.productRouter.getProduct.useQuery(
    { id: id as string },
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );

  return (
    <Layout>
      {product.data && (
        <div
          style={{ display: 'flex', height: '100%', flexDirection: 'column' }}
        >
          <ScrollArea style={{ height: '100%' }}>
            <ProductForm
              formInputs={{
                ...product.data,
                category: product.data.category.toString(),
                brand: product.data.brand.toString(),
                warehouse: product.data.warehouse.toString(),
                openingStockDate: product.data.openingStockDate.toString(),
              }}
              onSubmit={(values) => {
                if (values.logo === '') {
                  delete values.logo;
                }

                return updateProduct
                  .mutateAsync({
                    ...values,
                    _id: id as string,
                  })
                  .then(() => {
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

export default Edit;
