import { NextRequest } from 'next/server';

import { requireMiddlewareAuth } from '@/wristband';

export async function proxy(request: NextRequest) {
  return await requireMiddlewareAuth(request);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /_next (Next.js internals)
   * 2. /fonts (inside /public)
   * 3. /examples (inside /public)
   * 4. all root files inside /public (e.g. /favicon.ico)
   */
  matcher: ['/((?!_next|fonts|examples|[\\w-]+\\.\\w+).*)'],
};
