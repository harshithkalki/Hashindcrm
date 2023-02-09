import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import React from 'react';
import { z } from 'zod';
import FormInput from '../../components/FormikCompo/FormikInput';
import FormikCheck from '@/components/FormikCompo/FormikCheckBox';
import { useMediaQuery } from '@mantine/hooks';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
// import { trpc } from "@/utils/trpc";
import { Permissions } from '@/constants';

// const permissionsDemo: Permission = [
//   {
//     permissionName: "COMPANY",
//     crud: {
//       read: false,
//       update: false,
//       delete: false,
//       create: false,
//     },
//   },
//   {
//     permissionName: "USER",
//     crud: {
//       read: false,
//       update: false,
//       delete: false,
//       create: false,
//     },
//   },
// ];

//remove the type error from the array

interface CreateRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission;
}
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const matches = useMediaQuery('(max-width: 800px)');
  const formpermissions: Permission = formInputs.permissions;
  console.log(formInputs);

  function setChecked(checked: boolean): void {
    throw new Error('Function not implemented.');
  }

  const PermissonsValues = Permissions.map((permission) => {
    // console.log(permission);
    const permissionIndex = formpermissions.findIndex(
      (perm) => perm.permissionName === permission
    );
    // console.log(permissionIndex);
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
  }) as unknown as Permission;

  const inputs = {
    id: formInputs.id,
    name: formInputs.name,
    displayName: formInputs.displayName,
    description: formInputs.description,
    permissions: PermissonsValues,
  };

  return (
    <>
      <Container w={matches ? '80' : '50%'} mt={'5vh'}>
        <Title fz={'xxl'} fw={'400'} mb={'5vh'}>
          {title}
        </Title>
        <Formik
          initialValues={inputs}
          validationSchema={toFormikValidationSchema(
            z.object({
              id: z.string().optional(),
              name: z.string(),
              displayName: z.string(),
              description: z.string().optional(),
              permissions: z.array(
                z.object({
                  permissionName: z.enum(Permissions),
                  crud: z.object({
                    read: z.boolean(),
                    update: z.boolean(),
                    delete: z.boolean(),
                    create: z.boolean(),
                  }),
                })
              ),
            })
          )}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
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
              <Formiktextarea
                label='Description'
                placeholder='Description'
                name='description'
                withAsterisk
                mb={'sm'}
              />
              {PermissonsValues.map((permission, index) => {
                // const permissionv: Permission = PermissonsValues[
                //   index
                // ] as unknown as Permission;
                return (
                  <>
                    <div key={index}>
                      <Text
                        mt={'xs'}
                        mb={'sm'}
                      >{`${permission.permissionName}`}</Text>
                      <Group>
                        <FormikCheck
                          label={'view'}
                          defaultChecked={
                            permission?.crud.read !== undefined
                              ? permission?.crud.read
                              : false
                          }
                          name={`permissions.${index}.crud.read`}
                          mb={'sm'}
                        />

                        <FormikCheck
                          label={'create'}
                          defaultChecked={permission.crud.create}
                          name={`permissions.${index}.crud.create`}
                          mb={'sm'}
                        />

                        <FormikCheck
                          label={'edit'}
                          defaultChecked={permission.crud.update}
                          name={`permissions.${index}.crud.update`}
                          mb={'sm'}
                        />

                        <FormikCheck
                          label={'delete'}
                          defaultChecked={permission.crud.delete}
                          name={`permissions.${index}.crud.delete`}
                          mb={'sm'}
                        />

                        {/* </Checkbox.Group> */}
                      </Group>
                    </div>
                  </>
                );
              })}

              <Button
                disabled={isSubmitting}
                type='submit'
                onClick={() => {
                  //   console.log(values);
                }}
                mt={'md'}
              >
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default RoleForm;
