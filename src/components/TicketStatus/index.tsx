import { forwardRef } from 'react';
import type { SelectProps } from '@mantine/core';
import { Group, Select, Badge, ActionIcon } from '@mantine/core';
import { IconHash } from '@tabler/icons';
import { useField } from 'formik';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
}
const hashButton = (
  <ActionIcon size='xs' color='blue' radius='xl' variant='transparent'>
    <IconHash size={14} />
  </ActionIcon>
);

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => {
    SelectItem.displayName = 'SelectItem';
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Badge variant='filled' fullWidth leftSection={hashButton}>
              {label}
            </Badge>
          </div>
        </Group>
      </div>
    );
  }
);
interface Props extends SelectProps {
  name: string;
  label?: string;
}
const TicketSelect: React.FC<Props> = ({ name, ...props }) => {
  const [field, meta, helper] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <Select
      itemComponent={SelectItem}
      searchable
      {...field}
      {...props}
      maxDropdownHeight={400}
      nothingFound='Nobody here'
      icon={<IconHash size={14} />}
      error={isError ? meta.error : undefined}
      onChange={(e) => {
        props.onChange?.(e);
        helper.setValue(e);
      }}
      styles={(theme) => ({
        item: {
          '&[data-selected]': {
            '&, &:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.gray[8]
                  : theme.colors.gray[1],
              color:
                theme.colorScheme === 'dark'
                  ? theme.white
                  : theme.colors.teal[9],
            },
          },
          '&[data-hovered]': {},
        },
      })}
    />
  );
};
export default TicketSelect;
