web3-plugin-0x
===========
[![npm version](https://img.shields.io/badge/npm-0.1.0-brightgreen)](www.npmjs.com/package/web3-plugin-0x)

A plugin that adds Aggregated Swap functionality using 0x Aggregated Network

Prerequisites
===========
- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

Installation
===========
> Note: Make sure you are using `web3` version 4.0.3 or higher in your project.

```bash
npm i web3-plugin-0x --save
```

How to use
------------
> Disclaimer: These methods are only for ERC20 tokens.

1. Initialize the taker address (The address which will fill the quote.)

```
import { Chains } from "web3-plugin-0x/lib/types";
import {ZeroXSwapPlugin} from "web3-plugin-0x";

const web3rpcurl = "any_rpc_url_for_the_chain";
const web3 = new Web3(web3rpcurl);
const takerPrivateKey = "0x..."; // Replace with the actual private key

const wallet = web3.eth.accounts.wallet.add(takerPrivateKey);
const takerAddress = wallet[0].address;
  ```

2. Construct the swap parameters and Initialize the plugin
> Note: Get your API key from here: https://dashboard.0x.org
```
const apiKey = "your_api_key";

const defaultParams = {
  sellToken: "token_address_1",
  buyToken: "token_address_2",
  sellAmount: "1000000000000000000", // 1 ETH in wei
  takerAddress : takerAddress,
};

const chain = Chains.PolygonMumbai;

web3.registerPlugin(new ZeroXSwapPlugin(
        apiKey,
        defaultParams,
        takerPrivateKey,
        chain,
        web3rpcurl)
);
```

3. Get the price for the selected tokens.

 > Note: New defaultParams can be set in any function, they will simply override the values of the previously defined parameters. If not provided, the functions will still work with old parameters.
 
```
 web3.zeroXSwap.getPrice(paramters:optional);
 ```

4. Allow 0x to move your tokens.

```
web3.zeroXSwap.tokenAllowance(paramters:optional);
```

5. Swapping Tokens

```
web3.zeroXSwap.swap(paramters:optional);
```

Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

License
-------

[MIT](https://choosealicense.com/licenses/mit/)
