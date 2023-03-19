import FormikInput from '@/components/FormikCompo/FormikInput';
import FormInput from '@/components/FormikCompo/FormikPass';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import PartiesTable from '@/components/Tables/PartiesTable';
import { trpc } from '@/utils/trpc';
import { ZStaffMemCreateInput } from '@/zobjs/staffMem';
import {
  ActionIcon,
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
import { IconPlus, IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;

  onSubmit?: (values: z.infer<typeof ZStaffMemCreateInput>) => void;
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

const initialValues: z.infer<typeof ZStaffMemCreateInput> = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  role: '',
  password: '',
  warehouse: '',
  status: '',
  profile: '',
};

const WarehousesSelect = () => {
  const [search, setSearch] = useState('');
  const warehouses = trpc.warehouseRouter.warehouses.useQuery(
    {
      search: search,
    },
    { refetchOnWindowFocus: false }
  );
  const { push } = useRouter();

  return (
    <div>
      <label
        style={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Warehouse <span style={{ color: 'red' }}>*</span>
      </label>
      <Group spacing={2}>
        <FormikSelect
          data={
            warehouses.data?.docs?.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse._id.toString(),
            })) || []
          }
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          placeholder='Pick one warehouse'
          name='warehouse'
          style={{ flex: 1 }}
        />
        <ActionIcon
          onClick={() => push('/warehouse')}
          color='blue'
          variant='light'
          size={'lg'}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </div>
  );
};

const RolesSelect = () => {
  const [search, setSearch] = useState('');
  const roles = trpc.roleRouter.roles.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  return (
    <FormikSelect
      label='Role'
      data={
        roles.data?.docs?.map((brand) => ({
          label: brand.name,
          value: brand._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='role'
      withAsterisk
    />
  );
};

const StaffForm = ({
  formvalues = initialValues,
  onSubmit,
  setModal,
}: {
  formvalues?: z.infer<typeof ZStaffMemCreateInput>;
  onSubmit: (values: z.infer<typeof ZStaffMemCreateInput>) => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { classes } = useStyles();
  return (
    <Formik
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
      initialValues={formvalues}
      validationSchema={toFormikValidationSchema(ZStaffMemCreateInput)}
    >
      {({ handleSubmit, handleChange, values, setFieldValue, errors }) => (
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
                        setFieldValue('profile', URL.createObjectURL(file));
                      }
                    }
                  }}
                />
              </Center>
              <Center>
                <Button
                  size='xs'
                  leftIcon={values.profile === '' && <IconUpload size={17} />}
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
            <WarehousesSelect />
            <RolesSelect />
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
          {/* {JSON.stringify(errors, null, 2)} */}
        </Form>
      )}
    </Formik>
  );
};

const AddCustomer = ({ modal, setModal }: modalProps) => {
  const createStaff = trpc.staffRouter.create.useMutation();

  return (
    <Modal
      opened={modal}
      onClose={() => setModal(false)}
      title='Add New Staffmember'
      size={'60%'}
    >
      <StaffForm
        onSubmit={(values) => {
          createStaff.mutateAsync(values);
          setModal(false);
        }}
        setModal={setModal}
      />
    </Modal>
  );
};

const UpdateCustomer = ({
  id,
  setId,
}: {
  id: string | null;
  setId: (id: string | null) => void;
}) => {
  const updateStaff = trpc.staffRouter.update.useMutation();

  const staff = trpc.staffRouter.getStaff.useQuery(
    {
      _id: id as string,
    },
    { refetchOnWindowFocus: false, enabled: Boolean(id) }
  );

  if (staff.isLoading || !staff.data) return <div>loading</div>;

  return (
    <Modal
      opened={Boolean(id)}
      onClose={() => setId(null)}
      title='Update Staffmember'
      size={'60%'}
    >
      <StaffForm
        formvalues={{
          ...staff.data,
          linkedTo: staff.data?.linkedTo?.toString(),
          role: staff.data.role?.toString(),
          warehouse: staff.data.warehouse?.toString(),
          password: '',
        }}
        onSubmit={(values) => {
          updateStaff.mutateAsync({
            ...values,
            _id: id as string,
          });
          setId(null);
        }}
        setModal={() => setId(null)}
      />
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const staffs = trpc.staffRouter.staffs.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (!staffs.data?.pages.find((pageData) => pageData.page === page)) {
      staffs.fetchNextPage();
    }
  }, [staffs, page]);

  // console.log(id);

  return (
    <Layout>
      <AddCustomer modal={modal} setModal={setModal} />
      {id && <UpdateCustomer id={id} setId={setId} />}
      <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
        <Title fw={400}>Staff Members</Title>
        <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
          Add Staff Member
        </Button>
      </Group>
      <TableSelection
        data={
          staffs.data?.pages
            .find((pageData) => pageData.page === page)
            ?.docs.map((val) => ({ ...val, _id: val._id.toString() })) ?? []
        }
        colProps={{
          // name: 'Name',
          // email: 'Email',
          // status: 'Status',
          name: {
            label: 'Name',
          },
          email: {
            label: 'Email',
          },
          status: {
            label: 'Status',
          },
        }}
        onEdit={(id) => {
          setId(id);
        }}
        editable
      />
      <Center>
        {(staffs.data?.pages.find((pageData) => pageData.page === page)
          ?.totalPages ?? 0) > 1 && (
          <Pagination
            total={
              staffs.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages ?? 0
            }
            initialPage={1}
            page={page}
            onChange={setPage}
          />
        )}
      </Center>
    </Layout>
  );
};

export default Index;
