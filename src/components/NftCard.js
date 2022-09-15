import React from 'react'
import Link from 'next/link';

const NftCard = ({ nft }) => {
  const { name, image, is_darkblocked, contract, token } = nft

  return (
    <Link href={`details/${contract}/${token}`}>
      {image ? (
        <div className="mb-8 text-center border border-gray-200 shadow-sm bg-secondary h-84 w-60 rounded-xl shadow-white hover:shadow-md hover:shadow-white">
          <div className="rounded-lg">
            <img
              loading={'lazy'}
              alt={image}
              className="object-contain mx-auto mt-2 h-60 w-44 rounded-t-xl"
              src={image}
            />
          </div>
          <div className="w-full p-2 my-2 text-left">
            <h2 className="text-lg font-bold leading-5 text-center text-white truncate whitespace-nowrap">
              {name}
            </h2>
          </div>
          <div className="w-full p-2 my-1 text-left">
            <h2 className="text-sm leading-5 text-white truncate whitespace-nowrap">
              {is_darkblocked && (
                <img
                  alt="icon"
                  className="float-right w-auto h-4 mx-auto mt-1 text-black"
                  src="/footericon-blk.svg"
                ></img>
              )}
            </h2>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Link>
  )
}

export default NftCard
