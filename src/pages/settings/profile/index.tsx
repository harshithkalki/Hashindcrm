import FormInput from '@/components/FormikCompo/FormikInput';
import Layout from '@/components/Layout';
import {
  Button,
  Container,
  FileInput,
  Group,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { trpc } from '@/utils/trpc';
import axios from 'axios';

const Index = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const client = useSelector<RootState, RootState['clientState']['client']>(
    (state) => state.clientState.client
  );
  const { mutateAsync } = trpc.profileRouter.update.useMutation();

  if (!client) return null;

  return (
    <Layout>
      <Container>
        <Group>
          <Title fw={400}>Profile</Title>
        </Group>
        <Formik
          initialValues={{
            name: client?.name || '',
            email: client?.email || '',
            password: '',
            phone: client?.phoneNumber || '',
            profile: client?.profile || '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            if (logo) {
              const form = new FormData();
              form.append('file', logo);
              const { data } = await axios.post('/api/upload-file', form);
              values.profile = data.url;
            }
            await mutateAsync({
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone,
              profile: values.profile,
            });

            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <SimpleGrid cols={2} spacing='xl'>
                <FormInput
                  name='name'
                  label='Name'
                  placeholder='Enter your name'
                  value={values.name}
                />
                <FormInput
                  name='email'
                  label='Email'
                  placeholder='Enter your email'
                  value={values.email}
                />
                <FormInput
                  name='password'
                  label='Password'
                  placeholder='Enter your password'
                  value={values.password}
                  description='leave blank if you dont want to change.'
                />

                <FileInput
                  label='Profile'
                  onChange={setLogo}
                  name='profile'
                  placeholder='Select Profile'
                  icon={<IconUpload size={14} />}
                  description='leave blank if you dont want to change. '
                />

                <FormInput
                  name='phone'
                  label='Phone'
                  placeholder='Enter your phone'
                  value={values.phone}
                />
              </SimpleGrid>
              <Button type='submit' mt={'lg'} loading={isSubmitting}>
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  );
};

export default Index;
