import type { NextApiRequest, NextApiResponse } from 'next';
import { CallbackResultType } from '@wristband/nextjs-auth';
import wristbandAuth from '@/wristband-auth';
import { getSession } from '@/session/iron-session';
import { parseUserinfo } from '@/utils/helpers';
import { PERKPARTY_HOST, IS_LOCALHOST, PERK_PARTY_PROTOCOL } from '@/utils/constants';

import { Userinfo } from '@/types';

export default async function handleCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // After the user authenticates, exchange the incoming authorization code for JWTs and also retrieve userinfo.
    const callbackResult = await wristbandAuth.pageRouter.callback(req, res);
    const { callbackData, redirectUrl, result } = callbackResult;

    if (result === CallbackResultType.REDIRECT_REQUIRED) {
      res.redirect(redirectUrl!);
      return;
    }

    // Save any necessary fields for the user's app session into a session cookie.
    const session = await getSession(req, res);
    session.isAuthenticated = true;
    session.accessToken = callbackData!.accessToken;
    // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
    session.expiresAt = Date.now() + callbackData!.expiresIn * 1000;
    session.refreshToken = callbackData!.refreshToken;
    session.user = parseUserinfo(callbackData!.userinfo as Userinfo);

    // Save all fields into the session
    await session.save();

    // Send the user back to the Invotastic application.
    const tenantDomain = IS_LOCALHOST ? '' : `${callbackData!.tenantDomainName}.`;
    res.redirect(callbackData!.returnUrl || `${PERK_PARTY_PROTOCOL}://${tenantDomain}${PERKPARTY_HOST}`);
  } catch (error: unknown) {
    console.error(error);
  }
}
