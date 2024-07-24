import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import wristbandService from '@/services/wristband-service';
import { useWristband } from '@/context/auth-context';
import { getSession } from '@/session/iron-session';
import { Tenant } from '@/types';
import { clientRedirectToLogin, serverRedirectToLogin, validateFetchResponseStatus } from '@/utils/helpers';
import { FaSpinner } from 'react-icons/fa';
import { Raleway } from 'next/font/google';
import { SyntheticEvent, useState } from 'react';
import { JSON_MEDIA_TYPE } from '@/utils/constants';
import { FetchError } from '@/error';
import { toastSuccess, toastError } from '@/utils/toast';
const raleway = Raleway({ subsets: ['latin'] });

export default function AdminPage() {
  const { isAuthenticated, user, tenant, setTenant } = useWristband();
  const publicMetaData = tenant.publicMetadata || {};
  const perkCategories = publicMetaData.perkCategories || [];
  
  const [isThrillEnabled, setThrillEnabled] = useState<boolean>(true);
  const [isTravelEnabled, setTravellEnabled] = useState<boolean>(true);
  const [isRelaxEnabled, setRelaxEnabled] = useState<boolean>(true);
  const [isFooodEnabled, setFoodEnabled] = useState<boolean>(true);

  const [isPerkUpdateInProgress, setPerkUpdateInProgress] = useState<boolean>(false);
  const handlePerkCategoriesSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // stops javascripts submit events
    const perkCategories = [];

    if (isThrillEnabled) {
      perkCategories.push('thrill')
    }
    if (isTravelEnabled) {
      perkCategories.push('travel')
    }
    if (isRelaxEnabled) {
      perkCategories.push('relax')
    }
    if (isFooodEnabled) {
      perkCategories.push('food')
    }

    setPerkUpdateInProgress(true);

    try {
      const res = await fetch('/api/v1/update-perk-categories', {
        method: 'PATCH',
        keepalive: true,
        body: JSON.stringify({ perkCategories }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      // Reset the password form inputs
      toastSuccess('Your perks are enabled', '💪');
    } catch (error: unknown) {
      console.log(error);

      toastError('An unexpected error occurred.');
    } finally {
      setPerkUpdateInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {/* Perk Categories */}
        <form onSubmit={handlePerkCategoriesSubmit} className="mb-8">
          
          <h2 className="text-xl font-semibold mb-4">Perk Categories</h2>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="ThrillPerk"
                name="Thrill"
                checked={isThrillEnabled}
                onChange={ () => setThrillEnabled(!isThrillEnabled) }
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="Thrill" className="ml-2 block text-sm font-medium text-gray-700">
                Thrill
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="perk2"
                name="perk2"
                checked={isTravelEnabled}
                onChange={ () => setTravellEnabled(!isTravelEnabled) }
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="perk2" className="ml-2 block text-sm font-medium text-gray-700">
                Perk 2
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="perk3"
                name="perk3"
                checked={isRelaxEnabled}
                onChange={ () => setRelaxEnabled(!isRelaxEnabled) }
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="perk3" className="ml-2 block text-sm font-medium text-gray-700">
                Perk 3
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="perk4"
                name="perk4"
                checked={isFooodEnabled}
                onChange={ () => setFoodEnabled(!isFooodEnabled) }
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="perk4" className="ml-2 block text-sm font-medium text-gray-700">
                Perk 4
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPerkUpdateInProgress}
            className="min-h-10 min-w-20 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
          >
            {isPerkUpdateInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
