import { IncomingMessage } from 'http';

import { Role, Tenant, TenantOption } from '@/types';
import { JSON_MEDIA_TYPE, PERK_PARTY_PROTOCOL, VIP_HOST_ROLE_NAME } from '@/utils/constants';
import { FetchError } from '@/error';
import { AxiosError } from 'axios';

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

export function isUnauthorizedError(error: unknown) {
  if (!error) {
    return false;
  }

  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }

  if (error instanceof FetchError) {
    return error.statusCode === 401;
  }

  return false;
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

export const isVipHostRole = (role: Role) => {
  const roleParts = role && role.name ? role.name.split(':') : [];
  return roleParts.length === 3 ? roleParts[2] === VIP_HOST_ROLE_NAME : false;
};

export const truncateDisplayString = (displayString: string = '', limit = 15) => {
  return displayString.length > limit ? displayString.slice(0, limit) + '...' : displayString;
};

export const updateTenantOption = (tenantOptions: TenantOption[], updatedTenant: Tenant) => {
  return tenantOptions.map((tenantOption) => {
    if (tenantOption.tenantId === updatedTenant.id) {
      return {
        ...tenantOption,
        tenantDisplayName: updatedTenant.displayName || '',
        tenantLogoUrl: updatedTenant.logoUrl || '',
      };
    }

    return tenantOption;
  });
};
