import type { NextApiRequest, NextApiResponse } from 'next';
import wristbandAuth from '@/wristband-auth';

import { getSession } from '@/session/iron-session';
import { bearerAuthFetchHeaders } from '@/utils/helpers';

export default async function sessionRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  const { accessToken, expiresAt, isAuthenticated, refreshToken, tenantDomainName, user } = session;

  if (!isAuthenticated) {
    return res.status(200).json({
      isAuthenticated,
      user: null,
      tenantDomainName: null,
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
  } catch (error) {
    console.log(`Token refresh failed: `, error);
    return res.status(401).end();
  }

  // Grab latest user and their metadata as that is where we store the perks they've redeemed
  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${user.id}`, {
    method: 'GET',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });
  if (userResponse.status !== 200) {
    return res.status(500).end();
  }
  const latestUser = await userResponse.json();
  session.user = latestUser;

  // Grab metadata for the tenant as that is where enabled perk categories are stored
  const tenantResponse = await fetch(
    `https://${process.env.APPLICATION_DOMAIN}/api/v1/tenants/${user.tenantId}`,
    {
      method: 'GET',
      headers: bearerAuthFetchHeaders(accessToken),
      keepalive: true,
    }
  );
  if (userResponse.status !== 200) {
    return res.status(500).end();
  }
  const latestTenant = await tenantResponse.json();
  session.tenant = latestTenant;

  // Save all fields into the session
  await session.save();

  return res
    .status(200)
    .json({ isAuthenticated, user: latestUser, tenantDomainName, tenant: latestTenant });
}
