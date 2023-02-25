import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import Truncate from '@/components/TextTruncate';
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
import { IconPlus, IconTrash } from '@tabler/icons';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';

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

const customerOptions = [
  { label: 'Customer 1', value: 'Customer 1' },
  { label: 'Customer 2', value: 'Customer 2' },
  { label: 'Customer 3', value: 'Customer 3' },
  { label: 'Customer 4', value: 'Customer 4' },
  { label: 'Customer 5', value: 'Customer 5' },
];

type InlineProduct = {
  _id: string;
  name: string;
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

const Index = () => {
  const [query, setQuery] = useState<Query>({
    page: 1,
    limit: 20,
  });
  const [search, setSearch] = useState<string>('');

  const categories = trpc.categoryRouter.getAllCategories.useQuery();
  const productsQuery = trpc.productRouter.getProducts.useQuery(query);
  const searchProducts = trpc.productRouter.searchProducts.useQuery({
    search: search,
  });

  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [products, setProducts] = useState<
    RouterOutputs['productRouter']['getProducts']['docs']
  >([]);

  useEffect(() => {
    if (productsQuery.data) {
      setProducts((prev) => [
        ...prev,
        ...productsQuery.data.docs.filter((item) => !prev.includes(item)),
      ]);
    }
  }, [productsQuery.data]);

  const { classes, theme } = useStyles();
  return (
    <Layout>
      <Formik
        initialValues={{
          customer: '',
          product: [],
          ordertax: '',
          orderdiscount: 0,
          shipping: 0,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit, values }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>
              <Group>
                <Title fw={400}>POS</Title>
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
                      {categories.data?.map((item) => (
                        <ActionIcon
                          key={item._id.toString()}
                          style={{ width: '70px', height: '60px' }}
                          onClick={() => {
                            setQuery((prev) => ({
                              ...prev,
                              category: item._id.toString(),
                            }));
                            setSelectedCategory(item._id.toString());
                            productsQuery.refetch();
                          }}
                        >
                          <div
                            className='categorylist'
                            style={{
                              boxShadow: '1px 1px 1px 1px rgba(0,0,0,0)',
                              marginTop: '3px',
                              width: '70px',
                              height: '70px',
                              //   border: "1px solid white",
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
                              />
                              <Truncate
                                text={item.name}
                                maxLength={8}
                                textProps={{ size: 'xs' }}
                              />
                              {/* <Text fz={"xs"}>{item.name}</Text> */}
                            </Container>
                          </div>
                        </ActionIcon>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <ScrollArea
                  style={{ flex: '1', width: '45vw', marginTop: '15px' }}
                  scrollbarSize={10}
                  offsetScrollbars
                >
                  <div className={classes.products}>
                    {(selectedCategory
                      ? products.sort((a, b) =>
                          a.category._id === selectedCategory ? -1 : 1
                        )
                      : products
                    ).map((item, index) => (
                      <Card
                        shadow='sm'
                        key={item._id.toString()}
                        p={'xl'}
                        radius={'md'}
                        withBorder
                      >
                        <Card.Section>
                          <Image
                            src={item.logo}
                            alt={item.name}
                            height={160}
                            // width={0}
                          />
                        </Card.Section>
                        <Card.Section pl={'md'} mt={'sm'}>
                          <Text fw={500}>{item.name}</Text>
                        </Card.Section>
                        <Card.Section pl={'md'}>
                          <Text fw={300} fz={'xs'}>
                            {'name' in item.category && item.category.name}
                          </Text>
                        </Card.Section>
                        <Card.Section pl={'md'} mt={'xs'}>
                          <Text fw={500} fz={'lg'} mb={'md'}>
                            $ {item.mrp}
                          </Text>
                        </Card.Section>
                        {index === products.length - 5 && (
                          <Waypoint
                            onEnter={() => {
                              setQuery((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                              }));

                              if (productsQuery.data?.hasNextPage) {
                                productsQuery.refetch();
                              }
                            }}
                          />
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div style={{ flex: 0.39 }}>
                <div style={{ height: '20%' }}>
                  <Container w={'100%'}>
                    <FormikSelect
                      name='customer'
                      label='Customer'
                      data={customerOptions}
                      placeholder='Select Customer'
                      searchable
                      size='sm'
                    />
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
                            quantity: 1,
                            subtotal: product.salePrice + product.tax,
                            price: product.salePrice,
                            tax: product.tax,
                          });
                        }
                      }}
                      searchValue={search}
                      onSearchChange={setSearch}
                    />
                  </Container>
                </div>
                <div style={{ height: '60%' }}>
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
                                  item.subtotal =
                                    (item.price + item.tax) * value;
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
                              {item.subtotal}
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
                        ))}
                      </tbody>
                    </Table>
                  </ScrollArea>
                </div>
                <div style={{ height: '30%' }}>
                  <Group w={'100%'}>
                    <FormInput
                      name='orderdiscount'
                      label='Order Discount'
                      placeholder='Order Discount'
                      w={'30%'}
                      size='sm'
                      type='number'
                    />
                    <FormInput
                      name='shipping'
                      label='Shipping'
                      placeholder='Shipping'
                      w={'30%'}
                      size='sm'
                      type='number'
                    />
                    <FormikSelect
                      name='paymentmethod'
                      label='Payment Method'
                      data={[
                        { label: 'Cash', value: 'cash' },
                        { label: 'Card', value: 'card' },
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
                      value={
                        [...inlineProducts.values()].reduce(
                          (acc, item) => acc + item.subtotal,
                          0
                        ) -
                          values.orderdiscount +
                          values.shipping || 0
                      }
                      disabled
                    />
                    <Button w={'30%'} size='sm' type='submit'>
                      Pay Now
                    </Button>
                    <Button w={'30%'} size='sm'>
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
