import { Button, Center, Container, Modal, Title } from "@mantine/core";
import React from "react";
import { IconDatabase } from "@tabler/icons";
import { z } from "zod";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@/components/FormikCompo/FormikInput";

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const NoWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Modal
        opened={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Formik
          initialValues={{ name: "" }}
          onSubmit={onSubmit}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
            })
          )}
        >
          {({ isSubmitting }) => (
            <Form>
              <Title fw={200}>New WorkFlow</Title>
              <FormInput
                name="name"
                label="Name"
                placeholder="Enter Name"
                withAsterisk
              />
              <Button type="submit" mt={"md"} loading={isSubmitting}>
                save
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>

      <Container style={{ alignContent: "center", marginTop: "30vh" }}>
        <Center>
          <Title fw={500}>Create New WorkFlow</Title>
        </Center>
        <Center
          style={{ alignItems: "center", justifyContent: "space-around" }}
        >
          <Button
            size="sm"
            mt={"md"}
            leftIcon={<IconDatabase />}
            onClick={() => setOpen(true)}
          >
            Create New
          </Button>
        </Center>
      </Container>
    </>
  );
};

const index = () => {
  return (
    <div>
      <NoWorkflow />
    </div>
  );
};

export default index;
