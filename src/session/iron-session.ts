import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import * as http from 'http';

import { SESSION_COOKIE_NAME, SESSION_COOKIE_SECRET } from '@/utils/constants';

type SessionData = {
  accessToken: string;
  expiresAt: number;
  isAuthenticated: boolean;
  refreshToken?: string;
  tenantDomainName: string;
  tenantId: string;
  userId: string;
};

const sessionOptions: SessionOptions = {
  cookieName: SESSION_COOKIE_NAME,
  password: SESSION_COOKIE_SECRET,
  cookieOptions: {
    httpOnly: true,
    maxAge: 1800,
    path: '/',
    sameSite: 'lax',
    secure: process.env.PUBLIC_DEMO === 'ENABLED',
  },
};

export function getSession(
  req: http.IncomingMessage | Request,
  res: http.ServerResponse | Response
): Promise<IronSession<SessionData>> {
  return getIronSession(req, res, sessionOptions);
}
