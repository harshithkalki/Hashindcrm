import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import { useField } from "formik";

interface Props extends SelectProps {
  name: string;

  label?: string;
}

const FormikSelect: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta, helper] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <Select
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
      onChange={(e) => helper.setValue(e, true)}
    />
  );
};

export default FormikSelect;
