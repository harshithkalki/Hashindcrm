import FormDate from '@/components/FormikCompo/FormikDate';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import StockTransferTable from '@/components/Tables/StockTransferTable';
import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Divider,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Table,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

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

type InlineProduct = {
  _id: string;
  name: string;
  subtotal: number;
  quantity: number;
  price: number;
};

const AddStockTransfer = ({ modal, setModal }: modalProps) => {
  const { classes, cx } = useStyles();
  const warehouses = trpc.productRouter.getAllWarehouse.useQuery();
  const [warehouseModal, setWarehouseModal] = React.useState(false);
  const createWarehouse = trpc.productRouter.createWarehouse.useMutation();
  const products = trpc.productRouter.getAllProducts.useQuery();
  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const terms =
    '1.Goods once sold will not be takenback or exchanged\n2.All disputes are subject to Mumbai Jurisdiction';

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
            product: [],
            tax: '',
            discount: 0,
            shipping: 0,
            total: 0,
            notes: '',
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
                  name='date'
                  withAsterisk
                />
              </SimpleGrid>
              <Select
                label='Products'
                m={'md'}
                data={
                  products.data?.map((item) => ({
                    label: item.name,
                    value: item._id.toString(),
                  })) || []
                }
                placeholder='Select Products'
                searchable
                size='sm'
                value={selectProduct?._id.toString() || ''}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      if (selectProduct) {
                        const inlineProduct = inlineProducts.get(
                          selectProduct._id.toString()
                        );
                        if (!inlineProduct) {
                          inlineProducts.set(
                            selectProduct._id.toString(),
                            selectProduct
                          );
                        } else {
                          return;
                        }
                        inlineProducts.set(
                          selectProduct._id.toString(),
                          selectProduct
                        );
                        setInlineProducts(new Map(inlineProducts));
                        setSelectProduct(undefined);
                      }
                    }}
                  >
                    <IconPlus />
                  </ActionIcon>
                }
                onChange={(value) => {
                  const product = products.data?.find(
                    (item) => item._id.toString() === value
                  );

                  if (product) {
                    setSelectProduct({
                      _id: product._id.toString(),
                      name: product.name,
                      quantity: 1,
                      subtotal: product.mrp,
                      price: product.mrp,
                    });
                  }
                }}
              />
              <div style={{ height: '30vh' }}>
                <ScrollArea
                  style={{ height: '100%', width: '100%' }}
                  scrollbarSize={10}
                  offsetScrollbars
                >
                  <Table
                    sx={{ minWidth: '100%' }}
                    verticalSpacing='sm'
                    mt={'md'}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          #
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Product
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Quantity
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Tax
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Subtotal
                        </th>
                        <th
                          style={{
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...inlineProducts.values()].map((item, index) => (
                        <tr key={item._id}>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            <NumberInput
                              size='sm'
                              value={item.quantity}
                              onChange={(value) => {
                                console.log(value);
                                if (!value) return;
                                item.quantity = value;
                                item.subtotal = item.price * value;
                                setInlineProducts(new Map(inlineProducts));
                              }}
                              min={1}
                            />
                          </td>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {item.price}
                          </td>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {'XXXX'}
                          </td>

                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {item.subtotal}
                          </td>
                          <td
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                              // justifyItems: 'center',
                            }}
                          >
                            <ActionIcon
                              variant='filled'
                              color={'blue'}
                              onClick={() => {
                                inlineProducts.delete(item._id);
                                setInlineProducts(new Map(inlineProducts));
                              }}
                            >
                              <IconTrash />
                            </ActionIcon>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </div>
              <Divider mt={'lg'} />
              <Group style={{ justifyContent: 'end' }} w={'95%'}>
                <TextInput
                  label={'Total'}
                  value={
                    [...inlineProducts.values()].reduce(
                      (acc, item) => acc + item.subtotal,
                      0
                    ) || 0
                  }
                  disabled
                />
              </Group>
              <SimpleGrid
                m={'md'}
                cols={2}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: 'md', cols: 2, spacing: 'md' },
                  { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                  { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                ]}
                // style={{ alignItems: 'end' }}
              >
                <div>
                  <Textarea
                    label={'Terms & Conditions'}
                    value={terms}
                    disabled
                  />
                  <Formiktextarea
                    mt={'md'}
                    placeholder={'Notes'}
                    label={'Notes'}
                    name={'notes'}
                    value={values.notes}
                  />
                </div>

                <div>
                  <Group w={'100%'}>
                    <FormikSelect
                      label={'Status'}
                      placeholder={'Select Status'}
                      name={'orderstatus'}
                      w={'46%'}
                      data={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Rejected', value: 'rejected' },
                      ]}
                    />
                    <FormikSelect
                      w={'46%'}
                      label={'Order Tax'}
                      placeholder={'Select Tax'}
                      name={'tax'}
                      data={[
                        { label: 'Tax 1', value: 'tax1' },
                        { label: 'Tax 2', value: 'tax2' },
                        { label: 'Tax 3', value: 'tax3' },
                      ]}
                    />
                  </Group>
                  <Group w={'100%'} mt={'sm'}>
                    <FormInput
                      w={'46%'}
                      type={'number'}
                      label={'Shipping'}
                      placeholder={'Shipping'}
                      name={'shipping'}
                    />
                    <FormInput
                      w={'46%'}
                      type={'number'}
                      label={'Discount'}
                      placeholder={'Discount'}
                      name={'discount'}
                    />
                  </Group>
                  <Group w={'100%'} mt={'sm'}>
                    <TextInput
                      w={'46%'}
                      label={'Order Tax'}
                      placeholder={'Order Tax'}
                      disabled
                      value={0}
                      type={'number'}
                    />
                    <TextInput
                      w={'46%'}
                      label={'Total'}
                      placeholder={'Total'}
                      disabled
                      value={
                        [...inlineProducts.values()].reduce(
                          (acc, item) => acc + item.subtotal,
                          0
                        ) -
                          values.discount +
                          values.shipping || 0
                      }
                      type={'number'}
                    />
                  </Group>
                </div>
              </SimpleGrid>
              <Group w={'100%'} style={{ justifyContent: 'center' }}>
                <Button type='submit' mb={'md'}>
                  Submit
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
