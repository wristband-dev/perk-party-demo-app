import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession, wristbandAuth } from '@/wristband';

export default async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    const session = await getSession(req, res);
    const logoutUrl = await wristbandAuth.pagesRouter.logout(req, res, {
      refreshToken: session.refreshToken,
      tenantCustomDomain: session.tenantCustomDomain,
      tenantName: session.tenantName,
    });

    // Always destroy session.
    session.destroy();
    res.redirect(logoutUrl);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).end();
  }
}
