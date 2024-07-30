import { useWristband } from '@/context/auth-context';
import { validateFetchResponseStatus } from '@/utils/helpers';
import { FaSpinner } from 'react-icons/fa';
import { Raleway } from 'next/font/google';
import { SyntheticEvent, useEffect, useState } from 'react';
import { JSON_MEDIA_TYPE } from '@/utils/constants';
import { toastSuccess, toastError } from '@/utils/toast';

const raleway = Raleway({ subsets: ['latin'] });

export default function AdminPage() {
  const { tenant, setTenant } = useWristband();
  const publicMetaData = tenant.publicMetadata || {};
  const perkCategories = publicMetaData.perkCategories || [];

  const [isThrillEnabled, setThrillEnabled] = useState<boolean>(true);
  const [isTravelEnabled, setTravellEnabled] = useState<boolean>(true);
  const [isRelaxEnabled, setRelaxEnabled] = useState<boolean>(true);
  const [isFooodEnabled, setFoodEnabled] = useState<boolean>(true);
  const [isPerkUpdateInProgress, setPerkUpdateInProgress] = useState<boolean>(false);

  useEffect(() => {
    // Initialize the state with the Tenant's metadata when the page first loads in the browser
    if (tenant) {
      setThrillEnabled(perkCategories.indexOf('thrill') !== -1);
      setTravellEnabled(perkCategories.indexOf('travel') !== -1);
      setRelaxEnabled(perkCategories.indexOf('relax') !== -1);
      setFoodEnabled(perkCategories.indexOf('food') !== -1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  const handlePerkCategoriesSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // stops javascripts submit events
    const updatedPerkCategories = [
      ...(isThrillEnabled ? ['thrill'] : []),
      ...(isTravelEnabled ? ['travel'] : []),
      ...(isRelaxEnabled ? ['relax'] : []),
      ...(isFooodEnabled ? ['food'] : []),
    ];

    setPerkUpdateInProgress(true);

    try {
      const res = await fetch('/api/v1/update-perk-categories', {
        method: 'PATCH',
        keepalive: true,
        body: JSON.stringify({ perkCategories: updatedPerkCategories }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      const data = await res.json();
      setTenant(data); // updates the tenant (react side)

      switch (updatedPerkCategories.length) {
        case 4:
          toastSuccess('Maximum perks achieved! Your team is in beast mode!', '🐻');
          break;
        case 1:
          if (updatedPerkCategories[0] === 'food') {
            toastSuccess('Congrats on taking your team to Flavor Town -- Guy Fieri would be proud!', '🌶️');
          } else if (updatedPerkCategories[0] === 'relax') {
            toastSuccess("Your employees get to be chillin', and you're anything but the villain. Good on ya!", '❄️');
          } else if (updatedPerkCategories[0] === 'travel') {
            toastSuccess("Whatever happens in Vegas stays in Vegas (unless it's a hangover).", '✈️');
          } else {
            toastSuccess("You’re bringing the thriller vibes... just don't start moonwalking on me now.", '🧟');
          }
          break;
        case 0:
          toastSuccess('Team morale hits a new low. Thanks, Captain Killjoy.', '💀');
          break;
        case 2:
        case 3:
        default:
          toastSuccess('The perk party is in progress... but maybe crank it up another notch?', '💃');
      }
    } catch (error: unknown) {
      console.log(error);
      toastError('An unexpected error occurred.');
    } finally {
      setPerkUpdateInProgress(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${raleway.className}`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 break-all">Admin for {tenant.displayName}</h1>

        {/* Perk Categories */}
        <form onSubmit={handlePerkCategoriesSubmit} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Perk Categories</h2>
          <div className="mb-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="thrill"
                name="thrill"
                checked={isThrillEnabled}
                onChange={() => setThrillEnabled(!isThrillEnabled)}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
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
                onChange={() => setTravellEnabled(!isTravelEnabled)}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
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
              />
              <label htmlFor="relax" className="ml-4 block text-sm font-medium text-gray-700">
                Relax
              </label>
            </div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="perk4"
                name="perk4"
                checked={isFooodEnabled}
                onChange={() => setFoodEnabled(!isFooodEnabled)}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
              />
              <label htmlFor="food" className="ml-4 block text-sm font-medium text-gray-700">
                Food
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
