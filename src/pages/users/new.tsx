import Layout from '@/components/Layout';
import type { UserFormType } from '@/components/UserForm';
import UserForm from '@/components/UserForm';
import React from 'react';

const onSubmit = async (values: UserFormType, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const app = () => {
  return (
    <Layout>
      <UserForm
        title='Create User'
        // onSubmit={onSubmit}
        formInputs={{
          firstName: '',
          lastName: '',
          middlename: '',
          phoneNumber: '',
          addressline1: '',
          addressline2: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          role: '',
          linkedto: '',
          email: '',
        }}
      />
    </Layout>
  );
};

export default app;
