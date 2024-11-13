import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/session/iron-session';
import { FetchError } from '@/error';
import wristbandService from '@/services/wristband-service';
import { isPasswordBreached } from '@/utils/validation';
import { isUnauthorizedError } from '@/utils/helpers';

export default async function handleChangePassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, userId, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.changePassword(accessToken, { userId, currentPassword, newPassword });
    return res.status(204).end();
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError) {
      if (err.statusCode === 400 && !!err.res) {
        const errorData = await err.res.json();
        return isPasswordBreached(errorData)
          ? res.status(400).json({ error: 'password_breached' })
          : res.status(500).end();
      }
      if (isUnauthorizedError(err)) {
        return res.status(401).end();
      }
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
