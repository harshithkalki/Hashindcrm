import Layout from '@/components/Layout';
import {
  Center,
  createStyles,
  Group,
  Loader,
  Pagination,
  Title,
} from '@mantine/core';
import React, { useEffect } from 'react';
import Tables from '@/components/Tables';
import { trpc } from '@/utils/trpc';

const useStyle = createStyles((theme) => ({
  contianer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Index = () => {
  const { classes } = useStyle();
  const [page, setPage] = React.useState(1);
  const companies = trpc.companyRouter.companies.useInfiniteQuery(
    { limit: 1 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  const deleteCompany = trpc.companyRouter.delete.useMutation();

  useEffect(() => {
    if (!companies.data?.pages.find((pageData) => pageData.page === page)) {
      companies.fetchNextPage();
    }
  }, [companies, page]);

  if (companies.isLoading)
    return (
      <Center h='100%'>
        <Loader />
      </Center>
    );

  return (
    <div className={classes.contianer}>
      <Group mb={'md'}>
        <Title fw={400}>Companies</Title>
      </Group>
      {companies.data && (
        <>
          <Tables
            data={
              companies.data.pages.find((pageData) => pageData.page === page)
                ?.docs || []
            }
            colProps={{
              // name: 'Company Name',
              // email: 'Email',
              name: {
                label: 'Company Name',
              },
              email: {
                label: 'Email',
              },
            }}
            editable={true}
            deletable={true}
            onDelete={async (_id) => {
              await deleteCompany.mutateAsync({
                _id,
              });

              companies.refetch();
            }}
          />
          <Pagination
            total={
              companies.data.pages.find((pageData) => pageData.page === page)
                ?.totalPages || 0
            }
            initialPage={1}
            // {...pagination}
            page={page}
            onChange={setPage}
          />
        </>
      )}
      {companies.isLoading && (
        <Center h='100%'>
          <Loader />
        </Center>
      )}
    </div>
  );
};

export default function Wrapper() {
  return (
    <Layout>
      <Index />
    </Layout>
  );
}
