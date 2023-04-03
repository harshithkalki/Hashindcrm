import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import { Group, Table, Title } from '@mantine/core';
import React from 'react';

const index = () => {
  const { data } = trpc.reports.profitAndLoss.useQuery();

  return (
    <Layout>
      <Group>
        <Title fw={400}>Profit and Loss</Title>
      </Group>

      <Table
        w={'98%'}
        mt={'xl'}
        ml='lg'
        mr={'lg'}
        horizontalSpacing='md'
        verticalSpacing='xs'
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
        striped
        withBorder
        withColumnBorders
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Particulars</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sales</td>
            <td>{data?.salesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Purchases</td>
            <td>{data?.purchasesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td>{data?.expensesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Profit</td>
            <td>{data?.profit.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Purchase Return</td>
            <td>{0}</td>
          </tr>
          <tr>
            <td>Sales Return</td>
            <td>{0}</td>
          </tr>
        </tbody>
      </Table>
    </Layout>
  );
};

export default index;
