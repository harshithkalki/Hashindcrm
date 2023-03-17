import Layout from '@/components/Layout';
import TransferForm from '@/components/StockTransferForm';
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
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';

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

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (!transfers.data?.pages.find((pageData) => pageData.page === page)) {
      transfers.fetchNextPage();
    }
  }, [transfers, page]);

  return (
    <>
      {/* {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data} />
        </div>
      )} */}
      <Layout>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <ScrollArea style={{ height: '100vh' }}>
            <TransferForm
              modal={modal}
              setModal={setModal}
              title={'Stock Transfer'}
            />
            <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
              <Title fw={400}>Stock Transfer</Title>
              <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
                Add Transfer
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
                      'DD/MM/YYYY'
                    ),
                  })) || []
              }
              colProps={{
                invoiceId: {
                  label: 'Invoice ID',
                },
                openingStockDate: {
                  label: 'Opening Stock Date',
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
                    transfers.data?.pages.find(
                      (pageData) => pageData.page === page
                    )?.totalPages || 0
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
