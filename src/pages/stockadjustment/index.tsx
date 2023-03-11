import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import StockadjustmentTable from '@/components/Tables/StockAdjustTable';
import { trpc } from '@/utils/trpc';
import { ZStockAdjustCreateInput } from '@/zobjs/stockAdjust';
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
import type { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const initialValues: z.infer<typeof ZStockAdjustCreateInput> = {
  product: '',
  quantity: 0,
  operation: 'add',
  note: '',
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const stockadjustments = trpc.stockAdjustRouter.getAllStockAdjusts.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
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
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              createAdjustment.mutateAsync({
                ...values,
              });
              stockadjustments.refetch();
              setModal(false);
              resetForm();
            }}
            validationSchema={toFormikValidationSchema(ZStockAdjustCreateInput)}
          >
            {({ handleSubmit, values }) => (
              <Form onSubmit={handleSubmit}>
                <FormikSelect
                  mt={'md'}
                  name='product'
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
                        (product) => product._id.toString() === values.product
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
                  name='operation'
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
                <Group style={{ justifyContent: 'end' }}>
                  <Button type='submit' mt={'lg'} size={'xs'}>
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      setModal(false);
                    }}
                    mt={'lg'}
                    size={'xs'}
                  >
                    Cancel
                  </Button>
                </Group>
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
