import RoleForm from "@/components/RoleFrom/RoleForm";
import { trpc } from "@/utils/trpc";
import React from "react";
import type { Permissions } from "@/constants";

type Permission = {
  permissionName: typeof Permissions[number];
  crud: {
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    create?: boolean;
  };
}[];
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

const app = () => {
  const AddRole = trpc.userRouter.createRole.useMutation();
  return (
    <div>
      <RoleForm
        formInputs={{
          name: "",
          displayName: "",
          description: "",
          permissions: permissionsDemo,
        }}
        onSubmit={(inputs) => {
          return AddRole.mutateAsync(inputs).then((res) => {
            console.log(res);
          });
        }}
        title="Add Role"
      />
    </div>
  );
};

export default app;
