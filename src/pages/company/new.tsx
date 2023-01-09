import CompanyForm from "@/components/CompanyForm";
import { trpc } from "@/utils/trpc";
import React from "react";

const index = () => {
  const createCompany = trpc.userRouter.createCompany.useMutation();

  return (
    <div>
      <CompanyForm
        formInputs={{
          companyName: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        }}
        onSubmit={(inputs) => {
          return createCompany
            .mutateAsync(inputs)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        title="Add Company"
      />
    </div>
  );
};

export default index;
