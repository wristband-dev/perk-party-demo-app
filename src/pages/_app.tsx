import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { WristbandAuthProvider } from '@wristband/react-client-auth';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout from '@/layouts/default-layout';
import { ApiTouchpointsProvider } from '@/context/api-touchpoint-context';
import { MySessionMetadata } from '@/types';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WristbandAuthProvider<MySessionMetadata> loginUrl="/api/auth/login" sessionUrl="/api/auth/session">
      <ApiTouchpointsProvider>
        <DefaultLayout>
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            closeButton={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
          />
        </DefaultLayout>
      </ApiTouchpointsProvider>
    </WristbandAuthProvider>
  );
}
