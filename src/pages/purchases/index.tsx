import Layout from '@/components/Layout';
// import SalesForm from '@/components/SandCForm';
import PurchaseForm from '@/components/PurchaseForm';
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
import { IconEye } from '@tabler/icons';
// import Invoice from '@/components/Invoice';
import Invoice from '@/components/PurchaseInvoice';
import { useReactToPrint } from 'react-to-print';

const Index = () => {
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [page, setPage] = useState(1);
  // const sales = trpc.saleRouter.sales.useQuery({
  //   cursor: page,
  // });

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
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <ScrollArea style={{ height: '100vh' }}>
            <PurchaseForm
              modal={modal}
              setModal={setModal}
              isCustomer={true}
              title={'Sales'}
            />
            <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
              <Title fw={400}>Purchases</Title>
              <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
                Add Purchase
              </Button>
            </Group>
            <TableSelection
              data={
                purchases.data?.pages
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
                supplier: {
                  label: 'Supplier',
                },
                status: {
                  label: 'Payment Status',
                },
                total: {
                  label: 'Total Amount',
                },
                _id: {
                  label: 'Show Invoice',
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
          </ScrollArea>
        </div>
      </Layout>
    </>
  );
};

export default Index;
