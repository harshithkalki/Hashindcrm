import {
  SimpleGrid,
  Title,
  createStyles,
  Image,
  Grid,
  Button,
  Center,
  Container,
  Modal,
} from '@mantine/core';
import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import { z } from 'zod';
// import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { IconUpload, IconPlus } from '@tabler/icons';
import { useRef, useState } from 'react';
import Formiktextarea from '../FormikCompo/FormikTextarea';
import { trpc } from '@/utils/trpc';
import FormDate from '../FormikCompo/FormikDate';
import FormikInput from '@/components/FormikCompo/FormikInput';

const barcodeSymbologyOptions = [
  { label: 'Code 39', value: 'code39' },
  { label: 'Code 128', value: 'code128' },
  { label: 'EAN-13', value: 'ean13' },
  { label: 'EAN-8', value: 'ean8' },
  { label: 'UPC-A', value: 'upca' },
  { label: 'UPC-E', value: 'upce' },
];

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

export interface ProductFormType {
  name: string;
  logo: string;
  warehouse: string;
  slug: string;
  quantity: number;
  quantityAlert: number;
  category: string;
  brand: string;
  barcodeSymbology: string;
  itemCode: string;
  openingStock: number;
  openingStockDate: string;
  purchasePrice: number;
  salePrice: number;
  mrp: number;
  tax: string;
  expireDate?: string;
  description?: string;
}

interface Props {
  formInputs: ProductFormType;
}

const ProductForm = ({ formInputs }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { classes, cx } = useStyles();
  const createProduct = trpc.productRouter.create.useMutation();
  const categories = trpc.categoryRouter.getAllCategorys.useQuery();
  const createWarehouse = trpc.productRouter.createWarehouse.useMutation();
  const brands = trpc.brandRouter.getAllBrands.useQuery();
  const [modal, setModal] = useState(false);
  const warehouses = trpc.productRouter.getAllWarehouse.useQuery();

  const AddWarehouse = () => {
    return (
      <>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title='Add Warehouse'
        >
          <Formik
            initialValues={{
              name: '',
            }}
            validationSchema={toFormikValidationSchema(
              z.object({
                name: z.string().min(3).max(50),
              })
            )}
            onSubmit={async (values, actions) => {
              await createWarehouse.mutateAsync(values);
              actions.resetForm();
              actions.setSubmitting(false);
              setModal(false);
              warehouses.refetch();
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <FormikInput
                    name='name'
                    label='Warehouse Name'
                    placeholder='Warehouse Name'
                  />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    mt={'md'}
                  >
                    Submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Modal>
      </>
    );
  };

  return (
    <div>
      <AddWarehouse />
      <Formik
        initialValues={formInputs}
        validationSchema={toFormikValidationSchema(
          z.object({
            name: z.string().min(3).max(50),
            logo: z.string().optional(),
            warehouse: z.string(),
            slug: z.string(),
            quantity: z.number(),
            quantityAlert: z.number(),
            category: z.string(),
            brand: z.string(),
            barcodeSymbology: z.string(),
            itemCode: z.string(),
            openingStock: z.number(),
            openingStockDate: z.string(),
            purchasePrice: z.number(),
            salePrice: z.number(),
            mrp: z.number(),
            tax: z.string(),
            expireDate: z.string().optional(),
            description: z.string().optional(),
          })
        )}
        // onSubmit={(values, { setSubmitting }) => {
        //   console.log(values);
        // }}
        onSubmit={async (values, actions) => {
          await createProduct.mutateAsync(values);
          actions.resetForm();
          actions.setSubmitting(false);
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => {
          return (
            <Form>
              <SimpleGrid
                m={'md'}
                cols={3}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: 'md', cols: 3, spacing: 'md' },
                  { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                  { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                ]}
              >
                <Container className={classes.containerStyles}>
                  <Center>
                    <Image
                      height={200}
                      width={200}
                      src={values.logo}
                      alt=''
                      withPlaceholder
                    />
                    <input
                      hidden
                      ref={fileRef}
                      type='file'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          if (file) {
                            setFieldValue('logo', URL.createObjectURL(file));
                          }
                        }
                      }}
                    />
                  </Center>
                  <Center>
                    <Button
                      leftIcon={values.logo === '' && <IconUpload size={17} />}
                      onClick={() => {
                        fileRef.current?.click();
                      }}
                      styles={{
                        root: {
                          margin: 2,
                        },
                      }}
                    >
                      {values.logo === '' ? `Upload` : `Change`}
                    </Button>
                  </Center>
                </Container>

                <FormikSelect
                  label='Warehouse'
                  data={
                    warehouses.data?.map((warehouse) => ({
                      label: warehouse.name,
                      value: warehouse._id.toString(),
                    })) || []
                  }
                  placeholder='Pick one warehouse'
                  name='warehouse'
                  searchable
                  w={'100%'}
                  rightSection={
                    <IconPlus
                      size={20}
                      onClick={() => {
                        setModal(true);
                      }}
                      cursor={'pointer'}
                    />
                  }
                  withAsterisk
                />
                {/* <ActionIcon style={{ alignContent: "end" }}>
                    <IconPlus size={20} />
                  </ActionIcon> */}

                <FormInput
                  label='Name'
                  placeholder='Name'
                  name='name'
                  w={'100%'}
                  withAsterisk
                />

                <FormInput
                  label='Slug'
                  placeholder='Slug'
                  name='slug'
                  withAsterisk
                />

                <FormInput
                  label='Quantity'
                  placeholder='Quantity'
                  type={'number'}
                  name='quantity'
                  withAsterisk
                />
                <FormInput
                  label='Quantity Alert'
                  type={'number'}
                  placeholder='Quantity Alert'
                  name='quantityAlert'
                />
                <FormikSelect
                  label='Category'
                  data={
                    categories.data?.map((category) => ({
                      label: category.name,
                      value: category._id.toString(),
                    })) || []
                  }
                  placeholder='Pick one category'
                  name='category'
                  withAsterisk
                />
                <FormikSelect
                  label='Brand'
                  data={
                    brands.data?.map((brand) => ({
                      label: brand.name,
                      value: brand._id.toString(),
                    })) || []
                  }
                  placeholder='Pick one brand'
                  name='brand'
                  withAsterisk
                />
                <FormikSelect
                  label='Barcode Symbology'
                  data={barcodeSymbologyOptions}
                  placeholder='Pick one barcode symbology'
                  name='barcodeSymbology'
                  withAsterisk
                />
                <FormInput
                  label='Item Code'
                  placeholder='Item Code'
                  name='itemCode'
                  withAsterisk
                />
                <FormInput
                  label='Opening Stock'
                  type={'number'}
                  placeholder='Opening Stock'
                  name='openingStock'
                  withAsterisk
                />
                <FormDate
                  label='Opening Stock Date'
                  placeholder='Opening Stock Date'
                  name='openingStockDate'
                  withAsterisk
                />
              </SimpleGrid>
              <Grid
                m={'md'}
                className={cx(classes.wrapper, {
                  [classes.addressWrapper]: true,
                })}
                columns={4}
              >
                <Grid.Col>
                  <Title order={4}>Price & Tax</Title>
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormInput
                    label='Purchase Price'
                    type={'number'}
                    placeholder='Purchase Price'
                    name='purchasePrice'
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormInput
                    label='Sale Price'
                    type={'number'}
                    placeholder='Sale Price'
                    name='salePrice'
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormInput
                    label='Tax'
                    placeholder='Tax'
                    name='tax'
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormInput
                    label='MRP'
                    type={'number'}
                    placeholder='MRP'
                    name='mrp'
                    withAsterisk
                  />
                </Grid.Col>
              </Grid>
              {/* addess form */}
              <Grid
                m={'md'}
                className={cx(classes.wrapper, {
                  [classes.addressWrapper]: true,
                })}
                columns={4}
              >
                <Grid.Col>
                  <Title order={4}>Custom Fields</Title>
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormDate
                    label='Expire Date'
                    placeholder='Expire Date'
                    name='expireDate'
                  />
                </Grid.Col>
                <Grid.Col lg={3} sm={4}>
                  <Formiktextarea
                    label='Description'
                    placeholder='Description'
                    name='description'
                  />
                </Grid.Col>
              </Grid>
              <Grid
                m={'md'}
                className={cx(classes.wrapper, {
                  [classes.addressWrapper]: true,
                })}
                columns={2}
              >
                <Grid.Col>
                  <Button type='submit' loading={isSubmitting}>
                    Save
                  </Button>
                </Grid.Col>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductForm;
