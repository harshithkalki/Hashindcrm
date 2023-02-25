import Layout from '@/components/Layout';
import SalesSummaryTable from '@/components/Tables/SalesSummaryTable';
import { Group, Title } from '@mantine/core';
import React from 'react';

const data = [
  {
    date: '2021-01-01',
    invoicenumber: 'INV-0001',
    paymentstatus: 'Paid',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    createdby: 'John Doe',
    amount: 100,
  },
  {
    date: '2021-01-01',
    invoicenumber: 'INV-0001',
    paymentstatus: 'Paid',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    createdby: 'John Doe',
    amount: 100,
  },
  {
    date: '2021-01-01',
    invoicenumber: 'INV-0001',
    paymentstatus: 'Paid',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    createdby: 'John Doe',
    amount: 100,
  },
  {
    date: '2021-01-01',
    invoicenumber: 'INV-0001',
    paymentstatus: 'Paid',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    createdby: 'John Doe',
    amount: 100,
  },
];

const Index = () => {
  return (
    <Layout>
      <Group mb={'lg'}>
        <Title fw={400}>Sales Report</Title>
      </Group>
      <SalesSummaryTable data={data} />
    </Layout>
  );
};

export default Index;
