import React from 'react'
import Link from 'next/link';

const NftCard = ({ nft }) => {
  const { name, image, is_darkblocked, contract, token } = nft

  return (
    <Link href={`details/${contract}/${token}`}>
      {image ? (
        <div className="mb-8 text-center transition-all transform hover:scale-105 bg-secondary h-84 w-72 rounded-xl">
          <div>
            <img // eslint-disable-line
              className='object-cover mx-auto h-72'
              loading={'lazy'}
              alt={image}
              src={image}
            />
          </div>
          <div className="w-full p-3 text-left">
            <h2 className="text-lg font-semibold leading-5 text-white truncate whitespace-nowrap">
              {name}
            </h2>
            { is_darkblocked ? (
              <div className="flex justify-end w-full ">
                <img // eslint-disable-line
                  alt="icon"
                  className="h-5"
                  src="/footericon-blk.svg"
                ></img>
              </div>
            ) : <div className='h-5'></div>}
          </div>
        </div>
      ) : (
        <></>
      )}
    </Link>
  )
}

export default NftCard
