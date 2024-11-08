import { SyntheticEvent } from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

type Props = {
  buttonText?: string;
  isNavbar?: boolean;
  title?: string;
  url?: string;
};

export default function WristbandBadge({ buttonText, isNavbar, title, url }: Props) {
  let classes: string =
    'font-medium bg-wristband-green tracking-wide text-black py-1 px-4 rounded-full inline-flex justify-center items-center text-sm hover:brightness-90 cursor-pointer transition duration-300';

  if (isNavbar) {
    classes =
      'inline-flex justify-center items-center text-center leading-[1.4] w-[108px] h-[14px] font-medium bg-wristband-green tracking-tight text-black rounded-full text-[11px] hover:brightness-90 cursor-pointer transition duration-300';
  }

  return (
    <div
      title={title || 'Wristband API'}
      className={classes}
      onClick={
        url
          ? (e: SyntheticEvent) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }
          : undefined
      }
    >
      {buttonText || 'Wristband API'}
      <span className="ml-2">
        <FaArrowUpRightFromSquare />
      </span>
    </div>
  );
}
