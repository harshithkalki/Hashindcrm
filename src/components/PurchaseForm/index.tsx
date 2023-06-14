import type { RootState } from '@/store';
import { setWarehouse } from '@/store/clientSlice';
import { trpc } from '@/utils/trpc';
import type { PurchaseCreateInput } from '@/zobjs/purchase';
import { ZPurchaseCreateInput } from '@/zobjs/purchase';
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
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormDate from '../FormikCompo/FormikDate';
import FormInput from '../FormikCompo/FormikInput';
import FormikSelect from '../FormikCompo/FormikSelect';
import Formiktextarea from '../FormikCompo/FormikTextarea';
import FormikInfiniteSelect from '../FormikCompo/InfiniteSelect';
// import Invoice from '../Invoice';
import Invoice from '../PurchaseInvoice';
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
  discountedPrice: number;
  taxPrice: number;
  subtotal: number;
  quantity: number;
  price: number;
  tax: number;
};

const initialValues: PurchaseCreateInput = {
  supplier: '',
  date: new Date().toISOString(),
  products: [],
  orderTax: 0,
  status: 'approved' as 'approved' | 'pending' | 'rejected',
  discount: 0,
  shipping: 0,
  notes: '',
  total: 0,
  warehouse: '',
  paymentMode: 'cash',
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
      onClick={() => onSearchChange('')}
    />
  );
}

const SupplierSelect = () => {
  const [search, setSearch] = useState('');
  const suppliers = trpc.supplierRouter.suppliers.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  const { t } = useTranslation('common');
  return (
    <FormikSelect
      label={`${t('supplier')}`}
      data={
        suppliers.data?.docs?.map((supplier) => ({
          label: supplier.name,
          value: supplier._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='supplier'
      withAsterisk
      onClick={() => setSearch('')}
    />
  );
};
const terms =
  '1.Goods once sold will not be takenback or exchanged\n2.All disputes are subject to Mumbai Jurisdiction';

const PurchaseForm = ({ modal, setModal, title, ...props }: modalProps) => {
  const { classes, cx } = useStyles();
  // const products = trpc.productRouter.getAllProducts.useQuery();
  const [search, setSearch] = useState<string>('');
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);
  const utils = trpc.useContext();

  const searchProducts = trpc.productRouter.searchProducts.useQuery({
    search: search,
    warehouse: warehouse,
  });

  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());

  const [invoiceId, setInvoiceId] = useState<string>('');

  const PurchasesSubmit = trpc.purchaseRouter.create.useMutation();

  const invoice = trpc.purchaseRouter.getInvoice.useQuery(
    {
      _id: invoiceId,
    },
    { enabled: Boolean(invoiceId) }
  );
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (invoice.data) {
      handlePrint();
      setInvoiceId('');
    }
  }, [handlePrint, invoice.data]);

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
          validationSchema={toFormikValidationSchema(ZPurchaseCreateInput)}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            values.products = Array.from(inlineProducts.values());
            values.orderTax = Math.round(
              [...inlineProducts.values()].reduce(
                (acc, item) => acc + item.taxPrice * item.quantity,
                0
              ) -
                values.discount +
                values.shipping || 0
            );
            values.total =
              [...inlineProducts.values()].reduce(
                (acc, item) =>
                  acc + (item.discountedPrice + item.taxPrice) * item.quantity,
                0
              ) + values.shipping || 0;

            PurchasesSubmit.mutateAsync(values).then((res) => {
              showNotification({
                title: 'New Purchase',
                message: 'Created successfully',
              });
              setSubmitting(false);
              setInvoiceId(res._id as unknown as string);
              utils.purchaseRouter.purchases.invalidate();
            });

            resetForm();
            setInlineProducts(new Map());
          }}
        >
          {({ values, handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              {invoice.data && (
                <div style={{ display: 'none' }}>
                  <Invoice invoiceRef={componentRef} data={invoice.data} />
                </div>
              )}
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
                <WarehouseSelect />
                <SupplierSelect />
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
                        const totalPrice = [...inlineProducts.values()].reduce(
                          (acc, item) => acc + item.price,
                          0
                        );
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
                {<>{console.log(errors)}</>}
                <Button
                  type='submit'
                  mb={'md'}
                  loading={isSubmitting}
                  disabled={
                    Object.keys(errors).length > 0 || inlineProducts.size === 0
                  }
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
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default PurchaseForm;
