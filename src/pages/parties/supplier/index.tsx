import FormikInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import type { ZSupplierCreateInput } from '@/zobjs/supplier';
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
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconUpload } from '@tabler/icons';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

interface modalProps {
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

const initialValues: z.infer<typeof ZSupplierCreateInput> = {
  name: '',
  email: '',
  phone: '',
  billingAddress: '',
  shippingAddress: '',
  warehouse: '',
  status: 'active',
  creditLimit: 0,
  taxNumber: '',
  creditPeriod: 0,
  openingBalance: 0,
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
  const { t } = useTranslation('common');

  return (
    <div>
      <label
        style={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {t('warehouse')} <span style={{ color: 'red' }}>*</span>
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
          onClick={() => setSearch('')}
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

const Supplierform = ({
  formvalues = initialValues,
  onSubmit,
  setModal,
}: {
  formvalues?: z.infer<typeof ZSupplierCreateInput>;
  onSubmit: (values: z.infer<typeof ZSupplierCreateInput>) => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { classes } = useStyles();
  const { t } = useTranslation('common');
  const utils = trpc.useContext();
  return (
    <Formik
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
        utils.supplierRouter.suppliers.invalidate();
      }}
      initialValues={formvalues}
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
            <FormikInput
              label={`${t('phone')}`}
              placeholder='Phone'
              name='phone'
              withAsterisk
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
            withAsterisk
            mb={'md'}
          />
          <Formiktextarea
            label={`${t('shipping address')}`}
            placeholder='Shipping Address'
            name='shippingAddress'
            withAsterisk
          />
          <Group w={'100%'} style={{ justifyContent: 'center' }} mt={'lg'}>
            <Button type='submit' size='xs'>
              {t('create')}
            </Button>
            <Button
              size='xs'
              onClick={() => {
                setModal(false);
              }}
            >
              {t('cancel')}
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
};

const AddSupplier = ({ modal, setModal, onClose }: modalProps) => {
  const createSupplier = trpc.supplierRouter.create.useMutation();

  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add New Supplier'
        size={'60%'}
      >
        <Supplierform
          setModal={setModal}
          onSubmit={async (values) => {
            await createSupplier.mutateAsync(values);
            onClose();
            setModal(false);
            showNotification({
              title: 'New Supplier',
              message: 'Created successfully',
            });
          }}
        />
      </Modal>
    </>
  );
};

const UpdateSupplier = ({
  id,
  setId,
  onClose,
}: {
  id: string | null;
  setId: (id: string | null) => void;
  onClose: () => void;
}) => {
  const update = trpc.supplierRouter.update.useMutation();
  const supplier = trpc.supplierRouter.get.useQuery(
    {
      _id: id as string,
    },
    { refetchOnWindowFocus: false, enabled: Boolean(id) }
  );

  if (supplier.status === 'loading' || !supplier.data)
    return <div>Loading...</div>;

  return (
    <Modal
      opened={Boolean(id)}
      onClose={() => onClose()}
      title='Update Supplier'
      size={'60%'}
    >
      <Supplierform
        formvalues={{
          ...supplier.data,
          warehouse: supplier.data.warehouse.toString(),
        }}
        onSubmit={async (values) => {
          await update.mutateAsync({ ...values, _id: id as string });
          onClose();
          showNotification({
            title: 'Supplier',
            message: 'Updated successfully',
          });
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
  const suppliers = trpc.supplierRouter.suppliers.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (!suppliers.data?.pages.find((pageData) => pageData.page === page)) {
      suppliers.fetchNextPage();
    }
  }, [suppliers, page]);

  const onClose = () => {
    setId(null);
    suppliers.refetch();
  };

  const { t } = useTranslation();
  return (
    <Layout>
      <AddSupplier modal={modal} setModal={setModal} onClose={onClose} />
      {id && <UpdateSupplier id={id} setId={setId} onClose={onClose} />}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('supplier')}</Title>
          <Button size='xs' mr={'md'} onClick={() => setModal(true)}>
            {t('Add new supplier')}
          </Button>
        </Group>
        <TableSelection
          data={
            suppliers.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val, index) => ({
                ...val,
                _id: val._id.toString(),
                index: index + 10 * (page - 1) + 1,
              })) ?? []
          }
          colProps={{
            // name: 'Name',
            // email: 'Email',
            // status: 'Status',
            index: {
              label: `${t('sno')}`,
            },
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
          {(suppliers.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                suppliers.data?.pages.find((pageData) => pageData.page === page)
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
