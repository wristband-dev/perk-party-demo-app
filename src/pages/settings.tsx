import { SyntheticEvent, useEffect, useState } from 'react';
import { Raleway } from 'next/font/google';
import { useWristband } from '@/context/auth-context';

const raleway = Raleway({ subsets: ['latin'] });

export default function ProfileSettings() {
  const { user } = useWristband();

  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [changeEmailRequestId, setChangeEmailRequestId] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      // We'll have to implement a fetchChangeEmailRequestId function that fetches the request ID
      setChangeEmailRequestId('');
    }
  }, [user]);

  const handleNameSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Handle name update logic here
  };

  const handlePasswordSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Handle password update logic here
  };

  const handleEmailSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Handle email update logic here
  };

  const handleCancelEmailChange = () => {
    // Handle cancel email change logic here
    setChangeEmailRequestId('');
  };

  const handleResendEmailChange = () => {
    // Handle resend email change logic here
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${raleway.className}`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {/* Update Name Form */}
        <form onSubmit={handleNameSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Update Name</h2>
          <div className="mb-4">
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
            />
          </div>
          <button type="submit" className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
            Save
          </button>
        </form>

        {/* Update Password Form */}
        <form onSubmit={handlePasswordSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <button type="submit" className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
            Save
          </button>
        </form>

        {/* Update Email Form */}
        <form onSubmit={handleEmailSubmit} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Update Email</h2>
          <div className="text-lg text-pink-600 mb-4">Current Email: {user.email}</div>
          {!changeEmailRequestId ? (
            <>
              <div className="mb-4 text-sm text-blue-600">
                A confirmation email was sent to: {newEmail || 'test@email.com'}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEmailChange}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResendEmailChange}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Resend
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
                />
              </div>
              <button type="submit" className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700">
                Save
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
