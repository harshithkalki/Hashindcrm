import {
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Pagination,
  Title,
} from '@mantine/core';
import type { ZWarehouseCreateInput } from '@/zobjs/warehouse';
import { trpc } from '@/utils/trpc';
import FormikInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useEffect, useState } from 'react';
import TableSelection from '@/components/Tables';
import Layout from '@/components/Layout';

type WarehouseInput = z.infer<typeof ZWarehouseCreateInput>;

const initialValues: WarehouseInput = {
  name: '',
};

const WarehouseForm = ({
  onSubmit,
  values = initialValues,
}: {
  onSubmit: (values: WarehouseInput) => Promise<void>;
  values?: WarehouseInput | null;
}) => {
  return (
    <Formik
      initialValues={values ?? initialValues}
      validationSchema={toFormikValidationSchema(
        z.object({
          name: z.string().min(3).max(50),
        })
      )}
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        actions.resetForm();
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
  );
};

const AddWarehouse = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const createWarehouse = trpc.warehouseRouter.create.useMutation();

  return (
    <Modal title='Add Warehouse' opened={open} onClose={onClose} size='md'>
      <WarehouseForm
        onSubmit={async (values) => {
          await createWarehouse.mutateAsync(values);
          onClose();
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
      size='md'
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
        <AddWarehouse open={open} onClose={() => setOpen(false)} />
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
