import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import { Group, Table, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { data } = trpc.reports.profitAndLoss.useQuery();
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Group>
        <Title fw={400}>{t('profit & loss')}</Title>
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
            <th style={{ textAlign: 'left' }}>{t('particulars')}</th>
            <th> {t('amount')} </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('sales')}</td>
            <td>{data?.salesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>{t('purchase')}</td>
            <td>{data?.purchasesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>{t('expenses')}</td>
            <td>{data?.expensesTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>{t('profit')}</td>
            <td>{data?.profit.toFixed(2)}</td>
          </tr>
          <tr>
            <td>{t('purchase return')}</td>
            <td>{0}</td>
          </tr>
          <tr>
            <td>{t('sales returns')}</td>
            <td>{0}</td>
          </tr>
        </tbody>
      </Table>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
