import RoleForm from '@/components/RoleFrom/RoleForm';
import { trpc } from '@/utils/trpc';
import React from 'react';
import type { Permissions } from '@/constants';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ScrollArea } from '@mantine/core';

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
  const UpdateRole = trpc.roleRouter.update.useMutation();
  const router = useRouter();
  const { id } = router.query;
  const getRole = trpc.roleRouter.get.useQuery(
    { _id: id as string },
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
                name: role.name,
                displayName: role.displayName,
                description: role.description,
                permissions: role.permissions,
                defaultRedirect: role.defaultRedirect,
              }}
              onSubmit={(inputs) => {
                return UpdateRole.mutateAsync({
                  _id: id as string,
                  ...inputs,
                }).then((res) => {
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
