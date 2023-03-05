import FormikInput from '@/components/FormikCompo/FormikInput';
import FormInput from '@/components/FormikCompo/FormikPass';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import {
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import type { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { ZAdminCreateInput } from '@/zobjs/staffMem';
import Tables from '@/components/Tables';

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated?: () => void;
}

const initialValues: z.infer<typeof ZAdminCreateInput> = {
  firstName: '',
  lastName: 'lastname',
  phoneNumber: '',
  addressline1: '',
  city: 'hyd',
  state: 'tel',
  country: 'ind',
  pincode: '212345',
  email: '',
  password: '123456',
  company: '63ff1a39b29440e57af4c524',
  profile: 'profile',
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'dark',
    padding: '15px 20px',
    borderRadius: '5px',
    boxShadow: theme.shadows.xs,
  },
  profile: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: theme.shadows.sm,
    },
  },
  addressWrapper: {
    padding: '8px 13px',
  },
  containerStyles: {
    margin: 'auto',
    width: '100%',
  },
}));

const AddCustomer = ({ modal, setModal, onCreated }: modalProps) => {
  const { classes, cx } = useStyles();
  const createAdmin = trpc.staffRouter.createAdmin.useMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add New Customer'
        size={'60%'}
      >
        <Formik
          onSubmit={(values, { setSubmitting }) => {
            createAdmin.mutateAsync(values).then(() => {
              setModal(false);
              onCreated && onCreated();
              setSubmitting(false);
            });
          }}
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(ZAdminCreateInput)}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <SimpleGrid
                m={'md'}
                cols={3}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: 'md', cols: 3, spacing: 'md' },
                  { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                  { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                ]}
              >
                <Container className={classes.containerStyles}>
                  <Center>
                    <Image
                      height={150}
                      width={150}
                      src={values.profile}
                      alt=''
                      withPlaceholder
                    />
                    <input
                      hidden
                      ref={fileRef}
                      type='file'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          if (file) {
                            setFieldValue('logo', URL.createObjectURL(file));
                          }
                        }
                      }}
                    />
                  </Center>
                  <Center>
                    <Button
                      size='xs'
                      leftIcon={
                        values.profile === '' && <IconUpload size={17} />
                      }
                      onClick={() => {
                        fileRef.current?.click();
                      }}
                      styles={{
                        root: {
                          margin: 2,
                        },
                      }}
                    >
                      {values.profile === '' ? `Upload` : `Change`}
                    </Button>
                  </Center>
                </Container>

                <FormikInput
                  label='Name'
                  placeholder='Name'
                  name='firstName'
                  withAsterisk
                />
                <FormikInput
                  label='Email'
                  placeholder='Email'
                  name='email'
                  withAsterisk
                />
                <FormikInput
                  label='Phone'
                  placeholder='Phone'
                  name='phoneNumber'
                  withAsterisk
                />
                <FormikSelect
                  label='Status'
                  data={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                  placeholder='Pick one status'
                  name='status'
                  searchable
                  w={'100%'}
                  withAsterisk
                />
                <FormInput
                  label='Password'
                  placeholder='Password'
                  name='password'
                  withAsterisk
                />
              </SimpleGrid>
              <Formiktextarea
                label='Address'
                placeholder='Address'
                name='addressline1'
                withAsterisk
                mb={'md'}
              />

              <Group w={'100%'} style={{ justifyContent: 'center' }} mt={'lg'}>
                <Button type='submit' size='xs' loading={createAdmin.isLoading}>
                  Create
                </Button>
                <Button
                  size='xs'
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const admin = trpc.staffRouter.getAdmins.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <Layout>
      <AddCustomer
        modal={modal}
        setModal={setModal}
        onCreated={() => admin.refetch()}
      />
      <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
        <Title fw={400}>Admins</Title>
        <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
          Add New
        </Button>
      </Group>
      <Tables
        data={admin.data?.docs || []}
        keysandlabels={{
          firstName: 'Name',
          email: 'Email',
        }}
      />
    </Layout>
  );
};

export default Index;
