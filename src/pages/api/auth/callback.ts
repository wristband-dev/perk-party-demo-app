import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/utils/iron-session';
import { parseUserinfo } from '@/utils/helpers';
import { PERKPARTY_HOST, IS_LOCALHOST } from '@/utils/constants';
import { callback } from '@/utils/server-auth';

export default async function handleCallback(req: NextApiRequest, res: NextApiResponse) {
  try {
    /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
    // After the user authenticates, exchange the incoming authorization code for JWTs and also retrieve userinfo.
    console.log('REACHED CALLBACK!!!');
    const callbackData = await callback(req, res);
    console.log('CALLBACK DATA: ', callbackData);

    if (!callbackData) {
      console.log('NO CALLBACK DATA... RETURN');
      return;
    }

    // Save any necessary fields for the user's app session into a session cookie.
    const session = await getSession(req, res);
    session.isAuthenticated = true;
    session.accessToken = callbackData.accessToken;
    // Convert the "expiresIn" seconds into an expiration date with the format of milliseconds from the epoch.
    session.expiresAt = Date.now() + callbackData.expiresIn * 1000;
    session.refreshToken = callbackData.refreshToken;
    session.user = parseUserinfo(callbackData.userinfo);
    session.tenantDomainName = callbackData.tenantDomainName;
    console.log('SESSION: ', session);

    await session.save();

    // Send the user back to the Perk Party application.
    const tenantDomain = IS_LOCALHOST ? '' : `${callbackData.tenantDomainName}.`;
    console.log('TENANT DOMAIN: ', tenantDomain);
    console.log('REDIRECT: ', `http://${tenantDomain}${PERKPARTY_HOST}`);
    res.redirect(callbackData.returnUrl || `http://${tenantDomain}${PERKPARTY_HOST}`);
  } catch (error: unknown) {
    console.error(error);
  }
}
