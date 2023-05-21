import CardTable from '@/components/Cash,BankandUpi/BankTable';
import CashTable from '@/components/Cash,BankandUpi/CashTable';
import UPITable from '@/components/Cash,BankandUpi/UPITable';
import Layout from '@/components/Layout';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { client, trpc } from '@/utils/trpc';

import {
  Button,
  Container,
  Flex,
  Group,
  ScrollArea,
  Tabs,
  Title,
} from '@mantine/core';
import { IconBrandCashapp, IconBuildingBank } from '@tabler/icons';
import React from 'react';

const Index = () => {
  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group
          my='lg'
          style={{
            justifyContent: 'space-between',
          }}
        >
          <Title fw={400}>Cash, Bank & UPI</Title>
          <Group position='apart' align='center'>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.saleRouter.getAllCardSales.query();
                const headers: Record<string, string> = {};
                if (data.length === 0) return;
                Object.keys(data[0]!).forEach((key) => {
                  headers[key as keyof (typeof data)[number]] = key;
                });
                exportCSVFile(headers, data, 'cardSales');
              }}
            >
              Card Csv
            </Button>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.saleRouter.getAllCashSales.query();
                const headers: Record<string, string> = {};
                if (data.length === 0) return;
                Object.keys(data[0]!).forEach((key) => {
                  headers[key as keyof (typeof data)[number]] = key;
                });
                exportCSVFile(headers, data, 'cashSales');
              }}
            >
              UPI Csv
            </Button>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.saleRouter.getAllUPISales.query();
                const headers: Record<string, string> = {};
                if (data.length === 0) return;
                Object.keys(data[0]!).forEach((key) => {
                  headers[key as keyof (typeof data)[number]] = key;
                });
                exportCSVFile(headers, data, 'upiSales');
              }}
            >
              Cash Csv
            </Button>
          </Group>
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
