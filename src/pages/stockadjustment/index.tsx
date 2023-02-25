import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import StockadjustmentTable from '@/components/Tables/StockAdjustTable';
import { trpc } from '@/utils/trpc';
import {
  Button,
  Container,
  Group,
  Modal,
  TextInput,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const stockadjustments = trpc.stockAdjustRouter.getAllStockAdjusts.useQuery();
  const createAdjustment = trpc.stockAdjustRouter.create.useMutation();
  const products = trpc.productRouter.getAllProducts.useQuery();

  const AdjustForm = () => {
    return (
      <>
        <Modal
          onClose={() => setModal(false)}
          opened={modal}
          title={'Add Adjustment'}
        >
          <Formik
            initialValues={{
              productId: '',
              quantity: 0,
              adjustment: '',
              note: '',
            }}
            onSubmit={(values) => {
              createAdjustment.mutateAsync({
                ...values,
                operation: values.adjustment,
              });
            }}
            validationSchema={toFormikValidationSchema(
              z.object({
                productId: z.string(),
                quantity: z.number(),
                adjustment: z.string(),
                note: z.string().optional(),
              })
            )}
          >
            {({ handleSubmit, values }) => (
              <Form onSubmit={handleSubmit}>
                <FormikSelect
                  mt={'md'}
                  name='productId'
                  label='Product Name'
                  searchable
                  creatable
                  data={
                    products.data?.map((product) => ({
                      label: product.name,
                      value: product._id.toString(),
                    })) || []
                  }
                  placeholder='Select Product'
                  withAsterisk
                />
                <Group mt={'md'}>
                  <TextInput
                    value={
                      products.data?.find(
                        (product) => product._id.toString() === values.productId
                      )?.quantity || 0
                    }
                    label='Current Stock'
                    disabled
                  />
                  <FormInput
                    name='quantity'
                    label='Quantity'
                    placeholder='Quantity'
                    type='number'
                    withAsterisk
                  />
                </Group>
                <FormikSelect
                  name='adjustment'
                  label='Adjustment'
                  mt={'md'}
                  data={[
                    { label: 'Add', value: 'add' },
                    { label: 'Remove', value: 'remove' },
                  ]}
                  placeholder='Select Adjustment'
                  withAsterisk
                />
                <Formiktextarea
                  name='note'
                  label='Note'
                  placeholder='Note'
                  mt={'md'}
                />
                <Button type='submit' mt={'lg'}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal>
      </>
    );
  };

  if (stockadjustments.isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <AdjustForm />
      <Container h='100%'>
        <Group mb={'lg'} mt={'lg'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Stock Adjustment</Title>
          <Button
            size='xs'
            onClick={() => {
              setModal(true);
            }}
          >
            Add Adjustment
          </Button>
        </Group>
        <StockadjustmentTable data={stockadjustments.data || []} />
      </Container>
    </Layout>
  );
};

export default Index;
