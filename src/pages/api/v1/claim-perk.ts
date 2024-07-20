import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/session/iron-session';
import { bearerAuthFetchHeaders } from '@/utils/helpers';

type Data = { message: string };

export default async function handleClaimPerk(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await getSession(req, res);
  const { isAuthenticated, user, accessToken } = session;
  const publicMetadata  = user.publicMetadata || {}; // get meta data, if null then pass empty object
  const claimedPerks = publicMetadata.claimedPerks || [] // get claimed perks array, if null then empty array

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  console.log(req.body.perkId)

  if (!req.body.perkId) {
    return res.status(400).end(); // bad request error (internal developer bug)
  }

  // if perk is not already claimed
  if (claimedPerks.indexOf(req.body.perkId) === -1) {
    // append id from front end api body
    claimedPerks.push(req.body.perkId) 
  }

  const userResponse = await fetch(`https://${process.env.APPLICATION_DOMAIN}/api/v1/users/${user.id}`, {
    method: 'PATCH',
    headers: bearerAuthFetchHeaders(accessToken),
    keepalive: true,
    body: JSON.stringify({ publicMetadata: { claimedPerks } })
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
  session.user = data; // set the user (server side)
  await session.save();
  return res.status(200).json(data);
}
