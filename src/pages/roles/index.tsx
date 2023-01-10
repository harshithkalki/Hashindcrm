import TableSelection from '@/components/Tables';
import React from 'react';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { GetServerSideProps } from 'next';

type Roles = RouterOutputs['userRouter']['getAllRoles'];

interface props {
  data: Roles;
}

const index = () => {
  const getAllRoles = trpc.userRouter.getAllRoles.useQuery();
  const Data = getAllRoles.data;

  return (
    Data && (
      <div>
        <TableSelection
          data={Data}
          isDeleteColumn={true}
          isEditColumn={true}
          onDelete={(id) => console.log(id)}
          onEdit={(id) => console.log(id)}
          keysandlabels={{
            id: 'Id',
            name: 'Name',
          }}
        />
      </div>
    )
  );
};

export default index;

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
