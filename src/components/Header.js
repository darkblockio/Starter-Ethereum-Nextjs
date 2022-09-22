import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { shortenAddr } from '../utils/shortAddress'
import Web3 from 'web3'

const Header = () => {
  const [address, setAddress] = useState('')

  const connect = async () => {
    const web3 = new Web3(window.web3.currentProvider)

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        // Request account access if needed
        await window.ethereum.enable()
      } catch (error) {
        // User denied account access...
        console.error('User denied account access')
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)
    }

    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    const accounts = await web3.eth.getAccounts()
    if (accounts && accounts[0]) {
      setAddress(accounts[0])
    }
  }

  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    const web3 = new Web3(window.web3.currentProvider)
    const accountWasChanged = (accounts) => {
      if (accounts[0]) {
        setAddress(accounts[0])
      } else {
        setAddress('')
      }
    }
    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (changedAccounts[0]) {
        setAddress(changedAccounts[0])
      } else {
        setAddress('')
      }
    }
    const clearAccount = () => {
      setAddress('')
    }

    window.ethereum.on('accountsChanged', accountWasChanged)
    window.ethereum.on('connect', getAndSetAccount)
    window.ethereum.on('disconnect', clearAccount)

    async function getAddress() {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setAddress(accounts[0])
        }
      }
    }

    getAddress()
  }, [])

  return (
    <header className="sticky top-0 z-50 absolute md:flex flex flex-col md:flex-row items-center justify-center h-20 px-8 border-b bg-primary border-secondary">
      <nav className="flex items-center justify-center w-full">
        <div className="flex items-center flex-auto">
          <div className="flex items-center "></div>
          <Link href="/">
            <img
              className="w-auto h-12 px-2 py-2 border hover:border-white hover:w-auto rounded cursor-pointer  border-terciary"
              src="/images/MyLogo.png"
              alt="Change your logo here"
            ></img>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div className="block ml-2 "></div>
          <div className="items-center justify-end space-x-4 md:inline-flex">
            <button
              className="px-4 py-2 text-white border h-12 rounded bg-primary border-terciary hover:border-white text-base"
              onClick={() => connect()}
            >
              {address && address !== '' ? shortenAddr(address) : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
