import type { TextInputProps } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { useField } from 'formik';

interface Props extends TextInputProps {
  name: string;

  label?: string;
}

const FormInput: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <TextInput
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
    />
  );
};

export default FormInput;
