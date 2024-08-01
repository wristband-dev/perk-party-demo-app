import { useState } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';

import { useWristband } from '@/context/auth-context';
import { JSON_MEDIA_TYPE } from '@/utils/constants';
import { clientRedirectToLogin, validateFetchResponseStatus } from '@/utils/helpers';
import { toastSuccess, toastError } from '@/utils/toast';
import { FetchError } from '@/error';
import Image from 'next/image';

interface PerkCardProps {
  id: string;
  image: string;
  perkName: string;
  perkDesc: string;
  banner: string;
}

export function PerkCard({ id, image, perkName, perkDesc, banner }: PerkCardProps) {
  const [isClaimInProgress, setIsClaimInProgress] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user, setUser } = useWristband();

  const publicMetadata = user.publicMetadata || {};
  const claimedPerks = publicMetadata.claimedPerks || [];
  const isClaimed = claimedPerks.indexOf(id) !== -1;

  const claimPerk = async (id: string) => {
    try {
      setIsClaimInProgress(true);

      const res = await fetch('/api/v1/claim-perk', {
        method: 'PATCH',
        keepalive: true,
        body: JSON.stringify({ claimedPerks: [...claimedPerks, id] }),
        headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
      });

      validateFetchResponseStatus(res);

      const data = await res.json();
      setIsModalOpen(false); // closes pop up
      setUser(data); // updates the user (react side)
      toastSuccess(`Woohoo! Enjoy your "${perkName}".`);
    } catch (error: unknown) {
      console.log(error);

      if (error instanceof FetchError && error.statusCode === 401) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      toastError('An unexpected error occurred.');
      setIsClaimInProgress(false);
    }
  };

  return (
    <>
      <div
        className="w-[320px] h-[250px] mb-16 mx-8 bg-black shadow-2xl border-gray-200 rounded-lg overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => (isClaimed ? undefined : setIsModalOpen(true))}
      >
        {isClaimed && (
          <div className="absolute flex top-0 left-0 m-2 z-10">
            <FaCheck className="w-5 h-5 text-pink-600" />
            <p className="text-white pl-1 text-sm font-medium">Claimed</p>
          </div>
        )}
        <div className="h-3/5">
          <div className="relative w-full h-full">
            {/* Black overlay */}
            {isClaimed && <div className="absolute inset-0 bg-black opacity-50" />}
            <Image
              className={`w-full h-full object-cover ${isClaimed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              src={image}
              alt="perk image"
              width={320}
              height={150}
              style={{ objectFit: 'cover' }}
              quality={70}
              priority
            />
          </div>
          {banner && (
            <div className="absolute top-0 right-0 p-2">
              <h1 className="text-xl pt-2 text-white bg-pink-600 rounded-lg font-bold p-2">{banner}</h1>
            </div>
          )}
        </div>
        <div className="p-4 h-2/5 flex flex-col justify-between">
          <h1
            className={`text-xl text-white font-bold ${perkName.length > 20 ? 'text-lg' : ''}`}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {perkName}
          </h1>
          <p
            className="text-sm text-white overflow-hidden"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {perkDesc}
          </p>
        </div>
        {isHovered && (
          <div
            className={`absolute ${isClaimed ? 'cursor-not-allowed' : 'cursor-pointer'} inset-0 text-white bg-black bg-opacity-90 p-4 flex items-center justify-center`}
          >
            <p className="text-lg font-bold italic">{perkDesc}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="p-10 fixed inset-0 flex items-center justify-center z-[5000] bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg relative overflow-hidden">
            <section className="m-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Logo" className="max-h-[400px] w-full object-cover" />
              <button
                type="button"
                className="absolute top-0 right-0 m-4 mr-4 bg-black text-white hover:bg-pink-600 border border-black focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-md px-3 py-1.5 text-center me-2 mb-2"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </section>
            <div className="flex flex-col m-4">
              <h1 className="text-2xl font-bold mb-2">{perkName}</h1>
              <p className="text-lg">{perkDesc}</p>
            </div>
            <div className="flex justify-center mb-4">
              <button
                type="button"
                disabled={isClaimInProgress}
                className="min-h-12 min-w-28 bg-black text-white hover:bg-pink-600 border border-black focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-md px-8 py-2.5 text-center"
                onClick={() => claimPerk(id)}
              >
                {isClaimInProgress ? <FaSpinner className="animate-spin mx-auto" /> : 'Claim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
