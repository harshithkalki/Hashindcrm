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

const Index = () => {
  const [page, setPage] = React.useState(1);
  const roles = trpc.roleRouter.roles.useQuery({ page: page, limit: 10 });

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
          <Title fw={400}>Roles</Title>
          <Button
            size='xs'
            onClick={() => {
              router.push('/roles/add');
            }}
          >
            Add Role
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
              label: 'S.NO',
              Component: ({ index }) => {
                return <>{index + 1}</>;
              },
            },
            name: {
              label: 'Name',
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
