import Layout from '@/components/Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Center, Container, Group, Pagination, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = trpc.reports.paymentsReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { t } = useTranslation('common');

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg'>
          <Title fw={400}>{t('payments')}</Title>
        </Group>

        <TableSelection
          data={
            data?.slice((page - 1) * 10, page * 10)?.map((doc) => ({
              ...doc,
              _id: doc._id.toString(),
              index: data.indexOf(doc) + 1,
            })) || []
          }
          colProps={{
            index: {
              label: `${t('sno')}`,
            },
            paymentDate: {
              label: `${t('date')}`,
              Component: (props) => (
                <div>
                  {dayjs(props.data.paymentDate).format('MMMM DD, YYYY')}
                </div>
              ),
            },
            referenceNo: {
              label: `${t('reference no')}`,
            },
            paymentType: {
              label: `${t('payment type')}`,
            },
            user: {
              label: `${t('user')}`,
            },
            type: {
              label: `${t('type')}`,
            },
            amount: {
              label: `${t('amount')}`,
              Component: (props) => <>{Math.round(props.data.amount)}</>,
            },
          }}
        />
        <Center>
          {(data?.length ?? 0) > 1 && (
            <Pagination
              total={Math.floor((data?.length ?? 0) / 10)}
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
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
