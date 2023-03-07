import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  rem,
  Image,
  Avatar,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSearch,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from '@tabler/icons';
import { useState } from 'react';
// import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    width: '100%',
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    // padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
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
  userActive: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}));

interface HeaderSearchProps {
  links: { link: string; label: string }[];
  logout: () => void;
}

export default function HeaderSearch({ links, logout }: HeaderSearchProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx, theme } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={50} className={classes.header} mb={120}>
      <div className={classes.inner}>
        <Group>
          {/* <Burger opened={opened} onClick={toggle} size='sm' /> */}
          {/* <MantineLogo size={28} /> */}
          <Image src='/headerlogo2.svg' alt='hashind' width={140} height={28} />
        </Group>

        <Group w={'100%'} style={{ justifyContent: 'end' }}>
          <Menu
            width={260}
            position='bottom-end'
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={
                      'https://avatars.githubusercontent.com/u/10384315?s=400&u=3b0c2b0b'
                    }
                    alt={'name'}
                    radius='xl'
                    size={20}
                  />
                  <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                    {'name'}
                  </Text>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconLogout size='0.9rem' stroke={1.5} />}
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Header>
  );
}
