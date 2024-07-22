import { ChangeEmailRequestResults, Tenant, User } from '@/types';
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

const wristbandService = {
  cancelEmailChange,
  changePassword,
  getChangeEmailRequests,
  getTenant,
  requestEmailChange,
  updateUser,
};
export default wristbandService;
