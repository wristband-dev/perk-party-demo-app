import { createWristbandAuth } from '@wristband/nextjs-auth';

import { PERK_PARTY_PROTOCOL, PERKPARTY_HOST } from '@/utils/constants';

const tenantDomain = process.env.DOMAIN_FORMAT === 'VANITY_DOMAIN' ? '{tenant_domain}.' : '';

const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  // NOTE: If deploying your own app to production, do not disable secure cookies.
  dangerouslyDisableSecureCookies: process.env.PUBLIC_DEMO !== 'ENABLED',
  loginStateSecret: '7ffdbecc-ab7d-4134-9307-2dfcc52f7475',
  loginUrl: `${PERK_PARTY_PROTOCOL}://${tenantDomain}${PERKPARTY_HOST}/api/auth/login`,
  redirectUri: `${PERK_PARTY_PROTOCOL}://${tenantDomain}${PERKPARTY_HOST}/api/auth/callback`,
  rootDomain: PERKPARTY_HOST,
  scopes: ['openid', 'offline_access', 'profile', 'email', 'roles'],
  useCustomDomains: false,
  useTenantSubdomains: process.env.DOMAIN_FORMAT === 'VANITY_DOMAIN',
  wristbandApplicationDomain: process.env.APPLICATION_DOMAIN!,
});

export default wristbandAuth;
