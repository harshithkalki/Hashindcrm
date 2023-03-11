import Layout from '@/components/Layout';
import SalesForm from '@/components/SandCForm';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Group, Title, Button, ActionIcon } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { IconEye } from '@tabler/icons';
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';

const Index = () => {
  const [modal, setModal] = useState(false);
  const sales = trpc.saleRouter.sales.useQuery({});
  const [invoiceId, setInvoiceId] = useState<string>('');
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

  return (
    <>
      {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data} />
        </div>
      )}
      <Layout>
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
      </Layout>
    </>
  );
};

export default Index;
