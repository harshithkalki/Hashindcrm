import Layout from '@/components/Layout';
import SalesForm from '@/components/SandCForm';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Group, Title, Button } from '@mantine/core';
import React from 'react';

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const sales = trpc.saleRouter.sales.useQuery({});

  return (
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
          })) || []
        }
        keysandlabels={{
          invoiceId: 'Invoice',
          date: 'Date',
          customer: 'Customer',
          status: 'Payment Status',
          total: 'Total Amount',
        }}
      />
    </Layout>
  );
};

export default Index;
