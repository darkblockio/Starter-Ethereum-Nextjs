import Link from "next/link";
import React, { useContext } from "react";
import { shortenAddr } from "../utils/shortAddress";
import Web3 from "web3";
import { Web3Context } from "../context/Web3Context";
import {
  checkNetwork,
  requestPermissions,
  switchNetwork,
} from "../utils/metamaskHandlers";

const Header = () => {
  const { address, setAddress } = useContext(Web3Context);

  const targetNetworkId = "0x1";

  const connect = async () => {
    const web3 = new Web3(window.web3.currentProvider);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const isCorrect = await checkNetwork();
        if (!isCorrect) switchNetwork(targetNetworkId);
        if (window.web3._provider._state.isConnected) {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        }
      } catch (error) {
        if (error.code === -32002) {
          requestPermissions();
        }
        console.log(error);
        console.error("User denied account access");
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
    }

    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    const accounts = await web3.eth.getAccounts();
    if (accounts && accounts[0]) {
      setAddress(accounts[0]);
      console.log({ account: address });
    }
  };

  return (
    <header className="absolute sticky top-0 z-50 flex flex-col items-center justify-center h-20 px-8 border-b md:flex md:flex-row bg-primary border-secondary w-auto">
      <nav className="flex items-center justify-center w-full">
        <div className="flex items-center flex-auto">
          <div className="flex items-center "></div>
          <Link href="/">
            <img // eslint-disable-line
              className="w-auto h-12 px-2 py-2 border rounded cursor-pointer hover:border-fontColor hover:w-auto border-terciary"
              src="/images/MyLogo.png"
              alt="Change your logo here"
            />
          </Link>
        </div>
        <div className="flex flex-auto items-center">
          <div className="text-fontColor text-4xl ">Ethereum Gallery</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="block ml-2 "></div>
          <div className="items-center justify-end space-x-4 md:inline-flex">
            <button
              className="h-12 px-4 py-2 text-base text-fontColor border rounded bg-primary border-terciary hover:border-fontColor"
              onClick={() => connect()}
            >
              {address && address !== ""
                ? shortenAddr(address)
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
