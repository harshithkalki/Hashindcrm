import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, Loader } from '@mantine/core';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { trpc } from '../utils/trpc';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setClient } from '@/store/clientSlice';
import {
  NotificationsProvider,
  showNotification,
} from '@mantine/notifications';

const HASHIND_COLORPALETTE: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [
  '#FDE4B7',
  '#FDD897',
  '#FCCD7A',
  '#FCC25F',
  '#FBB946',
  '#FAB02F',
  '#FAA819',
  '#F89F05',
  '#E49305',
  '#D28705',
];

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

      if (router.pathname === '/') {
        if (!me.data.data.isSuperAdmin) {
          router.push(me.data.data.role.defaultRedirect);
        } else {
          router.push('/company');
        }
      }
    }
  }, [dispatch, me.data, me.error?.data?.code, router]);

  if (me.isLoading)
    return (
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          colors: {
            company: HASHIND_COLORPALETTE,
          },
          primaryColor: 'company',
        }}
      >
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
      </MantineProvider>
    );

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: {
          company: me.data?.data.company?.primaryColor
            ? [
                '',
                me.data?.data.company?.primaryColor || '#faa819',
                me.data?.data.company?.primaryColor || '#faa819',
                me.data?.data.company?.primaryColor || '#faa819',
                me.data?.data.company?.primaryColor || '#faa819',
                me.data?.data.company?.secondaryColor || '#faa819',
                '',
                '',
                me.data?.data.company?.primaryColor || '#faa819',
                '',
              ]
            : HASHIND_COLORPALETTE,
        },
        primaryColor: 'company',
      }}
    >
      <NotificationsProvider position='top-right'>
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
}

function App(props: AppProps) {
  const { Component, pageProps } = props;

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

      <Provider store={store}>
        <UserContextProvider>
          <NoNetworkErrorPlugin />
          <Component {...pageProps} />
        </UserContextProvider>
      </Provider>
    </>
  );
}

function NoNetworkErrorPlugin() {
  useEffect(() => {
    const setNetworkToast = () => {
      showNotification({
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        color: 'red',
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offline', setNetworkToast);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('offline', setNetworkToast);
      }
    };
  }, []);

  return null;
}

export default trpc.withTRPC(App);
