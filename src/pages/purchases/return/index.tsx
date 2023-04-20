import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Button,
  Pagination,
  ScrollArea,
  Center,
  Container,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';
import EditSales from '@/components/EditSales';
import _ from 'lodash';
import PurchaseReturnForm from '@/components/PReturnForm';

const Index = () => {
  const [modal, setModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [page, setPage] = useState(1);
  const sales = trpc.purchaseReturnRouter.purchaseReturns.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const invoice = trpc.saleRouter.getInvoice.useQuery(
    {
      _id: invoiceId,
    },
    { enabled: Boolean(invoiceId), cacheTime: 0 }
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
        {editId && (
          <EditSales
            _id={editId}
            onClose={() => {
              setEditId(null);
              sales.refetch();
            }}
          />
        )}
        <Container
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <PurchaseReturnForm
            modal={modal}
            setModal={setModal}
            isCustomer={true}
            title={'Sales'}
          />
          <Group my='lg' style={{ justifyContent: 'space-between' }}>
            <Title fw={400}>Purchase Return</Title>
            <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
              Add Return
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
