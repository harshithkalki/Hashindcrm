import Layout from '@/components/Layout';
import TransferForm from '@/components/StockTransferForm';
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
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormDate from '@/components/FormikCompo/FormikDate';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { Formik, Form } from 'formik';

interface DownloadModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function DownloadModal({ modal, setModal }: DownloadModalProps) {
  // const getAllSales = client.saleRouter.getAllSales
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Download Sales'
      >
        <Formik
          initialValues={{
            startDate: '',
            endDate: '',
          }}
          onSubmit={async (values) => {
            const startDate = values.startDate;
            const endDate = values.endDate;
            console.log(startDate, endDate);
            const data = await client.saleRouter.getAllSales.query({
              startDate,
              endDate,
            });
            const headers: Record<string, string> = {};
            if (data.length === 0) return;
            Object.keys(data[0]!).forEach((key) => {
              headers[key as keyof (typeof data)[number]] = key;
            });
            exportCSVFile(headers, data, 'Sales');
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormDate
                label='Start Date'
                placeholder='Start Date'
                name='startDate'
                // value={values.startDate}
                // onChange={handleChange}
              />
              <Center mt={'sm'}>
                <IconArrowDown />
              </Center>

              <FormDate
                label='End Date'
                placeholder='End Date'
                name='endDate'
                // value={values.endDate}
                // onChange={handleChange}
              />

              <Center mt={'md'}>
                <Button size='xs' mr={'md'} type='submit'>
                  Download Sales
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
  const [page, setPage] = useState(1);
  const transfers = trpc.stockTransferRouter.stockTransfers.useInfiniteQuery(
    {},
    {
      refetchOnWindowFocus: false,
      getNextPageParam: () => page,
    }
  );

  const invoice = trpc.stockTransferRouter.getInvoice.useQuery(
    {
      _id: invoiceId,
    },
    { enabled: Boolean(invoiceId), cacheTime: 0 }
  );

  const componentRef = useRef<HTMLDivElement>(null);
  const [downloadM, setDownloadM] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { t } = useTranslation('common');

  useEffect(() => {
    if (invoice.data) {
      handlePrint();
      setInvoiceId('');
    }
  }, [handlePrint, invoice.data]);

  useEffect(() => {
    if (!transfers.data?.pages.find((pageData) => pageData.page === page)) {
      transfers.fetchNextPage();
    }
  }, [transfers, page]);

  if (transfers.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data as any} />
        </div>
      )}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <DownloadModal modal={downloadM} setModal={setDownloadM} />
        <TransferForm
          modal={modal}
          setModal={setModal}
          title={'Stock Transfer'}
        />
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('stock transfer')}</Title>
          <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
            {t('add transfer')}
          </Button>
        </Group>
        <TableSelection
          data={
            transfers.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
                openingStockDate: dayjs(doc.openingStockDate).format(
                  'DD MMMM YYYY'
                ),
              })) || []
          }
          colProps={{
            invoiceId: {
              label: `${t('invoice id')} `,
            },
            openingStockDate: {
              label: `${t('date')}`,
            },
            status: {
              label: `${t('payment status')}`,
            },
            total: {
              label: `${t('total')}`,
            },
            _id: {
              label: `${t('show invoice')}`,
              Component: ({ data }) => (
                <Group position='center'>
                  <ActionIcon
                    color={'blue'}
                    variant='filled'
                    onClick={() => {
                      setInvoiceId(data._id);
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
          {(transfers.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                transfers.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages || 0
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
