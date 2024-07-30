import { SyntheticEvent, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import { Raleway } from 'next/font/google';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

import { useWristband } from '@/context/auth-context';
import { toastError, toastSuccess } from '@/utils/toast';
import { clientRedirectToLogin, serverRedirectToLogin, validateFetchResponseStatus } from '@/utils/helpers';
import { getSession } from '@/session/iron-session';
import wristbandService from '@/services/wristband-service';
import { ChangeEmailRequestResults } from '@/types';
import { FetchError } from '@/error';
import { JSON_MEDIA_TYPE } from '@/utils/constants';
import WristbandBadge from '@/components/wristband-badge';

const raleway = Raleway({ subsets: ['latin'] });

type ProfileSettingsPageProps = {
  changeEmailRequestResults: ChangeEmailRequestResults;
};

export default function ProfileSettingsPage({ changeEmailRequestResults }: ProfileSettingsPageProps) {
  const { items: changeEmailRequests, totalResults } = changeEmailRequestResults;

  const { user, setUser } = useWristband();

  // Full Name Form State
  const [fullName, setFullName] = useState<string>('');
  const [isUpdateNameInProgress, setIsUpdateNameInProgress] = useState<boolean>(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isChangePasswordInProgress, setIsChangePasswordInProgress] = useState<boolean>(false);

  // Change Email Form State
  const [newEmail, setNewEmail] = useState<string>('');
  const [changeEmailRequestId, setChangeEmailRequestId] = useState<string>(
    totalResults > 0 && !!changeEmailRequests.length ? changeEmailRequests[0].id : ''
  );
  const [requestedNewEmail, setRequestedNewEmail] = useState<string>(
    totalResults > 0 && !!changeEmailRequests.length ? changeEmailRequests[0].newEmail : ''
  );
  const [isChangeEmailInProgress, setIsChangeEmailInProgress] = useState<boolean>(false);
  const [isCancelChangeEmailInProgress, setIsCancelChangeEmailInProgress] = useState<boolean>(false);
  const [isResendChangeEmailInProgress, setIsResendChangeEmailInProgress] = useState<boolean>(false);

  // We need this here to ensure the existing fullName value is in the form input when the page loads.
  useEffect(() => {
    setFullName(user.fullName || '');
  }, [user]);

  const handleFullNameSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsUpdateNameInProgress(true);

    try {
      const res = await fetch('/api/v1/update-name', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ fullName }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      const data = await res.json();
      setUser(data); // updates the user (react side)
      toastSuccess('With a name like that, you must be a VIP everywhere you go!', '👑');
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError && error.statusCode === 401) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsUpdateNameInProgress(false);
    }
  };

  const handleChangePasswordSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
      toastError('Only parrots should repeat phrases. Try something truly new.', '🦜');
      return;
    }

    setIsChangePasswordInProgress(true);

    try {
      const res = await fetch('/api/v1/change-password', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      // Reset the password form inputs
      setCurrentPassword('');
      setNewPassword('');
      toastSuccess('Your new password is so strong, it could bench press a bear!', '💪');
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError) {
        if (error.statusCode === 400) {
          const errorData = await error.res.json();

          if (errorData.error === 'password_breached') {
            toastError('Detected in a breach! Not even the power of Flex Seal can fix that password.', '🚧');
            return;
          }
        }
        if (error.statusCode === 401) {
          clientRedirectToLogin(window.location.href);
          return;
        }
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsChangePasswordInProgress(false);
    }
  };

  const handleChangeEmailSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (newEmail === user.email) {
      toastError('Change can be scary, but picking an actual new email could be refreshing.', '💌');
      return;
    }

    setIsChangeEmailInProgress(true);

    try {
      const res = await fetch('/api/v1/change-email', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ newEmail }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      const updateChangeEmailRequestResults = await res.json();
      const { items } = updateChangeEmailRequestResults;
      setRequestedNewEmail(items.length ? items[0].newEmail : '');
      setChangeEmailRequestId(items.length ? items[0].id : '');
      setNewEmail('');
      toastSuccess('New email? We can pull a few strings for you... just check your inbox first.', '📬');
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError) {
        if (error.statusCode === 400 && error.res) {
          const errorData = await error.res.json();

          if (errorData.error === 'invalid_email') {
            toastError('That email is more invalid than putting pineapple on pizza!', '🍕');
            return;
          }
          if (errorData.error === 'not_unique') {
            toastError('Sorry champ, somebody beat you to that email. Maybe get a time machine?', '🕒');
            return;
          }
        }
        if (error.statusCode === 401) {
          clientRedirectToLogin(window.location.href);
          return;
        }
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsChangeEmailInProgress(false);
    }
  };

  const handleCancelEmailChange = async () => {
    setIsCancelChangeEmailInProgress(true);

    try {
      const res = await fetch('/api/v1/cancel-change-email', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ changeEmailRequestId }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      setRequestedNewEmail('');
      setChangeEmailRequestId('');
      setNewEmail('');
      toastSuccess("Don't worry, your old inbox is happy to have you back.", '😊');
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError && error.statusCode === 401) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsCancelChangeEmailInProgress(false);
    }
  };

  const handleResendEmailChange = async () => {
    setIsResendChangeEmailInProgress(true);

    try {
      const res = await fetch('/api/v1/change-email', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ newEmail: requestedNewEmail }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      const updateChangeEmailRequestResults = await res.json();
      const { items } = updateChangeEmailRequestResults;
      setRequestedNewEmail(items.length ? items[0].newEmail : '');
      setChangeEmailRequestId(items.length ? items[0].id : '');
      setNewEmail('');
      toastSuccess("Can't find the email we sent you? This new one is GPS-enabled and is coming in hot!", '📡');
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError && error.statusCode === 401) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
    } finally {
      setIsResendChangeEmailInProgress(false);
    }
  };

  return (
    <div className={`bg-gray-100 p-8 ${raleway.className}`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {/* Update Name Form */}
        <form onSubmit={handleFullNameSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Your Profile</h2>
          <WristbandBadge title="Update User API" url="https://docs.wristband.dev/reference/patchuserv1" />
          <div className="my-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="firstName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
              maxLength={200}
            />
          </div>
          <button
            type="submit"
            disabled={isUpdateNameInProgress}
            className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
          >
            {isUpdateNameInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePasswordSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Change Password</h2>
          <WristbandBadge title="Change Password API" url="https://docs.wristband.dev/reference/changepasswordv1" />
          <div className="my-4 relative">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full pr-10"
                required
                minLength={8}
                maxLength={64}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  className="transition-colors duration-300 hover:text-pink-600 cursor-pointer"
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  ) : (
                    <FaEye className="text-gray-500 text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full pr-10"
                required
                minLength={8}
                maxLength={64}
              />
              <div className="absolute inset-y-0 max-h-full right-0 px-3 flex items-center text-sm leading-5">
                <button
                  className="transition-colors duration-300 hover:text-pink-600 cursor-pointer"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
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
            disabled={isChangePasswordInProgress}
            className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
          >
            {isChangePasswordInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
          </button>
        </form>

        {/* Update Email Form */}
        <form onSubmit={handleChangeEmailSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Change Email</h2>
          <WristbandBadge
            title="Request Email Change API"
            url="https://docs.wristband.dev/reference/requestemailchangev1"
          />
          <div className="text-lg text-pink-600 my-4">Current Email: {user.email}</div>
          {requestedNewEmail ? (
            <>
              <div className="mb-4 text-sm text-blue-600">A confirmation email was sent to: {requestedNewEmail}</div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEmailChange}
                  disabled={isCancelChangeEmailInProgress || isResendChangeEmailInProgress}
                  className="min-h-10 min-w-20 bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
                >
                  {isCancelChangeEmailInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleResendEmailChange}
                  disabled={isCancelChangeEmailInProgress || isResendChangeEmailInProgress}
                  className="min-h-10 min-w-20 bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
                >
                  {isResendChangeEmailInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Resend'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  New Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                  maxLength={200}
                />
              </div>
              <button
                type="submit"
                disabled={isChangeEmailInProgress}
                className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:filter hover:brightness-90"
              >
                {isChangeEmailInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Change'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// NOTE: This gets called first every time BEFORE this page loads. The returned props are passed to the page
// above. The server will evaluate/render everything once on the server before sending the browser its 1st HTML.
export const getServerSideProps: GetServerSideProps = async function (context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session = await getSession(req, res);
  const { accessToken, isAuthenticated, userId } = session;

  /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
  if (!isAuthenticated) {
    return serverRedirectToLogin(req);
  }

  try {
    const changeEmailRequestResults = await wristbandService.getChangeEmailRequests(accessToken, userId);
    return { props: { changeEmailRequestResults } };
  } catch (err: unknown) {
    console.log(err);

    if (err instanceof FetchError && err.statusCode === 401) {
      return serverRedirectToLogin(req);
    }

    // For all other error, return a 500 error.
    return { props: { err }, status: 500 };
  }
};
