import { Group, Text } from '@mantine/core';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  role: string;
}

// eslint-disable-next-line react/display-name
const SelectUserItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, role, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size='sm'>{label}</Text>
          <Text size='xs' opacity={0.65}>
            {role}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export default SelectUserItem;
