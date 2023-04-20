import CardTable from '@/components/Cash,BankandUpi/BankTable';
import CashTable from '@/components/Cash,BankandUpi/CashTable';
import UPITable from '@/components/Cash,BankandUpi/UPITable';
import Layout from '@/components/Layout';

import { Container, Flex, Group, ScrollArea, Tabs, Title } from '@mantine/core';
import { IconBrandCashapp, IconBuildingBank } from '@tabler/icons';
import React from 'react';

const Index = () => {
  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg'>
          <Title fw={400}>Cash, Bank & UPI</Title>
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
      </Container>
    </Layout>
  );
};

export default Index;
