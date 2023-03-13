import CompanyForm from '@/components/CompanyForm';
import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import { Center } from '@mantine/core';
import { useRouter } from 'next/router';

function EditCompany() {
  const { query, push } = useRouter();
  const company = trpc.companyRouter.company.useQuery(
    {
      _id: query.id as string,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!query.id,
    }
  );
  const updateCompany = trpc.companyRouter.update.useMutation();

  if (!company.data) return <Center h={'100%'}>Loading...</Center>;

  return (
    <CompanyForm
      formInputs={company.data}
      onSubmit={(inputs) => {
        return updateCompany
          .mutateAsync({
            _id: query.id as string,
            ...inputs,
          })
          .then((res) => {
            push('/company');
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      title='Add Company'
    />
  );
}

export default function Wrapper() {
  return (
    <Layout>
      <EditCompany />
    </Layout>
  );
}
