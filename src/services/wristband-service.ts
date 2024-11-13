import {
  ChangeEmailRequestResults,
  IdentityProviderDto,
  NewUserInvite,
  PaginatedEntityResults,
  ResolveEntityOverrideResults,
  ResolveIdpRedirectUrlOverridesResult,
  Role,
  Tenant,
  TenantOption,
  User,
} from '@/types';
import { WRISTBAND_API_URL } from '@/utils/constants';
import { bearerAuthFetchHeaders, validateFetchResponseStatus } from '@/utils/helpers';

async function cancelEmailChange(accessToken: string, changeEmailRequestId: string): Promise<void> {
  const cancelResponse = await fetch(`${WRISTBAND_API_URL}/change-email/cancel-email-change`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ changeEmailRequestId }),
  });

  validateFetchResponseStatus(cancelResponse);
}

async function cancelNewUserInvite(accessToken: string, newUserInvitationRequestId: string): Promise<void> {
  const cancelResponse = await fetch(`${WRISTBAND_API_URL}/new-user-invitation/cancel-invite`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ newUserInvitationRequestId }),
  });

  validateFetchResponseStatus(cancelResponse);
}

async function changePassword(
  accessToken: string,
  requestData: { userId: string; currentPassword: string; newPassword: string }
): Promise<void> {
  const changePwResponse = await fetch(`${WRISTBAND_API_URL}/change-password`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify(requestData),
  });

  validateFetchResponseStatus(changePwResponse);
}

async function fetchTenants(
  accessToken: string,
  applicationId: string,
  email: string
): Promise<PaginatedEntityResults<TenantOption>> {
  const tenantResponse = await fetch(`${WRISTBAND_API_URL}/tenant-discovery/fetch-tenants`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ applicationId, email, clientId: process.env.CLIENT_ID }),
  });

  validateFetchResponseStatus(tenantResponse);

  const data = await tenantResponse.json();
  return data as PaginatedEntityResults<TenantOption>;
}

async function getChangeEmailRequests(accessToken: string, userId: string): Promise<ChangeEmailRequestResults> {
  const statusQuery = encodeURIComponent(`status ne "CANCELED" and status ne "COMPLETED"`);
  const changeEmailRequestsResponse = await fetch(
    `${WRISTBAND_API_URL}/users/${userId}/change-email-requests?query=${statusQuery}`,
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

const invitesQuery = `${encodeURIComponent(`status eq "PENDING_INVITE_ACCEPTANCE"`)}`;
async function getNewUserInvitesInTenant(
  accessToken: string,
  tenantId: string
): Promise<PaginatedEntityResults<NewUserInvite>> {
  const tenantOverridesResponse = await fetch(
    `${WRISTBAND_API_URL}/tenants/${tenantId}/new-user-invitation-requests?query=${invitesQuery}`,
    {
      method: 'GET',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
    }
  );

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as PaginatedEntityResults<NewUserInvite>;
}

async function getTenant(accessToken: string, tenantId: string): Promise<Tenant> {
  const tenantResponse = await fetch(`${WRISTBAND_API_URL}/tenants/${tenantId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(tenantResponse);

  const data = await tenantResponse.json();
  return data as Tenant;
}

async function getUser(accessToken: string, userId: string): Promise<User> {
  const userResponse = await fetch(`${WRISTBAND_API_URL}/users/${userId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(userResponse);

  const data = await userResponse.json();
  return data as User;
}

async function getUsersInTenantWithRoles(accessToken: string, tenantId: string): Promise<PaginatedEntityResults<User>> {
  const tenantOverridesResponse = await fetch(`${WRISTBAND_API_URL}/tenants/${tenantId}/users`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  validateFetchResponseStatus(tenantOverridesResponse);

  // TODO: Make query to get the role for each user

  const data = await tenantOverridesResponse.json();
  return data as PaginatedEntityResults<User>;
}

async function getTenantRoles(accessToken: string, tenantId: string): Promise<PaginatedEntityResults<Role>> {
  const tenantOverridesResponse = await fetch(
    `${WRISTBAND_API_URL}/tenants/${tenantId}/roles?include_application_roles=true&fields=id,name,displayName`,
    {
      method: 'GET',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
    }
  );

  validateFetchResponseStatus(tenantOverridesResponse);

  const data = await tenantOverridesResponse.json();
  return data as PaginatedEntityResults<Role>;
}

async function inviteNewUser(
  accessToken: string,
  tenantId: string,
  email: string,
  roleToAssign: string
): Promise<void> {
  const changeResponse = await fetch(`${WRISTBAND_API_URL}/new-user-invitation/invite-user`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ tenantId, email, rolesToAssign: [roleToAssign] }),
  });

  validateFetchResponseStatus(changeResponse);
}

async function resolveTenantIdpOverrides(
  accessToken: string,
  tenantId: string
): Promise<ResolveEntityOverrideResults<IdentityProviderDto>> {
  // We'll just hard-code to Okta type for now for demo purposes. Wristband type will always be enabled.
  const tenantOverridesResponse = await fetch(
    `${WRISTBAND_API_URL}/tenants/${tenantId}/identity-providers/resolve-overrides?types=OKTA`,
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
    `${WRISTBAND_API_URL}/tenants/${tenantId}/identity-providers/resolve-redirect-urls`,
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
  const changeResponse = await fetch(`${WRISTBAND_API_URL}/change-email/request-email-change`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ userId, newEmail }),
  });

  validateFetchResponseStatus(changeResponse);
}

async function updateUser(accessToken: string, userId: string, userData: User): Promise<User> {
  const userResponse = await fetch(`${WRISTBAND_API_URL}/users/${userId}`, {
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
  const userResponse = await fetch(`${WRISTBAND_API_URL}/tenants/${tenantId}`, {
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
  const userResponse = await fetch(`${WRISTBAND_API_URL}/identity-providers?upsert=true`, {
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
  const response = await fetch(`${WRISTBAND_API_URL}/identity-provider-override-toggles?upsert=true`, {
    method: 'POST',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ ownerType: 'TENANT', ownerId: tenantId, status: 'ENABLED' }),
  });

  validateFetchResponseStatus(response);
}

const wristbandService = {
  cancelEmailChange,
  cancelNewUserInvite,
  changePassword,
  fetchTenants,
  getChangeEmailRequests,
  getNewUserInvitesInTenant,
  getTenant,
  getTenantRoles,
  getUser,
  getUsersInTenantWithRoles,
  inviteNewUser,
  requestEmailChange,
  resolveTenantIdpOverrides,
  resolveTenantIdpRedirectUrlOverrides,
  updateUser,
  updateTenant,
  upsertIdp,
  upsertIdpOverrideToggle,
};
export default wristbandService;
