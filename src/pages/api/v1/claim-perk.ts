import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleClaimPerk(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  const { isAuthenticated, userId, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { claimedPerks } = req.body;
  if (!claimedPerks) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    const user = await wristbandService.updateUser(accessToken!, userId!, { publicMetadata: { claimedPerks } });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
