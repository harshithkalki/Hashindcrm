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
  Pagination,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
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
  name: '',
  phoneNumber: '',
  address: '',
  email: '',
  password: '123456',
  company: '',
  profile: 'profile',
  status: '',
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

function Company() {
  const [searchValue, onSearchChange] = useState('');
  const companies = trpc.companyRouter.companies.useQuery({
    search: searchValue,
  });

  return (
    <FormikSelect
      label='Company'
      placeholder='Company'
      name='company'
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      data={
        companies.data?.docs.map((company) => ({
          label: company.name,
          value: company._id,
        })) || []
      }
      withAsterisk
      searchable
    />
  );
}

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
                  placeholder='Phone'
                  name='phoneNumber'
                  withAsterisk
                />

                <Company />

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
  const [page, setPage] = React.useState(1);
  const admins = trpc.staffRouter.getAdmins.useInfiniteQuery(
    {},
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (!admins.data?.pages.find((pageData) => pageData.page === page)) {
      admins.fetchNextPage();
    }
  }, [admins, page]);

  return (
    <Layout>
      <AddCustomer
        modal={modal}
        setModal={setModal}
        onCreated={() => admins.refetch()}
      />
      <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
        <Title fw={400}>Admins</Title>
        <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
          Add New
        </Button>
      </Group>
      <Tables
        data={
          admins.data?.pages.find((pageData) => pageData.page === page)?.docs ??
          []
        }
        colProps={{
          name: {
            label: 'Name',
          },
          email: {
            label: 'Email',
          },
        }}
      />
      <Center>
        {(admins.data?.pages.find((pageData) => pageData.page === page)
          ?.totalPages ?? 0) > 1 && (
          <Pagination
            total={
              admins.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages ?? 0
            }
            initialPage={1}
            // {...pagination}
            page={page}
            onChange={setPage}
          />
        )}
      </Center>
    </Layout>
  );
};

export default Index;
