import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Pagination,
  Stack,
  Title,
  Text,
  Center,
  Grid,
  SimpleGrid,
  Image,
  createStyles,
} from '@mantine/core';
import { ZWarehouseCreateInput } from '@/zobjs/warehouse';
import { trpc } from '@/utils/trpc';
import { Formik, Form, FieldArray } from 'formik';
import type { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useRef, useState } from 'react';
import TableSelection from '@/components/Tables';
import Layout from '@/components/Layout';
import ArrayInput from '@/components/FormikCompo/ArrayInput';
import { IconMinus, IconPlus, IconUpload } from '@tabler/icons';
import FormikColor from '@/components/FormikCompo/FormikColor';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';

type WarehouseInput = z.infer<typeof ZWarehouseCreateInput>;

const initialValues: WarehouseInput = {
  name: '',
  addressline1: '',
  addressline2: '',
  email: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  primaryColor: '#000',
  secondaryColor: '#fff',
  backgroundColor: '#fff',
  logo: '',
  natureOfBusiness: 'marketing',
  numbers: [''],
  cinNo: undefined,
  gstNo: undefined,
  pan: undefined,
};

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

const WarehouseForm = ({
  onSubmit,
  values = initialValues,
}: {
  onSubmit: (values: WarehouseInput) => Promise<void>;
  values?: WarehouseInput | null;
}) => {
  const { classes, theme, cx } = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <Formik
      initialValues={values || initialValues}
      validationSchema={toFormikValidationSchema(ZWarehouseCreateInput)}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, setFieldValue, errors, touched }) => {
        return (
          <Form>
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
              <FormInput
                label='Warehouse Name'
                placeholder='Warehouse Name'
                name='name'
                withAsterisk
              />
              <FormInput
                label='email'
                placeholder='email'
                name='email'
                withAsterisk
              />

              <FieldArray
                name='numbers'
                render={(arrayHelpers) => (
                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      Mobile
                    </label>
                    <Stack spacing='xs'>
                      {values.numbers.map((num, index) => (
                        <div key={index}>
                          <Group spacing={0}>
                            <ArrayInput
                              name={`numbers.${index}`}
                              placeholder='mobile'
                              style={{
                                flex: 1,
                              }}
                            />
                            <Group spacing={1} ml={2}>
                              <ActionIcon
                                onClick={() => arrayHelpers.remove(index)}
                                color='red'
                                variant='light'
                                size={'lg'}
                                disabled={values.numbers.length === 1}
                              >
                                <IconMinus />
                              </ActionIcon>
                              <ActionIcon
                                onClick={() => arrayHelpers.push('')}
                                color='blue'
                                variant='light'
                                size={'lg'}
                              >
                                <IconPlus />
                              </ActionIcon>
                            </Group>
                          </Group>
                          {
                            <Text size='xs' color='red'>
                              {Array.isArray(touched.numbers) &&
                                (touched.numbers as unknown as boolean[])[
                                  index
                                ] &&
                                errors.numbers &&
                                errors.numbers[index]}
                            </Text>
                          }
                        </div>
                      ))}
                    </Stack>
                  </div>
                )}
              />
            </SimpleGrid>

            <Grid
              m={'md'}
              className={cx(classes.wrapper, {
                [classes.addressWrapper]: true,
              })}
              columns={3}
            >
              <Grid.Col lg={1} sm={3}>
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
              </Grid.Col>
              <Grid.Col lg={2} sm={3}>
                <Grid
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={2}
                >
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      label='cin'
                      placeholder='cin'
                      name='cinNo'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      label='gst'
                      placeholder='gst'
                      name='gstNo'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput label='pan' placeholder='pan' name='pan' />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              {/* <Grid.Col lg={1} sm={3}>
                <FormikColor
                  label='PrimaryColor'
                  name='primaryColor'
                  placeholder='Primary Color'
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={3}>
                <FormikColor
                  label='SecondaryColor'
                  name='secondaryColor'
                  placeholder='Secondary Color'
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={3}>
                <FormikColor
                  label='BackgroundColor'
                  name='backgroundColor'
                  placeholder='Background Color'
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={3}>
                <FormikSelect
                  label='Nature of Business'
                  name='natureOfBusiness'
                  placeholder='Nature of Business'
                  data={[
                    { label: 'Manufacturing', value: 'Manufacturing' },
                    { label: 'Trading', value: 'Trading' },
                    { label: 'Service', value: 'Service' },
                  ]}
                />
              </Grid.Col> */}
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
                <Title order={4}>Address Info</Title>
              </Grid.Col>
              <Grid.Col lg={2} sm={4}>
                <FormInput
                  label='Address line 1'
                  placeholder='Address line 1'
                  name='addressline1'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={2} sm={4}>
                <FormInput
                  label='Address line 2'
                  placeholder='Address line 2'
                  name='addressline2'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={2}>
                <FormInput
                  label='city'
                  placeholder='city'
                  name='city'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={2}>
                <FormInput
                  label='state'
                  placeholder='state'
                  name='state'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={2}>
                <FormInput
                  label='country'
                  placeholder='country'
                  name='country'
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col lg={1} sm={2}>
                <FormInput
                  label='pincode'
                  placeholder='pincode'
                  name='pincode'
                  withAsterisk
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
  );
};

const AddWarehouse = ({
  open,
  onClose,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const createWarehouse = trpc.warehouseRouter.create.useMutation();

  return (
    <Modal title='Add Warehouse' opened={open} onClose={onClose} fullScreen>
      <WarehouseForm
        onSubmit={async (values) => {
          await createWarehouse.mutateAsync(values);
          onClose();
          refetch();
        }}
      />
    </Modal>
  );
};

const EditWarehouse = ({
  _id,
  onClose,
}: {
  _id: string;
  onClose: () => void;
}) => {
  const updateWarehouse = trpc.warehouseRouter.update.useMutation();
  const warehouse = trpc.warehouseRouter.get.useQuery({ _id });

  return (
    <Modal
      title='Edit Warehouse'
      opened={Boolean(_id)}
      onClose={onClose}
      fullScreen
    >
      {warehouse.isLoading ? (
        <Loader />
      ) : (
        <WarehouseForm
          onSubmit={async (values) => {
            await updateWarehouse.mutateAsync({
              ...values,
              _id,
            });
            onClose();
          }}
          values={warehouse.data}
        />
      )}
    </Modal>
  );
};

export default function Warehouse() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const warehouses = trpc.warehouseRouter.warehouses.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  const deleteWarehouse = trpc.warehouseRouter.delete.useMutation();

  useEffect(() => {
    if (!warehouses.data?.pages.find((pageData) => pageData.page === page)) {
      warehouses.fetchNextPage();
    }
  }, [warehouses, page]);

  return (
    <>
      <Layout>
        <AddWarehouse
          open={open}
          onClose={() => setOpen(false)}
          refetch={warehouses.refetch}
        />
        {editId && (
          <EditWarehouse _id={editId} onClose={() => setEditId(null)} />
        )}
        <Container mt={'xs'}>
          <Group style={{ justifyContent: 'space-between' }}>
            <Title fw={400}>Warehouse</Title>
            <Button size='xs' onClick={() => setOpen(true)}>
              Add Warehouse
            </Button>
          </Group>
          <Divider mt={'xl'} />

          <TableSelection
            data={
              warehouses.data?.pages
                .find((pageData) => pageData.page === page)
                ?.docs.map((doc) => ({
                  ...doc,
                  _id: doc._id.toString(),
                })) || []
            }
            keysandlabels={{
              name: 'Name',
            }}
            onEdit={(id) => setEditId(id)}
            onDelete={async (id) => {
              await deleteWarehouse.mutateAsync({ _id: id });
              warehouses.refetch();
            }}
            editable
            deletable
          />
          <Pagination
            total={
              warehouses.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages || 0
            }
            initialPage={1}
            page={page}
            onChange={setPage}
          />
        </Container>
      </Layout>
    </>
  );
}
