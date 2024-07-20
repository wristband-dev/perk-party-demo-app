// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { Raleway } from 'next/font/google';

import { useWristband } from '@/context/auth-context';
import { PerkCard } from '@/components/PerkCard';
import { clientRedirectToLogin } from '@/utils/helpers';

const raleway = Raleway({ subsets: ['latin'] });

const perks = [
  {
    id: 1,
    image: 'https://cdn.pixabay.com/photo/2022/11/29/08/54/race-car-7624025_1280.jpg',
    perkName: 'Race Rental Car',
    category: 'Thrill',
    perkDesc:
      'Experience the thrill of driving a race car for a day! Speed through the track and feel the adrenaline. Perfect for both seasoned racers and beginners. Your dream ride awaits!',
    banner: 'NEW',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1501147830916-ce44a6359892?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlrZXxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'Bike Pass',
    category: 'Travel',
    perkDesc:
      'Enjoy unlimited bike rides throughout the city with our exclusive Bike Pass. Stay active and explore your surroundings effortlessly.',
    banner: 'TRENDING',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/uploads/1413387158190559d80f7/6108b580?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    perkName: 'Rail Pass',
    category: 'Travel',
    perkDesc:
      'Travel conveniently across the region with our comprehensive Rail Pass, providing access to all major rail lines.',
    banner: 'TRENDING',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1556695736-d287caebc48e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWV0cm98ZW58MHx8MHx8fDA%3D',
    perkName: 'Metro Pass',
    category: 'Travel',
    perkDesc: 'Unlimited metro rides for a month, ensuring seamless and affordable city travel for your daily commute.',
    banner: '',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYXxlbnwwfHwwfHx8MA%3D%3D',
    perkName: '30 Minute Hot Yoga Coupons',
    category: 'Relax',
    perkDesc: 'Relax and rejuvenate with 30-minute hot yoga sessions. Perfect for unwinding after a long day.',
    banner: '',
  },
  {
    id: 6,
    image:
      'https://plus.unsplash.com/premium_photo-1669374537810-f88d8ad82818?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlfGVufDB8fDB8fHww',
    perkName: 'Blue Bottle Coffee Delivered Intravenously',
    category: 'Relax',
    perkDesc:
      'Get your caffeine fix instantly with our Blue Bottle Coffee IV delivery service. Perfect for those who need an extra boost.',
    banner: '',
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVwcHl8ZW58MHx8MHx8fDA%3D',
    perkName: 'Puppy Hour',
    perkDesc: 'Cuddle with adorable puppies every Wednesday during our Puppy Hour. A perfect stress reliever!',
    banner: '',
  },
  {
    id: 8,
    image:
      'https://images.unsplash.com/photo-1457732815361-daa98277e9c8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2NyZWFtJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    perkName: '1-Hour Scream Room Coupons',
    category: 'Thrill',
    perkDesc:
      'Release your frustrations in our soundproof Scream Room for an hour. Scream away stress and feel refreshed!',
    banner: '',
  },
  {
    id: 9,
    image:
      'https://media.istockphoto.com/id/613668916/photo/woman-breaking-the-wall.jpg?s=612x612&w=0&k=20&c=dWYIdwoToWQP0qLzXM6hAcLOuleMLmTtn4A4DlsHViw=',
    perkName: '1-Hour Rage Room Tokens',
    category: 'Thrill',
    perkDesc: 'Smash away your stress in our Rage Room. Enjoy an hour of therapeutic destruction.',
    banner: '',
  },
  {
    id: 10,
    image:
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FpbGJvYXR8ZW58MHx8MHx8fDA%3D',
    perkName: 'Free Sailing Lessons',
    category: 'Travel',
    perkDesc: 'Learn the basics of sailing with our free lessons. Perfect for aspiring sailors and water enthusiasts.',
    banner: '',
  },
  {
    id: 11,
    image:
      'https://images.unsplash.com/photo-1565109254792-8856bba5abfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Nvb3RlcnxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'E-Scooters for Remote Workers',
    category: 'Travel',
    perkDesc: 'Refuse to work in the office? No problem! Enjoy free e-scooter rides to get around the city.',
    banner: '',
  },
  {
    id: 12,
    image:
      'https://images.unsplash.com/photo-1504708706948-13d6cbba4062?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R3Jhbm9sYXxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'Granola',
    category: 'Food',
    perkDesc: 'Keep your energy up with our delicious and nutritious granola packs. Perfect for snacking on the go.',
    banner: '',
  },
  {
    id: 13,
    image:
      'https://images.unsplash.com/photo-1577344718665-3e7c0c1ecf6b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'Virtual Reality Meditation',
    category: 'Relax',
    perkDesc:
      'Experience tranquility with our VR meditation sessions. Escape to peaceful virtual landscapes and relax.',
    banner: '',
  },
  {
    id: 14,
    image:
      'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'Personal Chef Service',
    category: 'Food',
    perkDesc:
      'Enjoy gourmet meals prepared by a personal chef in the comfort of your home. Perfect for special occasions or daily indulgence.',
    banner: '',
  },
  {
    id: 15,
    image:
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhfGVufDB8fDB8fHww',
    perkName: 'Spa Day Pass',
    category: 'Relax',
    perkDesc: 'Relax and rejuvenate with a full day pass to our luxurious spa. Enjoy massages, facials, and more.',
    banner: '',
  },
  {
    id: 16,
    image:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2luZW1hfGVufDB8fDB8fHww',
    perkName: 'Private Cinema Screening',
    category: 'Relax',
    perkDesc: 'Watch your favorite movies in a private cinema setting. Enjoy a personalized viewing experience.',
    banner: '',
  },
  {
    id: 17,
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvb2tpbmd8ZW58MHx8MHx8fDA%3D',
    perkName: 'Gourmet Cooking Classes',
    category: 'Food',
    perkDesc:
      'Learn to cook like a pro with our gourmet cooking classes. Perfect for food enthusiasts and aspiring chefs.',
    banner: '',
  },
  {
    id: 18,
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D',
    perkName: 'Exclusive Concert Tickets',
    category: 'Relax',
    perkDesc: 'Get front-row tickets to exclusive concerts and enjoy live performances from your favorite artists.',
    banner: '',
  },
  {
    id: 19,
    image:
      'https://plus.unsplash.com/premium_photo-1674852890869-045efbe8c54b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29vZHdvcmtpbmd8ZW58MHx8MHx8fDA%3D',
    perkName: 'Artisanal Craft Workshops',
    category: 'Thrill',
    perkDesc:
      'Unleash your creativity with our artisanal craft workshops. Learn new skills and create beautiful handmade items.',
    banner: '',
  },
];

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated } = useWristband();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const claimPerk = async () => {
    try {
      const res = await fetch('/api/v1/claim-perk', {
        method: 'PATCH',
        keepalive: true,
      });

      /* WRISTBAND_TOUCHPOINT - AUTHENTICATION */
      if (res.status === 401) {
        clientRedirectToLogin(window.location.href);
        return;
      }

      const data = await res.json();
      alert(data.message);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.pixabay.com/photo/2022/11/29/08/54/race-car-7624025_1280.jpg"
          alt="Logo"
          className="max-h-[450px] w-full object-cover"
        />
      </section>

      <section>
        <div className="top-0 bg-white z-10 mt-8 mx-16">
          <h1 className={`font-bold tracking-widest ${raleway.className} text-3xl`}>BENEFITS</h1>
          <div className="flex items-center pt-4">
            <h1 className="text-xl">FILTER BY</h1>
            <div className="ml-4 cursor-pointer">
              <select className="border border-gray-300 rounded-md p-2 cursor-pointer">
                <option value="none">None</option>
                <option value="thrill">Thrill</option>
                <option value="relax">Relax</option>
                <option value="travel">Travel</option>
                <option value="travel">Food</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 mx-4 flex flex-wrap justify-center z-10">
          {perks.map((perk) => (
            <PerkCard
              key={perk.perkName}
              image={perk.image}
              perkName={perk.perkName}
              perkDesc={perk.perkDesc}
              banner={perk.banner}
            />
          ))}
        </div>
      </section>
    </>
  );
}
