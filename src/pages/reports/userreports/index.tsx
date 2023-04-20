import Layout from '@/components/Layout';
import UserReportTable from '@/components/Tables/UserReportsTable.';
import { Container, Group, Tabs, Title } from '@mantine/core';
import { IconBrandCashapp, IconBuildingBank } from '@tabler/icons';
import React from 'react';

const userReportDate = [
  {
    name: 'Customer 1',
    subTable: {
      purchase: 100,
      sales: 200,
      purchaseReturn: 50,
      salesReturn: 0,
    },
    total: 250,
    paid: 100,
    due: 150,
  },
  {
    name: 'Customer 2',
    subTable: {
      purchase: 100,
      sales: 200,
      purchaseReturn: 50,
      salesReturn: 0,
    },
    total: 250,
    paid: 100,
    due: 150,
  },
  {
    name: 'Customer 2',
    subTable: {
      purchase: 100,
      sales: 200,
      purchaseReturn: 50,
      salesReturn: 0,
    },
    total: 250,
    paid: 100,
    due: 150,
  },
  {
    name: 'Customer 2',
    subTable: {
      purchase: 100,
      sales: 200,
      purchaseReturn: 50,
      salesReturn: 0,
    },
    total: 250,
    paid: 100,
    due: 150,
  },
];

const Index = () => {
  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my={'lg'}>
          <Title fw={400}>User Report</Title>
        </Group>
        <Tabs defaultValue='customers'>
          <Tabs.List>
            <Tabs.Tab value='customers' icon={<IconBrandCashapp size={14} />}>
              Customers
            </Tabs.Tab>
            <Tabs.Tab value='suppliers' icon={<IconBuildingBank size={14} />}>
              Suppliers
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='customers'>
            <UserReportTable data={userReportDate} isCustomer={true} />
          </Tabs.Panel>
          <Tabs.Panel value='suppliers'>
            <UserReportTable data={userReportDate} isCustomer={false} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default Index;
