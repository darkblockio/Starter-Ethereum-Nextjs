import Header from '../components/Header'
import { useState, useEffect, useCallback } from 'react'
import { getNFTMetadata, getNFTs, getNFTsOwned } from '../utils/getNfts'
import NftCard from '../components/NftCard'
import Web3 from 'web3'
import { collection } from '../utils/collection'

const platform = 'Ethereum'

export default function Home() {
  const [myNfts, setMyNfts] = useState([])
  const [data, setData] = useState([])
  const [offset, setOffset] = useState(0)
  const [offsetMyNfts, setOffsetMyNfts] = useState(0)
  const [address, setAddress] = useState('')
  const [HasMoreNfts, setHasMoreNfts] = useState(false)
  const [HasMoreMyNfts, setHasMoreMyNfts] = useState(false)
  const [showNfts, setShowNfts] = useState('created')
  const [web3, setWeb3] = useState(null)
  const [arrayOfNfts, setArrayOfNfts] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setWeb3(new Web3(window.web3.currentProvider))
  }, [])

  const getData = async () => {
    await getNFTs(process.env.NEXT_PUBLIC_REACT_APP_WALLET_ADDRESS, 'Ethereum', offset).then((nfts) => {
      let allNfts = data.concat(nfts.nfts.data)
      setData(allNfts)
      setOffset(nfts.nfts.next_offset)
      setHasMoreNfts(nfts.nfts.has_more)
    })
  }

  const getObjectData = useCallback(async () => {
    async function getDataCollection() {
      const arrOfPromises = collection.map( (item, i) => {
          return new Promise( () => {
            setTimeout(() => {
              getNFTMetadata(collection[i].contract, collection[i].id, 'Ethereum').then((data) => {
                const {name,contract,creator_address,token,creator_name,image,is_darkblocked } = data.nft
                const obj = { nft: {name,contract,creator_address,token,creator_name,image,is_darkblocked } }
                console.log(obj)
                setArrayOfNfts((state) => [...state, obj])
              })
            }, 1500);
          })
      })
      return Promise.all(arrOfPromises)
    }
    getDataCollection()
  }, [])


  // const getObjectData = async () => {
  //   collection.map(async (el, i) => {
  //     await getNFTMetadata(collection[i].contract, collection[i].id, 'Ethereum').then((nft) => {
  //       setArrayOfNfts((state) => [...state, nft])
  //     })
  //     setIsLoaded(true)
  //   })
  //   collection.map(async (el, i) => {
  //     setTimeout(async () => {
  //       await getNFTMetadata(collection[i].contract, collection[i].id, 'Ethereum').then((nft) => {
  //         console.log(nft)
  //         setArrayOfNfts((state) => [...state, nft])
  //       })
  //     }, 2000)
  //   })
  // }

  const getMyNFTs = async (address, loadMore) => {
    await getNFTsOwned(address, platform, loadMore ? offsetMyNfts : 0).then((nfts) => {
      let allNfts = []
      if (loadMore && process.env.NEXT_PUBLIC_REACT_APP_USE_WALLET_ADDRESS === 'true') {
        allNfts = myNfts.concat(nfts.nfts.filteredData)
      } else {
        allNfts = nfts.nfts.filteredData
      }
      setMyNfts(allNfts)
      setOffsetMyNfts(nfts.nfts.next_offset)
      setHasMoreMyNfts(nfts.nfts.has_more)
    })
  }

  useEffect(() => {
    const accountWasChanged = (accounts) => {
      setAddress(null)

      setTimeout(() => {
        if (accounts[0]) {
          setAddress(accounts[0])
        }
      }, 0)
    }

    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAddress(null)
      setTimeout(() => {
        if (changedAccounts[0]) {
          setAddress(changedAccounts[0])
        }
      }, 0)
    }

    const clearAccount = () => {
      setAddress(null)
    }

    window.ethereum.on('accountsChanged', accountWasChanged)
    window.ethereum.on('connect', getAndSetAccount)
    window.ethereum.on('disconnect', clearAccount)

    async function getAccount() {
      if (window.ethereum && web3?.eth) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setAddress(accounts[0])
        }
      }
    }
    getAccount()
    // getAddress()
  }, [web3])

  useEffect(() => {
    process.env.NEXT_PUBLIC_REACT_APP_USE_WALLET_ADDRESS === 'true' ? getData() : getObjectData()
  }, [])

  useEffect(() => {
    if (address && address.length > 0) {
      setMyNfts([])
      setOffsetMyNfts(0)
      setTimeout(() => {
        getMyNFTs(address)
      }, 1)
    }
  }, [address])

  return (
    <div className="h-full layout bg-primary">
      <Header address={address} />
      <div>
        <>
          <div>
            <span // eslint-disable-line
              className={`hover:border-b-2 ml-32 mt-32 bg-secondary text-white pb-2 px-4 rounded mr-8 cursor-pointer ${
                showNfts === 'created' ? 'border-b-2 border-black' : 'text-gray-300'
              }`}
              onClick={() => setShowNfts('created')}
            >
              NFTs Created
            </span>
            <span // eslint-disable-line
              className={`hover:border-b-2 bg-secondary text-white px-4 pb-2 rounded cursor-pointer ${
                showNfts === 'darkblockeds' ? 'border-b-2 border-black' : 'text-gray-300'
              }`}
              onClick={() => setShowNfts('darkblockeds')}
            >
              My Filtered NFTs
            </span>
          </div>
          <div className="grid pt-8 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {showNfts === 'created' &&
              data &&
              data.length > 0 &&
              data[0] !== undefined &&
              data.map((nft, i) => <NftCard key={i} nft={nft} />)}
            {showNfts === 'darkblockeds' &&
              myNfts &&
              myNfts.length > 0 &&
              myNfts[0] !== undefined &&
              myNfts.map((nft) => <NftCard key={nft.token} nft={nft} />)}
            {showNfts === 'created' &&
              arrayOfNfts &&
              arrayOfNfts !== [] &&
              arrayOfNfts !== undefined &&
              arrayOfNfts.map((nft, i) => i < collection.length && <NftCard key={i} nft={nft.nft} />)}
          </div>
          {HasMoreNfts && showNfts === 'created' && (
            <button
              onClick={getData}
              className="flex justify-center p-2 m-auto font-semibold bg-white bg-gray-200 rounded "
            >
              Load More
            </button>
          )}
          {/* {(myNfts?.length === 0 || myNfts[0] === undefined) && */}
          {myNfts?.length === 0 && showNfts === 'darkblockeds' && (
            <div className="w-screen h-screen m-auto text-xl text-center text-white">
              {`Oops, looks like you don't have any matching NFTs in this wallet.`}
            </div>
          )}
        </>
      </div>
    </div>
  )
}
