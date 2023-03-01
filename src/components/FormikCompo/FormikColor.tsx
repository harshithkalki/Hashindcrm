import type { ColorInputProps } from '@mantine/core';
import { ColorInput } from '@mantine/core';
// import type { ColorInputProps } from '@mantine/core/lib/components/ColorInput/ColorInput';
import { useField } from 'formik';

interface Props extends ColorInputProps {
  name: string;
  label?: string;
}

const FormikColor: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta, helper] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <ColorInput
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
      onChange={(e) => {
        helper.setValue(e, true);
      }}
    />
  );
};

export default FormikColor;
