/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/session/iron-session';
import { FetchError } from '@/error';
import wristbandService from '@/services/wristband-service';
import { isInvalidDomainName } from '@/utils/validation';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleUpsertIdp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken, tenantId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { idp } = req.body;
  if (!idp) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.upsertIdpOverrideToggle(accessToken, tenantId);
    const upsertedIdp = await wristbandService.upsertIdp(accessToken, idp);
    return res.status(200).json(upsertedIdp);
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError) {
      if (err.statusCode === 400 && !!err.res) {
        const errorData = await err.res.json();

        if (isInvalidDomainName(errorData)) {
          return res.status(400).json({ error: 'invalid_domain_name' });
        }

        return res.status(500).end();
      }
      if (isUnauthorizedError(err)) {
        return res.status(401).end();
      }
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
