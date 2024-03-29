import Layout from '@/components/Layout';
import PurchaseForm from '@/components/PurchaseForm';
import TableSelection from '@/components/Tables';
import { client, trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Button,
  ActionIcon,
  Pagination,
  Center,
  Container,
  Modal,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { IconArrowDown, IconEye } from '@tabler/icons';
import Invoice from '@/components/PurchaseInvoice';
import { useReactToPrint } from 'react-to-print';
import FormDate from '@/components/FormikCompo/FormikDate';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { showNotification } from '@mantine/notifications';

interface DownloadModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function DownloadModal({ modal, setModal }: DownloadModalProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Download Purchases'
      >
        <Formik
          initialValues={{
            startDate: '',
            endDate: '',
          }}
          onSubmit={async (values) => {
            const startDate = values.startDate;
            const endDate = values.endDate;

            const data = await client.purchaseRouter.getAllPurchases.query({
              startDate,
              endDate,
            });
            const headers: Record<string, string> = {};
            if (data.length === 0) return;
            Object.keys(data[0]!).forEach((key) => {
              headers[key as keyof (typeof data)[number]] = key;
            });
            exportCSVFile(headers, data, 'Purchases');
            setModal(false);
            showNotification({
              title: 'Downloaded',
              message: 'Downloaded Successfully',
              color: 'teal',
            });
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <FormDate
                label={`${t('start date')}`}
                placeholder='Start Date'
                name='startDate'
              />
              <Center mt={'sm'}>
                <IconArrowDown />
              </Center>

              <FormDate
                label={`${t('end date')}`}
                placeholder='End Date'
                name='endDate'
              />

              <Center mt={'md'}>
                <Button
                  size='xs'
                  mr={'md'}
                  type='submit'
                  loading={isSubmitting}
                >
                  {t('download')}
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

const Index = () => {
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [downloadM, setDownloadM] = useState(false);
  const [page, setPage] = useState(1);
  const { t } = useTranslation('common');

  const purchases = trpc.purchaseRouter.purchases.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const invoice = trpc.purchaseRouter.getInvoice.useQuery(
    {
      _id: invoiceId,
    },
    { enabled: Boolean(invoiceId) }
  );
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (invoice.data) {
      handlePrint();
      setInvoiceId('');
    }
  }, [handlePrint, invoice.data]);
  useEffect(() => {
    if (!purchases.data?.pages.find((pageData) => pageData.page === page)) {
      purchases.fetchNextPage();
    }
  }, [purchases, page]);

  return (
    <>
      {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data} />
        </div>
      )}
      <Layout>
        <Container
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <DownloadModal modal={downloadM} setModal={setDownloadM} />
          <PurchaseForm
            modal={modal}
            setModal={setModal}
            isCustomer={true}
            title={'Purchase'}
          />
          <Group my='lg' style={{ justifyContent: 'space-between' }}>
            <Title fw={400}>{t('purchase')}</Title>
            <Group>
              <Button size='xs' mr={'md'} onClick={() => setDownloadM(true)}>
                {t('download')}
              </Button>
              <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
                {t('add purchase')}
              </Button>
            </Group>
          </Group>
          <TableSelection
            data={
              purchases.data?.pages
                .find((pageData) => pageData.page === page)
                ?.docs.map((val, index) => ({
                  ...val,
                  _id: val._id.toString(),
                  date: dayjs(val.date).format('DD MMMM YYYY'),
                  supplier: (val.supplier as unknown as { name: string }).name,
                  index: index + 10 * (page - 1) + 1,
                })) || []
            }
            colProps={{
              index: {
                label: `${t('sno')}`,
              },

              invoiceId: {
                label: `${t('show invoice')}`,
              },
              date: {
                label: `${t('date')}`,
              },
              supplier: {
                label: `${t('supplier')}`,
              },
              status: {
                label: `${t('payment status')}`,
              },
              total: {
                label: `${t('total')}`,
              },
              _id: {
                label: `${t('show invoice')}`,
                Component: ({ data: { _id } }) => (
                  <Group position='center'>
                    <ActionIcon
                      color={'blue'}
                      variant='filled'
                      onClick={() => {
                        setInvoiceId(_id);
                      }}
                    >
                      <IconEye size='1.125rem' />
                    </ActionIcon>
                  </Group>
                ),
              },
            }}
          />
          <Center>
            {(purchases.data?.pages.find((pageData) => pageData.page === page)
              ?.totalPages ?? 0) > 1 && (
              <Pagination
                total={
                  purchases.data?.pages.find(
                    (pageData) => pageData.page === page
                  )?.totalPages ?? 0
                }
                initialPage={1}
                page={page}
                onChange={setPage}
              />
            )}
          </Center>
        </Container>
      </Layout>
    </>
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
