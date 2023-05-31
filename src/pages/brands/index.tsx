import {
  Button,
  Center,
  Container,
  FileInput,
  Group,
  Loader,
  Modal,
  Pagination,
  Title,
  Image,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import { trpc } from '@/utils/trpc';
import axios from 'axios';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { BrandCreateInput, ZBrandUpdateInput } from '@/zobjs/brand';
import { ZBrandCreateInput } from '@/zobjs/brand';
import type { z } from 'zod';
import { LoadingScreen } from '@/components/LoadingScreen';
import { showNotification } from '@mantine/notifications';

const initialValues: BrandCreateInput = {
  name: '',
  slug: '',
  logo: 'notset',
};

const BrandForm = ({
  onSubmit,
  values = initialValues,
  onClose,
}: {
  onSubmit: (values: BrandCreateInput) => Promise<void>;
  values?: BrandCreateInput | null;
  onClose: () => void;
}) => {
  const [logo, setLogo] = useState<File | null>(null);

  return (
    <Formik
      initialValues={values ?? initialValues}
      validationSchema={toFormikValidationSchema(ZBrandCreateInput)}
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
          title: 'New Brand',
          message: 'Created successfully',
        });
        actions.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormInput
            name={'name'}
            label='Name'
            placeholder='Enter Name'
            withAsterisk
            mt={'md'}
          />
          <FormInput
            name='slug'
            label='Slug'
            placeholder='Enter Slug'
            withAsterisk
            mt={'xs'}
          />
          <FileInput
            label='Logo'
            onChange={setLogo}
            name='logo'
            mt={'md'}
            placeholder='Select Logo'
            icon={<IconUpload size={14} />}
          />
          <Group mt={'md'} mb={'xs'} spacing={'md'}>
            <Button type='submit' mt={'md'} loading={isSubmitting} size={'sm'}>
              Submit
            </Button>
            <Button type='button' mt={'md'} size={'sm'} onClick={onClose}>
              Cancel
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
};

const AddBrand = ({
  onClose,
  opened,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const createBrand = trpc.brandRouter.create.useMutation();

  return (
    <Modal opened={opened} onClose={onClose} title='Add Brand'>
      <BrandForm
        onSubmit={async (values) => {
          await createBrand.mutateAsync({
            ...values,
          });

          onClose();
        }}
        onClose={onClose}
      />
    </Modal>
  );
};

const EditBrand = ({ onClose, _id }: { _id: string; onClose: () => void }) => {
  const update = trpc.brandRouter.update.useMutation();
  const brand = trpc.brandRouter.get.useQuery({ _id });

  return (
    <Modal opened={Boolean(_id)} onClose={onClose} title='Edit Brand'>
      {brand.isLoading ? (
        <Loader />
      ) : (
        <BrandForm
          onSubmit={async (values) => {
            const data: z.infer<typeof ZBrandUpdateInput> = {
              ...values,
              _id,
            };

            if (values.logo === 'notset') {
              delete data.logo;
            }

            await update.mutateAsync(data);

            onClose();
          }}
          values={brand.data}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

const Brand = () => {
  const [modal, setModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const brands = trpc.brandRouter.brands.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  const [editId, setEditId] = useState<string>('');

  useEffect(() => {
    if (!brands.data?.pages.find((pageData) => pageData.page === page)) {
      brands.fetchNextPage();
    }
  }, [brands, page]);

  if (brands.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <AddBrand
        opened={modal}
        onClose={() => {
          setModal(false);
          brands.refetch();
        }}
      />
      {Boolean(editId) && (
        <EditBrand _id={editId} onClose={() => setEditId('')} />
      )}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Brands</Title>
          <Button size='xs' onClick={() => setModal(true)}>
            Add Brand
          </Button>
        </Group>
        <TableSelection
          data={
            brands.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
              })) || []
          }
          onEdit={(id) => setEditId(id)}
          colProps={{
            logo: {
              label: 'Logo',
              Component: ({ data: { logo } }) => (
                <Group spacing='xs' position='center'>
                  <Image
                    src={logo}
                    alt={'logo'}
                    radius='lg'
                    style={{ width: 32, height: 32 }}
                    withPlaceholder
                  />
                </Group>
              ),
            },
            name: {
              label: 'Name',
            },
          }}
          editable
          deletable
        />
        <Center mb='lg'>
          {(brands.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                brands.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              // {...pagination}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Brand;
