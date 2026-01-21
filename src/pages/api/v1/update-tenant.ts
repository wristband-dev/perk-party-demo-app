import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { FetchError } from '@/error';
import { isInvalidTenantLogoUrl } from '@/utils/validation';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleUpdateTenant(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    const updatedTenant = await wristbandService.updateTenant(accessToken!, tenantId!, { ...req.body });
    return res.status(200).json(updatedTenant);
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    if (err instanceof FetchError && err.statusCode === 400 && !!err.res) {
      const errorData = await err.res.json();
      return isInvalidTenantLogoUrl(errorData)
        ? res.status(400).json({ error: 'invalid_logo_url' })
        : res.status(500).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
