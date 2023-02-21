import type { AppProps } from 'next/app';
import Head from 'next/head';
import {
  AppShell,
  Header,
  MantineProvider,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { trpc } from '../utils/trpc';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import NavbarNested from '../components/Navbar';
import { useRouter } from 'next/router';
import { setUser } from '@/store/userSlice';

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const me = trpc.userRouter.me.useQuery(undefined, {
    retry: false,
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/login');
      }
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me.data && !store.getState().userState.user) {
      dispatch(
        setUser({
          ...me.data,
          _id: me.data._id.toString(),
          role: { _id: me.data.role._id, name: me.data.role.name },
          linkedTo: me.data.linkedTo && {
            _id: me.data.linkedTo.toString(),
          },
          companyId: {
            _id: me.data.companyId.toString(),
          },
          ticket: me.data.ticket && {
            _id: me.data.ticket?._id.toString(),
          },
          createdAt: me.data.createdAt.toString(),
        })
      );
    }
  }, [dispatch, me.data, me.error?.data?.code, router]);

  if (me.isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}

function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const matches = useMediaQuery('(max-width: 800px)');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>HashindCrm</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
        }}
      >
        <AppShell
          padding='md'
          navbar={<NavbarNested hide={!opened} />}
          hidden={router.pathname === '/login'}
          header={
            matches ? (
              <Header p='md' height={50}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size='sm'
                    color={theme.colors.gray[6]}
                    mr='xl'
                  />
                </div>
              </Header>
            ) : undefined
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Provider store={store}>
            <UserContextProvider>
              <Component {...pageProps} />
            </UserContextProvider>
          </Provider>
        </AppShell>
      </MantineProvider>
    </>
  );
}

export default trpc.withTRPC(App);
