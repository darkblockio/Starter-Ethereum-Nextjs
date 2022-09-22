import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Header from '../../components/Header'
import { getNFTMetadata } from '../../utils/getNfts'
import { validateImage } from '../../utils/validateImage'
import { dateTimeFormat } from '../../utils/dateFormatter'
import { shortenAddr } from '../../utils/shortAddress'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const EthereumDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/eth-widget').then(mod => {
      return mod.EthereumDarkblockWidget
    }),
  { ssr: false }
)

const cb = (state) => {
  console.log(state) // log out unlockable process states
}

const config = {
  customCssClass: '', // pass here a class name you plan to use
  debug: false, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
}

const countAttribs = (nft) => {
  let count = 1
  if (nft.token) count++
  if (nft.contract) count++
  if (nft.blockchain) count++
  if (nft.edition) count++
  if (nft.nft_date_created) count++
  return count
}

const NftDetailCard = () => {
  const router = useRouter()
  const contract = router.query.params ? router.query.params[0] : null
  const id       = router.query.params ? router.query.params[1] : null
  const platform = 'Ethereum'

  const [nftData, setNftData] = useState(null)
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    if (id && contract && id !== undefined && contract !== undefined) {
      getNFTMetadata(contract, id, `${platform}`).then((data) => {
        setNftData(data.nft)
      })
    }
  }, [id, contract])

  useEffect(() => {
    const web3 = new Web3(window.web3.currentProvider)

    const accountWasChanged = (accounts) => {
      setWallet(null)

      setTimeout(() => {
        if (accounts[0]) {
          setWallet(web3)
        }
      }, 0)
    }

    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setWallet(null)
      setTimeout(() => {
        if (changedAccounts[0]) {
          setWallet(web3)
        }
      }, 0)
    }

    const clearAccount = () => {
      setWallet(null)
    }

    window.ethereum.on('accountsChanged', accountWasChanged)
    window.ethereum.on('connect', getAndSetAccount)
    window.ethereum.on('disconnect', clearAccount)

    async function getAccount() {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setWallet(web3)
        }
      }
    }

    getAccount()
  }, [])

  return (
    <div>
      <Header />
      <div className=' h-auto md:overflow-hidden text-white bg-primary'>
        {nftData ? (
          <div>
            <div className='flex md:mx-20 pt-8 mx-2 md:flex-cols-2 w-96 md:w-auto sm:flex-row flex-col'>
              <div className='md:w-1/2'>
                {nftData && nftData.image ? (
                  <img // eslint-disable-line
                    className='my-5 border border-gray-200 rounded-md shadow-md'
                    src={validateImage(nftData.image)}
                    alt='NFT'
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className=' md:w-1/2 my-5 sm:w-full md:text-left text-center m-0'>
                <div className='mb-10 md:mb-2 font-sans text-4xl font-bold'>
                  {nftData.name}
                </div>
                <div>{nftData.nft_description}</div>
                <div>
                  {wallet && (
                    <EthereumDarkblockWidget
                      contractAddress={nftData.contract}
                      tokenId={nftData.token}
                      w3={wallet}
                      cb={cb} // Optional
                      config={config}
                    />
                  )}

                  {!wallet && (
                    <EthereumDarkblockWidget
                      contractAddress={nftData.contract}
                      tokenId={nftData.token}
                      w3={null}
                      cb={cb} // Optional
                      config={config}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className='grid w-full md:grid-cols-3 gap-4 px-4 py-12 mt-12 border-t-[1px] md:grid-cols-3 md:px-7'>
                <div className='flex flex-col pb-2'>
                  <div className='flex flex-row mb-2'>
                    <h2 className='font-bold'>Traits:</h2>
                    <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded'>
                      {nftData.traits?.length ? nftData.traits.length : 0}
                    </div>
                  </div>
                  <div className='border border-gray-200 rounded-md'>
                    {nftData.traits?.map(i => {
                      return (
                        <>
                          <div className='grid grid-cols-2 p-2 md:grid-cols-2 '>
                            <p className='pt-1 text-sm font-semibold text-left text-gray-500'>
                              {i.name}
                            </p>
                            <p className=' text-base text-right text-white'>
                              {i.value}
                            </p>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div className='flex pb-2'>
                    <h2 className='font-bold'>Details</h2>
                    <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded'>
                      {countAttribs(nftData)}
                    </div>
                  </div>
                  <div className='grid grid-cols-2 p-2 text-left border border-gray-200 rounded-md'>
                    {platform && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Blockchain</h3>
                        </div>
                        <div className='py-2 text-right truncate text-ellipsis'>
                          <p>{platform}</p>
                        </div>
                      </>
                    )}
                    {nftData.token && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Token ID</h3>
                        </div>

                        <p className='py-2 text-right underline truncate text-ellipsis'>
                          {shortenAddr(nftData.token)}
                        </p>
                      </>
                    )}
                    {contract && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Contract Address</h3>
                        </div>

                        <p className='py-2 text-right underline truncate'>
                          {shortenAddr(contract)}
                        </p>
                      </>
                    )}
                    {nftData.blockchain && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Contract Standard</h3>
                        </div>
                        <div className='py-2 text-right'>
                          <p>{nftData.blockchain}</p>
                        </div>
                      </>
                    )}
                    {nftData.edition && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Editions</h3>
                        </div>
                        <div className='py-2 text-right'>
                          <p>{nftData.edition}</p>
                        </div>
                      </>
                    )}
                    {nftData.nft_date_created && (
                      <>
                        <div className='py-2 text-sm font-semibold text-gray-500'>
                          <h3>Date Contract</h3>
                        </div>
                        <div className='py-2 text-right'>
                          <p>{dateTimeFormat(nftData.nft_date_created)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <div className='flex pb-2'>
                      <h2 className='font-bold'>Owned by</h2>
                      <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-100 rounded'>
                        {1}
                      </div>
                    </div>
                    <p className='p-3 font-medium text-center text-gray-700 border border-gray-100 rounded '>
                      {shortenAddr(nftData.owner_address)}
                    </p>

                    <div className='flex pb-2 mt-2'>
                      <h2 className='font-bold '>Created by</h2>
                      <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded'>
                        {nftData.creators?.length ? nftData.creators.length : 1}
                      </div>
                    </div>
                    {nftData.creator_address && (
                      <p className='p-3 font-medium text-center text-gray-700 border border-gray-100 rounded'>
                        {shortenAddr(nftData.creator_address)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='h-screen md:mt-20 text-2xl text-center'>NFT not found</div>
        )}
      </div>
    </div>
  )
}

export default NftDetailCard
