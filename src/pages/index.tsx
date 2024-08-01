import { Raleway } from 'next/font/google';
import Image from 'next/image';

import { PerkCard } from '@/components/PerkCard';
import { useWristband } from '@/context/auth-context';
import { useEffect, useMemo, useState } from 'react';

const raleway = Raleway({ subsets: ['latin'] });

const perks = [
  {
    id: '1',
    image: '/race-car-rental.jpg',
    perkName: 'Race Rental Car',
    category: 'Thrill',
    perkDesc:
      'Experience the thrill of driving a race car for a day! Speed through the track and feel the adrenaline. Perfect for both seasoned racers and beginners. Your dream ride awaits!',
    banner: 'NEW',
  },
  {
    id: '2',
    image: '/bike-pass.jpeg',
    perkName: 'Bike Pass',
    category: 'Travel',
    perkDesc:
      'Enjoy unlimited bike rides throughout the city with our exclusive Bike Pass. Stay active and explore your surroundings effortlessly.',
    banner: 'TRENDING',
  },
  {
    id: '3',
    image: '/rail-pass.jpeg',
    perkName: 'Rail Pass',
    category: 'Travel',
    perkDesc:
      'Travel conveniently across the region with our comprehensive Rail Pass, providing access to all major rail lines.',
    banner: 'TRENDING',
  },
  {
    id: '4',
    image: '/metro-pass.jpeg',
    perkName: 'Metro Pass',
    category: 'Travel',
    perkDesc: 'Unlimited metro rides for a month, ensuring seamless and affordable city travel for your daily commute.',
    banner: '',
  },
  {
    id: '5',
    image: '/30-minute-hot-yoga-coupons.jpeg',
    perkName: '30 Minute Hot Yoga Coupons',
    category: 'Relax',
    perkDesc: 'Relax and rejuvenate with 30-minute hot yoga sessions. Perfect for unwinding after a long day.',
    banner: '',
  },
  {
    id: '6',
    image: '/blue-bottle-coffee-delivered-intravenously.jpeg',
    perkName: 'Blue Bottle Coffee Delivered Intravenously',
    category: 'Relax',
    perkDesc:
      'Get your caffeine fix instantly with our Blue Bottle Coffee IV delivery service. Perfect for those who need an extra boost.',
    banner: '',
  },
  {
    id: '7',
    image: '/puppy-hour.jpeg',
    perkName: 'Puppy Hour',
    perkDesc: 'Cuddle with adorable puppies every Wednesday during our Puppy Hour. A perfect stress reliever!',
    category: 'Relax',
    banner: '',
  },
  {
    id: '8',
    image: '/1-hour-scream-room-coupons.jpeg',
    perkName: '1-Hour Scream Room Coupons',
    category: 'Thrill',
    perkDesc:
      'Release your frustrations in our soundproof Scream Room for an hour. Scream away stress and feel refreshed!',
    banner: '',
  },
  {
    id: '9',
    image: '/1-hour-rage-room-tokens.jpg',
    perkName: '1-Hour Rage Room Tokens',
    category: 'Thrill',
    perkDesc: 'Smash away your stress in our Rage Room. Enjoy an hour of therapeutic destruction.',
    banner: '',
  },
  {
    id: '10',
    image: '/free-sailing-lessons.jpeg',
    perkName: 'Free Sailing Lessons',
    category: 'Travel',
    perkDesc: 'Learn the basics of sailing with our free lessons. Perfect for aspiring sailors and water enthusiasts.',
    banner: '',
  },
  {
    id: '11',
    image: '/e-scooters-for-remote-workers.jpeg',
    perkName: 'E-Scooters for Remote Workers',
    category: 'Travel',
    perkDesc: 'Refuse to work in the office? No problem! Enjoy free e-scooter rides to get around the city.',
    banner: '',
  },
  {
    id: '12',
    image: '/granola.jpeg',
    perkName: 'Granola',
    category: 'Food',
    perkDesc: 'Keep your energy up with our delicious and nutritious granola packs. Perfect for snacking on the go.',
    banner: '',
  },
  {
    id: '13',
    image: '/virtual-reality-meditation.jpeg',
    perkName: 'Virtual Reality Meditation',
    category: 'Relax',
    perkDesc:
      'Experience tranquility with our VR meditation sessions. Escape to peaceful virtual landscapes and relax.',
    banner: '',
  },
  {
    id: '14',
    image: '/personal-chef-service.jpeg',
    perkName: 'Personal Chef Service',
    category: 'Food',
    perkDesc:
      'Enjoy gourmet meals prepared by a personal chef in the comfort of your home. Perfect for special occasions or daily indulgence.',
    banner: '',
  },
  {
    id: '15',
    image: '/spa-day-pass.jpeg',
    perkName: 'Spa Day Pass',
    category: 'Relax',
    perkDesc: 'Relax and rejuvenate with a full day pass to our luxurious spa. Enjoy massages, facials, and more.',
    banner: '',
  },
  {
    id: '16',
    image: '/private-cinema-screening.jpeg',
    perkName: 'Private Cinema Screening',
    category: 'Relax',
    perkDesc: 'Watch your favorite movies in a private cinema setting. Enjoy a personalized viewing experience.',
    banner: '',
  },
  {
    id: '17',
    image: '/gourmet-cooking-classes.jpeg',
    perkName: 'Gourmet Cooking Classes',
    category: 'Food',
    perkDesc:
      'Learn to cook like a pro with our gourmet cooking classes. Perfect for food enthusiasts and aspiring chefs.',
    banner: '',
  },
  {
    id: '18',
    image: '/exclusive-concert-tickets.jpeg',
    perkName: 'Exclusive Concert Tickets',
    category: 'Relax',
    perkDesc: 'Get front-row tickets to exclusive concerts and enjoy live performances from your favorite artists.',
    banner: '',
  },
  {
    id: '19',
    image: '/artisanal-craft-workshops.jpeg',
    perkName: 'Artisanal Craft Workshops',
    category: 'Thrill',
    perkDesc:
      'Unleash your creativity with our artisanal craft workshops. Learn new skills and create beautiful handmade items.',
    banner: '',
  },
  {
    id: '20',
    image: '/mustache-rides.jpg',
    perkName: 'Mustache Rides',
    category: 'Thrill',
    perkDesc:
      'Let someone else do the driving with 30% off any ride-hailing service for a month. Were you... expecting something else?',
    banner: '',
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useWristband(); // get meta data from tenant to show perk cats
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
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white mx-8 text-3xl font-semibold text-center">Come for the perks. Stay for the auth.</p>
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
                <h1 className={`font-bold tracking-widest ${raleway.className} text-3xl`}>BENEFITS</h1>
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
