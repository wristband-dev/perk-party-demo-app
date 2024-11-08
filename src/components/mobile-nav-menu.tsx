import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa6';

import { clientRedirectToLogout, truncateDisplayString } from '@/utils/helpers';
import WristbandBadge from '@/components/wristband-badge';
import { useWristband } from '@/context/auth-context';
import { useApiTouchpoints } from '@/context/api-touchpoint-context';

type Props = {
  isMobileNavMenuOpen: boolean;
  setIsMobileNavMenuOpen: (isMobileNavMenuOpen: boolean) => void;
};

const MobileNavMenu = ({ isMobileNavMenuOpen, setIsMobileNavMenuOpen }: Props) => {
  // Context
  const { showApiTouchpoints } = useApiTouchpoints();
  const { tenant, tenantOptions } = useWristband();
  const currentTenantId = tenant.id!;

  // State
  const [isSwitchCompanyScreen, setIsSwitchCompanyScreen] = useState<boolean>(false);

  const closeMobileNavMenu = () => {
    setIsSwitchCompanyScreen(false);
    setIsMobileNavMenuOpen(false);
  };

  return (
    <nav
      className={
        isMobileNavMenuOpen
          ? 'fixed overflow-y-scroll left-0 top-0 w-[100%] h-screen p-8 bg-[#ecf0f3] ease-in duration-300 navbar-md:hidden'
          : 'fixed overflow-y-scroll left-[-100%] top-0 w-[100%] h-screen p-8 ease-in duration-300'
      }
    >
      {/* Header section with back button and close button */}
      <div className="flex w-full items-center justify-between text-black">
        {isSwitchCompanyScreen && (
          <div
            onClick={() => setIsSwitchCompanyScreen(false)}
            className="cursor-pointer hover:text-pink-600 transition duration-300"
          >
            <FaArrowLeft size={25} />
          </div>
        )}
        <div
          onClick={closeMobileNavMenu}
          className="cursor-pointer hover:text-pink-600 transition duration-300 ml-auto"
        >
          <AiOutlineClose size={25} />
        </div>
      </div>

      {/* Container for sliding screens */}
      <div className="overflow-x-hidden w-full">
        <div
          className={`mt-4 flex transition-transform duration-300 ease-in-out ${
            isSwitchCompanyScreen ? '-translate-x-[50%]' : 'translate-x-0'
          }`}
          style={{ minWidth: '200%' }} // makes space for both screens side by side
        >
          {/* Main menu screen */}
          <ul className="w-full text-sm 2xs:text-md xs:text-lg flex-col py-4 text-black">
            <li className="mb-6 list-none">
              <Link
                href="/"
                onClick={closeMobileNavMenu}
                className="cursor-pointer hover:text-pink-600 transition duration-300"
              >
                <span>🏠</span>
                <span className="ml-2">Home</span>
              </Link>
            </li>
            <li className="my-6 list-none">
              <div className="flex items-center justify-start">
                <div
                  onClick={() => setIsSwitchCompanyScreen(true)}
                  className="mr-4 cursor-pointer hover:text-pink-600 transition duration-300"
                >
                  <span>🏢</span>
                  <span className="ml-2">Switch Company</span>
                </div>
                {showApiTouchpoints && (
                  <WristbandBadge
                    isNavbar
                    title="Fetch Tenants API"
                    url="https://docs.wristband.dev/reference/fetchtenantsv1"
                  />
                )}
              </div>
            </li>
            <li className="my-6 list-none">
              <Link
                href="/admin"
                onClick={closeMobileNavMenu}
                className="cursor-pointer hover:text-pink-600 transition duration-300"
              >
                <span>⚙️</span>
                <span className="ml-2">Admin</span>
              </Link>
            </li>
            <li className="my-6 list-none">
              <Link
                href="/settings"
                onClick={closeMobileNavMenu}
                className="cursor-pointer hover:text-pink-600 transition duration-300"
              >
                <span>👤</span>
                <span className="ml-2">Settings</span>
              </Link>
            </li>
            <li className="my-6 list-none">
              <div className="flex items-center justify-start">
                <div
                  onClick={clientRedirectToLogout}
                  className="mr-4 cursor-pointer hover:text-pink-600 transition duration-300"
                >
                  <span>🚪</span>
                  <span className="ml-2">Log Out</span>
                </div>
                {showApiTouchpoints && (
                  <WristbandBadge isNavbar title="Logout API" url="https://docs.wristband.dev/reference/logoutv1" />
                )}
              </div>
            </li>
          </ul>

          {/* Switch Company screen */}
          <ul className="w-full text-sm 2xs:text-md xs:text-lg flex-col py-4 text-black">
            <li className="mb-6 list-none">
              <h2 className="font-semibold">Your Companies:</h2>
            </li>
            {tenantOptions.map((tenantOption) => (
              <li key={tenantOption.tenantId} className="mb-6 list-none">
                <div
                  onClick={() => {
                    if (tenantOption.tenantId !== currentTenantId) {
                      window.location.href = tenantOption.tenantLoginUrl;
                    }
                  }}
                  title={tenantOption.tenantDisplayName}
                  className={`inline-flex items-center ${tenantOption.tenantId === currentTenantId ? 'cursor-not-allowed' : 'cursor-pointer'} hover:text-pink-600 transition duration-300`}
                >
                  {truncateDisplayString(tenantOption.tenantDisplayName)}
                  <span className="ml-4">
                    {tenantOption.tenantId === currentTenantId && (
                      <FaCheck className="cursor-not-allowed text-wristband-green-mid" />
                    )}
                    {tenantOption.tenantId !== currentTenantId && <FaArrowRight />}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavMenu;
