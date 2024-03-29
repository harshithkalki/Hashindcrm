import type { RootState } from '@/store';
import { setWarehouse } from '@/store/clientSlice';
import { ZSaleCreateInput } from '@/zobjs/sale';
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
  Center,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconCurrencyRupee,
  IconPercentage,
  IconPlus,
  IconTrash,
} from '@tabler/icons';
import { Formik, Form } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormDate from './FormikCompo/FormikDate';
import FormInput from './FormikCompo/FormikInput';
import FormikSelect from './FormikCompo/FormikSelect';
import Formiktextarea from './FormikCompo/FormikTextarea';
import FormikInfiniteSelect from './FormikCompo/InfiniteSelect';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/utils/trpc';

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

type InitialValues = {
  id: string;
  customer: string;
  products: InlineProduct[];
  notes: string;
  total: number;
  status: 'approved' | 'pending' | 'rejected';
  shipping: number;
  orderTax: number;
  discount: number;
  date: string;
  warehouse: string;
  invoiceId?: string;
  paymentMode: 'cash' | 'card' | 'upi';
};

interface modalProps {
  //   modal: boolean;
  //   setModal: React.Dispatch<React.SetStateAction<boolean>>;
  //   isCustomer?: boolean;
  //   title: string;
  _id: string;
  onClose: () => void;
}

type InlineProduct = {
  _id: string;
  name: string;
  discountedPrice: number;
  taxPrice: number;
  subtotal: number;
  quantity: number;
  price: number;
  tax: number;
};

function WarehouseSelect() {
  const [searchValue, onSearchChange] = useState('');
  const { t } = useTranslation('common');
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
      onClick={() => {
        onSearchChange('');
      }}
    />
  );
}

const CustomerSelect = () => {
  const [search, setSearch] = useState('');
  const customers = trpc.customerRouter.customers.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  const customerData = customers.data?.docs?.map((customer) => ({
    label: customer.name,
    value: customer._id.toString(),
  }));
  const { t } = useTranslation('common');

  return (
    <FormikSelect
      label={`${t('customer')}`}
      data={[
        { label: 'Walk In Customer', value: 'walkInCustomer' },
        ...(customerData || []),
      ]}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='customer'
      onClick={() => setSearch('')}
    />
  );
};

const SalesForm = ({ _id, onClose }: modalProps) => {
  const { classes, cx } = useStyles();
  // const products = trpc.productRouter.getAllProducts.useQuery();
  const [search, setSearch] = useState<string>('');
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const terms =
    '1.Goods once sold will not be takenback or exchanged\n2.All disputes are subject to Mumbai Jurisdiction';

  const ProductData = trpc.saleRouter.getInvoice.useQuery(
    {
      _id: _id,
    },
    { enabled: Boolean(_id) }
  );

  const Data = ProductData.data;
  let totalProductsCost = 0;

  const initialValues: InitialValues = {
    id: Data?._id as unknown as string,
    customer: Data?.customer as string,
    date: Data?.date.toISOString() as unknown as string,
    products: Data?.products as unknown as InlineProduct[],
    orderTax: Data?.orderTax as number,
    status: Data?.status as 'approved' | 'pending' | 'rejected',
    discount: Data?.discount as number,
    shipping: Data?.shipping as number,
    notes: Data?.notes as string,
    total: Data?.total as number,
    warehouse: Data?.warehouse?._id as unknown as string,
    paymentMode: Data?.paymentMode as 'cash' | 'card' | 'upi',
  };

  totalProductsCost = Data?.products?.reduce(
    (acc, product) => acc + product.salePrice,
    0
  ) as number;

  const List = Data?.products.map((product) => {
    const Discount =
      product.salePrice -
      (totalProductsCost * (Data.discount / 100)) / Data.products.length;
    const tax = Discount * (product.tax / 100);
    return {
      _id: product._id,
      name: product.name,
      discountedPrice: Discount,
      taxPrice: tax,
      subtotal: product.salePrice,
      quantity: product.quantity,
      price: product.salePrice,
      tax: product.tax,
    } as InlineProduct;
  });

  const searchProducts = trpc.productRouter.searchProducts.useQuery({
    search: search,
  });

  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map(List?.map((product) => [product._id, product]) || []));

  const salesSubmit = trpc.saleRouter.update.useMutation();

  useEffect(() => {
    if (List && inlineProducts.size === 0) {
      setInlineProducts(
        new Map(List?.map((product) => [product._id, product]) || [])
      );
    }
  }, [List]);

  const { t } = useTranslation('common');

  return (
    <>
      <Modal opened={true} onClose={onClose} title={'EDIT SALE'} size='90%'>
        {ProductData.isLoading ? (
          <Center>
            <Loader size={20} />
          </Center>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(ZSaleCreateInput)}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
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
                    acc +
                    (item.discountedPrice + item.taxPrice) * item.quantity,
                  0
                ) + values.shipping || 0;

              salesSubmit
                .mutateAsync({
                  ...values,
                  customer:
                    values.customer === 'walkInCustomer'
                      ? undefined
                      : values.customer,
                })
                .then(() => {
                  ProductData.refetch();
                  showNotification({
                    title: 'Edit Sale',
                    message: 'Sale Edited Successfully',
                  });
                  setSubmitting(false);
                  onClose();
                });

              resetForm();
              setInlineProducts(new Map());
            }}
          >
            {({ values, handleSubmit, isSubmitting }) => (
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
                    name='id'
                    placeholder='Invoice Number'
                    description='Leave blank to auto generate'
                  />
                  <WarehouseSelect />
                  <CustomerSelect />
                  <FormDate
                    label={`${t('date')}`}
                    placeholder='Date'
                    name='date'
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
                        quantity: 1,
                        subtotal: product.salePrice,

                        price: product.salePrice,
                        tax: product.tax,
                        taxPrice: 0,
                        discountedPrice: 0,
                      });
                    }
                  }}
                  searchValue={search}
                  onSearchChange={setSearch}
                  onClick={() => {
                    setSearch('');
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

                          const taxedPrice =
                            item.discountedPrice * (item.tax / 100);
                          item.taxPrice = taxedPrice;

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
                                    if (!value) return;
                                    item.quantity = value;

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
                        placeholder='Payment Mode'
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
                        icon={<IconCurrencyRupee />}
                      />
                      <FormInput
                        w={'46%'}
                        type={'number'}
                        label={`${t('discount')}`}
                        placeholder={'Discount'}
                        name={'discount'}
                        rightSection={<IconPercentage />}
                      />
                    </Group>
                    <Group w={'100%'} mt={'sm'}>
                      <FormInput
                        w={'46%'}
                        label={`${t('order tax')}`}
                        placeholder={'Order Tax'}
                        name={'orderTax'}
                        value={[...inlineProducts.values()].reduce(
                          (acc, curr) => acc + curr.taxPrice * curr.quantity,
                          0
                        )}
                        readOnly
                        type={'number'}
                        icon={<IconCurrencyRupee />}
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
                        icon={<IconCurrencyRupee />}
                      />
                    </Group>
                  </div>
                </SimpleGrid>
                <Group w={'100%'} style={{ justifyContent: 'center' }}>
                  <Button type='submit' mb={'md'} loading={isSubmitting}>
                    {t('submit')}
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => {
                      onClose();
                    }}
                    mb={'md'}
                  >
                    {t('cancel')}
                  </Button>
                </Group>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </>
  );
};

export default SalesForm;
