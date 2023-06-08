import Layout from '@/components/Layout';
import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Container,
  createStyles,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Modal,
  Pagination,
  ScrollArea,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormDate from '@/components/FormikCompo/FormikDate';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { trpc } from '@/utils/trpc';
import { ZCarCreateInput } from '@/zobjs/car';
import TableSelection from '@/components/Tables';
import type { z } from 'zod';
import FormikColor from '@/components/FormikCompo/FormikColor';
import { IconArrowLeft } from '@tabler/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
      data={[{ label: 'walkin', value: 'walkin' }, ...(customerData || [])]}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='customer'
      onClick={() => setSearch('')}
    />
  );
};

type carsInput = z.infer<typeof ZCarCreateInput>;

const initialValues = {
  make: '',
  model: '',
  purchaseDate: '',
  registrationNumber: '',
  vehicleType: '',
  meterReading: '',
  wheelDriveType: '',
  fuelType: '',
  transmissionType: '',
  emissionType: '',
  insuranceDate: new Date().toISOString(),
  insurancePeriod: 0,
  renewalDate: '',
  interiorColor: '',
  exteriorColor: '',
  customer: '',
};

const CarsForm = ({
  onSubmit,
  inputs = initialValues,
  onClose,
}: {
  onSubmit: (values: carsInput) => Promise<void>;
  inputs?: carsInput;
  onClose: () => void;
}) => {
  const { classes, cx } = useStyles();
  const { t } = useTranslation('common');
  return (
    <Flex style={{ flexDirection: 'column' }}>
      <ScrollArea style={{ height: '80vh' }}>
        <Container>
          <Formik
            initialValues={inputs}
            onSubmit={onSubmit}
            validationSchema={toFormikValidationSchema(ZCarCreateInput)}
          >
            {({ values }) => (
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
                  style={{ alignItems: 'end' }}
                >
                  <FormikSelect
                    name='make'
                    label={`${t('make')}`}
                    placeholder='Make'
                    data={[
                      { label: 'Audi', value: 'Audi' },
                      { label: 'BMW', value: 'BMW' },
                      { label: 'Mahindra', value: 'Mahindra' },
                      { label: 'Tata', value: 'Tata' },
                      { label: 'Maruti', value: 'Maruti' },
                      { label: 'Toyota', value: 'Toyota' },
                      { label: 'Others', value: 'Others' },
                    ]}
                    searchable
                  />
                  <FormikSelect
                    name='model'
                    label={`${t('model')}`}
                    placeholder='Model'
                    data={[
                      { label: 'Lxi', value: 'Lxi' },
                      { label: 'Vxi', value: 'Vxi' },
                      { label: 'Zxi', value: 'Zxi' },
                      { label: 'Others', value: 'Others' },
                    ]}
                  />
                  <CustomerSelect />
                  <FormInput
                    name='registrationNumber'
                    label={`${t('registration num')}`}
                    placeholder='Registration Number'
                    type='text'
                  />
                  <FormDate
                    name='purchaseDate'
                    label={`${t('purchase date')}`}
                    placeholder='Purchase Date'
                    type='text'
                  />
                  <FormikSelect
                    name='vehicleType'
                    label={`${t('vehicle type')}`}
                    placeholder='Vehicle Type'
                    data={[
                      { label: 'Hatchback', value: 'hatchback' },
                      { label: 'Sedan', value: 'sedan' },
                      { label: 'SUV', value: 'suv' },
                      { label: 'MUV', value: 'muv' },
                      { label: 'Coupe', value: 'coupe' },
                      { label: 'Convertibles', value: 'convertible' },
                      { label: 'Pickup Trucks', value: 'pickup_truck' },
                      { label: 'Other', value: 'other' },
                    ]}
                  />
                  <FormInput
                    name='meterReading'
                    label={`${t('meter reading')}`}
                    placeholder='Meter Reading'
                    type='text'
                  />
                </SimpleGrid>
                <Grid
                  m={'md'}
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={3}
                >
                  <Grid.Col>
                    <Title order={3}>{t('color')}</Title>
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      name='interiorColor'
                      label={`${t('interior color')}`}
                      placeholder='Interior Color'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      name='exteriorColor'
                      label={`${t('exterior color')}`}
                      placeholder='Exterior Color'
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  m={'md'}
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={3}
                >
                  <Grid.Col>
                    <Title order={3}>{t('specifications')}</Title>
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikSelect
                      name='wheelDriveType'
                      label={`${t('wheel drive type')}`}
                      placeholder='Wheel Drive Type'
                      data={[
                        { label: '2WD', value: '2WD' },
                        { label: '4WD', value: '4WD' },
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikSelect
                      name='fuelType'
                      label={`${t('fuel type')}`}
                      placeholder='Fuel Type'
                      data={['petrol', 'Diesel', 'CNG']}
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikSelect
                      name='transmissionType'
                      label={`${t('transmission type')}`}
                      placeholder='Transmission Type'
                      data={['Automatic', 'Manual']}
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikSelect
                      name='emissionType'
                      label={`${t('emission type')}`}
                      placeholder='Emission Type'
                      data={['BSV', 'BSVI', 'Other']}
                    />
                  </Grid.Col>

                  <Grid.Col lg={1} sm={3}>
                    <FormDate
                      name='insuranceDate'
                      label={`${t('insurance date')}`}
                      placeholder='Insurance Date'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='insurancePeriod'
                      label={`${t('insurance period')}`}
                      placeholder='Insurance Period'
                      type='number'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    {/* <FormDate
                      name='renewalDate'
                      label='Renewal Date'
                      placeholder='Renewal Date'
                      type='text'
                      value={new Date(values.renewalDate as string)}
                    /> */}
                    <FormInput
                      name='renewalDate'
                      label={`${t('renewal date')}`}
                      placeholder='Renewal Date'
                      type='text'
                      value={dayjs(
                        dayjs(values.insuranceDate).add(
                          values.insurancePeriod as number,
                          'year'
                        )
                      ).format('DD MMMM YYYY')}
                      readOnly
                    />
                  </Grid.Col>
                </Grid>
                <Group>
                  <Button type='submit'>{t('submit')}</Button>
                  <Button onClick={() => onClose()}>{t('cancel')}</Button>
                </Group>
              </Form>
            )}
          </Formik>
        </Container>
      </ScrollArea>
    </Flex>
  );
};

const AddCar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const createCar = trpc.carRouter.create.useMutation();
  // const { classes } = useStyles();
  const utils = trpc.useContext();
  return (
    <Modal opened={open} title={'ADD CAR DATA'} onClose={onClose} size={'50'}>
      <CarsForm
        onClose={onClose}
        onSubmit={async (values) => {
          await createCar.mutateAsync(values);
          showNotification({
            title: 'New Car Added',
            message: 'Successfully',
          });
          onClose();
          utils.carRouter.cars.invalidate();
        }}
      />
    </Modal>
  );
};

const Editcar = ({ _id, onClose }: { _id: string; onClose: () => void }) => {
  const car = trpc.carRouter.get.useQuery({ _id });
  const updateCar = trpc.carRouter.update.useMutation();
  const utils = trpc.useContext();

  return (
    <Modal opened={true} title={'EDIT CAR DATA'} onClose={onClose} size={'50'}>
      {car.isLoading || !car.data ? (
        <Loader />
      ) : (
        <CarsForm
          inputs={{
            ...car.data,
            customer: car.data.customer.toString(),
          }}
          onClose={onClose}
          onSubmit={async (values) => {
            await updateCar.mutateAsync({ _id, ...values });
            showNotification({
              title: 'Car Updated',
              message: 'Successfully',
            });
            onClose();
            utils.carRouter.cars.invalidate();
          }}
        />
      )}
    </Modal>
  );
};

const Index = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const CarsData = trpc.carRouter.cars.useInfiniteQuery(
    {},
    {
      refetchOnWindowFocus: false,
      getNextPageParam: () => page,
    }
  );

  const router = useRouter();

  const deleteCar = trpc.carRouter.delete.useMutation();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!CarsData.data?.pages.find((pageData) => pageData.page === page)) {
      CarsData.fetchNextPage();
    }
  }, [CarsData, page]);
  // console.log(CarsData);

  return (
    <Layout>
      <AddCar
        open={open}
        onClose={() => {
          setOpen(false);
          CarsData.refetch();
        }}
      />
      {editId && <Editcar _id={editId} onClose={() => setEditId(null)} />}
      <Container mt={'xs'}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Group>
            <ActionIcon onClick={() => router.back()} size='lg'>
              <IconArrowLeft />
            </ActionIcon>
            <Title fw={400}>{t('cars')}</Title>
          </Group>
          <Button size='xs' onClick={() => setOpen(true)}>
            {t('add car')}
          </Button>
        </Group>
        <Divider mt={'sm'} />

        <TableSelection
          data={
            CarsData.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
                customer: (doc.customer as unknown as { name: string }).name,
              })) || []
          }
          colProps={{
            customer: {
              label: `${t('customer')}`,
            },
            make: {
              label: `${t('make')}`,
            },
            model: {
              label: `${t('model')}`,
            },
            registrationNumber: {
              label: `${t('registration num')}`,
            },
            vehicleType: {
              label: `${t('vehicle type')}`,
            },
          }}
          onEdit={(id) => setEditId(id)}
          onDelete={async (id) => {
            await deleteCar.mutateAsync({ _id: id });
            CarsData.refetch();
          }}
          editable
          deletable
        />
        <Center>
          {(CarsData.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                CarsData.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages || 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
