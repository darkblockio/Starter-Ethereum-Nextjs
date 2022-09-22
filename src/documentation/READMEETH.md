<h1>Next Ethereum</h1>
<h3>Hey Newbie &#128075;</h3>
<h4>Open this in preview mode for the best experience</h4>
<hr>
<h2>Intro:</h2>
<h3>We are going to build a simple web app using Next and our Ethereum widget.</h3>
<h3>
<a href="https://nextjs.org/docs">Check out the Next documents here</a>and follow the open-source documentation to create and deploy your site along with the documentation we have provided.</h3><hr>
<h2>Setting up Next to run your site</h2><br>
<ol>
<li>Go to your desktop and create a folder where you want your project to live. Open a new terminal, GitBash Here, or cmd.</li><br>
<li>Run the following code in your terminal:</li>
<br>

```
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
```

</ol>
<hr>
<h2>How do you run your site locally?</h2>
<ol>
<li>In the command line, cd into the directory that you created. 
<h3>Ex.</h3>
<br>

```
cd my-next-app
```

<li>Run the command: </li><br>

```
yarn dev
```

or

```
npm run dev
```

<li>Go to your browser of choice and enter http:/localhost:8000 <a href="http://localhost:3000">Or click here</a></li>
</ol>
<hr>
<h2>Set up your React component Using Darkblock with Ethereum Wallet:</h2>

<ol>
<li>Create a folder named "wallet" in the folder "Pages" and then create another folder named "eth.js".</li><br>
<li>Install these libraries with <strong>npm</strong> or <strong>yarn add:</strong></li><br>

```
npm install @darkblock.io/eth-widget @walletconnect/web3-provider' 'web3' 'web3modal' @darkblock.io/eth-widget
```

<h3>or</h3>

```
yarn add @darkblock.io/eth-widget @walletconnect/web3-provider' 'web3' 'web3modal' @darkblock.io/eth-widget
```

<li>Set up your component with react by importing these dependencies from the libraries installed:</li><br>

```
import React, { useEffect, useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { providers } from 'ethers'
import { EthereumDarkblockWidget } from '@darkblock.io/eth-widget'
```

<li>Create your states:</li><br>

```
const Page = () => {
  const [w3, setW3] = useState(null)
  const [flag, setFlag] = useState(false)

/* WALLET ADAPTER VIA WALLETCONNECT */
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
    },
  }

  let web3Modal
  let web3

  useEffect(() => {
    async function modal3() {
      try {
        let provider = await detectEthereumProvider()

        if (!web3Modal) {
          web3Modal = new Web3Modal({
            // network: 'mainnet',
            cacheProvider: true,
            providerOptions,
          })
          await web3Modal.connect()
        }

        let web3Provider
        if (provider) {
          web3Provider = new providers.Web3Provider(provider)
        } else {
          provider = await web3Modal.connect()
        }

        web3 = new Web3(provider)

        setW3(web3)
        setFlag(true)
      } catch (er) {}
    }

    modal3()
  }, [])

	return (
    <div>
      {flag && (
        <EthereumDarkblockWidget
          contractAddress='0x495f947276749ce646f68ac8c248420045cb7b5e'
          tokenId='30553606573219150352991292921105176340809048341686170040023897698980014850148'
          w3={w3}
					cb={cb}                                               // Optional
			    config={config}                                       // Optional
          network='mainnet'
        />
      )}
    </div>
  )
}

export default Page
```

<h3>Ex: <strong>cb function, the callback function will have the widgets state passed as a parameter:</h3><br>

```
const cb = (param) => {
	console.log(param)
}2>2
```

<h3><strong>Config objects</strong> default value:</h3><br>

```
{
  customCssClass: "",             // pass here a class name you plan to use
  debug: false,                   // debug flag to console.log some variables
  imgViewer: {                    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
}
```

<hr>
<h2>Set up Web3</h2>
<h3>You may run into issues building. This is because NodeJS polyfills are not included in the latest version of React</h3>
<h3>Install the missing modules.</h3>
<h3>If you are using yarn:</h3><br>

```
yarn add --dev process crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer path path-browserify dotenv-webpack
```

<h3>If you are using npm:</h3>
<br>

```
npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process path path-browserify dotenv-webpack
```

<h3>Create a file in the root of the project and put the following code:</h3>

```
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new Dotenv(),
    ],
  })
}
```

<h3>Create a file in the root of the project <strong>.env</strong> and put the following code:</h3>
NEXT_PUBLIC_REACT_APP_WALLET_ADDRESS=YourDefaultAddresHere //this is the default address with NFTs you want to see as a gallery
NEXT_PUBLIC_REACT_APP_USE_WALLET_ADDRESS=true //true if you want to use a wallet addres, false if you want to use a Json object

<h3>Restart your app and run</h3>
<br>

```
npm run dev
```

<h3>Refresh your page and you will need to log into your Ethereum wallet.</h3>
<br>

<img src="./eth.png"><br>

<h3>And now you have the <strong>Darkblock Ethereum Widget</strong> working!!!	&#x1f609; Congrats.</h3><br>

<img src="./EthereumAuth.png"><br>

<h3>The whole code for this guide is in <a href="https://github.com/darkblockio/Starter-Ethereum-Nextjs">Github</a></h3>
