/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Web3, Web3PluginBase } from "web3";
import { ChainIDs, SwapParams } from "./types";

export class OneInchPlugin extends Web3PluginBase {
  public pluginNamespace = "OneInch";

  private web3: any;

  public constructor(
    private apiKey: string,
    private chainId: ChainIDs,
    private web3RpcUrl: string,
    private walletAddress: string
  ) {
    super();
    // // @ts-ignore
    // this.apiKey = options?.apiKey;
    // // @ts-ignore
    // this.chainId = options?.chainId;
    // // @ts-ignore
    // this.web3RpcUrl = options?.web3RpcUrl;
    // // @ts-ignore
    // this.walletAddress = options?.walletAddress;
    this.web3 = new Web3(this.web3RpcUrl);
  }

  private async apiRequest(
    url: string,
    method: string = "GET",
    body?: any
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const requestOptions: any = {
      method,
      headers,
    };

    if (body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      requestOptions.body = JSON.stringify(body);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await fetch(url, requestOptions);
    console.log("Response: ", response);

    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`API request failed with status ${response}`);
    }

    // Check if the response body is empty
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const text = await response.text();
    console.log("Response: ", text);
    if (!text) {
      console.log(response);
      throw new Error("Empty response from the server");
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const responseBody = JSON.parse(text);
      console.log(responseBody);
      return responseBody;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to parse JSON response: ${error?.message}`);
    }
  }

  private async signAndSendTransaction(
    transaction: any,
    // from: string,
    privateKey: string
  ): Promise<string> {
    console.log(transaction);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const { rawTransaction } = await this.web3.eth.accounts.signTransaction(
      transaction,
      privateKey,
    );

    return await this.broadCastRawTransaction(rawTransaction);
  }

  private async broadCastRawTransaction(rawTransaction: any): Promise<any> {
    const broadcastApiUrl = `https://api.1inch.dev/tx-gateway/v1.1/${this.chainId}/broadcast`;
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.apiRequest(broadcastApiUrl, "POST", { rawTransaction })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .then((res: any) => res.transactionHash)
    );
  }

  public async checkAllowance(
    tokenAddress: string,
    walletAddress: string
  ): Promise<boolean> {
    const url = `https://api.1inch.dev/swap/v5.2/${this.chainId}/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await this.apiRequest(url);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.allowance;
  }

  public async approveToken(
    tokenAddress: string,
    amount: string,
    privateKey: string
  ): Promise<string> {
    const url = `https://api.1inch.dev/swap/v5.2/${this.chainId}/approve/transaction?tokenAddress=${tokenAddress}&amount=${amount}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const headers = {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        accept: "application/json",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const transaction = await fetch(url, headers);
    console.log("Token Approval Transaction: ", transaction);

    if (transaction == null || undefined) {
      console.log("Transaction is null or undefined");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const gasLimit = await this.web3.eth.estimateGas({
      ...transaction,
      from: this.walletAddress,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const approvedTransaction = {
      ...transaction,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      gas: gasLimit,
    };

    const approveTxHash = await this.signAndSendTransaction(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      approvedTransaction,
      privateKey
    );
    console.log("Approve tx hash: ", approveTxHash);
    return approveTxHash;
  }

  public async swapTokens(
    swapParams: SwapParams,
    privateKey: string
  ): Promise<string> {
    const url = `https://api.1inch.dev/swap/v5.2/${this.chainId}/swap`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const swapTransaction = await this.apiRequest(url, "POST", swapParams)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then((res: any) => res.tx);

    const swapTxHash = await this.signAndSendTransaction(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      swapTransaction,
      privateKey
    );
    return swapTxHash;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    OneInch: OneInchPlugin;
  }
}
