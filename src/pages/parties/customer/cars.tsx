import Layout from '@/components/Layout';
import React, { useEffect, useState } from 'react';
import {
  Button,
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
import { z } from 'zod';
import FormikColor from '@/components/FormikCompo/FormikColor';

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
  return (
    <FormikSelect
      label='Customer'
      data={[{ label: 'walkin', value: 'walkin' }, ...(customerData || [])]}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='customer'
    />
  );
};

type carsInput = z.infer<typeof ZCarCreateInput>;

const initialValues = {
  maker: '',
  model: '',
  purchaseDate: '',
  registrationNumber: '',
  vehicleType: '',
  meterReading: '',
  wheelDriveType: '',
  fuelType: '',
  transmissionType: '',
  emissionType: '',
  insuranceDate: '',
  insurancePeriod: '',
  renewalDate: '',
  interiorColor: '',
  exteriorColor: '',
  customer: '',
};

const CarsForm = ({
  onSubmit,
  values = initialValues,
  onClose,
}: {
  onSubmit: (values: carsInput) => Promise<void>;
  values?: carsInput | null;
  onClose: () => void;
}) => {
  const { classes, cx } = useStyles();
  return (
    <Flex style={{ flexDirection: 'column' }}>
      <ScrollArea style={{ height: '80vh' }}>
        <Container>
          <Formik
            initialValues={values}
            onSubmit={onSubmit}
            validationSchema={toFormikValidationSchema(ZCarCreateInput)}
          >
            {({ handleSubmit }) => (
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
                  <FormInput
                    name='maker'
                    label='Maker'
                    placeholder='Maker'
                    type='text'
                  />
                  <FormInput
                    name='model'
                    label='Model'
                    placeholder='Model'
                    type='text'
                  />
                  <CustomerSelect />
                  <FormInput
                    name='registrationNumber'
                    label='Registration Number'
                    placeholder='Registration Number'
                    type='text'
                  />
                  <FormDate
                    name='purchaseDate'
                    label='Purchase Date'
                    placeholder='Purchase Date'
                    type='text'
                  />
                  <FormInput
                    name='vehicleType'
                    label='Vehicle Type'
                    placeholder='Vehicle Type'
                    type='text'
                  />
                  <FormInput
                    name='meterReading'
                    label='Meter Reading'
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
                    <Title order={3}>Color</Title>
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      name='interiorColor'
                      label='Interior Color'
                      placeholder='Interior Color'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      name='exteriorColor'
                      label='Exterior Color'
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
                    <Title order={3}>Specifications</Title>
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='wheelDriveType'
                      label='Wheel Drive Type'
                      placeholder='Wheel Drive Type'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='fuelType'
                      label='Fuel Type'
                      placeholder='Fuel Type'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='transmissionType'
                      label='Transmission Type'
                      placeholder='Transmission Type'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='emissionType'
                      label='Emission Type'
                      placeholder='Emission Type'
                      type='text'
                    />
                  </Grid.Col>

                  <Grid.Col lg={1} sm={3}>
                    <FormDate
                      name='insuranceDate'
                      label='Insurance Date'
                      placeholder='Insurance Date'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      name='insurancePeriod'
                      label='Insurance Period'
                      placeholder='Insurance Period'
                      type='text'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormDate
                      name='renewalDate'
                      label='Renewal Date'
                      placeholder='Renewal Date'
                      type='text'
                    />
                  </Grid.Col>
                </Grid>
                <Button type='submit'>Submit</Button>
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
  return (
    <Modal opened={open} title={'ADD CAR DATA'} onClose={onClose} size={'50'}>
      <CarsForm
        onClose={onClose}
        onSubmit={async (values) => {
          await createCar.mutateAsync(values);
          onClose();
        }}
      />
    </Modal>
  );
};

const Editcar = ({ _id, onClose }: { _id: string; onClose: () => void }) => {
  const car = trpc.carRouter.get.useQuery({ _id });
  const updateCar = trpc.carRouter.update.useMutation();

  console.log(car.data);
  return (
    <Modal opened={true} title={'EDIT CAR DATA'} onClose={onClose} size={'50'}>
      {car.isLoading ? (
        <Loader />
      ) : (
        <CarsForm
          values={car.data}
          onClose={onClose}
          onSubmit={async (values) => {
            await updateCar.mutateAsync({ _id, ...values });
            onClose();
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

  const deleteCar = trpc.carRouter.delete.useMutation();

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
          <Title fw={400}>Cars</Title>
          <Button size='xs' onClick={() => setOpen(true)}>
            Add CAR
          </Button>
        </Group>
        <Divider mt={'xl'} />

        <TableSelection
          data={
            CarsData.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
              })) || []
          }
          colProps={{
            customer: {
              label: 'Customer',
            },
            maker: {
              label: 'Maker',
            },
            model: {
              label: 'Model',
            },
            registrationNumber: {
              label: 'Registration Number',
            },
            vehicleType: {
              label: 'Vehicle Type',
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
        <Pagination
          total={
            CarsData.data?.pages.find((pageData) => pageData.page === page)
              ?.totalPages || 0
          }
          initialPage={1}
          page={page}
          onChange={setPage}
        />
      </Container>
    </Layout>
  );
};

export default Index;
