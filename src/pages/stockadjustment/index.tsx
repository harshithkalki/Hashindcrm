import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { ZStockAdjustCreateInput } from '@/zobjs/stockAdjust';
import {
  Button,
  Center,
  Container,
  Group,
  Modal,
  Pagination,
  TextInput,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Form, Formik } from 'formik';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  const utils = trpc.useContext();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        await onSubmit(values);
        showNotification({
          title: 'Adjustment Created',
          message: 'Successfully',
        });
        resetForm();
        setSubmitting(false);
        utils.stockAdjustRouter.stockadjusts.invalidate();
      }}
      validationSchema={toFormikValidationSchema(ZStockAdjustCreateInput)}
    >
      {({ handleSubmit, values, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <FormikSelect
            mt={'md'}
            name='product'
            label={`${t('product name')}`}
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
              label={`${t('current stock')}`}
              disabled
            />
            <FormInput
              name='quantity'
              label={`${t('quantity')}`}
              placeholder='Quantity'
              type='number'
              withAsterisk
            />
          </Group>
          <FormikSelect
            name='operation'
            label={`${t('adjustment')}`}
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
            label={`${t('notes')}`}
            placeholder='Note'
            mt={'md'}
          />
          <Group style={{ justifyContent: 'end' }}>
            <Button type='submit' mt={'lg'} size={'xs'} loading={isSubmitting}>
              {t('submit')}
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

  const { t } = useTranslation('common');
  if (stockadjustments.isLoading) return <LoadingScreen />;

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
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('stock adjustment')}</Title>
          <Button
            size='xs'
            onClick={() => {
              setModal(true);
            }}
          >
            `${t('add adjustment')}`
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
              label: `${t('product')}`,
            },
            quantity: {
              label: `${t('quantity')}`,
            },
            operation: {
              label: `${t('operation')}`,
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
