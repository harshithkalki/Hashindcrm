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
  const sales = trpc.saleRouter.sales.useQuery({
    cursor: page,
  });
  const invoice = trpc.saleRouter.getInvoice.useQuery(
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
  console.log(sales);

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
            <SalesForm
              modal={modal}
              setModal={setModal}
              isCustomer={true}
              title={'Sales'}
            />
            <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
              <Title fw={400}>Sales</Title>
              <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
                Add New
              </Button>
            </Group>
            <TableSelection
              data={
                sales.data?.docs.map((val) => ({
                  ...val,
                  _id: val._id.toString(),
                  date: dayjs(val.date).format('DD/MM/YYYY'),
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
                    </Group>
                  ),
                },
                // date: 'Date',
                // customer: 'Customer',
                // status: 'Payment Status',
                // total: 'Total Amount',
              }}
            />
            <Pagination
              total={sales.data?.totalPages as number}
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          </ScrollArea>
        </div>
      </Layout>
    </>
  );
};

export default Index;
