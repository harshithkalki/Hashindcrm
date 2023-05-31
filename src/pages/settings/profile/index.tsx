import FormInput from '@/components/FormikCompo/FormikInput';
import Layout from '@/components/Layout';
import SettingsNav from '@/components/SettingsNav';
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

const Index = () => {
  const [logo, setLogo] = useState<File | null>(null);
  return (
    <Layout>
      <Container>
        <Group>
          <Title fw={400}>Profile</Title>
        </Group>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            phone: '',
            profile: '',
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values }) => (
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
                {/* <Flex> */}
                <FileInput
                  label='Profile'
                  onChange={setLogo}
                  name='profile'
                  placeholder='Select Profile'
                  icon={<IconUpload size={14} />}
                  description='leave blank if you dont want to change. '
                />
                {/* </Flex> */}
                <FormInput
                  name='phone'
                  label='Phone'
                  placeholder='Enter your phone'
                  value={values.phone}
                />
              </SimpleGrid>
              <Button type='submit' mt={'lg'}>
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
