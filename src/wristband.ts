import * as http from 'http';
import { createWristbandAuth, getPagesRouterSession, SessionOptions } from '@wristband/nextjs-auth';

import { WristbandSessionData } from '@/types';
import { CSRF_TOKEN_HEADER_NAME } from '@/utils/constants';

export const wristbandAuth = createWristbandAuth({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  wristbandApplicationVanityDomain: process.env.APPLICATION_DOMAIN!,
  dangerouslyDisableSecureCookies: process.env.PUBLIC_DEMO !== 'ENABLED',
  scopes: ['openid', 'offline_access', 'profile', 'email', 'roles'],
});

const sessionOptions: SessionOptions = {
  secrets: 'dummy-value-463a-812c-0d8db87c0ec5c1',
  secure: process.env.PUBLIC_DEMO === 'ENABLED',
  enableCsrfProtection: true,
};

export const requireMiddlewareAuth = wristbandAuth.createMiddlewareAuth<WristbandSessionData>({
  authStrategies: ['SESSION'],
  sessionConfig: { sessionOptions, csrfTokenHeaderName: CSRF_TOKEN_HEADER_NAME },
  protectedApis: ['/api/v1(.*)'],
  protectedPages: ['/admin', '/settings'],
});

/**
 * Retrieves session from Pages Router API routes and SSR functions.
 *
 * Use in:
 * - API Route Handlers
 * - getServerSideProps
 */
export function getSession(req: http.IncomingMessage, res: http.ServerResponse) {
  return getPagesRouterSession<WristbandSessionData>(req, res, sessionOptions);
}
