import { useEffect, useRef, useState } from 'react';
import { useWristband } from '@/context/auth-context';
import { AiOutlineDown } from 'react-icons/ai';

import { truncateDisplayString } from '@/utils/helpers';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

const TenantSwitcher = () => {
  const { tenant, tenantOptions } = useWristband();

  // Tenant Switcher State
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState<boolean>(false);
  const currentTenantId = tenant.id!;
  const toggleTenantDropdown = () => setTenantDropdownOpen(!tenantDropdownOpen);

  // Close the dropdown if a click occurs outside of it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dropdownRef = useRef<any>(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (tenantDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTenantDropdownOpen(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts or menuOpen changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tenantDropdownOpen]);

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={toggleTenantDropdown}
          className={`capitalize font-bold hover:text-pink-600 ${tenantDropdownOpen ? 'text-pink-600' : ''} transition duration-300 flex items-center`}
        >
          SWITCH COMPANY <AiOutlineDown className="ml-1" />
        </button>
        {tenantDropdownOpen && (
          <ul className="absolute top-8 left-0 bg-white text-black w-60 shadow-lg rounded-md z-10 border">
            {tenantOptions.map((tenantOption) => (
              <li
                key={tenantOption.tenantId}
                title={tenantOption.tenantDisplayName}
                className="px-4 py-2 hover:bg-pink-600 hover:text-white cursor-pointer first:rounded-t-md last:rounded-b-md flex justify-between items-center"
                onClick={() => {
                  if (tenantOption.tenantId === currentTenantId) {
                    setTenantDropdownOpen(false);
                  } else {
                    window.location.href = tenantOption.tenantLoginUrl;
                  }
                }}
              >
                <span>{truncateDisplayString(tenantOption.tenantDisplayName)}</span>
                {tenantOption.tenantId === currentTenantId && <FaCheck className="text-wristband-green-mid" />}
                {tenantOption.tenantId !== currentTenantId && <FaArrowRight />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TenantSwitcher;
