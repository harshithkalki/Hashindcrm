import Layout from '@/components/Layout';
import SalesForm from '@/components/SandCForm';
import SalesTable from '@/components/Tables/SalesTable';
import { Group, Title, Button } from '@mantine/core';
import React from 'react';

const Index = () => {
  const [modal, setModal] = React.useState(false);
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
      <SalesTable
        isCustomer={true}
        data={[
          {
            invoicenum: 'INV-0001',
            date: '2021-01-01',
            name: 'John Doe',
            status: 'Paid',
            paidamount: '1000',
            totalamount: '1000',
            paymentstatus: 'Paid',
          },
          {
            invoicenum: 'INV-0002',
            date: '2021-01-01',
            name: 'John Doe',
            status: 'Paid',
            paidamount: '1000',
            totalamount: '1000',
            paymentstatus: 'Paid',
          },
          {
            invoicenum: 'INV-0003',
            date: '2021-01-01',
            name: 'John Doe',
            status: 'Paid',
            paidamount: '1000',
            totalamount: '1000',
            paymentstatus: 'Paid',
          },
        ]}
      />
    </Layout>
  );
};

export default Index;
