import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { PerkCard } from '@/components/PerkCard';
import { useWristband } from '@/context/auth-context';
import { perks } from '@/data/perk-data';
import { ralewayFont } from '@/utils/fonts';

export default function HomePage() {
  // get meta data from tenant to show perk cats
  const { isAuthenticated, tenant, user } = useWristband();

  const [perksLoaded, setPerksLoaded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // const perkCategories = useMemo(() => tenant?.publicMetadata?.perkCategories ?? [], [tenant]);
  const perkCategories = useMemo(() => ['thrill', 'travel', 'relax', 'food'], []);
  const claimedPerks = useMemo(() => user?.publicMetadata?.claimedPerks ?? [], [user]);

  useEffect(() => {
    if (isAuthenticated) {
      setPerksLoaded(true);
    }
  }, [isAuthenticated]);

  // Set selectedCategory to the single category if only one exists
  useEffect(() => {
    if (perkCategories.length === 1) {
      setSelectedCategory(perkCategories[0].toLowerCase());
    }
  }, [perkCategories]);

  const filteredPerks = perks.filter((perk) =>
    selectedCategory === 'all'
      ? perkCategories.includes(perk.category?.toLowerCase() || '')
      : perk.category?.toLowerCase() === selectedCategory
  );

  return (
    <>
      <section className="relative w-full h-[450px]">
        <Image
          src="/race-car-rental.jpg"
          alt="race-car-rental"
          fill
          style={{ objectFit: 'cover' }}
          quality={70}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            style={{ textShadow: '2px 4px 8px rgba(0, 0, 0, 1)' }}
            className="text-white mx-8 text-3xl font-semibold text-center"
          >
            Welcome to the Perk Party for{' '}
            <span className="inline-block border-b-4 border-pink-600 ml-1">{tenant.displayName}</span>
          </p>
        </div>
      </section>

      <section className="relative">
        {/* Show a spinner instead of cards until the user session is loaded. */}
        {(!isAuthenticated || !perksLoaded) && (
          <div className="my-40 flex justify-center">
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600" />
            </div>
          </div>
        )}
        {isAuthenticated && perksLoaded && (
          <>
            {perkCategories.length > 0 && (
              <div className="top-0 bg-white z-10 mt-8 mx-16">
                {claimedPerks.length >= perks.length && (
                  <div className="my-8 mx-auto text-center text-2xl font-semibold max-w-[900px] flex flex-col justify-center items-center">
                    <Image
                      src="/party_animal.jpg"
                      alt="party-animal"
                      width={150}
                      height={228}
                      className="max-h-[450px]"
                      quality={70}
                    />
                    <h2 className="mt-2 mb-6">
                      Whoa there, party animal! You&apos;ve used up all your perks — time to take a timeout and let the
                      rest of us catch up!
                    </h2>
                  </div>
                )}
                <h1 className={`font-bold tracking-widest ${ralewayFont.className} text-3xl`}>BENEFITS</h1>
                <div className="flex flex-wrap items-center pt-4">
                  <h1 className="text-xl mr-4">{perkCategories.length > 1 ? 'FILTER BY' : 'SHOWING'}</h1>
                  {perkCategories.length > 1 ? (
                    <div className="cursor-pointer">
                      <select
                        className="min-w-[120px] border border-gray-300 rounded-md py-2 px-2 cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">All</option>
                        {perkCategories.map((category) => (
                          <option key={category} value={category.toLowerCase()}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <h2 className="text-xl font-medium">
                      {perkCategories[0].charAt(0).toUpperCase() + perkCategories[0].slice(1)}
                    </h2>
                  )}
                </div>
              </div>
            )}
            <div className="mt-10 mx-4 flex flex-wrap justify-center z-10">
              {filteredPerks.length > 0 ? (
                filteredPerks.map((perk) => (
                  <PerkCard
                    key={perk.id}
                    image={perk.image}
                    perkName={perk.perkName}
                    perkDesc={perk.perkDesc}
                    banner={perk.banner}
                    id={perk.id}
                  />
                ))
              ) : (
                <div className="flex flex-col">
                  <h2 className="my-4 mx-4 text-center text-2xl font-semibold max-w-[900px]">
                    Quick! Get someone to the Admin menu to turn on all the perks before the employees riot!
                  </h2>
                  <div className="mt-2 mb-10 mx-auto max-w-[300px]">
                    <Image
                      src="/beatings-will-continue.jpg"
                      alt="beatings-will-continue"
                      width={300}
                      height={450}
                      layout="intrinsic"
                      quality={70}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
