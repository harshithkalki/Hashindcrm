import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import React from "react";
import { z } from "zod";
import FormInput from "../../components/FormikCompo/FormikInput";
import FormikCheck from "@/components/FormikCompo/FormikCheckBox";
import { useMediaQuery } from "@mantine/hooks";

const onSubmit = async (values: CreateRole, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const permissionsDemo: Permission = [
  {
    name: "User",
    options: {
      view: false,
      edit: false,
      delete: false,
      create: false,
    },
  },
  {
    name: "Admin",
    options: {
      view: false,
      edit: false,
      delete: false,
      create: false,
    },
  },
];

interface CreateRole {
  rolename: string;
  displayname: string;
  permissions: Permission;
}
type Permission = {
  name: string;
  options: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    create?: boolean;
  };
}[];

const formInputs: CreateRole = {
  rolename: "",
  displayname: "",
  permissions: permissionsDemo,
};

const app = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const matches = useMediaQuery("(max-width: 800px)");

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
              rolename: z.string(),
              displayname: z.string(),
              permissions: z.array(
                z.object({
                  name: z.string().nonempty(),
                  options: z.object({
                    view: z.boolean(),
                    edit: z.boolean(),
                    delete: z.boolean(),
                    create: z.boolean(),
                  }),
                })
              ),
            })
          )}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label="Role Name"
                placeholder="Role name"
                name="rolename"
                withAsterisk
                mb={"sm"}
              />
              <FormInput
                label="Display Name"
                placeholder="Display name"
                name="displayname"
                withAsterisk
                mb={"sm"}
              />
              {permissionsDemo.map((permission, index) => (
                <div key={index}>
                  <Text mt={"xs"} mb={"sm"}>{`${permission.name}`}</Text>
                  <Group>
                    {permission.options.view === true ||
                      (permission.options.view === false && (
                        <FormikCheck
                          label={"view"}
                          name={`permissions.${index}.options.view`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.options.edit === true ||
                      (permission.options.edit === false && (
                        <FormikCheck
                          label={"create"}
                          name={`permissions.${index}.options.create`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.options.delete === true ||
                      (permission.options.delete === false && (
                        <FormikCheck
                          label={"edit"}
                          name={`permissions.${index}.options.edit`}
                          mb={"sm"}
                        />
                      ))}
                    {permission.options.create === true ||
                      (permission.options.create === false && (
                        <FormikCheck
                          label={"delete"}
                          name={`permissions.${index}.options.delete`}
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
