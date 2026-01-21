import type { NextApiRequest, NextApiResponse } from 'next';

import wristbandService from '@/services/wristband-service';
import { isUnauthorizedError } from '@/utils/helpers';
import { getSession } from '@/wristband';

export default async function handleActivateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.updateUser(accessToken!, userId, { status: 'ACTIVE' });
    const results = await wristbandService.getUsersInTenantWithRoles(accessToken!, tenantId!);
    return res.status(200).json({ users: results.items });
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
