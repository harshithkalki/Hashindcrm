import RoleForm from '@/components/RoleFrom/RoleForm';
import { trpc } from '@/utils/trpc';
import React from 'react';
import { Permissions } from '@/constants';
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
const permissionsDemo: Permission = Permissions.map((val) => ({
  permissionName: val,
  crud: {
    read: false,
    update: false,
    delete: false,
    create: false,
  },
}));

const app = () => {
  const AddRole = trpc.roleRouter.create.useMutation();
  return (
    <Layout>
      <ScrollArea style={{ height: '100%' }}>
        <RoleForm
          formInputs={{
            id: '',
            name: '',
            displayName: '',
            description: '',
            permissions: permissionsDemo,
          }}
          onSubmit={(inputs) => {
            return AddRole.mutateAsync(inputs).then((res) => {
              console.log(res);
            });
          }}
          title='Add Role'
        />
      </ScrollArea>
    </Layout>
  );
};

export default app;
