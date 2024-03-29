import type { RootState } from '@/store';
import { setWarehouse } from '@/store/clientSlice';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
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
import { Formik, Form, useFormikContext, FormikValues } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import type { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import InfiniteSelect from '../Custom/InfiniteSelect';
import FormDate from '../FormikCompo/FormikDate';
import FormInput from '../FormikCompo/FormikInput';
import FormikSelect from '../FormikCompo/FormikSelect';
import Formiktextarea from '../FormikCompo/FormikTextarea';

import { useTranslation } from 'react-i18next';

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
};

// function FromWarehouseSelect() {
//   const [searchValue, onSearchChange] = useState('');
//   const warehouses = trpc.warehouseRouter.warehouses.useInfiniteQuery(
//     {
//       search: searchValue,
//     },
//     {
//       refetchOnWindowFocus: false,
//       getNextPageParam: (lastPage) => lastPage.nextPage,
//     }
//   );
//   const warehouse = useSelector<
//     RootState,
//     RootState['clientState']['warehouse']
//   >((state) => state.clientState.warehouse);
//   const dispatch = useDispatch();
//   const { t } = useTranslation('common');
//   const { values } = useFormikContext();

//   return (
//     <InfiniteSelect
//       label={`${t('from warehouse')}`}
//       placeholder='Select warehouse'
//       data={
//         warehouses.data?.pages
//           .flatMap((page) => page.docs)
//           .map((warehouse, index) => ({
//             label: warehouse.name,
//             value: warehouse._id.toString(),
//             index,
//           })) ?? []
//       }
//       onChange={(value) => {
//         if (value) dispatch(setWarehouse(value));
//       }}
//       value={warehouse}
//       nothingFound='No warehouses found'
//       onWaypointEnter={() => {
//         if (
//           warehouses.data?.pages[warehouses.data.pages.length - 1]?.hasNextPage
//         ) {
//           warehouses.fetchNextPage();
//         }
//       }}
//       rightSection={warehouses.isLoading ? <Loader size={20} /> : undefined}
//       onSearchChange={onSearchChange}
//       searchValue={searchValue}
//       searchable
//       withAsterisk
//       onClick={() => onSearchChange('')}
//     />
//   );
// }

function FromWarehouseSelect() {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [searchValue, onSearchChange] = useState('');

  const warehouses = trpc.warehouseRouter.warehouses.useInfiniteQuery(
    {
      search: searchValue, // Pass the search value from the "From Warehouse" field
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

  // Disable the selected option in the "To Warehouse" based on the "From Warehouse" selection
  // useEffect(() => {
  //   if (values.fromWarehouse === values.toWarehouse) {
  //     setFieldValue('toWarehouse', ''); // Reset the "To Warehouse" value when "From Warehouse" changes
  //   }
  // }, [values.fromWarehouse, setFieldValue]);

  return (
    <InfiniteSelect
      label={`${t('from warehouse')}`}
      placeholder='Select warehouse'
      data={
        warehouses.data?.pages
          .flatMap((page) => page.docs)
          .map((warehouse, index) => ({
            label: warehouse.name,
            value: warehouse._id.toString(),
            index,
            // disabled: warehouse._id.toString() === values.fromWarehouse, // Disable the option if it matches the "From Warehouse" value
          }))
          .filter((option) => {
            return option.value != values.toWarehouse;
          }) ?? []
      }
      onChange={(value) => {
        // console.log(value);
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
      onSearchChange={(value) => {
        setFieldValue('fromWarehouse', value); // Update the "From Warehouse" value on search change
      }}
      searchValue={values.fromWarehouse} // Use the "From Warehouse" value as the search value
      searchable
      withAsterisk
      onClick={() => setFieldValue('fromWarehouse', '')} // Clear the "From Warehouse" value on click
    />
  );
}

const WarehouseSelect = () => {
  const [search, setSearch] = useState('');
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const warehouses = trpc.warehouseRouter.warehouses.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  const { t } = useTranslation('common');
  // console.log(values);
  return (
    <FormikSelect
      label={`${t('to warehouse')}`}
      data={
        warehouses.data?.docs
          ?.map((warehouse) => ({
            label: warehouse.name,
            value: warehouse._id.toString(),
            // disabled: warehouse._id.toString() === values.fromWarehouse,
          }))
          .filter((option) => {
            return option.label != values.fromWarehouse;
          }) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='toWarehouse'
      withAsterisk
      onClick={() => setSearch('')}
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
  const utils = trpc.useContext();

  useEffect(() => {
    if (warehouse) {
      initialValues.fromWarehouse = warehouse;
    }
  }, [warehouse]);

  const { t } = useTranslation('common');

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
          onSubmit={(values, { setSubmitting }) => {
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
              setSubmitting(false);
              setModal(false);
            });
            showNotification({
              title: 'New Transfer',
              message: 'Created successfully',
            });
            utils.stockTransferRouter.stockTransfers.invalidate();
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
                    label={`${t('invoice number')}`}
                    name='invoicenum'
                    placeholder='Invoice Number'
                    description='Leave blank to auto generate'
                  />
                  <FromWarehouseSelect />

                  <WarehouseSelect />

                  <FormDate
                    label={`${t('opening stock date')}`}
                    placeholder='openingStockDate'
                    name='openingStockDate'
                    withAsterisk
                  />
                </SimpleGrid>
                <Select
                  label={`${t('products')}`}
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
                  onClick={() => setSearch('')}
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
                            {t('product')}
                          </th>
                          <th
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {t('quantity')}
                          </th>
                          <th
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {t('price')}
                          </th>
                          <th
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {t('tax')}
                          </th>
                          <th
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {t('subtotal')}
                          </th>
                          <th
                            style={{
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                            }}
                          >
                            {t('actions')}
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
                      label={`${t('terms & conditions')}`}
                      value={terms}
                      readOnly
                    />
                    <Formiktextarea
                      mt={'md'}
                      placeholder={'Notes'}
                      label={`${t('notes')}`}
                      name='note'
                    />
                  </div>

                  <div>
                    <Group w={'100%'}>
                      <FormikSelect
                        label={`${t('status')}`}
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
                        label={`${t('payment Method')}`}
                        w={'46%'}
                        data={[
                          { label: 'Cash', value: 'cash' },
                          { label: 'Card', value: 'card' },
                          { label: 'UPI', value: 'upi' },
                        ]}
                        placeholder='Payment Method'
                        searchable
                        size='sm'
                      />
                    </Group>
                    <Group w={'100%'} mt={'sm'}>
                      <FormInput
                        w={'46%'}
                        type={'number'}
                        label={`${t('shipping')}`}
                        placeholder={'Shipping'}
                        name={'shipping'}
                      />
                      <FormInput
                        w={'46%'}
                        type={'number'}
                        label={`${t('discount')}`}
                        placeholder={'Discount'}
                        name={'discount'}
                      />
                    </Group>
                    <Group w={'100%'} mt={'sm'}>
                      <FormInput
                        w={'46%'}
                        label={`${t('order tax')}`}
                        placeholder={'Order Tax'}
                        name={'orderTax'}
                        value={[...inlineProducts.values()]
                          .reduce(
                            (acc, curr) => acc + curr.taxPrice * curr.quantity,
                            0
                          )
                          .toFixed(2)}
                        type={'number'}
                      />
                      <TextInput
                        w={'46%'}
                        label={`${t('total')}`}
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
                  <Button
                    type='submit'
                    mb={'md'}
                    loading={isSubmitting}
                    disabled={inlineProducts.size === 0}
                  >
                    {t('submit')}
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => {
                      setModal(false);
                    }}
                    mb={'md'}
                  >
                    {t('cancel')}
                  </Button>
                </Group>
                {/* {<pre>{JSON.stringify(props, null, 2)}</pre>} */}
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default TransferForm;
