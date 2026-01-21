import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { redirectToLogout, useWristbandSession } from '@wristband/react-client-auth';

import { useApiTouchpoints } from '@/context/api-touchpoint-context';
import WristbandBadge from '@/components/wristband-badge';
import TenantSwitcher from '@/components/tenant-switcher';
import MobileNavMenu from '@/components/mobile-nav-menu';
import { isVipHostRole } from '@/utils/helpers';
import { MySessionMetadata } from '@/types';

const Navbar = () => {
  // Contexts
  const { metadata } = useWristbandSession<MySessionMetadata>();
  const { role, tenant } = metadata;
  const { showApiTouchpoints } = useApiTouchpoints();

  // Mobile Nav State
  const [isMobileNavMenuOpen, setIsMobileNavMenuOpen] = useState<boolean>(false);

  // Disable body scroll when the menu is open
  useEffect(() => {
    if (isMobileNavMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup when component unmounts
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMobileNavMenuOpen]);

  return (
    <>
      <nav className="fixed w-full h-16 shadow-xl bg-black text-white z-[3200]">
        <div className="flex justify-between items-center h-full w-full pl-8 pr-10 2xl:px-16">
          <div className="flex justify-start items-center">
            <Link
              href="/"
              className="block cursor-pointer border border-white rounded-md transition-shadow duration-300 ease-in-out hover:shadow-[0px_0px_8px_3px_rgba(255,255,255,0.5)]"
            >
              <Image src="/perk-party-icon.png" alt="perk-party-icon" width={48} height={48} quality={70} />
            </Link>
            {tenant && tenant.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tenant.logoUrl}
                alt="Company Logo"
                width={40}
                height={40}
                className="object-contain text-xs ml-6"
              />
            )}
          </div>
          <ul className="hidden navbar-md:flex">
            <li className="relative ml-8">
              <div className="absolute bottom-[25px] left-8">
                {showApiTouchpoints && (
                  <WristbandBadge
                    isNavbar
                    title="Fetch Tenants API"
                    url="https://docs.wristband.dev/reference/fetchtenantsv1"
                  />
                )}
              </div>
              <TenantSwitcher />
            </li>
            {isVipHostRole(role) && (
              <li className="relative ml-6">
                <Link
                  href="/admin"
                  className="block capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300"
                >
                  ADMIN
                </Link>
              </li>
            )}
            <li className="relative ml-8">
              <Link
                href="/settings"
                className="block capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300"
              >
                SETTINGS
              </Link>
            </li>
            <li className="relative ml-8">
              <div className="absolute bottom-[25px] right-[-15px]">
                {showApiTouchpoints && (
                  <WristbandBadge
                    isNavbar
                    title="Logout API"
                    buttonText="Wristband API"
                    url="https://docs.wristband.dev/reference/logoutv1"
                  />
                )}
              </div>
              <div
                onClick={() => redirectToLogout('/api/auth/logout')}
                className="capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300"
              >
                LOG OUT
              </div>
            </li>
          </ul>
          <div onClick={() => setIsMobileNavMenuOpen(!isMobileNavMenuOpen)} className="navbar-md:hidden cursor-pointer">
            <AiOutlineMenu size={25} className="hover:text-pink-600 transition duration-300 list-none" />
          </div>
        </div>
        <MobileNavMenu isMobileNavMenuOpen={isMobileNavMenuOpen} setIsMobileNavMenuOpen={setIsMobileNavMenuOpen} />
      </nav>
    </>
  );
};

export default Navbar;
