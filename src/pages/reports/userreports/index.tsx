import CashandBankTable from '@/components/Tables/CashAndBankTable';
import UserReportTable from '@/components/Tables/UserReportsTable.';
import { Group, Tabs, Title } from '@mantine/core';
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
    <>
      <Group mb={'lg'}>
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
    </>
  );
};

export default Index;
