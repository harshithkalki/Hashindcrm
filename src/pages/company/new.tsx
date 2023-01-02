import { Button, Container, Title } from "@mantine/core";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import React from "react";
import { z } from "zod";
import FormInput from "../../components/FormikCompo/FormikInput";
import Formiktextarea from "../../components/FormikCompo/FormikTextarea";

const onSubmit = async (values: CreateCompany, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface CreateCompany {
  name: string;
  email: string;
  phn: string;
  description: string;
}

const formInputs: CreateCompany = {
  name: "",
  email: "",
  description: "",
  phn: "",
};

const app = () => {
  return (
    <>
      <Container w={"50%"} mt={"5vh"}>
        <Title fz={"xxl"} fw={"400"} mb={"5vh"}>
          Add Company
        </Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
              email: z.string().email({ message: "Please enter valid email" }),
              description: z.string(),
              phn: z
                .string()
                .length(10, "Phone number should be only 10 digits"),
            })
          )}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label="Name"
                placeholder="Company name"
                name="name"
                withAsterisk
                mb={"sm"}
              />
              <FormInput
                label="Email"
                placeholder="email id"
                name="email"
                withAsterisk
                mb={"sm"}
              />
              <FormInput
                label="Phone number"
                placeholder="Ex: 1234567890"
                name="phn"
                withAsterisk
                mb={"sm"}
              />
              <Formiktextarea
                label="Description"
                placeholder="About"
                name="description"
                withAsterisk
                mb={"md"}
              />
              <Button disabled={isSubmitting} type="submit">
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
