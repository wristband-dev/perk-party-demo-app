import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout from '@/layouts/default-layout';
import { AuthProvider } from '@/context/auth-context';
import { ApiTouchpointsProvider } from '@/context/api-touchpoint-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
