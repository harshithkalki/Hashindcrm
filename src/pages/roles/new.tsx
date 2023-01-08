import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import React from "react";
import { z } from "zod";
import FormInput from "../../components/FormikCompo/FormikInput";
import FormikCheck from "@/components/FormikCompo/FormikCheckBox";
import { useMediaQuery } from "@mantine/hooks";
import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
import { trpc } from "@/utils/trpc";
import { Permissions } from "@/constants";

const onSubmit = async (values: CreateRole, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const permissionsDemo: Permission = [
  {
    permissionName: "COMPANY",
    crud: {
      read: false,
      update: false,
      delete: false,
      create: false,
    },
  },
  {
    permissionName: "USER",
    crud: {
      read: false,
      update: false,
      delete: false,
      create: false,
    },
  },
];

interface CreateRole {
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

const formInputs: CreateRole = {
  name: "",
  displayName: "",
  description: "",
  permissions: permissionsDemo,
};

const app = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const matches = useMediaQuery("(max-width: 800px)");
  const AddRole = trpc.userRouter.createRole.useMutation();

  return (
    <>
      <Container w={matches ? "80" : "50%"} mt={"5vh"}>
        <Title fz={"xxl"} fw={"400"} mb={"5vh"}>
          Add Role
        </Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
              displayName: z.string(),
              description: z.string(),
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
          // onSubmit={onSubmit}
          onSubmit={(values) => {
            return AddRole.mutateAsync(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label="Role Name"
                placeholder="Role name"
                name="name"
                withAsterisk
                mb={"sm"}
              />
              <FormInput
                label="Display Name"
                placeholder="Display name"
                name="displayName"
                withAsterisk
                mb={"sm"}
              />
              <Formiktextarea
                label="Description"
                placeholder="Description"
                name="description"
                withAsterisk
                mb={"sm"}
              />
              {permissionsDemo.map((permission, index) => (
                <div key={index}>
                  <Text
                    mt={"xs"}
                    mb={"sm"}
                  >{`${permission.permissionName}`}</Text>
                  <Group>
                    {permission.crud.read === true ||
                      (permission.crud.read === false && (
                        <FormikCheck
                          label={"view"}
                          name={`permissions.${index}.crud.read`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.crud.create === true ||
                      (permission.crud.create === false && (
                        <FormikCheck
                          label={"create"}
                          name={`permissions.${index}.crud.create`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.crud.update === true ||
                      (permission.crud.update === false && (
                        <FormikCheck
                          label={"edit"}
                          name={`permissions.${index}.crud.update`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.crud.delete === true ||
                      (permission.crud.delete === false && (
                        <FormikCheck
                          label={"delete"}
                          name={`permissions.${index}.crud.delete`}
                          mb={"sm"}
                        />
                      ))}
                    {/* </Checkbox.Group> */}
                  </Group>
                </div>
              ))}

              <Button
                disabled={isSubmitting}
                type="submit"
                onClick={() => {
                  //   console.log(values);
                }}
                mt={"md"}
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

export default app;
