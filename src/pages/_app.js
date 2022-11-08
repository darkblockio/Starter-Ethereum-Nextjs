import { Web3Provider } from "../context/Web3Provider";
import { useEffect } from "react";

import "./styles/globals.css";
import "./styles/darkblock.css";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
