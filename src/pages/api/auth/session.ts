import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/session/iron-session';

export default async function sessionRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  const { isAuthenticated, tenantDomainName, user, tenantMetadata } = session;

  if (!isAuthenticated) {
    return res.status(200).json({
      isAuthenticated,
      user: null,
      tenantDomainName: null,
      tenantMetadata: null,
    });
  }

  return res.status(200).json({ isAuthenticated, user, tenantDomainName, tenantMetadata });
}
