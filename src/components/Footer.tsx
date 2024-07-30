import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-4 w-full py-16 px-16 bg-gray-900 text-white text-center">
      <div className="flex flex-col xs:flex-row items-center justify-center mb-4">
        <div>
          <span className="text-lg font-semibold mr-2">Made with</span>
          <span className="text-xl mr-2">❤️</span>
          <span className="text-lg font-semibold mr-2">by</span>
        </div>
        <a
          className="cursor-pointer active:scale-95 active:shadow-inner transition duration-300 mt-2 xs:mt-0"
          href="https://wristband.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/wristband_transparent_logo.svg" alt="wristband logo" width={119} height={26} quality={70} />
        </a>
      </div>
      <p className="my-6 mx-auto max-w-[840px]">
        We&apos;d love to hear your thoughts on our auth, tenant and user management, APIs, and more! Like what you see?
        Start building on our multi-tenant auth platform for free!
      </p>
      <a
        href="https://dashboard-wristband.us.wristband.dev/signup"
        className="bg-pink-600 text-white py-2 px-4 rounded-md inline-block transition duration-300 cursor-pointer transform hover:filter hover:brightness-90"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get It For Free
      </a>
    </footer>
  );
}
