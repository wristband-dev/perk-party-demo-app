import type { SessionData } from '@wristband/nextjs-auth';

/**
 * Custom session data type for this application.
 * Extends the base SessionData from the Wristband Next.js Auth SDK with app-specific fields.
 */
export interface WristbandSessionData extends SessionData {
  // Custom Fields
  role?: Role;
}

/**
 * Custom session metadata for Wristband React Client Auth SDK.
 * The metadata is accessible via the `useWristbandSession()` hook in React components.
 */
export type MySessionMetadata = {
  role: Role;
  user: User;
  tenant: Tenant;
  tenantOptions: TenantOption[];
};

export type EntityMetadata = {
  version: number;
  lastModifiedTime: string;
  creationTime: string;
  activationTime?: string;
  deactivationTime?: string;
  lastVerificationTime?: string;
};

export type TenantMetadata = {
  perkCategories?: string[];
};

export type Tenant = {
  id?: string;
  applicationId?: string;
  vanityDomain?: string;
  domainName?: string;
  displayName?: string;
  description?: string;
  logoUrl?: string | null;
  signupEnabled?: boolean;
  status?: string;
  publicMetadata?: TenantMetadata;
  restrictedMetadata?: object;
  metadata?: EntityMetadata;
};

export type Role = {
  id: string;
  name: string;
  displayName: string;
};

export type UserMetadata = {
  claimedPerks?: string[];
};

export type User = {
  id?: string;
  tenantId?: string;
  applicationId?: string;
  identityProviderName?: string;
  email?: string;
  emailVerified?: boolean;
  username?: string | null;
  fullName?: string | null;
  givenName?: string | null;
  middleName?: string | null;
  familyName?: string | null;
  nickname?: string | null;
  pictureURL?: string | null;
  gender?: string | null;
  birthdate?: string | null;
  timezone?: string | null;
  locale?: string | null;
  updatedAt?: string | null;
  publicMetadata?: UserMetadata;
  restrictedMetadata?: object;
  status?: string;
  roles?: Role[];
};

export type ChangeEmailRequest = {
  id: string;
  expirationTime: string;
  status: string;
  userId: string;
  tenantId: string;
  applicationId: string;
  newEmail: string;
  currentEmail: string;
  currentEmailVerified: boolean;
  externalIdpName: string;
  externalIdpDisplayName: string;
  externalIdpType: string;
  metadata: EntityMetadata;
};

export type ChangeEmailRequestResults = {
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  items: ChangeEmailRequest[];
};

type ConstraintViolationDetails = {
  code: string;
  constraintAttributes?: {
    [key: string]: string;
  };
};

export type WristbandRestError = {
  type: string;
  code: string;
  message: string;
  ticket: string;
  violations?: {
    [key: string]: ConstraintViolationDetails[];
  };
};

export interface IdpProtocolDto {
  type?: string;
  clientId?: string;
  clientSecret?: string;
  teamId?: string;
  serviceId?: string;
  keyId?: string;
  privateKey?: string;
  scopes?: string[];
}

export type IdentityProviderDto = {
  ownerType?: string;
  ownerId?: string;
  type?: string;
  name?: string;
  displayName?: string;
  domainName?: string;
  isExternal?: boolean;
  protocol?: IdpProtocolDto;
  jitProvisioningEnabled: boolean;
  status?: string;
  loginIdentifiers?: string[];
  loginFactors?: string[];
};

export type IdpRedirectUrl = {
  protocolType: string;
  redirectUrl: string;
  redirectDomainName: string;
};

export type IdpRedirectUrlConfig = {
  identityProviderType: string;
  redirectUrls: IdpRedirectUrl[];
};

export type ResolveIdpRedirectUrlOverridesResult = {
  items: IdpRedirectUrlConfig[];
};

export type ResolveEntityOverrideResult<T> = {
  item: T;
  isDefault: boolean;
};

export type ResolveEntityOverrideResults<T> = {
  items: ResolveEntityOverrideResult<T>[];
};

export type PaginatedEntityResults<T> = {
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  items: T[];
};

export type NewUserInvite = {
  id: string;
  expirationTime: string;
  status: string;
  tenantId: string;
  applicationId: string;
  email: string;
  rolesToAssign: string[];
  externalIdpRequestStatus: string;
  externalIdpName: string;
  externalIdpDisplayName: string;
  externalIdpType: string;
  metadata?: EntityMetadata;
};

export type TenantOption = {
  tenantId: string;
  tenantVanityDomain: string;
  tenantDomainName: string;
  tenantDisplayName: string;
  tenantLoginUrl: string;
  tenantLogoUrl?: string;
};
