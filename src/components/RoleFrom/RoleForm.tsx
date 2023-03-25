import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React from 'react';
import type { z } from 'zod';
import FormInput from '../../components/FormikCompo/FormikInput';
import FormikCheck from '@/components/FormikCompo/FormikCheckBox';
import { useMediaQuery } from '@mantine/hooks';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
// import { trpc } from "@/utils/trpc";
import { Permissions, PermissionsLabels } from '@/constants';
import { ZRoleCreateInput } from '@/zobjs/role';
import { useRouter } from 'next/router';
import FormikSelect from '../FormikCompo/FormikSelect';
import { navData } from '../Navbar';

type CreateRole = z.infer<typeof ZRoleCreateInput>;

type Permission = {
  permissionName: typeof Permissions[number];
  crud: {
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    create?: boolean;
  };
}[];

interface props {
  formInputs: CreateRole;
  onSubmit: (inputs: CreateRole) => Promise<void>;
  title: string;
}

const RoleForm = ({ formInputs, onSubmit, title }: props) => {
  const matches = useMediaQuery('(max-width: 800px)');
  const formpermissions: Permission = formInputs.permissions;
  const router = useRouter();

  const PermissonsValues = Permissions.map((permission) => {
    const permissionIndex = formpermissions.findIndex(
      (perm) => perm.permissionName === permission
    );

    return {
      permissionName: permission,
      crud:
        permissionIndex !== -1
          ? formInputs?.permissions[permissionIndex]?.crud
          : {
              read: false,
              update: false,
              delete: false,
              create: false,
            },
    };
  });

  return (
    <>
      <Container w={matches ? '80' : '50%'} mt={'5vh'}>
        <Title fz={'xxl'} fw={'400'} mb={'5vh'}>
          {title}
        </Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(ZRoleCreateInput)}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label='Role Name'
                placeholder='Role name'
                name='name'
                withAsterisk
                mb={'sm'}
              />
              <FormInput
                label='Display Name'
                placeholder='Display name'
                name='displayName'
                withAsterisk
                mb={'sm'}
              />
              <FormikSelect
                label='Go directly on'
                placeholder='Go directly on'
                name='defaultRedirect'
                withAsterisk
                mb={'sm'}
                data={navData.flatMap((nav) => {
                  if (typeof nav.links === 'string') {
                    return {
                      label: nav.label,
                      value: nav.links,
                    };
                  }

                  return nav.links.map((link) => ({
                    label: link.label,
                    value: link.link,
                  }));
                })}
              />
              <Formiktextarea
                label='Description'
                placeholder='Description'
                name='description'
                mb={'sm'}
              />

              <Text>Permissions</Text>
              {formInputs.permissions.map((permission, index) => {
                return (
                  <div key={permission.permissionName}>
                    <Text mt={'xs'} mb={'sm'} transform='capitalize'>{`${
                      PermissionsLabels[permission.permissionName]
                    }`}</Text>
                    <Group>
                      <FormikCheck
                        label={'view'}
                        defaultChecked={
                          permission?.crud?.read !== undefined
                            ? permission?.crud.read
                            : false
                        }
                        name={`permissions.${index}.crud.read`}
                        mb={'sm'}
                      />

                      <FormikCheck
                        label={'create'}
                        defaultChecked={permission.crud?.create}
                        name={`permissions.${index}.crud.create`}
                        mb={'sm'}
                      />

                      <FormikCheck
                        label={'edit'}
                        defaultChecked={permission.crud?.update}
                        name={`permissions.${index}.crud.update`}
                        mb={'sm'}
                      />

                      <FormikCheck
                        label={'delete'}
                        defaultChecked={permission.crud?.delete}
                        name={`permissions.${index}.crud.delete`}
                        mb={'sm'}
                      />
                    </Group>
                  </div>
                );
              })}
              <Group spacing={'xs'} mt={'md'} mb={'xl'}>
                <Button disabled={isSubmitting} type='submit' size={'xs'}>
                  Save
                </Button>
                <Button
                  size='xs'
                  onClick={() => {
                    router.back();
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default RoleForm;
