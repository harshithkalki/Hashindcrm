import TableSelection from '@/components/Tables/ProductsTable';
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  ScrollArea,
  Title,
} from '@mantine/core';
import React from 'react';
// import { useRouter } from "next/router";
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import ProductForm from '@/components/ProductForm';
import { trpc } from '@/utils/trpc';
import Layout from '@/components/Layout';

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface Product {
  id: string;
  name: string;
  logo: string;
  warehouse: string;
  category: string;
  brand: string;
  salePrice: string;
  purchasePrice: string;
  quantity: string;
  description: string;
}

const Index = () => {
  // const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const products = trpc.productRouter.getAllProducts.useQuery();
  const deleteProduct = trpc.productRouter.delete.useMutation();

  console.log(products.data);

  const AddProduct = () => {
    return (
      <>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title='Add Product'
          size={'80%'}
        >
          <ScrollArea style={{ height: '80vh' }}>
            <ProductForm
              formInputs={{
                name: '',
                logo: '',
                warehouse: '',
                category: '',
                brand: '',
                salePrice: 0,
                purchasePrice: 0,
                quantity: 0,
                description: '',
                quantityAlert: 0,
                barcodeSymbology: '',
                itemCode: '',
                mrp: 0,
                openingStock: 0,
                openingStockDate: '',
                slug: '',
                tax: '',
                expireDate: '',
              }}
            />
          </ScrollArea>
        </Modal>
      </>
    );
  };

  if (products.isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <AddProduct />
      <Container mt={'xs'}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Products</Title>
          <Button size='xs' onClick={() => setModal(true)}>
            Add Product
          </Button>
        </Group>
        <Divider mt={'xl'} />
        <TableSelection
          data={
            products.data?.map((val) => ({
              ...val,
              id: val._id.toString(),
              warehouse: val.warehouse as unknown as string,
              category: val.category as unknown as string,
              brand: val.brand as unknown as string,
            })) || []
          }
          onDelete={(id) => {
            deleteProduct.mutateAsync({
              id,
            });
          }}
          onEdit={(id) => console.log(id)}
        />
      </Container>
    </Layout>
  );
};

export default Index;
