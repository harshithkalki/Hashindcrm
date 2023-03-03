import Layout from '@/components/Layout';
import {
  Center,
  createStyles,
  Group,
  Loader,
  Pagination,
  Title,
} from '@mantine/core';
import React, { useMemo } from 'react';
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
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  );

  const deleteCompany = trpc.companyRouter.delete.useMutation();

  const onChangePage = (val: number) => {
    setPage(val);

    if (companies.data?.pages.length && val > companies.data.pages.length) {
      companies.fetchNextPage();
    }
  };

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
            data={companies.data.pages[page - 1]?.docs || []}
            keysandlabels={{
              name: 'Company Name',
              email: 'Email',
            }}
            isEditColumn={true}
            isDeleteColumn={true}
            onDelete={async (_id) => {
              await deleteCompany.mutateAsync({
                _id,
              });

              companies.refetch();
            }}
          />
          <Pagination
            total={companies.data.pages[page - 1]?.totalPages || 0}
            initialPage={1}
            // {...pagination}
            page={page}
            onChange={onChangePage}
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
