import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Header from '../../components/Header'
import { EthereumDarkblockWidget } from '@darkblock.io/eth-widget'
import { getNFTMetadata } from '../../utils/getNfts'
import { validateImage } from '../../utils/validateImage'
import { dateTimeFormat } from '../../utils/dateFormatter'
import { shortenAddr } from '../../utils/shortAddress'
import { useRouter } from 'next/router'

const countAttribs = nft => {
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
  const id = router.query.params ? router.query.params[1] : null
  const platform = 'Ethereum'

  const [nftData, setNftData] = useState(null)
  const [wallet, setWallet] = useState(null)
  console.log(nftData, 'hfjdkahfladshfsdjafhlsdaf')

  useEffect(() => {
    if (id && contract && id !== undefined && contract !== undefined) {
      getNFTMetadata(contract, id, `${platform}`).then(data => {
        setNftData(data.nft)
      })
    }
  }, [])

  //   const contracts = nftData.contract
  //   const token = nftData.token
  //   const owner = nftData.owner_address
  //   const creators = nftData.all_creators
  //   const traits = nftData.traits

  //  const tokenIdRedirects = {
  //    Ethereum: `https://opensea.io/assets/ethereum/${contracts}/${token}`,
  //  }
  //  const contractAddresRedirects = {
  //    Ethereum: `https://etherscan.io/address/${contracts}`,
  //  }

  const cb = state => {
    console.log(state) // log out unlockable process states
  }

  const config = {
    customCssClass: '', // pass here a class name you plan to use
    debug: false, // debug flag to console.log some variables
    imgViewer: {
      // image viewer control parameters
      showRotationControl: true,
      autoHideControls: true,
      controlsFadeDelay: true
    }
  }

  useEffect(() => {
    const web3 = new Web3(window.web3.currentProvider)

    const accountWasChanged = accounts => {
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

    async function getAccount () {
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
    <div className='w-screen h-auto overflow-hidden text-white bg-primary '>
      <Header />
      {nftData ? (
        <div className='flex gap-10 mx-20 mt-8 flex-col-2'>
          <div></div>
          <div className='flex flex-col'>
            {nftData && nftData.image ? (
              <img
                className='mx-0 border border-gray-200 rounded-md shadow-md'
                src={validateImage(nftData.image)}
                alt='NFT'
              />
            ) : (
              <></>
            )}
          </div>
          <div className='flex flex-col w-2/3'>
            <div className='mb-2 font-sans text-4xl font-bold'>
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
            <div className='grid w-full grid-cols-1 gap-6 px-4 py-12 mt-12 borter-t-[4px] md:grid-cols-2'>
              <div className='flex flex-col pb-2'>
                <div className='flex flex-row mb-2'>
                  <h2 className='font-bold'>Traits:</h2>
                  <div className='px-2 py-1 ml-2 text-xs font-semibold rounded bg-gray-200 text-gray-800'>
                    {nftData.traits?.length ? nftData.traits.length : 0}
                  </div>
                </div>
                <div className='flex-col'>
                  {nftData.traits?.map(i => {
                    return (
                      <div className='flex h-16 text-center border border-gray-200 rounded-md'>
                        <div className='m-auto'>
                          <p className='text-sm font-bold text-gray-500 uppercase'>
                            {i.name}
                          </p>
                          <p className='w-32 text-xs font-semibold text-gray-500 truncate'>
                            {i.value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div>
                    <div className='flex pb-2 mt-2'>
                      <h2 className='font-bold'>Owned by</h2>
                      <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 border border-gray-100 bg-gray-200 rounded'>
                        {1}
                      </div>
                    </div>
                    <p className='border border-gray-100 rounded text-gray-700 pb-8 font-medium '>{shortenAddr(nftData.owner_name)}</p>
                    {/* <a
                      className='pb-8 font-medium underline truncate'
                      href={`https://app.darkblock.io/platform/${shortPlatforms[platform]}/${owner}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                    </a> */}

                    <div className='flex pb-2 mt-2'>
                      <h2 className='font-bold '>Created by</h2>
                      <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded'>
                        {nftData.creators?.length ? nftData.creators.length : 0}
                      </div>
                    </div>
                    {nftData.creators && (
                    
                        <p className='border border-gray-100 rounded text-gray-700 pb-8 font-medium'>{shortenAddr(nftData.creator_address)}</p>
                    )}
                  </div>
                  {/* <h2>Created By:</h2>
                  <li>{shortenAddr(nftData.creator_address)}</li>
                  <h4>Owned By:</h4>
                  <li>{shortenAddr(nftData.owner_address)}</li> */}
                </div>
              </div>
              <div>
                <div className='flex pb-2'>
                  <h2 className='font-bold'>Details</h2>
                  <div className='px-2 py-1 ml-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded'>
                    {countAttribs(nftData)}
                  </div>
                </div>
                <div className='grid grid-cols-2 text-left border border-gray-200 rounded-md p-2'>
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
                      {/* {/* <a
                <a>
                className="py-2 text-right underline truncate text-ellipsis"
                href={tokenIdRedirects[platform]}
                rel="noreferrer"
                target="_blank"
              > 
              </a> */}
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
                      {/* <a
                className="py-2 text-right underline truncate"
                href={contractAddresRedirects[platform]}
                rel="noreferrer"
                target="_blank"
              >
              </a> */}
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
            </div>
          </div>
        </div>
      ) : (
        <div className='flex gap-10 mx-20 mt-8 flex-col-2'>nft not found</div>
      )}
    </div>
  )
}

export default NftDetailCard
