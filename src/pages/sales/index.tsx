import Layout from '@/components/Layout';
import SalesForm from '@/components/SandCForm';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Button,
  ActionIcon,
  Pagination,
  ScrollArea,
  Center,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { IconEdit, IconEye } from '@tabler/icons';
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';
import EditSales from '@/components/EditSales';

const Index = () => {
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [page, setPage] = useState(1);
  const sales = trpc.saleRouter.sales.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const invoice = trpc.saleRouter.getInvoice.useQuery(
    {
      _id: invoiceId,
    },
    { enabled: Boolean(invoiceId) }
  );
  const [editId, setEditId] = useState<string | null>(null);
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
        {editId && <EditSales _id={editId} onClose={() => setEditId(null)} />}
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <ScrollArea style={{ height: '100vh' }}>
            <SalesForm
              modal={modal}
              setModal={setModal}
              isCustomer={true}
              title={'Sales'}
            />
            <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
              <Title fw={400}>Sales</Title>
              <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
                Add Sales
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
                  })) || []
              }
              colProps={{
                invoiceId: {
                  label: 'Invoice ID',
                },
                date: {
                  label: 'Date',
                },
                customer: {
                  label: 'Customer',
                },
                status: {
                  label: 'Payment Status',
                },
                total: {
                  label: 'Total Amount',
                },
                _id: {
                  label: 'Show Invoice',
                  Component: ({ ...value }) => (
                    <Group position='center'>
                      <ActionIcon
                        color={'blue'}
                        variant='filled'
                        onClick={() => {
                          setInvoiceId(value._id);
                        }}
                      >
                        <IconEye size='1.125rem' />
                      </ActionIcon>
                      <ActionIcon
                        color={'blue'}
                        variant='filled'
                        onClick={() => {
                          setEditId(value._id);
                        }}
                      >
                        <IconEdit size='1.125rem' />
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
          </ScrollArea>
        </div>
      </Layout>
    </>
  );
};

export default Index;
