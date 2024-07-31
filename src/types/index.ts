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
  roles?: Role[];
};

export type Userinfo = {
  sub: string;
  tnt_id: string;
  app_id: string;
  idp_name: string;
  email: string;
  email_verified: boolean;
  preferred_username: string | null;
  name: string | null;
  given_name: string | null;
  middle_name: string | null;
  family_name: string | null;
  nickname: string | null;
  picture: string | null;
  gender: string | null;
  birthdate: string | null;
  zoneinfo: string | null;
  locale: string | null;
  updated_at: string | null;
  roles: Role[];
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
