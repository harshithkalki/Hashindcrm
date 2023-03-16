import CardTable from '@/components/Cash,BankandUpi/BankTable';
import CashTable from '@/components/Cash,BankandUpi/CashTable';
import UPITable from '@/components/Cash,BankandUpi/UPITable';
import Layout from '@/components/Layout';

import { Flex, Group, ScrollArea, Tabs, Title } from '@mantine/core';
import { IconBrandCashapp, IconBuildingBank } from '@tabler/icons';
import React from 'react';

const Index = () => {
  return (
    <Layout>
      <Flex style={{ flexDirection: 'column' }}>
        <Group mb={'md'}>
          <Title fw={400}>Cash , Bank & Upi</Title>
        </Group>
        <Tabs defaultValue='cash'>
          <Tabs.List>
            <Tabs.Tab value='cash' icon={<IconBrandCashapp size={14} />}>
              Cash
            </Tabs.Tab>
            <Tabs.Tab value='bank' icon={<IconBuildingBank size={14} />}>
              Bank
            </Tabs.Tab>
            <Tabs.Tab value='upi' icon={<IconBuildingBank size={14} />}>
              UPI
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='cash' mt={'lg'}>
            <CashTable />
          </Tabs.Panel>
          <Tabs.Panel value='bank' mt={'lg'}>
            <CardTable />
          </Tabs.Panel>
          <Tabs.Panel value='upi' mt={'lg'}>
            <UPITable />
          </Tabs.Panel>
        </Tabs>
      </Flex>
    </Layout>
  );
};

export default Index;
