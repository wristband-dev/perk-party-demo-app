type Props = {
  buttonText?: string;
  title?: string;
  url?: string;
};

export default function WristbandBadge({ buttonText, title, url }: Props) {
  return (
    <div
      title={title || 'Wristband API'}
      className="font-medium bg-wristband-green tracking-wide text-black py-1 px-4 rounded-full inline-block text-sm hover:brightness-90 cursor-pointer transition duration-300"
      onClick={url ? () => window.open(url, '_blank') : undefined}
    >
      {buttonText || 'Wristband API'}
    </div>
  );
}
