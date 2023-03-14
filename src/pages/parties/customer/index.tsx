import FormikInput from '@/components/FormikCompo/FormikInput';
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
  Loader,
  Modal,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import type { CustomerCreateInput } from '@/zobjs/customer';
import { ZCustomerCreateInput } from '@/zobjs/customer';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormikInfiniteSelect from '@/components/FormikCompo/InfiniteSelect';
import type { RootState } from '@/store';
import { setWarehouse } from '@/store/clientSlice';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import FormikArray from '@/components/FormikCompo/FormikArray';
import TableSelection from '@/components/Tables';

interface ModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
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

const initialValues: CustomerCreateInput = {
  status: 'active',
  name: '',
  email: '',
  profile: '',
  warehouse: '',
  // natureOfBusiness: '',
  numbers: [''],
  billingAddress: '',
  shippingAddress: '',
  taxNumber: '',
  openingBalance: 0,
  creditLimit: 0,
  creditPeriod: 0,
};

function WarehouseSelect() {
  const [searchValue, onSearchChange] = useState('');
  const warehouses = trpc.warehouseRouter.warehouses.useInfiniteQuery(
    {
      search: searchValue,
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);
  const dispatch = useDispatch();

  return (
    <FormikInfiniteSelect
      name='warehouse'
      placeholder='Pick one warehouse'
      label='Warehouse'
      data={
        warehouses.data?.pages
          .flatMap((page) => page.docs)
          .map((warehouse, index) => ({
            label: warehouse.name,
            value: warehouse._id.toString(),
            index,
          })) ?? []
      }
      onChange={(value) => {
        if (value) dispatch(setWarehouse(value));
      }}
      value={warehouse}
      nothingFound='No warehouses found'
      onWaypointEnter={() => {
        if (
          warehouses.data?.pages[warehouses.data.pages.length - 1]?.hasNextPage
        ) {
          warehouses.fetchNextPage();
        }
      }}
      rightSection={warehouses.isLoading ? <Loader size={20} /> : undefined}
      onSearchChange={onSearchChange}
      searchValue={searchValue}
      w={'100%'}
      searchable
    />
  );
}

function CustomerForm({
  values = initialValues,
  onSubmit,
}: {
  values?: CustomerCreateInput;
  onSubmit: (values: CustomerCreateInput) => Promise<void>;
}) {
  const { classes } = useStyles();
  const [profile, setProfile] = useState<File | null>(null);
  const profileref = useRef<HTMLInputElement>(null);

  return (
    <Formik
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const file = profile;
        if (file) {
          const form = new FormData();
          form.append('file', file);
          const { data } = await axios.post('/api/upload-file', form);
          values.profile = data.url;
        }
        await onSubmit(values);
        setSubmitting(false);
        resetForm();
      }}
      initialValues={values}
      validationSchema={toFormikValidationSchema(ZCustomerCreateInput)}
    >
      {(props) => {
        const { handleSubmit, values, setFieldValue } = props;
        return (
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
                  <div style={{ display: 'none' }}>
                    <input
                      type='file'
                      ref={profileref}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfile(file);
                          setFieldValue('profile', URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </Center>
                <Center>
                  <Button
                    size='xs'
                    leftIcon={!!values.profile && <IconUpload size={17} />}
                    onClick={() => {
                      profileref.current?.click();
                    }}
                    styles={{
                      root: {
                        margin: 2,
                      },
                    }}
                  >
                    {!!values.profile ? `Change` : `Upload`}
                  </Button>
                </Center>
              </Container>
              <WarehouseSelect />
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
              <FieldArray
                name='numbers'
                render={(arrayHelpers) => (
                  <FormikArray
                    arrayHelpers={arrayHelpers}
                    label='Phone'
                    placeholder='Phone'
                  />
                )}
              />
              <FormikSelect
                label='Status'
                data={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                placeholder='Pick one status'
                name='status'
                searchable
                w={'100%'}
                withAsterisk
              />
              <FormikInput
                label='Tax Number'
                placeholder='Tax Number'
                name='taxNumber'
                withAsterisk
              />
              <FormikInput
                type={'number'}
                label='Opening Balance'
                placeholder='Opening Balance'
                name='openingBalance'
                withAsterisk
              />
              <FormikInput
                type={'number'}
                label='Credit Limit'
                placeholder='Credit Limit'
                name='creditLimit'
                withAsterisk
              />
              <FormikInput
                type={'number'}
                label='Credit Period'
                placeholder='Credit Period'
                name='creditPeriod'
                withAsterisk
              />
            </SimpleGrid>
            <Formiktextarea
              label='Billing Address'
              placeholder='Billing Address'
              name='billingAddress'
              withAsterisk
              mb={'md'}
            />
            <Formiktextarea
              label='Shipping Address'
              placeholder='Shipping Address'
              name='shippingAddress'
              withAsterisk
            />
            <Group w={'100%'} style={{ justifyContent: 'center' }} mt={'lg'}>
              <Button type='submit' size='xs' loading={props.isSubmitting}>
                Create
              </Button>
            </Group>
            {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
          </Form>
        );
      }}
    </Formik>
  );
}

const AddCustomer = ({ modal, setModal, onClose }: ModalProps) => {
  const create = trpc.customerRouter.create.useMutation();
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => onClose()}
        title='Add New Customer'
        size={'60%'}
      >
        <CustomerForm
          onSubmit={async (values) => {
            await create.mutateAsync(values);
            onClose();
          }}
        />
      </Modal>
    </>
  );
};

const UpdateCustomer = ({
  id,
  setId,
  onClose,
}: {
  id: string | null;
  setId: (id: string | null) => void;
  onClose: () => void;
}) => {
  const customer = trpc.customerRouter.get.useQuery(
    {
      _id: id as string,
    },
    { refetchOnWindowFocus: false, enabled: Boolean(id) }
  );
  const update = trpc.customerRouter.update.useMutation();
  if (customer.isLoading)
    return (
      <center>
        <Loader />
      </center>
    );
  // console.log(customer.data);
  return (
    <Modal
      opened={Boolean(id)}
      onClose={() => onClose()}
      title='Update Customer'
      size={'60%'}
    >
      <CustomerForm
        onSubmit={async (values) => {
          await update.mutateAsync({ _id: id as string, ...values });
          onClose();
        }}
        values={customer.data}
      />
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const customers = trpc.customerRouter.customers.useQuery({
    limit: 10,
  });
  console.log(customers.data);
  const onClose = () => {
    setId(null);
    setModal(false);
    customers.refetch();
  };
  return (
    <Layout>
      <AddCustomer modal={modal} setModal={setModal} onClose={onClose} />

      {id && <UpdateCustomer id={id} setId={setId} onClose={onClose} />}
      <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
        <Title fw={400}>Customers</Title>
        <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
          Add New
        </Button>
      </Group>
      <TableSelection
        data={
          customers.data?.docs.map((val) => ({
            ...val,
            _id: val._id.toString(),
          })) ?? []
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
    </Layout>
  );
};

export default Index;
