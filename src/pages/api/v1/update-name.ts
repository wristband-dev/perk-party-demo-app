import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/wristband';
import wristbandService from '@/services/wristband-service';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleUpdateName(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, userId, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { fullName } = req.body;
  if (!fullName) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    const user = await wristbandService.updateUser(accessToken!, userId!, { fullName });
    return res.status(200).json(user);
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
