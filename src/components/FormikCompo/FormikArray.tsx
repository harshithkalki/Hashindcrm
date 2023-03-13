import { Stack, Group, ActionIcon, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons';
import type { FieldArrayRenderProps } from 'formik';
import ArrayInput from './ArrayInput';

export default function FormikArray({
  arrayHelpers,
  label,
  placeholder,
}: {
  label: string;
  arrayHelpers: FieldArrayRenderProps;
  placeholder: string;
}) {
  const { values, touched, errors } = arrayHelpers.form;
  const name = arrayHelpers.name;

  return (
    <div>
      <label
        style={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <Stack spacing='xs'>
        {values[name].map((num: string, index: number) => (
          <div key={index}>
            <Group spacing={0}>
              <ArrayInput
                name={`${name}.${index}`}
                placeholder={placeholder}
                style={{
                  flex: 1,
                }}
              />
              <Group spacing={1} ml={2}>
                <ActionIcon
                  onClick={() => arrayHelpers.remove(index)}
                  color='red'
                  variant='light'
                  size={'lg'}
                  disabled={values[name].length === 1}
                >
                  <IconMinus />
                </ActionIcon>
                <ActionIcon
                  onClick={() => arrayHelpers.push('')}
                  color='blue'
                  variant='light'
                  size={'lg'}
                >
                  <IconPlus />
                </ActionIcon>
              </Group>
            </Group>
            {
              <Text size='xs' color='red'>
                {Array.isArray(touched[name]) &&
                  (touched[name] as unknown as boolean[])[index] &&
                  errors[name] &&
                  (errors[name] as string[])[index]}
              </Text>
            }
          </div>
        ))}
      </Stack>
    </div>
  );
}
