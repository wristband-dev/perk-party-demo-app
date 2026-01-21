import type { NextApiRequest, NextApiResponse } from 'next';

import { wristbandAuth } from '@/wristband';

export default async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // Redirect out to the Wristband authorize endpoint to start the login process via OAuth2/OIDC Auth Code flow.
    const authorizeUrl = await wristbandAuth.pagesRouter.login(req, res);
    res.redirect(authorizeUrl);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
