import { collection } from './collection'

const baseApi = process.env.NEXT_PUBLIC_BASE_API ? process.env.NEXT_PUBLIC_BASE_API : 'https://api.darkblock.io/v1/'

export const getNFTs = async (address, platform, offset = 0) => {
  const pageSize = 48
  return await fetch(
    `${baseApi}/nfts/created?platform=${platform}&account=${address}&offset=${offset}&page_size=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      return {
        nfts: data,
        loaded: true,
        error: false,
        errorMsg: null,
      }
    })
    .catch((error) => {
      return {
        nfts: null,
        loaded: true,
        error: true,
        errorMsg: error,
      }
    })
}

export const getNFTsOwned = async (address, platform, offSet) => {
  const pageSize = 48
  return await fetch(
    `${baseApi}/nfts/collected?platform=${platform}&account=${address}&offset=${offSet}&page_size=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      let filterData
      if (process.env.NEXT_PUBLIC_REACT_APP_USE_WALLET_ADDRESS === 'true') {
        filterData = data.data.filter((item) => {
          return item.creator_address.toLowerCase() === process.env.NEXT_PUBLIC_REACT_APP_WALLET_ADDRESS.toLowerCase()
        })
      } else {
        filterData = []
        collection.forEach((nft) => {
          data.data.filter((item) => {
            if (item.contract === nft.contract && item.token === nft.token) {
              filterData.push(item)
            }
          })
        })
      }

      data.filteredData = filterData

      return {
        nfts: data,
        loaded: true,
        error: false,
        errorMsg: null,
      }
    })
    .catch((error) => {
      return {
        nfts: null,
        loaded: true,
        error: true,
        errorMsg: error,
      }
    })
}

export const getNFTMetadata = async (contract, id, platform) => {
  return await fetch(`${baseApi}/nft/metadata?platform=${platform}&contract=${contract}&token=${id}`)
    .then((response) => response.json())
    .then((data) => {
      return {
        nft: data.data,
        loaded: true,
        error: false,
        errorMsg: null,
      }
    })
    .catch((error) => {
      return {
        nft: null,
        loaded: true,
        error: true,
        errorMsg: error,
      }
    })
}

export const getNFTData = async (contract, tokenId) => {
  return await fetch(`${baseApi}/nft/metadata?platform=Ethereum&contract=${contract}&token=${tokenId}`)
    .then((response) => response.json())
    .then((data) => {
      return {
        nft: data.data,
        loaded: true,
        error: false,
        errorMsg: null,
      }
    })
    .catch((error) => {
      return {
        nft: null,
        loaded: true,
        error: true,
        errorMsg: error,
      }
    })
}
