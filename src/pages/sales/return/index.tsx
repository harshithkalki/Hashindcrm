import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { client, trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Button,
  Pagination,
  Center,
  Container,
  Modal,
  ActionIcon,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';
import EditSales from '@/components/EditSales';
import _ from 'lodash';
import SaleReturnForm from '@/components/SReturnFrom';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormDate from '@/components/FormikCompo/FormikDate';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { IconArrowDown, IconEye } from '@tabler/icons';
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
  const sales = trpc.saleReturnRouter.returns.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const invoice = trpc.saleReturnRouter.getInvoice.useQuery(
    {
      id: invoiceId,
    },
    { enabled: Boolean(invoiceId), cacheTime: 0 }
  );
  const [editId, setEditId] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [downloadM, setDownloadM] = useState(false);
  const utils = trpc.useContext();

  const { t } = useTranslation('common');

  useEffect(() => {
    if (invoice.data) {
      handlePrint();
      setInvoiceId('');
    }
  }, [handlePrint, invoice.data]);

  useEffect(() => {
    if (!sales.data?.pages.find((pageData) => pageData.page === page)) {
      sales.fetchNextPage();
    }
  }, [sales, page]);

  return (
    <>
      {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data} />
        </div>
      )}
      <Layout>
        {editId && (
          <EditSales
            _id={editId}
            onClose={() => {
              setEditId(null);
              utils.saleReturnRouter.returns.invalidate();
            }}
          />
        )}
        <Container
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <DownloadModal modal={downloadM} setModal={setDownloadM} />
          <SaleReturnForm
            modal={modal}
            setModal={setModal}
            isCustomer={true}
            title={'Sales return'}
          />
          <Group my='lg' style={{ justifyContent: 'space-between' }}>
            <Title fw={400}>{t('sales returns')}</Title>
            <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
              {t('add return')}
            </Button>
          </Group>
          <TableSelection
            data={
              sales.data?.pages
                .find((pageData) => pageData.page === page)
                ?.docs.map((val) => ({
                  ...val,
                  _id: val._id.toString(),
                  date: dayjs(val.date).format('DD MMMM YYYY'),
                  customer: _.get(val, 'customer.name', 'Walk-in Customer'),
                  total: val.total.toFixed(),
                })) ?? []
            }
            colProps={{
              date: {
                label: `${t('date')}`,
              },
              customer: {
                label: `${t('customer')}`,
              },
              status: {
                label: `${t('status')}`,
              },
              total: {
                label: `${t('total')}`,
              },
              _id: {
                label: 'Show Invoice',
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
            {(sales.data?.pages.find((pageData) => pageData.page === page)
              ?.totalPages ?? 0) > 1 && (
              <Pagination
                total={
                  sales.data?.pages.find((pageData) => pageData.page === page)
                    ?.totalPages ?? 0
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
