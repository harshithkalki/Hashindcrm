import { trpc } from '@/utils/trpc';
import {
  Modal,
  Button,
  SimpleGrid,
  Select,
  ActionIcon,
  ScrollArea,
  Table,
  NumberInput,
  Divider,
  Group,
  TextInput,
  Textarea,
  createStyles,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons';
import { Formik, Form, FieldArray } from 'formik';
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormDate from '../FormikCompo/FormikDate';
import FormInput from '../FormikCompo/FormikInput';
import FormikSelect from '../FormikCompo/FormikSelect';
import Formiktextarea from '../FormikCompo/FormikTextarea';

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
  isCustomer?: boolean;
  title: string;
}

type InlineProduct = {
  product: string;
  quantity: number;
  subtotal: number;
  price: number;
  tax: number;
  name: string;
};

type InitialValues = {
  products: InlineProduct[];
  note: string;
  total: number;
  status: string;
  shipping: number;
  orderTax: number;
  discount: number;
  name: string;
  date: string;
};

const initialValues: InitialValues = {
  products: [],
  note: '',
  total: 0,
  status: 'pending',
  shipping: 0,
  orderTax: 0,
  discount: 0,
  name: '',
  date: new Date().toISOString(),
};

const SalesForm = ({ modal, setModal, title, ...props }: modalProps) => {
  const { classes, cx } = useStyles();
  const products = trpc.productRouter.getAllProducts.useQuery();
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const terms =
    '1.Goods once sold will not be takenback or exchanged\n2.All disputes are subject to Mumbai Jurisdiction';

  return (
    <>
      <Modal
        opened={modal}
        onClose={() => {
          setModal(false);
        }}
        title={title}
        size='90%'
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            console.log(values);
          }}
          validationSchema={toFormikValidationSchema(
            z.object({
              products: z.array(
                z.object({
                  product: z.string(),
                  quantity: z.number(),
                })
              ),
              note: z.string(),
              total: z.number(),
              status: z.string(),
              shipping: z.number(),
              orderTax: z.number(),
              discount: z.number(),
              warehouse: z.string(),
              date: z.string(),
            })
          )}
        >
          {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
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
                  label={props.isCustomer ? 'Customer' : 'Supplier'}
                  name='warehouse'
                  data={[
                    { label: 'Customer 1', value: '1' },
                    { label: 'Customer 2', value: '2' },
                  ]}
                  // data={
                  //   warehouses.data?.map((warehouse) => ({
                  //     label: warehouse.name,
                  //     value: warehouse._id.toString(),
                  //   })) || []
                  // }
                  placeholder='Pick one'
                  searchable
                  w={'100%'}
                  rightSection={
                    <IconPlus
                      size={20}
                      onClick={() => {
                        console.log('clicked');
                      }}
                      cursor={'pointer'}
                    />
                  }
                  withAsterisk
                />
                <FormDate
                  label='Date'
                  placeholder='Date'
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
                name='products'
                placeholder='Select Products'
                searchable
                size='sm'
                value={selectProduct?.product.toString() || ''}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      if (selectProduct) {
                        setFieldValue('products', [
                          ...values.products,
                          selectProduct,
                        ]);
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
                      name: product.name,
                      product: product._id.toString(),
                      quantity: 1,
                      price: product.salePrice,
                      tax: product.tax,
                      subtotal: product.salePrice + product.tax,
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
                      <FieldArray
                        name='products'
                        render={(arrayHelpers) => (
                          <React.Fragment>
                            {values.products.map((item, index) => (
                              <tr key={item.product}>
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
                                      if (!value) return;
                                      item.quantity = value;
                                      item.subtotal =
                                        (item.price + item.tax) * value;
                                      setFieldValue(
                                        `products[${index}].quantity`,
                                        value
                                      );
                                      setFieldValue(
                                        `products[${index}].subtotal`,
                                        item.subtotal
                                      );
                                    }}
                                    name={`products[${index}].quantity`}
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
                                  {item.tax}
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
                                      arrayHelpers.remove(index);
                                    }}
                                  >
                                    <IconTrash />
                                  </ActionIcon>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        )}
                      />
                    </tbody>
                  </Table>
                </ScrollArea>
              </div>
              <Divider mt={'lg'} />
              <Group style={{ justifyContent: 'end' }} w={'95%'}>
                <TextInput
                  label={'Total'}
                  value={
                    values.products.reduce(
                      (acc, item) => acc + item.subtotal,
                      0
                    ) || 0
                  }
                  readOnly
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
                    readOnly
                  />
                  <Formiktextarea
                    mt={'md'}
                    placeholder={'Notes'}
                    label={'Notes'}
                    name='note'
                  />
                </div>

                <div>
                  <Group w={'100%'}>
                    <FormikSelect
                      label={'Status'}
                      placeholder={'Select Status'}
                      name={'status'}
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
                    <FormInput
                      w={'46%'}
                      label={'Order Tax'}
                      placeholder={'Order Tax'}
                      name={'orderTax'}
                      type={'number'}
                    />
                    <TextInput
                      w={'46%'}
                      label={'Total'}
                      placeholder={'Total'}
                      readOnly
                      value={
                        values.products.reduce(
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
                <Button type='submit' mb={'md'} loading={isSubmitting}>
                  Submit
                </Button>
                <Button
                  size='sm'
                  onClick={() => {
                    setModal(false);
                  }}
                  mb={'md'}
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

export default SalesForm;
