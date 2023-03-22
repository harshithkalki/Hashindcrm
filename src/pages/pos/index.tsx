import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import Truncate from '@/components/TextTruncate';
import type { RootState } from '@/store';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import {
  Divider,
  Image,
  Group,
  ScrollArea,
  Title,
  Text,
  Container,
  ActionIcon,
  createStyles,
  Card,
  Select,
  Table,
  TextInput,
  Button,
  NumberInput,
} from '@mantine/core';
import {
  IconCurrencyRupee,
  IconPercentage,
  IconPlus,
  IconTrash,
} from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Waypoint } from 'react-waypoint';
import { showNotification } from '@mantine/notifications';
import Invoice from '@/components/Invoice';
import { useReactToPrint } from 'react-to-print';
import type { IProduct } from '@/models/Product';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { SaleCreateInput } from '@/zobjs/sale';
import { ZSaleCreateInput } from '@/zobjs/sale';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  products: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridGap: theme.spacing.lg,
    // [theme.breakpoints.down("xs")]: {
    //     gridTemplateColumns: "repeat(2, 1fr)",
    // },
  },
}));

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

type Query = {
  page: number;
  limit: number;
  category?: string;
};

const initialValues: SaleCreateInput = {
  customer: 'walkin',
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
  staffMem: '',
};

function ProductsSelect({
  onClickProduct,
}: {
  onClickProduct: (
    product: IProduct & {
      _id: string;
    }
  ) => void;
}) {
  const { classes } = useStyles();
  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);
  const categories = trpc.saleRouter.getCategoriesForPos.useQuery(
    {
      warehouse: warehouse ?? '',
    },
    {
      enabled: !!warehouse,
    }
  );
  const [category, setCategory] = useState<string | undefined>(undefined);
  const products = trpc.productRouter.getProducts.useInfiniteQuery(
    {
      warehouse: warehouse,
      category,
    },
    {
      enabled: !!warehouse,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return (
    <div
      style={{
        flex: 0.59,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div>
        <ScrollArea scrollbarSize={5}>
          <div
            style={{
              display: 'flex',
              padding: '15px',
              overflow: 'hidden',
              gap: '10px',
            }}
          >
            <ActionIcon
              style={{ width: '70px', height: '60px' }}
              onClick={() => {
                setCategory(undefined);
              }}
            >
              <div
                className='categorylist'
                style={{
                  boxShadow: '1px 1px 1px 1px rgba(0,0,0,0)',
                  marginTop: '3px',
                  width: '70px',
                  height: '70px',
                  borderRadius: '10px',
                  backgroundColor: '#25262B',
                  display: 'inline-block',
                }}
              >
                <Container
                  p={2}
                  ta={'center'}
                  mt={'5px'}
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                  styles={{
                    '&:hover': {
                      backgroundColor: 'white',
                      color: 'black',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Image
                    ml={'14px'}
                    alt='All'
                    height={35}
                    width={35}
                    radius='xl'
                    withPlaceholder
                  />
                  <Truncate
                    text='All'
                    maxLength={8}
                    textProps={{ size: 'xs' }}
                  />
                </Container>
              </div>
            </ActionIcon>
            {categories.data?.map((item) => (
              <ActionIcon
                key={item._id.toString()}
                style={{ width: '70px', height: '60px' }}
                onClick={() => {
                  setCategory(item._id.toString());
                }}
              >
                <div
                  className='categorylist'
                  style={{
                    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0)',
                    marginTop: '3px',
                    width: '70px',
                    height: '70px',
                    borderRadius: '10px',
                    backgroundColor: '#25262B',
                    display: 'inline-block',
                  }}
                >
                  <Container
                    p={2}
                    ta={'center'}
                    mt={'5px'}
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    styles={{
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Image
                      ml={'14px'}
                      src={item.logo}
                      alt={item.name}
                      height={35}
                      width={35}
                      radius='xl'
                      withPlaceholder
                    />
                    <Truncate
                      text={item.name}
                      maxLength={8}
                      textProps={{ size: 'xs' }}
                    />
                  </Container>
                </div>
              </ActionIcon>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ScrollArea
        style={{
          flex: '1',
          width: '45vw',
          marginTop: '15px',
        }}
        scrollbarSize={10}
        offsetScrollbars
      >
        <div className={classes.products}>
          {products.data?.pages.map((page) =>
            page.docs.map((item, index) => (
              <Card
                shadow='sm'
                key={item._id.toString()}
                p={'xl'}
                radius={'md'}
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onClickProduct({
                    ...item,
                    _id: item._id.toString(),
                  });
                }}
              >
                <Card.Section>
                  <Image
                    src={item.logo}
                    alt={item.name}
                    height={160}
                    // width={0}
                    withPlaceholder
                  />
                </Card.Section>
                <Card.Section pl={'md'} mt={'sm'}>
                  <Text fw={500}>{item.name}</Text>
                </Card.Section>
                <Card.Section pl={'md'}>
                  <Text fw={300} fz={'xs'}>
                    {(item.category as unknown as { name: string }).name}
                  </Text>
                </Card.Section>
                <Card.Section pl={'md'} mt={'xs'}>
                  <Text fw={500} fz={'lg'} mb={'md'}>
                    {'\u20B9'} {item.salePrice}
                  </Text>
                </Card.Section>
                {index === page.docs.length - 5 && (
                  <Waypoint
                    onEnter={() => {
                      if (!page.hasNextPage) return;

                      if (page.hasNextPage) {
                        products.fetchNextPage();
                      }
                    }}
                  />
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const StaffMemSelect = () => {
  const [search, setSearch] = useState('');
  const staffMem = trpc.staffRouter.staffs.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  return (
    <FormikSelect
      label='Staff Member'
      data={
        staffMem.data?.docs?.map((staff) => ({
          label: staff.name,
          value: staff._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='staffMem'
    />
  );
};

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
  return (
    <FormikSelect
      label='Customer'
      data={[
        { label: 'Walk In Customer', value: 'walkInCustomer' },
        ...(customerData || []),
      ]}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='customer'
    />
  );
};

const Index = () => {
  const [query, setQuery] = useState<Query>({
    page: 1,
    limit: 20,
  });
  const [search, setSearch] = useState<string>('');
  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);

  const categories = trpc.categoryRouter.getAllCategories.useQuery(undefined, {
    enabled: !!warehouse,
  });
  //todo:  double caching should be removed
  const productsQuery = trpc.productRouter.getProducts.useQuery(
    {
      ...query,
      cursor: query.page,
      warehouse,
    },
    {
      enabled: !!warehouse,
      cacheTime: 0,
    }
  );

  const searchProducts = trpc.productRouter.searchProducts.useQuery({
    search: search,
  });
  const router = useRouter();

  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [products, setProducts] = useState<
    RouterOutputs['productRouter']['getProducts']['docs']
  >([]);

  const salesSubmit = trpc.saleRouter.create.useMutation();

  const invoice = trpc.saleRouter.getInvoice.useQuery(
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
    if (productsQuery.data) {
      setProducts((prev) => {
        return [
          ...(prev[0]?.warehouse.toString() === warehouse ? prev : []),
          ...productsQuery.data.docs.filter((item) => !prev.includes(item)),
        ];
      });
    }
  }, [productsQuery.data, warehouse]);

  useEffect(() => {
    if (invoice.data) {
      handlePrint();
      setInvoiceId('');
    }
  }, [handlePrint, invoice.data]);

  const { classes, theme } = useStyles();
  return (
    <Layout>
      {invoice.data && (
        <div style={{ display: 'none' }}>
          <Invoice invoiceRef={componentRef} data={invoice.data} />
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(ZSaleCreateInput)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
          values.warehouse = warehouse as string;

          salesSubmit.mutateAsync(values).then((res) => {
            showNotification({
              title: 'New Sale',
              message: 'Sale created successfully',
            });
            setSubmitting(false);
            console.log(res._id);
            setInvoiceId(res._id as unknown as string);

            // const invoice = trpc.saleRouter.getInvoice.useQuery({
            //   _id: res._id as string,
            // });
          });

          resetForm();
          setInlineProducts(new Map());
          console.log(values);
        }}
      >
        {({ handleSubmit, values, isSubmitting, resetForm }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>
              <Group style={{ justifyContent: 'space-between' }}>
                <Title fw={400}>POS</Title>
                <StaffMemSelect />
              </Group>
              <Divider mt={'md'} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                flex: 1,
                marginTop: '10px',
                marginBottom: '10px',
                overflow: 'hidden',
              }}
            >
              <ProductsSelect
                onClickProduct={(item) => {
                  const product = item;
                  const pushItem: InlineProduct = {
                    _id: product._id.toString(),
                    name: product.name,
                    quantity: 1,
                    subtotal: product.salePrice,
                    price: product.salePrice,
                    tax: product.tax,
                    discountedPrice: 0,
                    taxPrice: 0,
                  };
                  const inlineProduct = inlineProducts.get(
                    pushItem._id.toString()
                  );
                  if (!inlineProduct) {
                    inlineProducts.set(pushItem._id.toString(), pushItem);
                  } else {
                    return;
                  }
                  inlineProducts.set(pushItem._id.toString(), pushItem);
                  setInlineProducts(new Map(inlineProducts));
                  setSelectProduct(undefined);
                }}
              />
              <div
                style={{
                  flex: 0.39,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <div>
                  <Container w={'100%'}>
                    <CustomerSelect />
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
                            // if (selectProduct) {
                            //   const inlineProduct = inlineProducts.get(
                            //     selectProduct._id.toString()
                            //   );
                            //   if (!inlineProduct) {
                            //     inlineProducts.set(
                            //       selectProduct._id.toString(),
                            //       selectProduct
                            //     );
                            //   } else {
                            //     return;
                            //   }
                            //   inlineProducts.set(
                            //     selectProduct._id.toString(),
                            //     selectProduct
                            //   );
                            //   setInlineProducts(new Map(inlineProducts));
                            //   setSelectProduct(undefined);
                            // }
                            router.push('/products/add');
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
                            // discountedPrice:
                            //   product.salePrice -
                            //   (totalPrice * (values.orderdiscount / 100)) /
                            //     (inlineProducts.size + 1),
                            price: product.salePrice,
                            tax: product.tax,
                            discountedPrice: 0,
                            taxPrice: 0,
                          });
                          const pushItem: InlineProduct = {
                            _id: product._id.toString(),
                            name: product.name,
                            quantity: 1,
                            subtotal: product.salePrice,
                            price: product.salePrice,
                            tax: product.tax,
                            discountedPrice: 0,
                            taxPrice: 0,
                          };
                          const inlineProduct = inlineProducts.get(
                            pushItem._id.toString()
                          );
                          if (!inlineProduct) {
                            inlineProducts.set(
                              pushItem._id.toString(),
                              pushItem
                            );
                          } else {
                            return;
                          }
                          inlineProducts.set(pushItem._id.toString(), pushItem);
                          setInlineProducts(new Map(inlineProducts));
                          setSelectProduct(undefined);
                        }
                      }}
                      searchValue={search}
                      onSearchChange={setSearch}
                    />
                  </Container>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
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
                          <th style={{ whiteSpace: 'nowrap' }}>Tax</th>
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
                                {item.tax}
                              </td>
                              <td
                                style={{
                                  whiteSpace: 'nowrap',
                                  textAlign: 'center',
                                }}
                              >
                                {(
                                  (discountedPrice + taxedPrice) *
                                  item.quantity
                                ).toFixed(2)}
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
                <div>
                  <Group w={'100%'}>
                    <FormInput
                      name='discount'
                      label='Order Discount'
                      placeholder='Order Discount'
                      w={'30%'}
                      size='sm'
                      type='number'
                      rightSection={<IconPercentage />}
                    />
                    <FormInput
                      name='shipping'
                      label='Shipping'
                      placeholder='Shipping'
                      w={'30%'}
                      size='sm'
                      type='number'
                      icon={<IconCurrencyRupee />}
                    />
                    <FormikSelect
                      name='paymentMode'
                      label='Payment Method'
                      data={[
                        { label: 'Cash', value: 'cash' },
                        { label: 'Card', value: 'card' },
                        { label: 'UPI', value: 'upi' },
                      ]}
                      placeholder='Payment Method'
                      w={'30%'}
                      searchable
                      size='sm'
                    />
                  </Group>
                  <Group w={'100%'} align={'end'}>
                    <TextInput
                      label='Total'
                      w={'30%'}
                      placeholder='Total'
                      size='sm'
                      value={(
                        [...inlineProducts.values()].reduce(
                          (acc, item) =>
                            acc +
                            (item.discountedPrice + item.taxPrice) *
                              item.quantity,
                          0
                        ) + (values.shipping ? values.shipping : 0) ?? 0
                      ).toFixed(2)}
                      disabled
                      icon={<IconCurrencyRupee />}
                    />
                    <Button
                      w={'30%'}
                      size='sm'
                      loading={isSubmitting}
                      type='submit'
                    >
                      Save & Print
                    </Button>
                    <Button
                      w={'30%'}
                      size='sm'
                      onClick={() => {
                        setInlineProducts(new Map());
                        resetForm();
                      }}
                    >
                      Reset
                    </Button>
                  </Group>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default Index;
