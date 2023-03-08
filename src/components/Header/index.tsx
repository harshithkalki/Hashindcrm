import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons';
import InfiniteSelect from '../Custom/InfiniteSelect';
import { trpc } from '@/utils/trpc';
import { setWarehouse } from '@/store/clientSlice';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    gridArea: 'header',
  },

  mainSection: {},

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },
}));

interface HeaderTabsProps {
  user: { name: string; image: string };
}

function WarehouseSelect() {
  const warehouses = trpc.warehouseRouter.warehouses.useQuery(
    {},
    { refetchOnWindowFocus: false }
  );
  const warehouse = useSelector<
    RootState,
    RootState['clientState']['warehouse']
  >((state) => state.clientState.warehouse);
  const dispatch = useDispatch();

  return (
    <InfiniteSelect
      placeholder='Select warehouse'
      data={
        warehouses.data?.docs.map((warehouse) => ({
          label: warehouse.name,
          value: warehouse._id.toString(),
        })) ?? []
      }
      onChange={(value) => {
        if (value) dispatch(setWarehouse(value));
      }}
      value={warehouse}
    />
  );
}

export function CustomHeader({ user }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position='apart'>
          <Image
            src='/logo.svg'
            height={30}
            width={30}
            alt='Mantine logo'
            withPlaceholder
          />

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size='sm'
          />

          <Group>
            <WarehouseSelect />
            <Menu
              width={260}
              position='bottom-end'
              transition='pop-top-right'
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={user.image}
                      alt={user.name}
                      radius='xl'
                      size={20}
                    />
                    <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                      {user.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={
                    <IconHeart
                      size={14}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Liked posts
                </Menu.Item>
                <Menu.Item
                  icon={
                    <IconStar
                      size={14}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Saved posts
                </Menu.Item>
                <Menu.Item
                  icon={
                    <IconMessage
                      size={14}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Your comments
                </Menu.Item>

                <Menu.Label>Settings</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>
                  Account settings
                </Menu.Item>
                <Menu.Item
                  icon={<IconSwitchHorizontal size={14} stroke={1.5} />}
                >
                  Change account
                </Menu.Item>
                <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>
                  Logout
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item icon={<IconPlayerPause size={14} stroke={1.5} />}>
                  Pause subscription
                </Menu.Item>
                <Menu.Item
                  color='red'
                  icon={<IconTrash size={14} stroke={1.5} />}
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
    </div>
  );
}
