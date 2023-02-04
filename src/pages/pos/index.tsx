import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Truncate from '@/components/TextTruncate';
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
import React, { useState } from 'react';

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
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const categories = trpc.categoryRouter.getAllCategories.useQuery();
  const products = trpc.productRouter.getProductsByCategory.useQuery({
    category: categories.data?.[selectedCategory]?._id.toString() || '',
  });
  const [inlineProducts, setInlineProducts] = useState<
    Map<string, InlineProduct>
  >(new Map());
  const [selectProduct, setSelectProduct] = useState<InlineProduct>();

  const { classes } = useStyles();
  return (
    <>
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
          <Form onSubmit={handleSubmit}>
            <Group>
              <Title fw={400}>POS</Title>
            </Group>
            <Divider mt={'md'} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                height: '100%',
                marginTop: '10px',
              }}
            >
              <div style={{ flex: 0.59 }}>
                <div
                  style={{
                    height: '13%',
                    //   border: "1px solid white",
                  }}
                >
                  <ScrollArea
                    style={{ height: '100%', width: '45vw' }}
                    scrollbarSize={5}
                  >
                    <div
                      style={{
                        display: 'flex',
                        marginTop: '10px',
                        //   flexWrap: "wrap",
                        justifyContent: 'space-around',
                        width: `${95 * (categories.data?.length || 0)}px`,
                        height: '100%',
                      }}
                    >
                      {categories.data?.map((item, index) => (
                        <ActionIcon
                          key={item._id.toString()}
                          style={{ width: '70px', height: '60px' }}
                          onClick={() => setSelectedCategory(index)}
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
                <div style={{ height: '85%', marginTop: '15px' }}>
                  <ScrollArea
                    style={{ height: '75vh', width: '45vw' }}
                    scrollbarSize={10}
                    offsetScrollbars
                  >
                    <div className={classes.products}>
                      {products.data?.map((item) => (
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
                              {item.category as unknown as string}
                            </Text>
                          </Card.Section>
                          <Card.Section pl={'md'} mt={'xs'}>
                            <Text fw={500} fz={'lg'} mb={'md'}>
                              $ {item.mrp}
                            </Text>
                          </Card.Section>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
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
                <div style={{ height: '20%' }}>
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
                      name='ordertax'
                      label='Order Tax'
                      data={customerOptions}
                      placeholder='Select Order Tax'
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
    </>
  );
};

export default Index;
