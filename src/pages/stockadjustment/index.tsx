import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { ZStockAdjustCreateInput } from '@/zobjs/stockAdjust';
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Pagination,
  TextInput,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
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
  const [page, setPage] = React.useState(1);
  const stockadjustments = trpc.stockAdjustRouter.stockadjusts.useInfiniteQuery(
    { limit: 10 },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (
      !stockadjustments.data?.pages.find((pageData) => pageData.page === page)
    ) {
      stockadjustments.fetchNextPage();
    }
  }, [stockadjustments, page]);

  const createAdjustment = trpc.stockAdjustRouter.create.useMutation();

  if (stockadjustments.isLoading)
    return (
      <Layout>
        <Center h='100%'>
          <Loader />
        </Center>
      </Layout>
    );

  console.log(stockadjustments.data);

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
        <TableSelection
          data={
            stockadjustments.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
                product: (doc.product as unknown as { name: string }).name,
              })) || []
          }
          colProps={{
            product: {
              label: 'Product',
            },
            quantity: {
              label: 'Quantity',
            },
            operation: {
              label: 'Operation',
            },
          }}
        />
        <Center>
          {(stockadjustments.data?.pages.find(
            (pageData) => pageData.page === page
          )?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                stockadjustments.data?.pages.find(
                  (pageData) => pageData.page === page
                )?.totalPages || 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Index;
