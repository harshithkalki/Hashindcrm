import Layout from '@/components/Layout';
import CashandBankTable from '@/components/Tables/CashAndBankTable';
import { Group, Tabs, Title } from '@mantine/core';
import { IconBrandCashapp, IconBuildingBank } from '@tabler/icons';
import React from 'react';
const cashData = [
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0001',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
];

const Index = () => {
  return (
    <Layout>
      <Group mb={'md'}>
        <Title fw={400}>Cash and Bank</Title>
      </Group>
      <Tabs defaultValue='cash'>
        <Tabs.List>
          <Tabs.Tab value='cash' icon={<IconBrandCashapp size={14} />}>
            Cash
          </Tabs.Tab>
          <Tabs.Tab value='bank' icon={<IconBuildingBank size={14} />}>
            Bank
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='cash' mt={'lg'}>
          <CashandBankTable data={cashData} />
        </Tabs.Panel>
        <Tabs.Panel value='bank' mt={'lg'}>
          <CashandBankTable data={cashData} />
        </Tabs.Panel>
      </Tabs>
    </Layout>
  );
};

export default Index;
