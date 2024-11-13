import frontendApiClient from '@/client/frontend-api-client';
import { IdentityProviderDto, Tenant } from '@/types';

async function activateUser(userId: string) {
  const response = await frontendApiClient.patch(`/activate-user`, { userId });
  return response.data;
}

async function cancelChangeEmail(changeEmailRequestId: string) {
  await frontendApiClient.post(`/cancel-change-email`, { changeEmailRequestId });
}

async function cancelNewUserInvite(newUserInvitationRequestId: string) {
  const response = await frontendApiClient.post(`/cancel-new-user-invite`, { newUserInvitationRequestId });
  return response.data;
}

async function changeEmail(newEmail: string) {
  const response = await frontendApiClient.post(`/change-email`, { newEmail });
  return response.data;
}

async function changePassword(currentPassword: string, newPassword: string) {
  const response = await frontendApiClient.post(`/change-password`, { currentPassword, newPassword });
  return response.data;
}

async function claimPerk(perkId: string, claimedPerks: string[]) {
  const response = await frontendApiClient.patch(`/claim-perk`, { claimedPerks: [...claimedPerks, perkId] });
  return response.data;
}

async function deactivateUser(userId: string) {
  const response = await frontendApiClient.patch(`/deactivate-user`, { userId });
  return response.data;
}

async function getSession() {
  const response = await frontendApiClient.get(`/session`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
  return response.data;
}

async function inviteNewUser(inviteEmail: string, roleName: string) {
  const response = await frontendApiClient.post(`/invite-new-user`, { inviteEmail, roleName });
  return response.data;
}

async function updateFullName(fullName: string) {
  const response = await frontendApiClient.post(`/update-name`, { fullName });
  return response.data;
}

async function updateTenant(tenant: Tenant) {
  const response = await frontendApiClient.patch(`/update-tenant`, tenant);
  return response.data;
}

async function upsertIdp(idp: IdentityProviderDto) {
  const response = await frontendApiClient.post(`/upsert-idp`, { idp });
  return response.data;
}

const frontendApiService = {
  activateUser,
  cancelChangeEmail,
  cancelNewUserInvite,
  changeEmail,
  changePassword,
  claimPerk,
  deactivateUser,
  getSession,
  inviteNewUser,
  updateFullName,
  updateTenant,
  upsertIdp,
};
export default frontendApiService;
