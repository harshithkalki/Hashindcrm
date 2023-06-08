import {
  SimpleGrid,
  Title,
  createStyles,
  Grid,
  Button,
  Group,
  ActionIcon,
  FileInput,
} from '@mantine/core';
import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import type { z } from 'zod';
// import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { IconPlus, IconUpload } from '@tabler/icons';
import { useState } from 'react';
import Formiktextarea from '../FormikCompo/FormikTextarea';
import { trpc } from '@/utils/trpc';
import FormDate from '../FormikCompo/FormikDate';
import axios from 'axios';
import { ZProductCreateInput } from '@/zobjs/product';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

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

export type ProductFormType = z.infer<typeof ZProductCreateInput>;

interface Props {
  formInputs: ProductFormType;
  onSubmit: (values: ProductFormType) => Promise<void>;
}

const BrandsSelect = () => {
  const [search, setSearch] = useState('');
  const brands = trpc.brandRouter.brands.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  const { t } = useTranslation('common');
  return (
    <FormikSelect
      label={`${t('brand')}`}
      data={
        brands.data?.docs?.map((brand) => ({
          label: brand.name,
          value: brand._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one brand'
      name='brand'
      withAsterisk
      onClick={() => setSearch('')}
    />
  );
};

const WarehousesSelect = () => {
  const [search, setSearch] = useState('');
  const warehouses = trpc.warehouseRouter.warehouses.useQuery(
    {
      search: search,
    },
    { refetchOnWindowFocus: false }
  );
  const { push } = useRouter();
  const { t } = useTranslation('common');

  return (
    <div>
      <label
        style={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {t('warehouse')} <span style={{ color: 'red' }}>*</span>
      </label>
      <Group spacing={2}>
        <FormikSelect
          data={
            warehouses.data?.docs?.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse._id.toString(),
            })) || []
          }
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          placeholder='Pick one warehouse'
          name='warehouse'
          style={{ flex: 1 }}
          onClick={() => setSearch('')}
        />
        <ActionIcon
          onClick={() => push('/warehouse')}
          color='blue'
          variant='light'
          size={'lg'}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </div>
  );
};

const ProductForm = ({ formInputs, onSubmit }: Props) => {
  const { classes, cx } = useStyles();
  const categories = trpc.categoryRouter.getAllCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const router = useRouter();
  const [logo, setLogo] = useState<File | null>(null);
  const { t } = useTranslation('common');

  return (
    <Formik
      initialValues={formInputs}
      validationSchema={toFormikValidationSchema(ZProductCreateInput)}
      onSubmit={async (values, actions) => {
        const file = logo;
        if (file) {
          const form = new FormData();
          form.append('file', file);
          const { data } = await axios.post('/api/upload-file', form);
          values.logo = data.url;
        }
        await onSubmit(values);
        showNotification({
          title: 'New Product',
          message: 'created successfully',
        });
        actions.resetForm();
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => {
        console.log(errors);
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
              <FileInput
                label={`${t('logo')}`}
                onChange={setLogo}
                name='logo'
                placeholder='Select Logo'
                icon={<IconUpload size={14} />}
              />
              <WarehousesSelect />
              <FormInput
                label={`${t('name')}`}
                placeholder='Name'
                name='name'
                w={'100%'}
                withAsterisk
              />
              <FormInput label={`${'slug'}`} placeholder='Slug' name='slug' />
              <FormInput
                label={`${t('quantity')}`}
                placeholder='Quantity'
                type={'number'}
                name='quantity'
                withAsterisk
              />
              <FormInput
                label={`${t('quantity alert')}`}
                type={'number'}
                placeholder='Quantity Alert'
                name='quantityAlert'
              />
              <FormikSelect
                label={`${t('category')}`}
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
              <BrandsSelect />
              <FormikSelect
                label={`${t('barcode symbology')}`}
                data={barcodeSymbologyOptions}
                placeholder='Pick one barcode symbology'
                name='barcodeSymbology'
              />
              <FormInput
                label={`${t('hsn code / item code')}`}
                placeholder='HSN Code / Item Code'
                name='itemCode'
              />
              <FormInput
                label={`${t('opening stock')}`}
                type={'number'}
                placeholder='Opening Stock'
                name='openingStock'
                withAsterisk
              />
              <FormDate
                label={`${t('opening stock date')}`}
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
                <Title order={4}>{t('price & tax')}</Title>
              </Grid.Col>
              <Grid.Col lg={1} sm={4}>
                <FormInput
                  label={`${t('mrp')}`}
                  type={'number'}
                  placeholder='MRP'
                  name='mrp'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={4}>
                <FormInput
                  label={`${t('purchase price')}`}
                  type={'number'}
                  placeholder='Purchase Price'
                  name='purchasePrice'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={4}>
                <FormInput
                  label={`${t('sale price')}`}
                  type={'number'}
                  placeholder='Sale Price'
                  name='salePrice'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={4}>
                <FormInput
                  label={`${t('tax')}`}
                  placeholder='Tax'
                  name='tax'
                  withAsterisk
                  type={'number'}
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
                <Title order={4}>{t('custom fields')}</Title>
              </Grid.Col>
              <Grid.Col lg={1} sm={4}>
                <FormDate
                  label={`${t('expire date')}`}
                  placeholder='Expire Date'
                  name='expireDate'
                />
              </Grid.Col>
              <Grid.Col lg={3} sm={4}>
                <Formiktextarea
                  label={`${t('description')}`}
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
                <Group spacing={'md'}>
                  <Button type='submit' loading={isSubmitting}>
                    {t('save')}
                  </Button>
                  <Button
                    onClick={() => {
                      router.back();
                    }}
                  >
                    {t('cancel')}
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProductForm;
