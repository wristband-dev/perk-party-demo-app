import type { NextApiRequest, NextApiResponse } from 'next';
import wristbandAuth from '@/wristband-auth';

import { getSession } from '@/session/iron-session';
import { bearerAuthFetchHeaders } from '@/utils/helpers';
import { TenantOptionsList } from '@/types';

export default async function sessionRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  const { accessToken, expiresAt, isAuthenticated, refreshToken, role, tenantId, userId } = session;

  if (!isAuthenticated) {
    return res.status(200).json({
      isAuthenticated,
      role: null,
      user: null,
      tenant: null,
    });
  }

  // Need to make sure the access token is not expired since the middleware doesn't handle it for the session API.
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const tokenData = await wristbandAuth.refreshTokenIfExpired(refreshToken!, expiresAt);
    if (tokenData) {
      // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
      session.expiresAt = Date.now() + tokenData.expiresIn * 1000;
      session.accessToken = tokenData.accessToken;
      session.refreshToken = tokenData.refreshToken;
    }
    // Save all fields into the session
    await session.save();
  } catch (error) {
    console.log(`Token refresh failed: `, error);
    return res.status(401).end();
  }

  // Grab latest user and their metadata as that is where we store the perks they've redeemed
  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${userId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });
  if (userResponse.status !== 200) {
    return res.status(500).end();
  }
  const user = await userResponse.json();
  const { applicationId, email } = user;

  // Grab latest tenant and their metadata as that is where enabled perk categories are stored
  const tenantResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/tenants/${tenantId}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });
  if (userResponse.status !== 200) {
    return res.status(500).end();
  }
  const tenant = await tenantResponse.json();

  // Grab latest tenant options for the tenant switcher
  const fetchTenantsResponse = await fetch(
    `https://${process.env.APPLICATION_DOMAIN}/api/v1/tenant-discovery/fetch-tenants`,
    {
      method: 'POST',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
      body: JSON.stringify({ applicationId, email, clientId: process.env.CLIENT_ID }),
    }
  );
  if (fetchTenantsResponse.status !== 200) {
    return res.status(500).end();
  }
  const fetchTenantsData = await fetchTenantsResponse.json();
  const tenantOptions: TenantOptionsList = fetchTenantsData.items || [];
  const sortedTenantOptions = tenantOptions.sort((a, b) =>
    a.tenantDisplayName.toLowerCase().localeCompare(b.tenantDisplayName.toLowerCase())
  );

  return res.status(200).json({ isAuthenticated, role, user, tenant, tenantOptions: sortedTenantOptions });
}
