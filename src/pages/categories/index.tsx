import CategoriesTable from '@/components/Tables/CategoriesTable';
import {
  Button,
  Center,
  Container,
  FileButton,
  FileInput,
  Group,
  Loader,
  Modal,
  Pagination,
  Title,
} from '@mantine/core';
import React from 'react';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { client, trpc } from '@/utils/trpc';
import axios from 'axios';
import Layout from '@/components/Layout';
import type { CategoryCreateInput } from '@/zobjs/category';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MIME_TYPES } from '@mantine/dropzone';
import csvtojson from 'csvtojson';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const initialValues: CategoryCreateInput = {
  logo: '',
  name: '',
  slug: '',
  parentCategory: '',
};

const CategoryForm = ({
  onSubmit,
  values = initialValues,
  onClose,
}: {
  onSubmit: (values: CategoryCreateInput) => Promise<void>;
  values?: (CategoryCreateInput & { _id?: string }) | null;
  onClose: () => void;
}) => {
  const allCategories = trpc.categoryRouter.getAllCategories.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [logo, setLogo] = React.useState<File | null>(null);
  const { t } = useTranslation('common');

  return (
    <Formik
      initialValues={values ?? initialValues}
      onSubmit={async (values, actions) => {
        const file = logo;
        if (file) {
          const form = new FormData();
          form.append('file', file);
          const { data } = await axios.post('/api/upload-file', form);
          values.logo = data.url;
        }

        if (values.parentCategory === '') {
          delete values.parentCategory;
        }

        if (values.logo === '') {
          delete values.logo;
        }

        await onSubmit(values);
        showNotification({
          title: 'New Category',
          message: 'Created successfully',
        });
        actions.resetForm();
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormInput
            name='name'
            label={`${t('name')}`}
            placeholder='Enter Name'
            withAsterisk
            mt={'md'}
          />
          <FormikSelect
            name='parentCategory'
            label={`${t('parent category')}`}
            data={
              allCategories.data
                ?.filter((val) => val._id.toString() !== values?._id)
                .map((val) => {
                  return { label: val.name, value: val._id.toString() };
                }) || []
            }
            placeholder='Enter Parent Category'
            mt={'md'}
          />

          <FormInput
            name='slug'
            label={`${t('slug')}`}
            placeholder='Enter Slug'
            withAsterisk
            mt={'xs'}
          />
          <FileInput
            label={`${t('logo')}`}
            name='logo'
            mt={'md'}
            placeholder='Select Logo'
            icon={<IconUpload size={14} />}
            onChange={setLogo}
          />
          <Group mt={'md'} mb={'xs'} spacing={'md'}>
            <Button type='submit' mt={'md'} loading={isSubmitting} size={'sm'}>
              {t('submit')}
            </Button>
            <Button type='button' mt={'md'} size={'sm'} onClick={onClose}>
              {t('cancel')}
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
};

const AddCategory = ({
  onClose,
  opened,
}: {
  onClose: () => void;
  opened: boolean;
}) => {
  const createCategory = trpc.categoryRouter.create.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal opened={opened} onClose={onClose} title='Add Categories'>
        <CategoryForm
          onSubmit={async (values) => {
            await createCategory.mutateAsync({
              ...values,
            });
            utils.categoryRouter.getrootCategories.invalidate();
            onClose();
          }}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};

const EditCategory = ({
  onClose,
  _id,
}: {
  onClose: () => void;
  _id: string;
}) => {
  const category = trpc.categoryRouter.get.useQuery(
    {
      _id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const updateCategory = trpc.categoryRouter.update.useMutation();
  const utils = trpc.useContext();

  return (
    <Modal opened={Boolean(_id)} onClose={onClose} title='Edit Categories'>
      {category.isLoading ? (
        <Loader />
      ) : (
        <CategoryForm
          onSubmit={async (values) => {
            await updateCategory.mutateAsync({
              _id,
              ...values,
            });
            onClose();
            utils.categoryRouter.getrootCategories.invalidate();
          }}
          values={
            category.data
              ? {
                  ...category.data,
                  parentCategory: category.data.parentCategory?.toString(),
                  _id: category.data._id.toString(),
                }
              : null
          }
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const rootCategories = trpc.categoryRouter.getrootCategories.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );
  const createManyCategories = trpc.categoryRouter.createMany.useMutation();
  const utils = trpc.useContext();

  React.useEffect(() => {
    if (
      !rootCategories.data?.pages.find((pageData) => pageData.page === page)
    ) {
      rootCategories.fetchNextPage();
    }
  }, [rootCategories, page]);

  const [editId, setEditId] = React.useState<string | null>(null);
  const { t } = useTranslation('common');

  if (rootCategories.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <AddCategory
        onClose={() => {
          setModal(false);
          rootCategories.refetch();
        }}
        opened={modal}
      />

      {editId && (
        <EditCategory
          onClose={() => {
            setEditId(null);
            rootCategories.refetch();
          }}
          _id={editId}
        />
      )}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group style={{ justifyContent: 'space-between' }} my='lg'>
          <Title fw={400}>{t('categories')}</Title>
          <Group>
            <Button size='xs' onClick={() => setModal(true)}>
              {t('add category')}
            </Button>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.categoryRouter.getCsv.query();
                const headers: Record<keyof (typeof data)[number], string> = {
                  _id: 'ID',
                  name: 'name',
                  parentCategory: 'Parent Category Name',
                  parentCategory_id: 'parentCategory',
                  slug: 'slug',
                };

                exportCSVFile(headers, data, 'categories');
              }}
            >
              {t('export csv')}
            </Button>
            <FileButton
              onChange={(file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const csv = e.target?.result;
                  if (!csv) return;
                  const data = await csvtojson({
                    colParser: {
                      name: 'string',
                      parentCategory: 'string',
                      slug: 'string',
                    },
                  }).fromString(csv as string);
                  createManyCategories.mutateAsync(data).then(() => {
                    utils.categoryRouter.getrootCategories.invalidate({
                      limit: 10,
                      cursor: 0,
                    });
                    showNotification({
                      title: 'Categories Created',
                      message: `Categories created successfully`,
                    });
                  });
                };
                reader.readAsText(file);
              }}
              accept={MIME_TYPES.csv}
            >
              {(props) => (
                <Button {...props} size='xs'>
                  {t('upload csv')}
                </Button>
              )}
            </FileButton>
          </Group>
        </Group>
        <CategoriesTable
          data={
            rootCategories.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
                parentCategory: doc.parentCategory?.toString(),
              })) || []
          }
          onEdit={setEditId}
        />
        <Center mb='lg'>
          {(rootCategories.data?.pages.find(
            (pageData) => pageData.page === page
          )?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                rootCategories.data?.pages.find(
                  (pageData) => pageData.page === page
                )?.totalPages ?? 0
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
