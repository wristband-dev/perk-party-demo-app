import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaHome } from 'react-icons/fa';

import { Raleway } from 'next/font/google';

import { clientRedirectToLogout } from '@/utils/helpers';

const raleway = Raleway({ subsets: ['latin'] });

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleNav = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed w-full h-16 shadow-xl bg-black text-white z-[3200]">
      <div className="flex justify-between items-center h-full w-full px-10 2xl:px-16">
        <Link
          href="/"
          className={`font-bold tracking-widest ${raleway.className} hover:text-pink-600 cursor-pointer transition duration-300`}
          style={{ fontSize: 'clamp(1.625rem, 5vw, 2rem)', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
        >
          PERK PARTY
        </Link>
        <div className="hidden md:flex">
          <ul className="hidden md:flex">
            <Link href="/">
              <li className="mr-2 capitalize hover:text-pink-600 text-2xl font-bold cursor-pointer transition duration-300 list-none flex items-center">
                <FaHome />
              </li>
            </Link>
            <Link href="/admin">
              <li className="ml-8 capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300">
                ADMIN
              </li>
            </Link>
            <Link href="/settings">
              <li className="ml-8 capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300">
                SETTINGS
              </li>
            </Link>
            <div onClick={clientRedirectToLogout} className="cursor-pointer">
              <li className="ml-8 capitalize border-b-2 border-transparent hover:border-b-2 hover:border-pink-600 hover:text-pink-600 text-l font-bold cursor-pointer transition duration-300">
                LOG OUT
              </li>
            </div>
          </ul>
        </div>
        <div onClick={handleNav} className="md:hidden cursor-pointer">
          <AiOutlineMenu size={25} className="hover:text-pink-600 transition duration-300 list-none" />
        </div>
      </div>
      <div
        className={
          menuOpen
            ? 'fixed left-0 top-0 w-[100%] h-screen p-8 bg-[#ecf0f3] ease-in duration-300 md:hidden'
            : 'fixed left-[-100%] top-0 w-[100%] h-screen p-8 ease-in duration-300'
        }
      >
        <div className="flex w-full items-center justify-end text-black">
          <div onClick={handleNav} className="cursor-pointer hover:text-pink-600 transition duration-300">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <div className="flex-col py-4 text-black">
          <ul>
            <Link href="/">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer hover:text-pink-600 transition duration-300 list-none"
              >
                Home
              </li>
            </Link>
            <Link href="/admin">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer hover:text-pink-600 transition duration-300 list-none"
              >
                Admin
              </li>
            </Link>
            <Link href="/settings">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer hover:text-pink-600 transition duration-300 list-none"
              >
                Settings
              </li>
            </Link>
            <div onClick={clientRedirectToLogout} className="cursor-pointer">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer hover:text-pink-600 transition duration-300 list-none"
              >
                Log Out
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
