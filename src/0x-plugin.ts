/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Web3PluginBase, Web3 } from "web3";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ERC20TokenContract } from "@0x/contract-wrappers";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from "@0x/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import qs from "qs";
import { SwapParams, Chains } from "./types";

export class ZeroXSwapPlugin extends Web3PluginBase {
  public pluginNamespace = "zeroXSwap";
  private apiKey: string;
  private defaultParams: SwapParams;
  private web3: any;
  private takerPrivateKey: string;
  private chain: Chains;

  constructor(
    apiKey: string,
    defaultParams: SwapParams,
    takerPrivateKey: string,
    chain: Chains,
    web3rpcurl: string
  ) {
    super();
    this.apiKey = apiKey;
    this.defaultParams = defaultParams;
    this.web3 = new Web3(web3rpcurl);
    this.takerPrivateKey = takerPrivateKey;
    this.chain = chain;
  }

  private async signAndSendTransaction(txObject: any): Promise<string> {
    if (!this.takerPrivateKey) {
      throw new Error("Taker's private key not set");
    }

    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      txObject,
      this.takerPrivateKey
    );

    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    return receipt.transactionHash;
  }

  public async tokenAllowance(
    overrideParams: Partial<{
      sellToken: string;
      buyToken: string;
      sellAmount: string;
      takerAddress: string;
    }> = {}
  ): Promise<string> {
    const params = { ...this.defaultParams, ...overrideParams };
    const headers = { "0x-api-key": this.apiKey };
    const res = await fetch(
      `https://${this.chain}api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers }
    );
    const quote = await res.json();

    const tokenContract = new ERC20TokenContract(
      params.sellToken,
      this.web3.eth.currentProvider
    );

    // const price = await this.getPrice();
    // const gasfees = price.gasPrice * price.gas;
    // const maxApproval = new BigNumber(params.sellAmount).plus(gasfees);

    const maxApproval = new BigNumber(2).pow(256).minus(1);

    const approvalTxData = tokenContract
      .approve(quote.allowanceTarget, maxApproval)
      .getABIEncodedTransactionData();

    const txdata = await this.signAndSendTransaction({
      from: params.takerAddress,
      to: params.sellToken,
      data: approvalTxData,
    });

    console.log(txdata);
    return txdata;
  }

  public async getPrice(
    overrideParams: Partial<{
      sellToken: string;
      buyToken: string;
      sellAmount: string;
      takerAddress: string;
    }> = {}
  ): Promise<any> {
    const params = { ...this.defaultParams, ...overrideParams };
    const headers = { "0x-api-key": this.apiKey };

    const response = await fetch(
      `https://${this.chain}api.0x.org/swap/v1/price?${qs.stringify(params)}`,
      { headers }
    );

    return await response.json();
  }

  public async swap(
    overrideParams: Partial<{
      sellToken: string;
      buyToken: string;
      sellAmount: string;
      takerAddress: string;
    }> = {}
  ): Promise<any> {
    const params = { ...this.defaultParams, ...overrideParams };
    const headers = { "0x-api-key": this.apiKey };

    const response = await fetch(
      `https://${this.chain}api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers }
    );

    const quote = await response.json();

    const receipt = await this.signAndSendTransaction({
      from: quote.taker,
      to: quote.to,
      data: quote.data,
      value: quote.value,
      gasPrice: quote.gasPrice,
    });

    console.log(receipt);

    return receipt;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    zeroXSwap: ZeroXSwapPlugin;
  }
}
