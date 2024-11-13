import React, { createContext, useEffect, useState } from 'react';

import { clientRedirectToLogin, clientRedirectToLogout, isUnauthorizedError } from '@/utils/helpers';
import { Role, Tenant, TenantOption, User } from '@/types';
import frontendApiService from '@/services/frontend-api-service';

const DEFAULT_ROLE_STATE: Role = {
  id: '',
  name: 'app:app:party-animal',
  displayName: 'Party Animal',
};

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

const DEFAULT_TENANT_OPTIONS: TenantOption[] = [];

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  role: DEFAULT_ROLE_STATE,
  user: DEFAULT_USER_STATE,
  tenant: DEFAULT_TENANT,
  tenantOptions: DEFAULT_TENANT_OPTIONS,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTenant: (tenant: Tenant) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTenantOptions: (tenantOptions: TenantOption[]) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: User) => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth Context State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<Role>(DEFAULT_ROLE_STATE);
  const [user, setUser] = useState<User>(DEFAULT_USER_STATE);
  const [tenant, setTenant] = useState<Tenant>(DEFAULT_TENANT);
  const [tenantOptions, setTenantOptions] = useState<TenantOption[]>(DEFAULT_TENANT_OPTIONS);

  // Bootstrap the application with the authenticated user's session data.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
        const sessionData = await frontendApiService.getSession();
        const { role, user, tenant, tenantOptions } = sessionData;

        setIsLoading(false);
        setIsAuthenticated(true);
        setRole(role);
        setUser(user);
        setTenant(tenant);
        setTenantOptions(tenantOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);

        if (isUnauthorizedError(error)) {
          // We want to preserve the page route that the user lands on when they come back after re-authentication.
          clientRedirectToLogin(window.location.href);
        } else {
          clientRedirectToLogout();
        }
      }
    };

    fetchSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, role, user, setUser, tenant, setTenant, tenantOptions, setTenantOptions }}
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
