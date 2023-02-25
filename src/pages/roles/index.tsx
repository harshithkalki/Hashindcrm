import TableSelection from '@/components/Tables';
import React from 'react';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

type Roles = RouterOutputs['userRouter']['getAllRoles'];

interface props {
  data: Roles;
}

const Index = () => {
  const getAllRoles = trpc.userRouter.getAllRoles.useQuery();

  const tabData = getAllRoles.data;
  const Data = tabData;
  const router = useRouter();

  return (
    <Layout>
      {Data && (
        <div>
          <TableSelection
            data={Data}
            isDeleteColumn={true}
            isEditColumn={true}
            onDelete={(id) => console.log(id)}
            onEdit={(id) => router.push('/roles/edit/' + id)}
            keysandlabels={{
              // displayName: "Display Name",
              id: 'ID',
              name: 'Name',
            }}
          />
        </div>
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
