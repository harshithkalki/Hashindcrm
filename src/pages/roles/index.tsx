import TableSelection from '@/components/Tables';
import React from 'react';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Pagination, ScrollArea } from '@mantine/core';
import RolesTable from '@/components/Tables/RolesTable';
import { usePagination } from '@mantine/hooks';

type Roles = RouterOutputs['roleRouter']['roles']['docs'];

interface props {
  data: Roles;
}

const Index = () => {
  const [page, setPage] = React.useState(1);
  const getAllRoles = trpc.roleRouter.roles.useQuery({ page: page, limit: 1 });

  const tabData = getAllRoles.data;
  const Data = tabData;
  // console.log(Data.docs);
  const router = useRouter();

  return (
    <Layout>
      {Data && (
        <ScrollArea style={{ height: '100%' }}>
          <div>
            {getAllRoles.isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <RolesTable data={Data.docs} />
                <Pagination
                  total={getAllRoles.data?.totalPages}
                  initialPage={1}
                  // {...pagination}
                  page={page}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </Layout>
  );
};

export default Index;

// export const getServerSideProps: GetServerSideProps<
//   { data: Roles },
//   { id: string }
// > = async (ctx) => {
//   const Data = getAllRoles.data;
//   return {
//     props: {
//       data: Data,
//     },
//   };
// };
