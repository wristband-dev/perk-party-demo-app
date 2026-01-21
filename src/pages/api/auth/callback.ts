import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession, wristbandAuth } from '@/wristband';
import { PERKPARTY_HOST, IS_LOCALHOST, PERK_PARTY_PROTOCOL } from '@/utils/constants';

const PARTY_ANIMAL_ROLE = { id: '', name: 'app:app:party-animal', displayName: 'Party Animal' };

export default async function handleCallback(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // After the user authenticates, exchange the incoming authorization code for JWTs and also retrieve userinfo.
    const callbackResult = await wristbandAuth.pagesRouter.callback(req, res);
    const { callbackData, redirectUrl, type } = callbackResult;

    if (type === 'redirect_required') {
      res.redirect(redirectUrl);
      return;
    }

    // Save all fields into the session
    const session = await getSession(req, res);
    const { roles } = callbackData.userinfo;
    session.fromCallback(callbackData, { role: roles && roles.length > 0 ? roles[0] : PARTY_ANIMAL_ROLE });
    await session.save();

    // Send the user back to the application.
    const tenantDomain = IS_LOCALHOST ? '' : `${callbackData.tenantName}.`;
    res.redirect(callbackData!.returnUrl || `${PERK_PARTY_PROTOCOL}://${tenantDomain}${PERKPARTY_HOST}`);
  } catch (error: unknown) {
    console.error(error);
  }
}
