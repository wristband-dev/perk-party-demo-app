import React, { createContext, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { clientRedirectToLogin, clientRedirectToLogout } from '@/utils/helpers';
import { Tenant, User } from '@/types';

const DEFAULT_USER_STATE: User = {
  id: '',
  tenantId: '',
  applicationId: '',
  identityProviderName: '',
  email: '',
  emailVerified: false,
  username: null,
  fullName: null,
  givenName: null,
  middleName: null,
  familyName: null,
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

const DEFAULT_PERK_CATEGORIES: string[] = ['thrill', 'relax', 'travel', 'food'];

const DEFAULT_TENANT: Tenant = {
  id: '',
  applicationId: '',
  vanityDomain: '',
  domainName: '',
  displayName: '',
  description: '',
  signupEnabled: false,
  status: '',
  publicMetadata: { perkCategories: DEFAULT_PERK_CATEGORIES },
  restrictedMetadata: {},
};

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: DEFAULT_USER_STATE,
  tenant: DEFAULT_TENANT,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTenant: (tenant: Tenant) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: User) => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ id: '' });
  const [tenant, setTenant] = useState<Tenant>(DEFAULT_TENANT);

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
        const { isAuthenticated, user, tenant } = data;

        if (!isAuthenticated) {
          // We want to preserve the page route that the user lands on when they com back after re-authentication.
          clientRedirectToLogin(window.location.href);
          return;
        }

        setIsLoading(false);
        setIsAuthenticated(true);
        setUser(user);
        setTenant(tenant);
      } catch (error) {
        console.log(error);
        clientRedirectToLogout();
      }
    };

    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, setUser, tenant, setTenant }}>
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
