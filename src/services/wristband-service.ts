import { bearerAuthFetchHeaders } from '@/utils/helpers';

export async function getTenant(accessToken: string, tenantId: string) {
  const res = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/tenants/${tenantId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  if (res.status !== 200) {
    throw new Error(`Get tenant failed. Status: [${res.status}], Message: [${res.statusText}]`);
  }

  const data = await res.json();
  return data;
}
