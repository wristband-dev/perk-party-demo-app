import { useState } from 'react';

export function PerkCard({ image, perkName, perkDesc, banner }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="w-[320px] h-[250px] mb-16 mx-8 bg-black shadow-2xl border-gray-200 rounded-lg overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
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

      {isModalOpen && (
        <div className="p-10 fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg relative overflow-hidden">
            <section className="m-0 relative">
              <img 
                src={image}
                alt="Logo" 
                className="max-h-[400px] w-full object-cover"
              />
              <button 
                type="button" 
                className="absolute top-0 right-0 m-4 bg-black text-white hover:bg-pink-600 border border-black focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" 
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </section>
            <div className="flex flex-col m-4">
              <h1 className="text-2xl font-bold mb-2">{perkName}</h1>
              <p className="text-lg">{perkDesc}</p>
            </div>
            <div className="flex justify-center mb-4">
              <button 
                type="button" 
                className="bg-black text-white hover:bg-pink-600 border border-black focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}