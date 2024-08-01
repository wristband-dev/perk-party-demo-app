import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/session/iron-session';
import wristbandService from '@/services/wristband-service';
import { FetchError } from '@/error';

export default async function handleInviteNewUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { inviteEmail, roleName } = req.body;
  if (!inviteEmail || !roleName) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    const roleResults = await wristbandService.getTenantRoles(accessToken, tenantId);
    const { items: roles } = roleResults;
    const role = roles.find((role) => role.displayName === roleName);
    await wristbandService.inviteNewUser(accessToken, tenantId, inviteEmail, role?.id || 'Party Animal');
    const results = await wristbandService.getNewUserInvitesInTenant(accessToken, tenantId);
    return res.status(200).json({ invites: results.items });
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError && err.statusCode === 401) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
