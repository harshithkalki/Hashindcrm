import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, useMantineTheme, Loader } from '@mantine/core';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { trpc } from '../utils/trpc';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setClient } from '@/store/clientSlice';

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const me = trpc.auth.me.useQuery(undefined, {
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/login');
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
    refetchInterval: false,
  });

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me.data && !store.getState().clientState.client) {
      dispatch(setClient(me.data.data));
    }
  }, [dispatch, me.data, me.error?.data?.code, router]);

  if (me.isLoading)
    return (
      <div style={{ height: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Loader size='md' />
        </div>
      </div>
    );

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
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
        }}
      >
        <Provider store={store}>
          <UserContextProvider>
            <Component {...pageProps} />
          </UserContextProvider>
        </Provider>
      </MantineProvider>
    </>
  );
}

export default trpc.withTRPC(App);
