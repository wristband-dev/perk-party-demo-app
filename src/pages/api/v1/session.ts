import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from '@/session/iron-session';
import { isUnauthorizedError } from '@/utils/helpers';
import { TenantOption } from '@/types';
import wristbandService from '@/services/wristband-service';

export default async function sessionRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  const { accessToken, isAuthenticated, role, tenantId, userId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return res.status(401).end();
  }

  try {
    // Grab latest user and their metadata as that is where we store the perks they've redeemed
    const user = await wristbandService.getUser(accessToken, userId);
    const { applicationId, email } = user;

    // Grab latest tenant and their metadata as that is where enabled perk categories are stored
    const tenant = await wristbandService.getTenant(accessToken, tenantId);

    // Grab latest tenant options for the tenant switcher
    const fetchTenantsData = await wristbandService.fetchTenants(accessToken, applicationId!, email!);
    const tenantOptions: TenantOption[] = fetchTenantsData.items || [];
    const sortedTenantOptions = tenantOptions.sort((a, b) =>
      a.tenantDisplayName.toLowerCase().localeCompare(b.tenantDisplayName.toLowerCase())
    );

    return res.status(200).json({ role, user, tenant, tenantOptions: sortedTenantOptions });
  } catch (error) {
    console.log(error);

    if (isUnauthorizedError(error)) {
      return res.status(401).end();
    }

    // For all other error, return a 500 error.
    return res.status(500).end();
  }
}
