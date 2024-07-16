import { useState } from 'react';

export function PerkCard({ image, perkName, perkDesc, banner }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-[320px] h-[250px] mb-16 mx-8 bg-black shadow-2xl border-gray-200 rounded-lg overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-3/5">
        <img src={image} alt="Logo" className="w-full h-full object-cover cursor-pointer" />
        {banner && (
          <div className="absolute top-0 right-0 p-2">
            <h1 className="text-xl pt-2 text-white bg-pink-600 rounded-lg font-bold p-2">{banner}</h1>
          </div>
        )}
      </div>
      <div className="p-4 h-2/5 flex flex-col justify-between">
        <h1 
          className={`text-xl text-white font-bold ${perkName.length > 20 ? 'text-lg' : ''}`}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {perkName}
        </h1>
        <p 
          className="text-sm text-white overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {perkDesc}
        </p>
      </div>
      {isHovered && (
        <div className="absolute inset-0 text-white bg-black bg-opacity-90 p-4 flex items-center justify-center">
          <p className="text-lg font-bold italic">{perkDesc}</p>
        </div>
      )}
    </div>
  );
}