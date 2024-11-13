import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FaCopy, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import copy from 'copy-to-clipboard';

import { useWristband } from '@/context/auth-context';
import {
  clientRedirectToLogin,
  isUnauthorizedError,
  isVipHostRole,
  serverRedirectToLogin,
  updateTenantOption,
} from '@/utils/helpers';
import { toastSuccess, toastError } from '@/utils/toast';
import WristbandBadge from '@/components/wristband-badge';
import { getSession } from '@/session/iron-session';
import wristbandService from '@/services/wristband-service';
import { IdentityProviderDto, NewUserInvite, Tenant, User } from '@/types';
import { ralewayFont } from '@/utils/fonts';
import { useApiTouchpoints } from '@/context/api-touchpoint-context';
import frontendApiService from '@/services/frontend-api-service';
import { AxiosError } from 'axios';

type Props = {
  invites: NewUserInvite[];
  oktaIdp: IdentityProviderDto | null;
  oktaRedirectUrl: string | null;
  users: User[];
};

export default function AdminPage({ oktaIdp, oktaRedirectUrl, users, invites }: Props) {
  // Contexts
  const { setTenant, setTenantOptions, tenant, tenantOptions, user: loggedInUser } = useWristband();
  const { showApiTouchpoints } = useApiTouchpoints();

  // Perk Category State
  // const [isAllSelected, setAllSelected] = useState<boolean>(false);
  // const [isThrillEnabled, setThrillEnabled] = useState<boolean>(false);
  // const [isTravelEnabled, setTravelEnabled] = useState<boolean>(false);
  // const [isRelaxEnabled, setRelaxEnabled] = useState<boolean>(false);
  // const [isFoodEnabled, setFoodEnabled] = useState<boolean>(false);
  // const [isPerkUpdateInProgress, setPerkUpdateInProgress] = useState<boolean>(false);

  // Company Details Form State
  const [tenantDisplayName, setTenantDisplayName] = useState<string>('');
  const [tenantLogoUrl, setTenantLogoUrl] = useState<string>('');
  const [isUpdateTenantInProgress, setIsUpdateTenantInProgress] = useState<boolean>(false);

  // Invite User State
  const [currentInvites, setCurrentInvites] = useState<NewUserInvite[]>(invites);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('Party Animal');
  const [isInviteEmailInProgress, setIsInviteEmailInProgress] = useState<boolean>(false);
  const [isCancelInviteInProgress, setIsCancelInviteInProgress] = useState<boolean>(false);

  // User State Session
  const [currentUsers, setCurrentUsers] = useState<User[]>(users);
  const [isActivateUserInProgress, setActivateUserInProgress] = useState<boolean>(false);
  const [isDeactivateUserInProgress, setDeactivateUserInProgress] = useState<boolean>(false);

  // Okta IDP State
  const [isOktaIdpInProgress, setOktaIdpInProgress] = useState<boolean>(false);
  const [currentOktaIdp, setCurrentOktaIdp] = useState<IdentityProviderDto | null>(oktaIdp);
  const [domainName, setDomainName] = useState<string>(oktaIdp?.domainName || '');
  const [clientId, setClientId] = useState<string>(oktaIdp?.protocol?.clientId || '');
  const [clientSecret, setClientSecret] = useState<string>(oktaIdp?.protocol?.clientSecret || '');
  // We set to true in the event they haven't created the IDP yet.
  const [isOktaEnabled, setIsOktaEnabled] = useState<boolean>(oktaIdp ? oktaIdp.status === 'ENABLED' : true);
  const [showClientSecret, setShowClientSecret] = useState<boolean>(false);

  // Initialize the state with the Tenant's metadata when the page first loads in the browser
  // useEffect(() => {
  //   if (tenant) {
  //     const publicMetaData = tenant.publicMetadata || {};
  //     const perkCategories = publicMetaData.perkCategories || [];
  //     setThrillEnabled(perkCategories.includes('thrill'));
  //     setTravelEnabled(perkCategories.includes('travel'));
  //     setRelaxEnabled(perkCategories.includes('relax'));
  //     setFoodEnabled(perkCategories.includes('food'));
  //   }
  // }, [tenant]);

  // Check if all categories are selected
  // useEffect(() => {
  //   setAllSelected(isThrillEnabled && isTravelEnabled && isRelaxEnabled && isFoodEnabled);
  // }, [isThrillEnabled, isTravelEnabled, isRelaxEnabled, isFoodEnabled]);

  // We need this here to ensure the existing tenant values in the form inputs when the page loads.
  useEffect(() => {
    setTenantDisplayName(tenant.displayName || '');
    setTenantLogoUrl(tenant.logoUrl || '');
  }, [tenant]);

  const handleTenantDisplayNameSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsUpdateTenantInProgress(true);

    try {
      const data: Tenant = await frontendApiService.updateTenant({
        displayName: tenantDisplayName,
        logoUrl: tenantLogoUrl || null,
      });
      setTenant(data);
      setTenantOptions(updateTenantOption(tenantOptions, data));
      toastSuccess('Nice work! Your updated company info is ready to confuse future interns.', '🤓');
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      if (error instanceof AxiosError && error.response?.status === 400) {
        if (error.response?.data.error === 'invalid_logo_url') {
          toastError(`Bouncer's not impressed... that logo's not quite "club-ready".`, '🚪');
          return;
        }
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsUpdateTenantInProgress(false);
    }
  };

  // Invite New User
  const handleInviteNewUser = async (e: SyntheticEvent) => {
    e.preventDefault(); // stops javascript submit events
    setIsInviteEmailInProgress(true);

    try {
      const data = await frontendApiService.inviteNewUser(inviteEmail, selectedRole);
      setCurrentInvites(data.invites);
      setInviteEmail('');
      setSelectedRole('Party Animal');
      toastSuccess("Perk Party’s about to get wild. Hopefully you didn't invite a party pooper!", '🥳');
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsInviteEmailInProgress(false);
    }
  };

  // Deactivate User
  const handleDeactivateUser = async (e: SyntheticEvent, userId: string) => {
    e.preventDefault(); // stops javascript submit events
    setDeactivateUserInProgress(true);

    try {
      const data = await frontendApiService.deactivateUser(userId);
      setCurrentUsers(data.users);
      toastSuccess("User deactivated. Looks like someone's getting a breather in the drunk tank! ", '😴');
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setDeactivateUserInProgress(false);
    }
  };

  // Activate User
  const handleActivateUser = async (e: SyntheticEvent, userId: string) => {
    e.preventDefault(); // stops javascript submit events
    setActivateUserInProgress(true);

    try {
      const data = await frontendApiService.activateUser(userId);
      setCurrentUsers(data.users);
      toastSuccess('The life of the party is back in action. Raise the roof!', '🎊');
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setActivateUserInProgress(false);
    }
  };

  // Cancel Invite
  const handleCancelNewUserInvite = async (e: SyntheticEvent, newUserInvitationRequestId: string) => {
    e.preventDefault();
    setIsCancelInviteInProgress(true);

    try {
      const data = await frontendApiService.cancelNewUserInvite(newUserInvitationRequestId);
      setCurrentInvites(data.invites);
      toastSuccess('Invite canceled. Guess the bouncer saw that person as a party foul waiting to happen!', '👀');
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsCancelInviteInProgress(false);
    }
  };

  // const handleAllPerksChange = () => {
  //   const allChecked = !isAllSelected;
  //   setAllSelected(allChecked);
  //   setThrillEnabled(allChecked);
  //   setTravelEnabled(allChecked);
  //   setRelaxEnabled(allChecked);
  //   setFoodEnabled(allChecked);
  // };

  // Update Perk Categories
  // const handlePerkCategoriesSubmit = async (e: SyntheticEvent) => {
  //   e.preventDefault(); // stops javascript submit events
  //   const updatedPerkCategories = [
  //     ...(isThrillEnabled ? ['thrill'] : []),
  //     ...(isTravelEnabled ? ['travel'] : []),
  //     ...(isRelaxEnabled ? ['relax'] : []),
  //     ...(isFoodEnabled ? ['food'] : []),
  //   ];

  //   setPerkUpdateInProgress(true);

  //   try {
  //     const res = await fetch('/api/v1/update-perk-categories', {
  //       method: 'PATCH',
  //       keepalive: true,
  //       body: JSON.stringify({ perkCategories: updatedPerkCategories }),
  //       headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  //     });

  //     validateFetchResponseStatus(res);

  //     const data = await res.json();
  //     setTenant(data); // updates the tenant (react side)

  //     switch (updatedPerkCategories.length) {
  //       case 4:
  //         toastSuccess('Maximum perks achieved! Your team is in beast mode!', '🐻');
  //         break;
  //       case 1:
  //         if (updatedPerkCategories[0] === 'food') {
  //           toastSuccess('Congrats on taking your team to Flavor Town -- Guy Fieri would be proud!', '🌶️');
  //         } else if (updatedPerkCategories[0] === 'relax') {
  //           toastSuccess("Your employees get to be chillin', and you're anything but the villain. Good on ya!", '❄️');
  //         } else if (updatedPerkCategories[0] === 'travel') {
  //           toastSuccess("Whatever happens in Vegas stays in Vegas (unless it's a hangover).", '✈️');
  //         } else {
  //           toastSuccess("You’re bringing the thriller vibes... just don't start moonwalking on me now.", '🧟');
  //         }
  //         break;
  //       case 0:
  //         toastSuccess('Team morale hits a new low. Thanks, Captain Killjoy.', '💀');
  //         break;
  //       case 2:
  //       case 3:
  //       default:
  //         toastSuccess('The perk party is in progress... but maybe crank it up another notch?', '💃');
  //     }
  //   } catch (error: unknown) {
  //     console.log(error);
  //     toastError('An unexpected error occurred.');
  //   } finally {
  //     setPerkUpdateInProgress(false);
  //   }
  // };

  const handleCopyClick = () => {
    copy(oktaRedirectUrl!);
    toastSuccess('Got it! Now you’re officially on your way to Okta greatness!', '🗂️');
  };

  // Upsert Okta IDP
  const handleUpsertOktaIdp = async (e: SyntheticEvent) => {
    e.preventDefault();

    setOktaIdpInProgress(true);

    try {
      const upsertedIdp = await frontendApiService.upsertIdp({
        type: 'OKTA',
        ownerType: 'TENANT',
        ownerId: tenant.id,
        name: 'okta',
        displayName: 'Okta',
        domainName,
        status: isOktaEnabled ? 'ENABLED' : 'DISABLED',
        protocol: { type: 'OAUTH2', clientId, clientSecret },
        jitProvisioningEnabled: true,
      });

      setCurrentOktaIdp(upsertedIdp);

      if (isOktaEnabled) {
        toastSuccess('Mixing fun with safety like a pro — now show off that funky chicken!', '🐔');
      } else {
        toastSuccess('No Okta? No party! Your boss is about to become the fun police...', '🚓');
      }
    } catch (error: unknown) {
      console.log(error);

      if (isUnauthorizedError(error)) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      if (
        error instanceof AxiosError &&
        error.response?.status === 400 &&
        error.response?.data.error === 'invalid_domain_name'
      ) {
        toastError('Invalid domain name? That’s like inviting a mime to karaoke night!', '🤐');
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setOktaIdpInProgress(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${ralewayFont.className}`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 break-all">Admin Portal</h1>

        {/* ********************** Other API Endpoints ********************** */}

        {showApiTouchpoints && (
          <div className="p-4 mb-8 border-2 border-solid border-wristband-green rounded-md">
            <h2 className="text-xl font-semibold mb-4">Other APIs Used to Load This Page</h2>
            <p className="mb-2">&#8226; Query New User Invitation Requests Filtered By Tenant</p>
            <div className="mb-4 ml-2">
              <WristbandBadge
                title="Query New User Invitation Requests Filtered By Tenant API"
                url="https://docs.wristband.dev/reference/querynewuserinvitationrequestsfilteredbytenantv1"
              />
            </div>
            <p className="mb-2">&#8226; Query Tenant Roles</p>
            <div className="mb-4 ml-2">
              <WristbandBadge
                title="Query Tenant Roles API"
                url="https://docs.wristband.dev/reference/querytenantrolesv1"
              />
            </div>
            <p className="mb-2">&#8226; Query Tenant Users</p>
            <div className="mb-4 ml-2">
              <WristbandBadge
                title="Query Tenant Users API"
                url="https://docs.wristband.dev/reference/querytenantusersv1"
              />
            </div>
            <p className="mb-2">&#8226; Resolve Tenant Identity Provider Overrides</p>
            <div className="mb-4 ml-2">
              <WristbandBadge
                title="Resolve Tenant Identity Provider Overrides API"
                url="https://docs.wristband.dev/reference/resolvetenantidentityprovideroverridesv1"
              />
            </div>
            <p className="mb-2">&#8226; Resolve Tenant Identity Provider Redirect URLs</p>
            <div className="mb-2 ml-2">
              <WristbandBadge
                title="Resolve Tenant Identity Provider Redirect URLs API"
                url="https://docs.wristband.dev/reference/resolvetenantidentityproviderredirectsurlsv1"
              />
            </div>
          </div>
        )}

        {/* ********************** Perk Categories ********************** */}

        {/* <section>
          <form onSubmit={handlePerkCategoriesSubmit} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Perk Categories</h2>
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="selectAll"
                  name="selectAll"
                  checked={isAllSelected}
                  onChange={handleAllPerksChange}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  disabled={isPerkUpdateInProgress}
                />
                <label htmlFor="selectAll" className="ml-4 block text-sm font-medium text-gray-700">
                  All
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="thrill"
                  name="thrill"
                  checked={isThrillEnabled}
                  onChange={() => setThrillEnabled(!isThrillEnabled)}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  disabled={isPerkUpdateInProgress}
                />
                <label htmlFor="thrill" className="ml-4 block text-sm font-medium text-gray-700">
                  Thrill
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="travel"
                  name="travel"
                  checked={isTravelEnabled}
                  onChange={() => setTravelEnabled(!isTravelEnabled)}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  disabled={isPerkUpdateInProgress}
                />
                <label htmlFor="travel" className="ml-4 block text-sm font-medium text-gray-700">
                  Travel
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="relax"
                  name="relax"
                  checked={isRelaxEnabled}
                  onChange={() => setRelaxEnabled(!isRelaxEnabled)}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  disabled={isPerkUpdateInProgress}
                />
                <label htmlFor="relax" className="ml-4 block text-sm font-medium text-gray-700">
                  Relax
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="food"
                  name="food"
                  checked={isFoodEnabled}
                  onChange={() => setFoodEnabled(!isFoodEnabled)}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  disabled={isPerkUpdateInProgress}
                />
                <label htmlFor="food" className="ml-4 block text-sm font-medium text-gray-700">
                  Food
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPerkUpdateInProgress}
              className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
            >
              {isPerkUpdateInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
            </button>
          </form>
        </section> */}

        {/* ********************** Company Details Form ********************** */}

        <form onSubmit={handleTenantDisplayNameSubmit} className="mb-12">
          <h2 className="text-xl font-semibold mb-2">Company Details</h2>
          {showApiTouchpoints && (
            <WristbandBadge title="Wristband API" url="https://docs.wristband.dev/reference/patchtenantv1" />
          )}
          <div className="my-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={tenantDisplayName}
              onChange={(e) => setTenantDisplayName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
              maxLength={60}
            />
          </div>
          <div className="my-4">
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              value={tenantLogoUrl}
              onChange={(e) => setTenantLogoUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              maxLength={2000}
            />
          </div>
          <div className="mb-2 flex flex-col items-start justify-start">
            <div className="p-2 w-20 h-20 border border-gray-500 rounded-md flex items-center justify-center">
              {tenantLogoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenantLogoUrl} alt="Company Logo" className="w-full h-full object-contain text-xs" />
              )}
              {!tenantLogoUrl && <FaImage className="w-10 h-10" />}
            </div>
            <p className="text-xs my-2">Company Logo</p>
          </div>
          <button
            type="submit"
            disabled={isUpdateTenantInProgress}
            className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
          >
            {isUpdateTenantInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
          </button>
        </form>

        {/* ********************** Invite New User Form ********************** */}

        <section>
          <form onSubmit={handleInviteNewUser} className="mb-12">
            <h2 className="text-xl font-semibold mb-2">Invite Your Friends To Party</h2>
            {showApiTouchpoints && (
              <WristbandBadge title="Invite New User API" url="https://docs.wristband.dev/reference/invitenewuserv1" />
            )}
            <div className="mb-4 pt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="homelander@perkparty.club"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
                maxLength={200}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Choose a Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full cursor-pointer"
                required
              >
                <option value="Party Animal">Party Animal</option>
                <option value="VIP Host">VIP Host (aka Admin)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isInviteEmailInProgress}
              className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
            >
              {isInviteEmailInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Invite'}
            </button>
          </form>
        </section>

        {/* ********************** View Current Active Users ********************** */}

        <section>
          <form className="mb-12">
            <h2 className="text-xl font-semibold mb-2">All Party Animals</h2>
            {showApiTouchpoints && (
              <WristbandBadge
                title="Query Tenant Users API"
                url="https://docs.wristband.dev/reference/querytenantusersv1"
              />
            )}
            <ul className="pt-4">
              {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <div className="flex items-center mb-2 md:mb-0">
                      <span role="img" aria-label="people icon" className="mr-2">
                        🕺
                      </span>
                      <span className="break-all" title={`${user.fullName} / ${user.email}`}>
                        {user.fullName}&nbsp;&nbsp;/&nbsp;&nbsp;{user.email}
                      </span>
                    </div>
                    {loggedInUser.email === user.email && (
                      <p className="min-w-28 text-center font-semibold">{"That's You!"}</p>
                    )}
                    {loggedInUser.email !== user.email && (
                      <button
                        type="submit"
                        disabled={isDeactivateUserInProgress || isActivateUserInProgress}
                        onClick={(e) =>
                          user.status === 'ACTIVE' ? handleDeactivateUser(e, user.id!) : handleActivateUser(e, user.id!)
                        }
                        className="self-start min-w-28 h-8 md:self-auto bg-pink-600 text-white rounded-lg transition duration-300 hover:filter hover:brightness-90"
                      >
                        {isDeactivateUserInProgress || isActivateUserInProgress ? (
                          <FaSpinner className="animate-spin mx-auto" />
                        ) : user.status === 'ACTIVE' ? (
                          'Deactivate'
                        ) : (
                          'Activate'
                        )}
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 my-8">No users at the moment. Bummer.</li>
              )}
            </ul>
          </form>
        </section>

        {/* ********************** View Pending New User Invites ********************** */}

        <section>
          <form className="mb-12">
            <h2 className="text-xl font-semibold mb-2">Party Animals Waiting To RSVP</h2>
            {showApiTouchpoints && (
              <WristbandBadge
                title="Query New User Invitation Requests Filtered By Tenant API"
                url="https://docs.wristband.dev/reference/querynewuserinvitationrequestsfilteredbytenantv1"
              />
            )}
            <ul className="pt-4">
              {currentInvites && currentInvites.length > 0 ? (
                currentInvites.map((invite, index) => (
                  <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <div className="flex items-center mb-2 md:mb-0">
                      <span role="img" aria-label="people icon" className="mr-2">
                        📨
                      </span>
                      <span title={invite.email} className="break-all">
                        {invite.email}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isCancelInviteInProgress}
                      onClick={(e) => handleCancelNewUserInvite(e, invite.id)}
                      className="self-start min-w-28 h-8 md:self-auto bg-pink-600 text-white rounded-lg transition duration-300 hover:filter hover:brightness-90"
                    >
                      {isCancelInviteInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Cancel'}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 my-8">No invites at the moment. Bummer.</li>
              )}
            </ul>
          </form>
        </section>

        {/* ********************** Okta SSO ********************** */}

        <section>
          <form onSubmit={handleUpsertOktaIdp} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Make It A Corporate Affair</h2>
            {showApiTouchpoints && (
              <WristbandBadge
                title="Create Identity Provider API"
                url="https://docs.wristband.dev/reference/createidentityprovidersv1"
              />
            )}
            <p className="mt-4 mb-8">
              You can enable Okta SSO for Perk Party. Impress your boss both with your commitment to security as well as
              your dance moves!
            </p>
            {!currentOktaIdp && (
              <>
                <h3 className="text-lg font-medium mb-2">Step 1</h3>
                <p className="mb-4">
                  Make sure you follow the instructions over on the Wristband documentation on how to configure your
                  Okta account. <strong>Just follow steps 3 and 4 only!</strong>
                </p>
              </>
            )}
            {currentOktaIdp && (
              <h3 className="text-lg font-medium mb-2">
                We&apos;ll leave these here in case you need to change your configuration later.
              </h3>
            )}
            <a
              href="https://docs.wristband.dev/reference/createidentityprovidersv1"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${currentOktaIdp ? 'my-4' : 'mb-8'} text-[#1E90FF] border-b-2 border-[#1E90FF] hover:filter hover:brightness-90 transition duration-300 cursor-pointer`}
            >
              Okta Setup Docs
            </a>
            {!currentOktaIdp && (
              <>
                <h3 className="text-lg font-medium mb-2">Step 2</h3>
                <div className="mb-4">
                  <p className="mb-2">
                    Make sure to copy/paste the following redirct URL into your Okta configuration as shown in the docs:
                  </p>
                  <div className="flex items-center mb-8">
                    <input
                      type="text"
                      value={oktaRedirectUrl!}
                      readOnly
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full mr-2"
                    />
                    <button
                      type="button"
                      onClick={handleCopyClick}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              </>
            )}
            {currentOktaIdp && (
              <div className="flex items-center mb-12">
                <input
                  type="text"
                  value={oktaRedirectUrl!}
                  readOnly
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full mr-2"
                />
                <button
                  type="button"
                  onClick={handleCopyClick}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
                >
                  <FaCopy />
                </button>
              </div>
            )}
            {!currentOktaIdp && (
              <>
                <h3 className="text-lg font-medium mb-2">Step 3</h3>
                <p className="mb-4">Now add your Okta IDP configurations below.</p>
              </>
            )}
            {currentOktaIdp && (
              <>
                <h3 className="text-lg font-medium mb-2">You can update your Okta configuration at any time.</h3>
                <div className="my-4 flex items-center">
                  <input
                    type="checkbox"
                    id="status"
                    checked={isOktaEnabled}
                    onChange={() => setIsOktaEnabled(!isOktaEnabled)}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                  />
                  <label htmlFor="status" className="ml-3 block text-lg font-medium text-gray-700">
                    Enable Okta?
                  </label>
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor="domainName" className="block text-sm font-medium text-gray-700">
                Okta Domain Name
              </label>
              <input
                type="text"
                id="domainName"
                placeholder="mydomain.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
                maxLength={253}
                title="Please enter a valid domain name (e.g., mydomain.com)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                Client ID
              </label>
              <input
                type="text"
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
                maxLength={200}
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">
                Client Secret
              </label>
              <div className="relative mt-1">
                <input
                  type={showClientSecret ? 'text' : 'password'}
                  id="clientSecret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full pr-10"
                  required
                  maxLength={200}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <button
                    type="button"
                    onClick={() => setShowClientSecret(!showClientSecret)}
                    className="transition-colors duration-300 hover:text-pink-600 cursor-pointer"
                  >
                    {showClientSecret ? (
                      <FaEyeSlash className="text-gray-500 text-xl" />
                    ) : (
                      <FaEye className="text-gray-500 text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isOktaIdpInProgress}
              className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
            >
              {isOktaIdpInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Submit'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

//
// *************************************************************************************************** //
//

// NOTE: This gets called first every time BEFORE this page loads. The returned props are passed to the page
// above. The server will evaluate/render everything once on the server before sending the browser its 1st HTML.
export const getServerSideProps: GetServerSideProps = async function (context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session = await getSession(req, res);
  const { accessToken, isAuthenticated, role, tenantId } = session;

  // Only VIP Host roles can access the admin page
  if (!isAuthenticated || !isVipHostRole(role)) {
    return serverRedirectToLogin(req);
  }

  try {
    const [tenantIdpOverrideResults, tenantIdpRedirectUrlOverrideResults, userResults, inviteResults] =
      await Promise.all([
        wristbandService.resolveTenantIdpOverrides(accessToken, tenantId),
        wristbandService.resolveTenantIdpRedirectUrlOverrides(accessToken, tenantId),
        wristbandService.getUsersInTenantWithRoles(accessToken, tenantId),
        wristbandService.getNewUserInvitesInTenant(accessToken, tenantId),
      ]);

    const { items: idpOverrides } = tenantIdpOverrideResults;
    const { items: idpRedirectUrlOverrides } = tenantIdpRedirectUrlOverrideResults;
    const { items: users } = userResults;
    const { items: invites } = inviteResults;

    return {
      props: {
        statusCode: 200,
        oktaIdp: idpOverrides.length > 0 && idpOverrides[0].item.type === 'OKTA' ? idpOverrides[0].item : null,
        oktaRedirectUrl:
          idpRedirectUrlOverrides.length && idpRedirectUrlOverrides[0].identityProviderType === 'OKTA'
            ? idpRedirectUrlOverrides[0].redirectUrls[0].redirectUrl
            : null,
        users,
        invites,
      },
    };
  } catch (err: unknown) {
    console.log(err);

    if (isUnauthorizedError(err)) {
      return serverRedirectToLogin(req);
    }

    // For all other error, return a 500 error.
    return { props: { err, statusCode: 500 } };
  }
};
