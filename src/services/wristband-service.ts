import {
  ChangeEmailRequestResults,
  IdentityProviderDto,
  NewUserInvite,
  PaginatedEntityResults,
  ResolveEntityOverrideResults,
  ResolveIdpRedirectUrlOverridesResult,
  Tenant,
  User,
} from '@/types';
import { bearerAuthFetchHeaders, validateFetchResponseStatus } from '@/utils/helpers';

const API_URL = `https://${process.env.APPLICATION_DOMAIN}/api/v1`;

async function cancelEmailChange(accessToken: string, changeEmailRequestId: string): Promise<void> {
  const cancelResponse = await fetch(`${API_URL}/change-email/cancel-email-change`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ changeEmailRequestId }),
  });

  validateFetchResponseStatus(cancelResponse);
}

async function changePassword(
  accessToken: string,
  requestData: { userId: string; currentPassword: string; newPassword: string }
): Promise<void> {
  const changePwResponse = await fetch(`${API_URL}/change-password`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify(requestData),
  });

  validateFetchResponseStatus(changePwResponse);
}

async function getChangeEmailRequests(accessToken: string, userId: string): Promise<ChangeEmailRequestResults> {
  const statusQuery = encodeURIComponent(`status ne "CANCELED" and status ne "COMPLETED"`);
  const changeEmailRequestsResponse = await fetch(
    `${API_URL}/users/${userId}/change-email-requests?query=${statusQuery}`,
    {
      method: 'GET',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
    }
  );

  validateFetchResponseStatus(changeEmailRequestsResponse);

  const data = await changeEmailRequestsResponse.json();
  return data as ChangeEmailRequestResults;
}

async function getTenant(accessToken: string, tenantId: string): Promise<Tenant> {
  const tenantResponse = await fetch(`${API_URL}/tenants/${tenantId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(tenantResponse);

  const data = await tenantResponse.json();
  return data as Tenant;
}

async function getNewUserInvitesInTenant(
  accessToken: string,
  tenantId: string
): Promise<PaginatedEntityResults<NewUserInvite>> {
  const tenantOverridesResponse = await fetch(`${API_URL}/tenants/${tenantId}/new-user-invitation-requests`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as PaginatedEntityResults<NewUserInvite>;
}

async function getUsersInTenantWithRoles(accessToken: string, tenantId: string): Promise<PaginatedEntityResults<User>> {
  const tenantOverridesResponse = await fetch(`${API_URL}/tenants/${tenantId}/users`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as PaginatedEntityResults<User>;
}

async function resolveTenantIdpOverrides(
  accessToken: string,
  tenantId: string
): Promise<ResolveEntityOverrideResults<IdentityProviderDto>> {
  // We'll just hard-code to Okta type for now for demo purposes. Wristband type will always be enabled.
  const tenantOverridesResponse = await fetch(
    `${API_URL}/tenants/${tenantId}/identity-providers/resolve-overrides?types=OKTA`,
    {
      method: 'POST',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
    }
  );

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as ResolveEntityOverrideResults<IdentityProviderDto>;
}

async function resolveTenantIdpRedirectUrlOverrides(
  accessToken: string,
  tenantId: string
): Promise<ResolveIdpRedirectUrlOverridesResult> {
  // We'll just hard-code to Okta type for now for demo purposes. Wristband type will always be enabled.
  const tenantOverridesResponse = await fetch(
    `${API_URL}/tenants/${tenantId}/identity-providers/resolve-redirect-urls`,
    {
      method: 'POST',
      headers: bearerAuthFetchHeaders(accessToken),
      body: JSON.stringify({ identityProviderTypes: ['OKTA'] }),
      keepalive: true,
    }
  );

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as ResolveIdpRedirectUrlOverridesResult;
}

async function requestEmailChange(accessToken: string, userId: string, newEmail: string): Promise<void> {
  const changeResponse = await fetch(`${API_URL}/change-email/request-email-change`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ userId, newEmail }),
  });

  validateFetchResponseStatus(changeResponse);
}

async function updateUser(accessToken: string, userId: string, userData: User): Promise<User> {
  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${userId}`, {
    method: 'PATCH',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify(userData),
  });

  validateFetchResponseStatus(userResponse);

  const data = await userResponse.json();
  return data as User;
}

async function updateTenant(accessToken: string, tenantId: string, tenantData: Tenant): Promise<Tenant> {
  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/tenants/${tenantId}`, {
    method: 'PATCH',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify(tenantData),
  });

  validateFetchResponseStatus(userResponse);

  const data = await userResponse.json();
  return data as Tenant;
}

async function upsertIdp(accessToken: string, idpData: IdentityProviderDto): Promise<IdentityProviderDto> {
  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/identity-providers?upsert=true`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify(idpData),
  });

  validateFetchResponseStatus(userResponse);

  const data = await userResponse.json();
  return data as IdentityProviderDto;
}

async function upsertIdpOverrideToggle(accessToken: string, tenantId: string): Promise<void> {
  const response = await fetch(
    `https://${process.env.APPLICATION_DOMAIN}/api/v1/identity-provider-override-toggles?upsert=true`,
    {
      method: 'POST',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
      body: JSON.stringify({ ownerType: 'TENANT', ownerId: tenantId, status: 'ENABLED' }),
    }
  );

  validateFetchResponseStatus(response);
}

const wristbandService = {
  cancelEmailChange,
  changePassword,
  getChangeEmailRequests,
  getNewUserInvitesInTenant,
  getTenant,
  getUsersInTenantWithRoles,
  requestEmailChange,
  resolveTenantIdpOverrides,
  resolveTenantIdpRedirectUrlOverrides,
  updateUser,
  updateTenant,
  upsertIdp,
  upsertIdpOverrideToggle,
};
export default wristbandService;
