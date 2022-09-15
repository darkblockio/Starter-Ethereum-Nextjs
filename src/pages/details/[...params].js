import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Web3 from 'web3'
import Header from '../../components/Header'
import { validateImage } from '../../utils/validateImage'
import { useRouter } from 'next/router'
import { getNFTMetadata } from '../../utils/getNfts'

const EthereumDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/eth-widget').then((mod) => {
      return mod.EthereumDarkblockWidget
    }),
  { ssr: false }
)

const cb = (state) => {
  // console.log(state) // enable to log out unlockable process states
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

const platform = 'Ethereum'

const NftDetailCard = () => {
  const router = useRouter()
  const contract = router.query.params ? router.query.params[0] : null
  const id       = router.query.params ? router.query.params[1] : null
  const [wallet, setWallet] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [nft, setNft] = useState(null)

  useEffect(() => {
      setWeb3(new Web3(window.web3.currentProvider))
      setNft(window.history.state)
  }, [])

  useEffect(() => {
    if (id && contract) {
      // const platformParam = network !== 'rinkeby' ? '' : '-devnet'
      const platformParam = ''

      getNFTMetadata(contract, id, `${platform}${platformParam}`).then((data) => {
        setNft(data.nft)
      })
    }
  }, [id, contract])

  useEffect(() => {
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
        method: 'eth_requestAccounts',
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
      if (window.ethereum && web3?.eth) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setWallet(web3)
        }
      }
    }

    getAccount()
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden text-white bg-primary ">
      <Header />
      <div className="flex gap-10 mx-20 mt-8 flex-col-2">
        <div></div>
        <div className="flex flex-col">
          {
            nft && nft.image ? (
            <img
              className="mx-0 border border-gray-200 rounded-md shadow-md"
              src={validateImage(nft.image)}
              alt="NFT" />
            ) : <></>
          }
        </div>
        <div className="flex flex-col w-2/3">
          {
            nft && (
              <>
              <div className="mb-2 font-sans text-4xl font-bold">{nft.name}</div>
              <div>{nft.description}</div>
              <div>
                {wallet && (
                  <EthereumDarkblockWidget
                    contractAddress={nft.contract}
                    tokenId={nft.token}
                    w3={wallet}
                    cb={cb} // Optional
                    config={config}
                  />
                )}

                {!wallet && (
                  <EthereumDarkblockWidget
                    contractAddress={nft.contract}
                    tokenId={nft.token}
                    w3={null}
                    cb={cb} // Optional
                    config={config}
                  />
                )}
              </div>
              </>

            )
          }
        </div>
      </div>
    </div>
  )
}

export default NftDetailCard

