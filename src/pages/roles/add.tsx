import RoleForm from '@/components/RoleFrom/RoleForm';
import { trpc } from '@/utils/trpc';
import React from 'react';
import { Permissions } from '@/constants';
import Layout from '@/components/Layout';
import { ScrollArea } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

type Permission = {
  permissionName: (typeof Permissions)[number];
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

const App = () => {
  const { t } = useTranslation('common');
  const AddRole = trpc.roleRouter.create.useMutation();
  return (
    <Layout>
      <ScrollArea style={{ height: '100%' }}>
        <RoleForm
          formInputs={{
            name: '',
            displayName: '',
            permissions: permissionsDemo,
            defaultRedirect: '',
          }}
          onSubmit={async (inputs) => {
            return AddRole.mutateAsync(inputs).then((res) => {
              console.log(res);
            });
          }}
          title={`${t('add role')}`}
        />
      </ScrollArea>
    </Layout>
  );
};

export default App;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
