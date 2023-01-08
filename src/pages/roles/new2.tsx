import { Button, Container, Title, TransferList } from "@mantine/core";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import React from "react";
import { z } from "zod";
import FormInput from "../../components/FormikCompo/FormikInput";
// import Formiktextarea from "../../components/FormikCompo/FormikTextarea";
import type { TransferListData } from "@mantine/core";

const onSubmit = async (values: CreateRole, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface CreateRole {
  rolename: string;
  permissions: TransferListData;
}

const permissionsZodtype = z.object({
  value: z.string(),
  label: z.string(),
});

const permissionValues: TransferListData = [
  [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
    { value: "gatsby", label: "Gatsby.js" },
    { value: "vue", label: "Vue" },
    { value: "jq", label: "jQuery" },
    { value: "sv", label: "Svelte" },
    { value: "rw", label: "Redwood" },
    { value: "np", label: "NumPy" },
    { value: "dj", label: "Django" },
    { value: "fl", label: "Flask" },
  ],
  [],
];
const formInputs: CreateRole = {
  rolename: "",
  permissions: permissionValues,
};

const app = () => {
  return (
    <>
      <Container w={"50%"} mt={"5vh"}>
        <Title fz={"xxl"} fw={"400"} mb={"5vh"}>
          Add Role
        </Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(
            z.object({
              rolename: z.string(),
              permissions: z.array(permissionsZodtype),
            })
          )}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <FormInput
                label="Role Name"
                placeholder="Role name"
                name="rolename"
                withAsterisk
                mb={"sm"}
              />
              <TransferList
                value={values.permissions}
                onChange={(value) => {
                  setFieldValue("permissions", value, true);
                }}
                searchPlaceholder="Search..."
                nothingFound="Nothing here"
                titles={["Available", "Given"]}
                breakpoint="sm"
                mt={"md"}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                onClick={() => {
                  console.log(values);
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
