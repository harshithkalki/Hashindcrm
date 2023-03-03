import CompanyForm from '@/components/CompanyForm';
import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import React from 'react';
import type { ZCompanyCreateInput } from '@/zobjs/company';
import type { z } from 'zod';
import { useRouter } from 'next/router';

const initialFormInputs: z.infer<typeof ZCompanyCreateInput> = {
  name: '',
  addressline1: '',
  addressline2: '',
  email: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  landline: '',
  mobile: '',
  gstNo: '',
  cinNo: '',
  primaryColor: '',
  secondaryColor: '',
  backgroundColor: '',
  logo: '',
  natureOfBusiness: '',
  numbers: [''],
};

const Index = () => {
  const createCompany = trpc.companyRouter.create.useMutation();
  const { push } = useRouter();

  return (
    <Layout>
      <CompanyForm
        formInputs={initialFormInputs}
        onSubmit={(inputs) => {
          return createCompany
            .mutateAsync(inputs)
            .then((res) => {
              push('/company');
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        title='Add Company'
      />
    </Layout>
  );
};

export default Index;
