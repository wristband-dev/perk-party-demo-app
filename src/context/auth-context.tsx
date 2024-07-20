import React, { createContext, useEffect, useState } from 'react';

import { clientRedirectToLogin, clientRedirectToLogout } from '@/utils/helpers';
import { User } from '@/types';

const DEFAULT_USER_STATE: User = {
  id: '',
  tenantId: '',
  applicationId: '',
  identityProviderName: '',
  email: '',
  emailVerified: false,
  username: null,
  fullName: null,
  firstName: null,
  middleName: null,
  lastName: null,
  nickname: null,
  pictureURL: null,
  gender: null,
  birthdate: null,
  timezone: null,
  locale: null,
  updatedAt: null,
  publicMetadata: {},
  restrictedMetadata: {},
  roles: [],
};

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: DEFAULT_USER_STATE,
  tenantDomainName: '',
  tenantMetadata: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTenantMetadata: (tenantMetadata: object) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: User) => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ id: '' });
  const [tenantDomainName, setTenantDomainName] = useState<string>('');
  const [tenantMetadata, setTenantMetadata] = useState<object>({});

  // Bootstrap the application with the authenticated user's session data.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
        const res = await fetch(`/api/auth/session`, { cache: 'no-store', method: 'GET' });

        if (res.status !== 200) {
          clientRedirectToLogout();
          return;
        }

        const data = await res.json();
        const { isAuthenticated, user, tenantDomainName, tenantMetadata } = data;

        if (!isAuthenticated) {
          // We want to preserve the page route that the user lands on when they com back after re-authentication.
          clientRedirectToLogin(window.location.href);
          return;
        }

        setIsLoading(false);
        setIsAuthenticated(true);
        setUser(user);
        setTenantDomainName(tenantDomainName);
        setTenantMetadata(tenantMetadata);
      } catch (error) {
        console.log(error);
        clientRedirectToLogout();
      }
    };

    fetchSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, setUser, tenantDomainName, tenantMetadata, setTenantMetadata }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useWristband() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useWristband must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useWristband };
