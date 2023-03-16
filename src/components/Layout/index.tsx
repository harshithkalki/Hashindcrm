import { useMantineTheme, createStyles } from '@mantine/core';
import { useState } from 'react';
import { Footer } from '../Footer';
import { CustomHeader } from '../Header';
import NavbarNested from '../Navbar';

type Props = {
  hide?: boolean;
  shownav?: boolean;
  showheader?: boolean;
  showfooter?: boolean;
  navBar?: React.ReactNode;
  children: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '0.8fr 1fr 1fr 1fr',
    gridTemplateAreas: `
    "header header header header"
      "nav main main main"
    `,
    gridTemplateRows: 'auto 1fr',

    [theme.fn.smallerThan('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "nav"
        "main"
      `,
    },
  },

  closeNav: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '0.8fr 1fr 1fr 1fr',
    gridTemplateAreas: `
    "header header header header"
      "main main main main"
    `,
    gridTemplateRows: 'auto 1fr',

    [theme.fn.smallerThan('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "nav"
        "main"
      `,
    },
  },

  nav: {
    gridArea: 'nav',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    maxHeight: '100%',
    overflow: 'hidden',
  },

  main: {
    gridArea: 'main',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    gridRowStart: 2,
    gridRowEnd: 3,
  },

  header: {
    gridArea: 'header',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    height: '100%',
  },
}));

export default function Layout({
  shownav,
  showheader,
  children,
  hide,
  navBar,
}: Props) {
  const [opened, setOpened] = useState(true);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();

  return (
    <div>
      <div className={cx(classes.closeNav, { [classes.container]: opened })}>
        <CustomHeader navopen={opened} setNavOpen={setOpened} />
        {opened && (
          <div className={classes.nav}>
            {navBar ?? <NavbarNested hide={!opened} />}
          </div>
        )}
        <main
          className={classes.main}
          style={{
            display: 'block',
            padding: theme.spacing.xs,
            overflow: 'hidden',
            maxHeight: '100%',
            height: '100%',
          }}
        >
          {/* <ScrollArea style={{ height: '100%' }}>{children}</ScrollArea> */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
