import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { FetchError } from '@/error';
import { isDuplicateNewEmail, isInvalidNewEmail } from '@/utils/validation';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleChangeEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, userId, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { newEmail } = req.body;
  if (!newEmail) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.requestEmailChange(accessToken!, userId!, newEmail);
    const changeEmailRequestResults = await wristbandService.getChangeEmailRequests(accessToken!, userId!);
    return res.status(200).json(changeEmailRequestResults);
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError) {
      if (err.statusCode === 400 && !!err.res) {
        const errorData = await err.res.json();

        if (isInvalidNewEmail(errorData)) {
          return res.status(400).json({ error: 'invalid_email' });
        }
        if (isDuplicateNewEmail(errorData)) {
          return res.status(400).json({ error: 'not_unique' });
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
