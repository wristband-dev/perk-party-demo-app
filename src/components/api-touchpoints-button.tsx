import Image from 'next/image';

import { useApiTouchpoints } from '@/context/api-touchpoint-context';

export default function ApiTouchpointsButton() {
  const { showApiTouchpoints, setShowApiTouchpoints } = useApiTouchpoints();

  return (
    <div className="fixed bottom-6 right-6 inline-flex items-center justify-center group">
      {/* Tooltip Box */}
      <div className="absolute left-[-120px] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-28 px-2 py-1 bg-white text-gray-800 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>{showApiTouchpoints ? 'Hide APIs?' : 'Show APIs?'}</span>
        <span className="ml-1">{showApiTouchpoints ? '🙈' : '🔍'}</span>
      </div>

      {/* Main Button */}
      <button
        className="flex items-center justify-center w-16 h-16 rounded-full bg-wristband-green text-black shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:bg-wristband-green-mid transition-colors duration-300"
        aria-label="API Touchpoints Button"
        onClick={() => setShowApiTouchpoints(!showApiTouchpoints)}
      >
        <Image src="/api-touchpoints-icon.png" alt="wristband logo" width={44} height={44} quality={80} />
      </button>
    </div>
  );
}
