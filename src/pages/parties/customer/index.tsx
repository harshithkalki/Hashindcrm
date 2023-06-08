import FormikInput from '@/components/FormikCompo/FormikInput';
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
  Loader,
  Modal,
  Pagination,
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
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  const { t } = useTranslation('common');

  return (
    <FormikInfiniteSelect
      name='warehouse'
      placeholder='Pick one warehouse'
      label={`${t('warehouse')}`}
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
      withAsterisk
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
  const { t } = useTranslation('common');

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
                label={`${t('name')}`}
                placeholder='Name'
                name='name'
                withAsterisk
              />
              <FormikInput
                label={`${t('email')}`}
                placeholder='Email'
                name='email'
                // withAsterisk
              />
              <FieldArray
                name='numbers'
                render={(arrayHelpers) => (
                  <FormikArray
                    arrayHelpers={arrayHelpers}
                    label={`${t('phone')}`}
                    placeholder='Phone'
                  />
                )}
              />
              <FormikSelect
                label={`${t('status')}`}
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
                label={`${t('tax number')}`}
                placeholder='Tax Number'
                name='taxNumber'
                // withAsterisk
              />
              <FormikInput
                type={'number'}
                label={`${t('opening balance')}`}
                placeholder='Opening Balance'
                name='openingBalance'
                // withAsterisk
              />
              <FormikInput
                type={'number'}
                label={`${t('credit limit')}`}
                placeholder='Credit Limit'
                name='creditLimit'
                // withAsterisk
              />
              <FormikInput
                type={'number'}
                label={`${t('credit period')}`}
                placeholder='Credit Period'
                name='creditPeriod'
                // withAsterisk
              />
            </SimpleGrid>
            <Formiktextarea
              label={`${t('billing address')}`}
              placeholder='Billing Address'
              name='billingAddress'
              // withAsterisk
              mb={'md'}
            />
            <Formiktextarea
              label={`${t('shipping address')}`}
              placeholder='Shipping Address'
              name='shippingAddress'
              // withAsterisk
            />
            <Group w={'100%'} style={{ justifyContent: 'center' }} mt={'lg'}>
              <Button type='submit' size='xs' loading={props.isSubmitting}>
                {t('create')}
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
  const { t } = useTranslation('common');
  const utils = trpc.useContext();
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => onClose()}
        title={`${t('Add new customer')}`}
        size={'60%'}
      >
        <CustomerForm
          onSubmit={async (values) => {
            await create.mutateAsync(values);
            onClose();
            utils.customerRouter.customers.invalidate();
            showNotification({
              title: 'New Customer',
              message: 'Created successfully',
            });
          }}
        />
      </Modal>
    </>
  );
};

const UpdateCustomer = ({
  id,

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
  const { t } = useTranslation('common');
  const utils = trpc.useContext();
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
      title={`${t('update customer')}`}
      size={'60%'}
    >
      <CustomerForm
        onSubmit={async (values) => {
          await update.mutateAsync({ _id: id as string, ...values });
          utils.customerRouter.customers.invalidate();
          onClose();
          showNotification({
            title: 'New Customer',
            message: 'Created successfully',
          });
        }}
        values={
          customer.data && {
            ...customer.data,
            warehouse: customer.data.warehouse.toString(),
          }
        }
      />
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const customers = trpc.customerRouter.customers.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const onClose = () => {
    setId(null);
    setModal(false);
    customers.refetch();
  };

  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <Layout>
      <AddCustomer modal={modal} setModal={setModal} onClose={onClose} />

      {id && <UpdateCustomer id={id} setId={setId} onClose={onClose} />}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my={'lg'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('customer')}</Title>
          <Group>
            <Button
              size='xs'
              mr={'md'}
              onClick={() => {
                router.push('customer/cars');
              }}
            >
              {t('show customer cars')}
            </Button>

            <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
              {t('Add new customer')}
            </Button>
          </Group>
        </Group>
        <TableSelection
          data={
            customers.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
              })) ?? []
          }
          colProps={{
            name: {
              label: `${t('name')}`,
            },
            email: {
              label: `${t('email')}`,
            },
            status: {
              label: `${t('status')}`,
            },
          }}
          onEdit={(id) => {
            setId(id);
          }}
          editable
        />
        <Center>
          {(customers.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                customers.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
