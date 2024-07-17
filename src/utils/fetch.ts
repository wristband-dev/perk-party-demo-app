import { JSON_MEDIA_TYPE } from '@/utils/constants';
export function bearerAuthFetchHeaders(accessToken: string) {
    return { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE, Authorization: `Bearer ${accessToken}` };
}