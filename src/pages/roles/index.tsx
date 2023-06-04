import TableSelection from '@/components/Tables';
import React from 'react';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Button,
  Center,
  Container,
  Group,
  Pagination,
  Title,
} from '@mantine/core';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const roles = trpc.roleRouter.roles.useQuery({ page: page, limit: 10 });
  const { t } = useTranslation('common');
  // const {}=useTranslation('client');
  // const { cl}=useTranslation('client');

  const router = useRouter();

  if (roles.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Container
        h='100%'
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Group mb={'lg'} mt='lg' position='apart'>
          <Title fw={400}>{t('roles')}</Title>
          <Button
            size='xs'
            onClick={() => {
              router.push('/roles/add');
            }}
          >
            {t('add role')}
          </Button>
        </Group>
        <TableSelection
          data={
            roles.data?.docs.map((val) => ({
              ...val,
              _id: val._id.toString(),
            })) ?? []
          }
          colProps={{
            _id: {
              label: `${t('sno')}`,
              Component: ({ index }) => {
                return <>{index + 1}</>;
              },
            },
            name: {
              label: `${t('name')}`,
            },
          }}
          editable
          onEdit={(id) => {
            router.push(`/roles/edit/${id}`);
          }}
        />
        <Center>
          {(roles.data?.totalPages ?? 0) > 1 && (
            <Pagination
              total={roles.data?.totalPages ?? 0}
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
