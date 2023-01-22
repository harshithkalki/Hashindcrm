import TableSelection from "@/components/Tables/ProductsTable";
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  ScrollArea,
  Title,
} from "@mantine/core";
import React from "react";
// import { useRouter } from "next/router";
import FormInput from "@/components/FormikCompo/FormikInput";
import { Formik, Form } from "formik";
import { IconUpload } from "@tabler/icons";
import ProductForm from "@/components/ProductForm";

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface Product {
  id: string;
  name: string;
  logo: string;
  warehouse: string;
  category: string;
  brand: string;
  salePrice: string;
  purchasePrice: string;
  quantity: string;
  description: string;
}

const Data: Product[] = [
  {
    id: "1",
    name: "Product 1",
    logo: "https://picsum.photos/200",
    warehouse: "Warehouse 1",
    category: "Category 1",
    brand: "Brand 1",
    salePrice: "100",
    purchasePrice: "100",
    quantity: "100",
    description: "Description 1",
  },
  {
    id: "2",
    name: "Product 2",
    logo: "https://picsum.photos/200",
    warehouse: "Warehouse 2",
    category: "Category 2",
    brand: "Brand 2",
    salePrice: "200",
    purchasePrice: "200",
    quantity: "200",
    description: "Description 2",
  },
  {
    id: "3",
    name: "Product 3",
    logo: "https://picsum.photos/200",
    warehouse: "Warehouse 3",
    category: "Category 3",
    brand: "Brand 3",
    salePrice: "300",
    purchasePrice: "300",
    quantity: "300",
    description: "Description 3",
  },
  {
    id: "4",
    name: "Product 4",
    logo: "https://picsum.photos/200",
    warehouse: "Warehouse 4",
    category: "Category 4",
    brand: "Brand 4",
    salePrice: "400",
    purchasePrice: "400",
    quantity: "400",
    description: "Description 4",
  },
  {
    id: "5",
    name: "Product 5",
    logo: "https://picsum.photos/200",
    warehouse: "Warehouse 5",
    category: "Category 5",
    brand: "Brand 5",
    salePrice: "500",
    purchasePrice: "500",
    quantity: "500",
    description: "Description 5",
  },
];

const Index = () => {
  // const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const AddProduct = () => {
    return (
      <>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title="Add Product"
          size={"80%"}
        >
          <ScrollArea style={{ height: "80vh" }}>
            <ProductForm
              formInputs={{
                name: "",
                logo: "",
                warehouse: "",
                category: "",
                brand: "",
                salePrice: 0,
                purchasePrice: 0,
                quantity: 0,
                description: "",
                quantityAlert: 0,
                barcodeSymbology: "",
                itemCode: "",
                mrp: 0,
                openingStock: 0,
                openingStockDate: "",
                slug: "",
                tax: "",
                expiryDate: "",
              }}
            />
          </ScrollArea>
        </Modal>
      </>
    );
  };
  return (
    <>
      <AddProduct />
      <Container mt={"xs"}>
        <Group style={{ justifyContent: "space-between" }}>
          <Title fw={400}>Products</Title>
          <Button size="xs" onClick={() => setModal(true)}>
            Add Product
          </Button>
        </Group>
        <Divider mt={"xl"} />
        <TableSelection
          data={Data}
          onDelete={(id) => console.log(id)}
          onEdit={(id) => console.log(id)}
        />
      </Container>
    </>
  );
};

export default Index;
