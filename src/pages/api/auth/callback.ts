import type { NextApiRequest, NextApiResponse } from 'next';
import { CallbackResultType } from '@wristband/nextjs-auth';

import { getSession } from '@/session/iron-session';
import { bearerAuthFetchHeaders, parseUserinfo } from '@/utils/helpers';
import { PERKPARTY_HOST, IS_LOCALHOST } from '@/utils/constants';
import wristbandAuth from '@/wristband-auth';
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
    session.tenantDomainName = callbackData!.tenantDomainName;

    // Grab metadata for the user as that is where we store the perks they've redeemed
    const userResponse = await fetch(
      `https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${callbackData!.userinfo.sub}?fields=publicMetadata`,
      {
        method: 'GET',
        headers: bearerAuthFetchHeaders(callbackData!.accessToken),
        keepalive: true,
      }
    );
    if (userResponse.status !== 200) {
      return res.status(500).end();
    }
    const user = await userResponse.json();
    session.user.publicMetadata = user.publicMetadata;

    // Grab metadata for the tenant as that is where enabled perk categories are stored
    const tenantResponse = await fetch(
      `https://${process.env.APPLICATION_DOMAIN}/api/v1/tenants/${callbackData!.userinfo.tnt_id}?fields=publicMetadata`,
      {
        method: 'GET',
        headers: bearerAuthFetchHeaders(callbackData!.accessToken),
        keepalive: true,
      }
    );
    if (userResponse.status !== 200) {
      return res.status(500).end();
    }
    const tenant = await tenantResponse.json();
    session.tenantMetadata = tenant.publicMetadata;

    // Save all fields into the session
    await session.save();

    // Send the user back to the Invotastic application.
    const tenantDomain = IS_LOCALHOST ? '' : `${callbackData!.tenantDomainName}.`;
    res.redirect(callbackData!.returnUrl || `http://${tenantDomain}${PERKPARTY_HOST}`);
  } catch (error: unknown) {
    console.error(error);
  }
}
