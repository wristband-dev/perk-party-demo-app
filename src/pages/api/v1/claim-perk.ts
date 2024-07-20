import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/session/iron-session';
import { bearerAuthFetchHeaders } from '@/utils/helpers';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getSession(req, res);
  const { isAuthenticated, user, accessToken } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${user.id}`, {
    method: 'PATCH',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
  });

  // not authenticated -> send to login
  if (userResponse.status == 401) {
    return res.status(401).end();
  }
  if (userResponse.status !== 200) {
    console.log(`Update user failed. Status: [${userResponse.status}], Message: [${userResponse.statusText}]`);
    return res.status(500).end();
  }

  const data = await userResponse.json();
  return res.status(200).json(data);
}
