import FormikInput from '@/components/FormikCompo/FormikInput';
import FormInput from '@/components/FormikCompo/FormikPass';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import PartiesTable from '@/components/Tables/PartiesTable';
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
import { IconPlus, IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const AddCustomer = ({ modal, setModal }: modalProps) => {
  const { classes, cx } = useStyles();
  const [Wmodal, WsetModal] = useState(false);
  const createWarehouse = trpc.productRouter.createWarehouse.useMutation();
  const warehouses = trpc.productRouter.getAllWarehouse.useQuery();
  const fileRef = useRef<HTMLInputElement>(null);

  const AddWarehouse = () => {
    return (
      <>
        <Modal
          opened={Wmodal}
          onClose={() => WsetModal(false)}
          title='Add Warehouse'
        >
          <Formik
            initialValues={{
              name: '',
            }}
            validationSchema={toFormikValidationSchema(
              z.object({
                name: z.string().min(3).max(50),
              })
            )}
            onSubmit={async (values, actions) => {
              await createWarehouse.mutateAsync(values);
              actions.resetForm();
              actions.setSubmitting(false);
              setModal(false);
              warehouses.refetch();
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <FormikInput
                    name='name'
                    label='Warehouse Name'
                    placeholder='Warehouse Name'
                  />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    mt={'md'}
                  >
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Modal>
      </>
    );
  };

  return (
    <>
      <AddWarehouse />
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add New Customer'
        size={'60%'}
      >
        <Formik
          onSubmit={(values) => {
            console.log(values);
          }}
          initialValues={{
            name: '',
            email: '',
            phone: '',
            address: '',
            role: '',
            password: '',
            warehouse: '',
            status: '',
            profile: '',
          }}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.number(),
              address: z.string(),
              role: z.string(),
              password: z.string(),
              warehouse: z.string(),
              status: z.string(),
              profile: z.string(),
            })
          )}
        >
          {({ handleSubmit, handleChange, values, setFieldValue }) => (
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
                <FormikSelect
                  label='Warehouse'
                  data={
                    warehouses.data?.map((warehouse) => ({
                      label: warehouse.name,
                      value: warehouse._id.toString(),
                    })) || []
                  }
                  placeholder='Pick one warehouse'
                  name='warehouse'
                  searchable
                  w={'100%'}
                  rightSection={
                    <IconPlus
                      size={20}
                      onClick={() => {
                        WsetModal(true);
                      }}
                      cursor={'pointer'}
                    />
                  }
                  withAsterisk
                />
                <FormikSelect
                  label='Role'
                  data={[
                    { label: 'Admin', value: 'Admin' },
                    { label: 'User', value: 'User' },
                  ]}
                  placeholder='Pick one role'
                  name='role'
                  searchable
                  w={'100%'}
                  withAsterisk
                />
                <FormikInput
                  label='Name'
                  placeholder='Name'
                  name='name'
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
                  type={'number'}
                  placeholder='Phone'
                  name='phone'
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
                name='address'
                withAsterisk
                mb={'md'}
              />

              <Group w={'100%'} style={{ justifyContent: 'center' }} mt={'lg'}>
                <Button type='submit' size='xs'>
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
  return (
    <Layout>
      <AddCustomer modal={modal} setModal={setModal} />
      <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
        <Title fw={400}>Staff Members</Title>
        <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
          Add New
        </Button>
      </Group>
      <PartiesTable
        data={[
          {
            name: 'John Doe',
            email: 'harshith@gmail.com',
            created: '2021-01-01',
            balance: '1000',
            status: 'Active',
          },
          {
            name: 'John Doe',
            email: 'jjjjj@gmail.com',
            created: '2021-01-01',
            balance: '1000',
            status: 'Active',
          },
          {
            name: 'John Doe',
            email: 'jjjjj@gmail.com',
            created: '2021-01-01',
            balance: '1000',
            status: 'Active',
          },
          {
            name: 'John Doe',
            email: 'jjjjj@gmail.com',
            created: '2021-01-01',
            balance: '1000',
            status: 'Active',
          },
        ]}
      />
    </Layout>
  );
};

export default Index;
