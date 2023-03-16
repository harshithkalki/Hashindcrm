import type { RootState } from '@/store';
import { setWarehouse } from '@/store/clientSlice';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import { ZSaleCreateInput } from '@/zobjs/sale';
import { ZStockTransferCreateInput } from '@/zobjs/stockTransfer';
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
  Loader,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons';
import { Formik, Form } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormDate from '../FormikCompo/FormikDate';
import FormInput from '../FormikCompo/FormikInput';
import FormikSelect from '../FormikCompo/FormikSelect';
import Formiktextarea from '../FormikCompo/FormikTextarea';
import FormikInfiniteSelect from '../FormikCompo/InfiniteSelect';
import Invoice from '../Invoice';

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
  _id: string;
  name: string;
  product: string;
  discountedPrice: number;
  taxPrice: number;
  subtotal: number;
  quantity: number;
  price: number;
  tax: number;
};

type InitialValues = {
  products: InlineProduct[];
  notes: string;
  total: number;
  status: 'approved' | 'pending' | 'rejected';
  shipping: number;
  orderTax: number;
  discount: number;
  openingStockDate: string;
  formWarehouse: string;
  toWarehouse: string;
  invoiceId?: string;
  paymentMode: string;
};
// type WarehouseInput = ;
const initialValues: z.infer<typeof ZStockTransferCreateInput> = {
  openingStockDate: new Date().toISOString(),
  products: [],
  orderTax: 0,
  status: 'approved' as 'approved' | 'pending' | 'rejected',
  discount: 0,
  shipping: 0,
  note: '',
  total: 0,
  fromWarehouse: '',
  toWarehouse: '',
  //   paymentMode: '',
};

const WarehouseSelect = () => {
  const [search, setSearch] = useState('');
  const warehouses = trpc.warehouseRouter.warehouses.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  return (
    <FormikSelect
      label='To Warehouse'
      data={
        warehouses.data?.docs?.map((warehouse) => ({
          label: warehouse.name,
          value: warehouse._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='toWarehouse'
      withAsterisk
    />
  );
};

const TransferForm = ({ modal, setModal, title, ...props }: modalProps) => {
  const { classes, cx } = useStyles();
  // const products = trpc.productRouter.getAllProducts.useQuery();
  const [search, setSearch] = useState<string>('');
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const terms =
    '1.Goods once sold will not be takenback or exchanged\n2.All disputes are subject to Mumbai Jurisdiction';

  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);

  const searchProducts = trpc.productRouter.searchProducts.useQuery({
    search: search,
    warehouse: warehouse,
  });

  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());

  const [products, setProducts] = useState<
    RouterOutputs['productRouter']['getProducts']['docs']
  >([]);

  const transferSubmit = trpc.stockTransferRouter.create.useMutation();
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (warehouse) {
      initialValues.fromWarehouse = warehouse;
    }
  }, [warehouse]);

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
          validationSchema={toFormikValidationSchema(ZStockTransferCreateInput)}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            console.log(inlineProducts);
            values.products = Array.from(inlineProducts.values());
            values.orderTax =
              [...inlineProducts.values()].reduce(
                (acc, item) => acc + item.taxPrice * item.quantity,
                0
              ) -
                values.discount +
                values.shipping || 0;
            values.total =
              [...inlineProducts.values()].reduce(
                (acc, item) =>
                  acc + (item.discountedPrice + item.taxPrice) * item.quantity,
                0
              ) + values.shipping || 0;

            transferSubmit.mutateAsync(values).then((res) => {
              showNotification({
                title: 'New Sale',
                message: 'Sale created successfully',
              });
              setSubmitting(false);

              setModal(false);
            });

            resetForm();
            setInlineProducts(new Map());
          }}
          //  onSubmit={(values, { setSubmitting, resetForm }) => {
          //    console.log(values);
          //    setSubmitting(false);
          //  }}
        >
          {(props) => {
            const {
              values,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              errors,
            } = props;

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
                  style={{ alignItems: 'end' }}
                >
                  <FormInput
                    label='Invoice Number'
                    name='invoicenum'
                    placeholder='Invoice Number'
                    description='Leave blank to auto generate'
                  />

                  <WarehouseSelect />

                  <FormDate
                    label='openingStockDate'
                    placeholder='openingStockDate'
                    name='openingStockDate'
                    withAsterisk
                  />
                </SimpleGrid>
                <Select
                  label='Products'
                  data={
                    searchProducts.data?.map((item) => ({
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
                    const product = searchProducts.data?.find(
                      (item) => item._id.toString() === value
                    );

                    if (product) {
                      setSelectProduct({
                        _id: product._id.toString(),
                        name: product.name,
                        product: product._id.toString(),
                        quantity: 1,
                        subtotal: product.salePrice,
                        // discountedPrice:
                        //   product.salePrice -
                        //   (totalPrice * (values.orderdiscount / 100)) /
                        //     (inlineProducts.size + 1),
                        price: product.salePrice,
                        tax: product.tax,
                        taxPrice: 0,
                        discountedPrice: 0,
                      });
                    }
                  }}
                  searchValue={search}
                  onSearchChange={setSearch}
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
                        {[...inlineProducts.values()].map((item, index) => {
                          const totalPrice = [
                            ...inlineProducts.values(),
                          ].reduce((acc, item) => acc + item.price, 0);
                          const discountedPrice =
                            item.subtotal -
                            (totalPrice * (values.discount / 100)) /
                              inlineProducts.size;
                          item.discountedPrice = discountedPrice;
                          // console.log(item);
                          const taxedPrice =
                            item.discountedPrice * (item.tax / 100);
                          item.taxPrice = taxedPrice;
                          // item.subtotal = item.discountedPrice + taxedPrice;
                          return (
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
                                    // console.log(item);
                                    if (!value) return;
                                    item.quantity = value;

                                    // item.discountedPrice =
                                    //   item.discountedPrice * value;
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
                                {item.tax}
                              </td>
                              <td
                                style={{
                                  whiteSpace: 'nowrap',
                                  textAlign: 'center',
                                }}
                              >
                                {(discountedPrice + taxedPrice) * item.quantity}
                              </td>
                              <td
                                style={{
                                  whiteSpace: 'nowrap',
                                  textAlign: 'center',
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
                          );
                        })}
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
                        name='paymentMode'
                        label='Payment Mode'
                        w={'46%'}
                        data={[
                          { label: 'Cash', value: 'cash' },
                          { label: 'Card', value: 'card' },
                          { label: 'UPI', value: 'upi' },
                        ]}
                        placeholder='Payment Mode'
                        searchable
                        size='sm'
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
                        value={[...inlineProducts.values()].reduce(
                          (acc, curr) => acc + curr.taxPrice * curr.quantity,
                          0
                        )}
                        type={'number'}
                      />
                      <TextInput
                        w={'46%'}
                        label={'Total'}
                        placeholder={'Total'}
                        readOnly
                        value={(
                          [...inlineProducts.values()].reduce(
                            (acc, item) =>
                              acc +
                              (item.discountedPrice + item.taxPrice) *
                                item.quantity,
                            0
                          ) + (values.shipping ? values.shipping : 0) ?? 0
                        ).toFixed(2)}
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
                {<pre>{JSON.stringify(props, null, 2)}</pre>}
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default TransferForm;