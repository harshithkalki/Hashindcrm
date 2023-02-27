import RoleForm from '@/components/RoleFrom/RoleForm';
import { trpc } from '@/utils/trpc';
import React from 'react';
import type { Permissions } from '@/constants';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ScrollArea } from '@mantine/core';

type Permission = {
  permissionName: typeof Permissions[number];
  crud: {
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    create?: boolean;
  };
}[];

// const permissionsDemo: Permission = [
//   {
//     permissionName: "COMPANY",
//     crud: {
//       read: false,
//       update: false,
//       delete: false,
//       create: false,
//     },
//   },
//   {
//     permissionName: "USER",
//     crud: {
//       read: false,
//       update: false,
//       delete: false,
//       create: false,
//     },
//   },
// ];

// https://decision-tree-lxlo.vercel.app/
// https://decision-tree-lxlo.vercel.app/workspace

const App = () => {
  const UpdateRole = trpc.userRouter.updateRole.useMutation();
  const router = useRouter();
  const { id } = router.query;
  const getRole = trpc.userRouter.getRole.useQuery(
    { roleId: id as string },
    { refetchOnWindowFocus: false }
  );
  const role = getRole.data;

  return (
    <Layout>
      {(role && (
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <ScrollArea style={{ height: '100%' }}>
            <RoleForm
              formInputs={{
                id: id as string,
                name: role.name,
                displayName: role.displayName,
                description: '',
                permissions: role.permissions,
              }}
              onSubmit={(inputs) => {
                return UpdateRole.mutateAsync(inputs).then((res) => {
                  console.log(res);
                });
              }}
              title='Edit Role'
            />
          </ScrollArea>
        </div>
      )) || <div>Loading...</div>}
    </Layout>
  );
};

export default App;
