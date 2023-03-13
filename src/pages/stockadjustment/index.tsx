import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import StockadjustmentTable from '@/components/Tables/StockAdjustTable';
import { trpc } from '@/utils/trpc';
import { ZStockAdjustCreateInput } from '@/zobjs/stockAdjust';
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
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

function StockAdjustmentForm({
  onSubmit,
}: {
  onSubmit: (values: typeof initialValues) => Promise<void>;
}) {
  const products = trpc.productRouter.getAllProducts.useQuery();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        await onSubmit(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={toFormikValidationSchema(ZStockAdjustCreateInput)}
    >
      {({ handleSubmit, values, isSubmitting }) => (
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
            <Button type='submit' mt={'lg'} size={'xs'} loading={isSubmitting}>
              Submit
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
}

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const stockadjustments = trpc.stockAdjustRouter.getAllStockAdjusts.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  const createAdjustment = trpc.stockAdjustRouter.create.useMutation();

  if (stockadjustments.isLoading)
    return (
      <Layout>
        <Center h='100%'>
          <Loader />
        </Center>
      </Layout>
    );

  return (
    <Layout>
      <Modal
        onClose={() => setModal(false)}
        opened={modal}
        title={'Add Adjustment'}
      >
        <StockAdjustmentForm
          onSubmit={async (values) => {
            await createAdjustment.mutateAsync(values);
            await stockadjustments.refetch();
            setModal(false);
          }}
        />
      </Modal>
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
        <StockadjustmentTable data={stockadjustments.data ?? []} />
      </Container>
    </Layout>
  );
};

export default Index;
