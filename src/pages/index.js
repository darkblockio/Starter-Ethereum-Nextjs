import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { getNFTs, getNFTsOwned } from '../utils/getNfts'
import { shortenAddr } from '../utils/shortAddress'
import NftCard from '../components/NftCard'
import Web3 from 'web3'

const platform = 'Ethereum'

export default function Home() {
  const [myNfts, setMyNfts] = useState([])
  const [data, setData] = useState([])
  const [offset, setOffset] = useState(0)
  const [offsetMyNfts, setOffsetMyNfts] = useState(0)
  const [address, setAddress] = useState('')
  const [HasMoreNfts, setHasMoreNfts] = useState(true)
  const [HasMoreMyNfts, setHasMoreMyNfts] = useState(true)
  const [showNfts, setShowNfts] = useState('created')
  const [web3, setWeb3] = useState(null)

  useEffect(() => {
      setWeb3(new Web3(window.web3.currentProvider))
  }, [])

  const getData = async () => {
    await getNFTs(process.env.NEXT_PUBLIC_REACT_APP_WALLET_ADDRESS, 'Ethereum', offset).then(
      (nfts) => {
        let allNfts = data.concat(nfts.nfts.data)
        setData(allNfts)
        setOffset(nfts.nfts.next_offset)
        setHasMoreNfts(nfts.nfts.has_more)
      }
    )
  }

  const getMyNFTs = async (address, loadMore) => {
    await getNFTsOwned(address, platform, loadMore ? offsetMyNfts : 0).then((nfts) => {
      let allNfts = []
      if (loadMore) {
        allNfts = myNfts.concat(nfts.nfts.data)
      } else {
        allNfts = nfts.nfts.data
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
    getData()
    // getAddress()
  }, [web3])

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
    <div className="layout bg-primary">
      <Header address={address} />
      <div>
        <>
          <div className="pb-10 ml-32 text-2xl font-bold text-white">
            {/* {address === ''
              ? `Wallet: ${shortenAddr(process.env.REACT_APP_WALLET_ADDRESS)}`
              : `Wallet: ${shortenAddr(address)}`} */}
          </div>
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
                showNfts === 'darkblockeds'
                  ? 'border-b-2 border-black'
                  : 'text-gray-300'
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
              myNfts.map((nft, i) => <NftCard key={i} nft={nft} />)}
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
          {(myNfts?.length === 0 ) &&
            showNfts === 'darkblockeds' && (
              <div className=" text-white text-xl w-screen text-center m-auto ">
                Oops, looks like you don't have any matching NFTs in this wallet.
              </div>
            )}
          {HasMoreMyNfts && showNfts === 'darkblockeds' && (
            <button
              onClick={() => getMyNFTs(address, true)}
              className="flex justify-center p-2 m-auto font-semibold bg-white bg-gray-200 rounded "
            >
              Load More
            </button>
          )}
        </>
      </div>
    </div>
  )
}
