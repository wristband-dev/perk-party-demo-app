import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/session/iron-session';
import wristbandService from '@/services/wristband-service';
import { FetchError } from '@/error';

export default async function handleCancelChangeEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { isAuthenticated, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const { newUserInvitationRequestId } = req.body;
  if (!newUserInvitationRequestId) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  try {
    await wristbandService.cancelEmailChange(accessToken, newUserInvitationRequestId);
    return res.status(204).end();
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError && err.statusCode === 401) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
