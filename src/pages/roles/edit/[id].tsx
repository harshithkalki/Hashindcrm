import RoleForm from '@/components/RoleFrom/RoleForm';
import { trpc } from '@/utils/trpc';
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ScrollArea } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';

const App = () => {
  const UpdateRole = trpc.roleRouter.update.useMutation();
  const router = useRouter();
  const { id } = router.query;
  const getRole = trpc.roleRouter.get.useQuery(
    { _id: id as string },
    { refetchOnWindowFocus: false }
  );
  const role = getRole.data;
  const { t } = useTranslation('common');

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
              title={`${t('edit role')}`}
            />
          </ScrollArea>
        </div>
      )) || <div>Loading...</div>}
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
