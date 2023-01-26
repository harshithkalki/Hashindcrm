import FormInput from "@/components/FormikCompo/FormikInput";
import FormikSelect from "@/components/FormikCompo/FormikSelect";
import Truncate from "@/components/TextTruncate";
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
  Input,
  TextInput,
  Button,
} from "@mantine/core";
import { Form, Formik } from "formik";
import React from "react";

const useStyles = createStyles((theme) => ({
  products: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridGap: theme.spacing.lg,
    // [theme.breakpoints.down("xs")]: {
    //     gridTemplateColumns: "repeat(2, 1fr)",
    // },
  },
}));

const customerOptions = [
  { label: "Customer 1", value: "Customer 1" },
  { label: "Customer 2", value: "Customer 2" },
  { label: "Customer 3", value: "Customer 3" },
  { label: "Customer 4", value: "Customer 4" },
  { label: "Customer 5", value: "Customer 5" },
];

const CategoriesDate = [
  {
    id: 1,
    name: "Category 1",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "Category 2",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Category 3",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    name: "Category 4",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 5,
    name: "Category 5",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 6,
    name: "Category 6",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 7,
    name: "Category 7",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 8,
    name: "Category 8",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 9,
    name: "Category 9",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 10,
    name: "Category 10",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 10,
    name: "Category 10",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 10,
    name: "Category 10",
    logo: "https://picsum.photos/200/300",
  },
  {
    id: 10,
    name: "Category 10",
    logo: "https://picsum.photos/200/300",
  },
];

const ProductsDate = [
  {
    id: 1,
    name: "Product 1",
    logo: "https://as-images.apple.com/is/refurb-iphone-12-pro-graphite-2020?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1635202842000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 2,
    name: "Product 2",
    logo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=607&hei=556&fmt=jpeg&qlt=90&.v=1633623988000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 3,
    name: "Product 3",
    logo: "https://img.freepik.com/premium-psd/cosmetic-product-packaging-mockup_1150-40282.jpg?w=2000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 4,
    name: "Product 4",
    logo: "https://picsum.photos/200/300",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 5,
    name: "Product 5",
    logo: "https://thumbs.dreamstime.com/b/bath-beauty-products-24145725.jpg",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 6,
    name: "Product 6",
    logo: "https://as-images.apple.com/is/refurb-iphone-12-pro-graphite-2020?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1635202842000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 7,
    name: "Product 7",
    logo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=607&hei=556&fmt=jpeg&qlt=90&.v=1633623988000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 8,
    name: "Product 8",
    logo: "https://as-images.apple.com/is/refurb-iphone-12-pro-graphite-2020?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1635202842000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 9,
    name: "Product 9",
    logo: "https://thumbs.dreamstime.com/b/bath-beauty-products-24145725.jpg",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
  {
    id: 10,
    name: "Product 10",
    logo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=607&hei=556&fmt=jpeg&qlt=90&.v=1633623988000",
    category: "Category 1",
    price: 100,
    quantity: 10,
  },
];

const Index = () => {
  const { classes } = useStyles();
  return (
    <>
      <Formik
        initialValues={{
          customer: "",
          product: [],
          ordertax: "",
          orderdiscount: 0,
          shipping: 0,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Group>
              <Title fw={400}>POS</Title>
            </Group>
            <Divider mt={"md"} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                height: "100%",
                marginTop: "10px",
              }}
            >
              <div style={{ flex: 0.59 }}>
                <div
                  style={{
                    height: "13%",
                    //   border: "1px solid white",
                  }}
                >
                  <ScrollArea
                    style={{ height: "100%", width: "45vw" }}
                    scrollbarSize={5}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                        //   flexWrap: "wrap",
                        justifyContent: "space-around",
                        width: `${95 * CategoriesDate.length}px`,
                        height: "100%",
                      }}
                    >
                      {CategoriesDate.map((item) => (
                        <ActionIcon
                          key={item.id}
                          style={{ width: "70px", height: "60px" }}
                        >
                          <div
                            className="categorylist"
                            style={{
                              boxShadow: "1px 1px 1px 1px rgba(0,0,0,0)",
                              marginTop: "3px",
                              width: "70px",
                              height: "70px",
                              //   border: "1px solid white",
                              borderRadius: "10px",
                              backgroundColor: "#25262B",
                              display: "inline-block",
                            }}
                          >
                            <Container
                              p={2}
                              ta={"center"}
                              mt={"5px"}
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                              styles={{
                                "&:hover": {
                                  backgroundColor: "white",
                                  color: "black",
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <Image
                                ml={"14px"}
                                src={item.logo}
                                alt={item.name}
                                height={35}
                                width={35}
                                radius="xl"
                              />
                              <Truncate
                                text={item.name}
                                maxLength={8}
                                textProps={{ size: "xs" }}
                              />
                              {/* <Text fz={"xs"}>{item.name}</Text> */}
                            </Container>
                          </div>
                        </ActionIcon>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div style={{ height: "85%", marginTop: "15px" }}>
                  <ScrollArea
                    style={{ height: "75vh", width: "45vw" }}
                    scrollbarSize={10}
                    offsetScrollbars
                  >
                    <div className={classes.products}>
                      {ProductsDate.map((item) => (
                        <Card
                          shadow="sm"
                          key={item.id}
                          p={"xl"}
                          radius={"md"}
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
                          <Card.Section pl={"md"} mt={"sm"}>
                            <Text fw={500}>{item.name}</Text>
                          </Card.Section>
                          <Card.Section pl={"md"}>
                            <Text fw={300} fz={"xs"}>
                              {item.category}
                            </Text>
                          </Card.Section>
                          <Card.Section pl={"md"} mt={"xs"}>
                            <Text fw={500} fz={"lg"} mb={"md"}>
                              $ {item.price}
                            </Text>
                          </Card.Section>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div style={{ flex: 0.39 }}>
                <div style={{ height: "20%" }}>
                  <Container w={"100%"}>
                    <FormikSelect
                      name="customer"
                      label="Customer"
                      data={customerOptions}
                      placeholder="Select Customer"
                      searchable
                      size="sm"
                    />
                    <Select
                      label="Products"
                      data={customerOptions}
                      placeholder="Select Customer"
                      searchable
                      size="sm"
                    />
                  </Container>
                </div>
                <div style={{ height: "60%" }}>
                  <ScrollArea
                    style={{ height: "100%", width: "100%" }}
                    scrollbarSize={10}
                    offsetScrollbars
                  >
                    <Table
                      sx={{ minWidth: "100%" }}
                      verticalSpacing="sm"
                      mt={"md"}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            Product
                          </th>
                          <th
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            Quantity
                          </th>
                          <th
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            Subtotal
                          </th>
                          <th
                            style={{
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                    </Table>
                  </ScrollArea>
                </div>
                <div style={{ height: "20%" }}>
                  <Group w={"100%"}>
                    <FormInput
                      name="oderdiscount"
                      label="Order Discount"
                      placeholder="Order Discount"
                      w={"30%"}
                      size="sm"
                    />
                    <FormInput
                      name="shipping"
                      label="Shipping"
                      placeholder="Shipping"
                      w={"30%"}
                      size="sm"
                    />
                    <FormikSelect
                      name="ordertax"
                      label="Order Tax"
                      data={customerOptions}
                      placeholder="Select Order Tax"
                      w={"30%"}
                      searchable
                      size="sm"
                    />
                  </Group>
                  <Group w={"100%"} align={"end"}>
                    <TextInput
                      label="Total"
                      w={"30%"}
                      placeholder="Total"
                      size="sm"
                      value={0}
                      disabled
                    />
                    <Button w={"30%"} size="sm" type="submit">
                      Pay Now
                    </Button>
                    <Button w={"30%"} size="sm">
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
