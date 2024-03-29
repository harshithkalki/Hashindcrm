import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Image,
  Loader,
  ActionIcon,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconSettings,
  IconChevronDown,
  IconMenu2,
  IconUserCircle,
} from '@tabler/icons';
import InfiniteSelect from '../Custom/InfiniteSelect';
import { trpc } from '@/utils/trpc';
import { setWarehouse } from '@/store/clientSlice';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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

  mainSection: {
    maxWidth: '100%',
    width: '100%',
    padding: `0 ${theme.spacing.xl}px`,
  },

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
  navopen: boolean;
  setNavOpen: (value: boolean) => void;
  className?: string;
}

function WarehouseSelect() {
  const [searchValue, onSearchChange] = useState('');
  const { warehouse, client } = useSelector<
    RootState,
    RootState['clientState']
  >((state) => state.clientState);
  const warehouses = trpc.warehouseRouter.warehouses.useInfiniteQuery(
    {
      search: searchValue,
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: !client?.isSuperAdmin && !!client,
    }
  );

  const dispatch = useDispatch();

  return (
    <InfiniteSelect
      placeholder='Select warehouse'
      data={
        warehouses.data?.pages
          .flatMap((page) => page.docs)
          .map((warehouse, index) => ({
            label: warehouse.name,
            value: warehouse._id.toString(),
            index,
          })) ?? []
      }
      onChange={(value) => {
        if (value) dispatch(setWarehouse(value));
      }}
      value={warehouse}
      nothingFound='No warehouses found'
      onWaypointEnter={() => {
        if (
          warehouses.data?.pages[warehouses.data.pages.length - 1]?.hasNextPage
        ) {
          warehouses.fetchNextPage();
        }
      }}
      rightSection={warehouses.isLoading ? <Loader size={20} /> : undefined}
      onSearchChange={onSearchChange}
      searchValue={searchValue}
      onClick={() => {
        onSearchChange('');
      }}
      searchable
    />
  );
}

export function CustomHeader({ navopen, setNavOpen }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const logout = trpc.auth.logout.useMutation();
  const client = useSelector<RootState, RootState['clientState']['client']>(
    (state) => state.clientState.client
  );
  const { push, locale } = useRouter();
  const router = useRouter();
  const [language, setLanguage] = useState(locale);
  const { i18n } = useTranslation();

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position='apart'>
          <Group>
            <ActionIcon onClick={() => setNavOpen(!navopen)} size='lg'>
              {!navopen && <IconMenu2 size='1.7rem' />}
            </ActionIcon>

            <Image
              src={client?.company?.logo}
              height={30}
              width={30}
              alt='Mantine logo'
              withPlaceholder
            />
          </Group>

          <Group>
            {!client?.isSuperAdmin && <WarehouseSelect />}
            {!client?.isSuperAdmin && (
              <Select
                data={[
                  { label: 'English', value: 'en' },
                  { label: 'Tamil', value: 'ta' },
                ]}
                onChange={(value) => {
                  // console.log(router.asPath);
                  if (value === 'en') {
                    push('/', `${router.asPath}`, { locale: 'en' }).then(() => {
                      router.reload();
                    });
                    setLanguage('en');
                  } else if (value === 'ta') {
                    push('/', `${router.asPath}`, { locale: 'ta' }).then(() => {
                      router.reload();
                    });
                    setLanguage('ta');
                  }
                }}
                value={language}
                defaultValue={locale}
                size='xs'
              />
            )}
            <Menu
              width={200}
              position='bottom-end'
              transition='pop-top-right'
              trigger='hover'
              openDelay={100}
              closeDelay={400}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={client?.profile}
                      alt={client?.name}
                      radius='xl'
                      size={20}
                    />
                    <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                      {client?.isSuperAdmin ? 'Super Admin' : client?.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Menu</Menu.Label>
                {/* <Menu.Item
                  icon={<IconSettings size={14} stroke={1.5} />}
                  onClick={() => {
                    push('/settings/paymentmodes');
                  }}
                >
                  Settings
                </Menu.Item> */}
                <Menu.Item
                  icon={<IconUserCircle size={14} stroke={1.5} />}
                  onClick={() => {
                    push('/settings/profile');
                  }}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  icon={<IconLogout size={14} stroke={1.5} />}
                  onClick={() => {
                    logout.mutateAsync();
                    push('/login');
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
    </div>
  );
}
