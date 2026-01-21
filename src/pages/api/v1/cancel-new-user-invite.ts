import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleCancelNewUserInvite(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { newUserInvitationRequestId } = req.body;
  if (!newUserInvitationRequestId) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.cancelNewUserInvite(accessToken!, newUserInvitationRequestId);
    const results = await wristbandService.getNewUserInvitesInTenant(accessToken!, tenantId!);
    return res.status(200).json({ invites: results.items });
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
