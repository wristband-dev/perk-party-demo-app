import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleUpdatePerkCategories(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { perkCategories } = req.body;
  if (!perkCategories) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    const updatedTenant = await wristbandService.updateTenant(accessToken!, tenantId!, {
      publicMetadata: { perkCategories },
    });
    return res.status(200).json(updatedTenant);
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
