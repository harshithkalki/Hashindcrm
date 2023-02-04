import FormDate from '@/components/FormikCompo/FormikDate';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import StockTransferTable from '@/components/Tables/StockTransferTable';
import { trpc } from '@/utils/trpc';
import {
  Button,
  Container,
  createStyles,
  Divider,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const productsData = [
  {
    id: 1,
    name: 'Product 1',
    quantity: 10,
    price: 100,
    total: 1000,
  },
  {
    id: 2,
    name: 'Product 2',
    quantity: 10,
    price: 100,
    total: 1000,
  },
  {
    id: 3,
    name: 'Product 3',
    quantity: 10,
    price: 100,
    total: 1000,
  },
  {
    id: 4,
    name: 'Product 4',
    quantity: 10,
    price: 100,
    total: 1000,
  },
  {
    id: 5,
    name: 'Product 5',
    quantity: 10,
    price: 100,
    total: 1000,
  },
];

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

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddStockTransfer = ({ modal, setModal }: modalProps) => {
  const { classes, cx } = useStyles();
  const warehouses = trpc.productRouter.getAllWarehouse.useQuery();
  const [warehouseModal, setWarehouseModal] = React.useState(false);
  const createWarehouse = trpc.productRouter.createWarehouse.useMutation();

  const AddWarehouse = () => {
    return (
      <>
        <Modal
          opened={warehouseModal}
          onClose={() => setWarehouseModal(false)}
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
                  <FormInput
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
        onClose={() => {
          setModal(false);
        }}
        title='Add Stock Transfer'
        size='90%'
      >
        <Formik
          initialValues={{
            invoicenum: '',
            warehouse: '',
            date: '',
            orderstatus: '',
            productList: [],
            tax: '',
            discount: 0,
            shipping: 0,
            total: 0,
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
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
                style={{ alignItems: 'end' }}
              >
                <FormInput
                  label='Invoice Number'
                  name='invoicenum'
                  placeholder='Invoice Number'
                  description='Leave blank to auto generate'
                />
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
                        setWarehouseModal(true);
                      }}
                      cursor={'pointer'}
                    />
                  }
                  withAsterisk
                />
                <FormDate
                  label='Opening Stock Date'
                  placeholder='Opening Stock Date'
                  name='openingStockDate'
                  withAsterisk
                />
              </SimpleGrid>
              <Select
                style={{ width: '100%' }}
                placeholder='Select Product'
                data={productsData.map((product) => ({
                  label: product.name,
                  value: product.id,
                }))}
              />
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
    <>
      <AddStockTransfer modal={modal} setModal={setModal} />
      <Container>
        <Group style={{ justifyContent: 'space-between' }} mt={'md'}>
          <Title fw={400}>Stock Transfer</Title>
          <Button
            size='xs'
            onClick={() => {
              setModal(true);
            }}
          >
            Add Transfer
          </Button>
        </Group>
        <Divider mt={'lg'} />
        <StockTransferTable
          data={[
            {
              invoicenum: 'INV-0001',
              warehouse: 'Warehouse 1',
              date: '2021-01-01',
              status: 'Pending',
              paidamount: '100',
              totalamount: '100',
              paymentstatus: 'Pending',
            },
            {
              invoicenum: 'INV-0002',
              warehouse: 'Warehouse 2',
              date: '2021-01-01',
              status: 'Pending',
              paidamount: '100',
              totalamount: '100',
              paymentstatus: 'Pending',
            },
            {
              invoicenum: 'INV-0003',
              warehouse: 'Warehouse 3',
              date: '2021-01-01',
              status: 'Pending',
              paidamount: '100',
              totalamount: '100',
              paymentstatus: 'Pending',
            },
          ]}
        />
      </Container>
    </>
  );
};

export default Index;
