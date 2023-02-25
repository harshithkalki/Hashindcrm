import Layout from '@/components/Layout';
import { Container, Title, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Formik, Form } from 'formik';
import React from 'react';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '../../components/FormikCompo/FormikInput';
import FormikPass from '../../components/FormikCompo/FormikPass';

const onSubmit = async (values: CreateAdmin, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface CreateAdmin {
  firstname: string;
  lastname: string;
  username: string;
  // age: number | undefined;
  password: string;
  confirmPassword: string;
  email: string;
  phn: string;
  // gender: "male" | "female" | undefined;
  // companyname: string;
}

const formInputs: CreateAdmin = {
  firstname: '',
  lastname: '',
  username: '',
  // age: undefined,
  email: '',
  password: '',
  confirmPassword: '',
  phn: '',
  // gender: undefined,
  // companyname: "",
};

const app = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const matches = useMediaQuery('(max-width: 800px)');
  return (
    <Layout>
      <Container w={matches ? '80%' : '50%'} mt={'5vh'}>
        <Title fz={'xxl'} fw={'400'} mb={'5vh'}>
          Add Admin
        </Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(
            z
              .object({
                firstname: z.string(),
                lastname: z.string(),
                username: z.string(),
                email: z
                  .string()
                  .email({ message: 'Please enter valid email' }),
                password: z.string(),
                confirmPassword: z.string(),
                phn: z
                  .string()
                  .length(10, 'Phone number should be only 10 digits'),
                // age: z.number(),
                // gender: z.string(),
                // companyname: z.string(),
              })
              .refine((data) => data.password === data.confirmPassword, {
                message: "Passwords don't match",
                path: ['confirm'],
              })
          )}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label='FirstName'
                placeholder='First name'
                name='firstname'
                withAsterisk
                mb={'sm'}
              />
              <FormInput
                label='LastName'
                placeholder='Last name'
                name='lastname'
                withAsterisk
                mb={'sm'}
              />
              <FormInput
                label='UserName'
                placeholder='Username'
                name='username'
                withAsterisk
                mb={'sm'}
              />
              <FormInput
                label='Email'
                placeholder='email id'
                name='email'
                withAsterisk
                mb={'sm'}
              />
              <FormInput
                label='Phone number'
                placeholder='Ex: 1234567890'
                name='phn'
                withAsterisk
                mb={'sm'}
              />

              <FormikPass
                label='Password'
                placeholder='Password'
                name='password'
                withAsterisk
                mb={'sm'}
              />
              <FormikPass
                label='Confirm'
                placeholder='Confirm'
                name='confirmPassword'
                withAsterisk
                mb={'sm'}
              />
              <Button
                disabled={isSubmitting}
                type='submit'
                onClick={() => console.log('button clicked')}
              >
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  );
};

export default app;
