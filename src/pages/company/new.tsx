import CompanyForm from '@/components/CompanyForm';
import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import React from 'react';

const index = () => {
  const createCompany = trpc.companyRouter.create.useMutation();

  return (
    <Layout>
      <CompanyForm
        formInputs={{
          name: '',
          email: '',
          addressline1: '',
          addressline2: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
          landline: '',
          mobile: '',
          cinNo: '',
          gstNo: '',
          primaryColor: '',
          secondaryColor: '',
          backgroundColor: '',
          logo: '',
          natureOfBusiness: '',
        }}
        onSubmit={(inputs) => {
          return createCompany
            .mutateAsync(inputs)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        title='Add Company'
      />
    </Layout>
  );
};

export default index;
