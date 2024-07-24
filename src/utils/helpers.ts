import { IncomingMessage } from 'http';

import { User, Userinfo } from '@/types';
import { JSON_MEDIA_TYPE, PERK_PARTY_PROTOCOL } from '@/utils/constants';
import { FetchError } from '@/error';

export function bearerAuthFetchHeaders(accessToken: string) {
  return { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE, Authorization: `Bearer ${accessToken}` };
}

export function validateFetchResponseStatus(response: Response) {
  switch (response.status) {
    case 200:
    case 201:
    case 204:
      break;
    case 400:
      throw new FetchError<Response>(400, 'Bad Request', response);
    case 401:
      throw new FetchError(401, 'Unauthorized');
    default:
      throw new FetchError(
        500,
        `URL: [${response.url}], Status: [${response.status}], Message: [${response.statusText}]`
      );
  }
}

export function clientRedirectToLogin(returnUrl?: string) {
  if (!!window) {
    if (returnUrl) {
      const queryParams = new URLSearchParams({ return_url: encodeURI(returnUrl) }).toString();
      window.location.href = `${window.location.origin}/api/auth/login?${queryParams}`;
    } else {
      window.location.href = `${window.location.origin}/api/auth/login`;
    }
  }
}

export function clientRedirectToLogout() {
  if (!!window) {
    window.location.href = `${window.location.origin}/api/auth/logout`;
  }
}

export function serverRedirectToLogin(req: IncomingMessage) {
  const { headers, url } = req;
  const returnUrl = `${PERK_PARTY_PROTOCOL}://${headers.host}${url}`;
  return {
    redirect: {
      destination: `${PERK_PARTY_PROTOCOL}://${headers.host}/api/auth/login?return_url=${returnUrl}`,
      permanent: false,
    },
  };
}

export function parseUserinfo(userinfo: Userinfo): User {
  return {
    id: userinfo.sub,
    tenantId: userinfo.tnt_id,
    applicationId: userinfo.app_id,
    identityProviderName: userinfo.idp_name,
    email: userinfo.email,
    emailVerified: userinfo.email_verified,
    username: userinfo.preferred_username,
    fullName: userinfo.name,
    givenName: userinfo.given_name,
    middleName: userinfo.middle_name,
    familyName: userinfo.family_name,
    nickname: userinfo.nickname,
    pictureURL: userinfo.picture,
    gender: userinfo.gender,
    birthdate: userinfo.birthdate,
    timezone: userinfo.zoneinfo,
    locale: userinfo.locale,
    updatedAt: userinfo.updated_at,
    roles: userinfo.roles,
  };
}
