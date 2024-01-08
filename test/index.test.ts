import { core } from "web3";
import { OneInchPlugin } from "../src/index";
import { ChainIDs } from "../src/types";

describe("OneInchSwapPlugin Tests", () => {
  let web3Context: core.Web3Context;
  let oneInchPlugin: OneInchPlugin;

  beforeAll(() => {
    const web3RpcUrl =
      "https://optimism-mainnet.infura.io/v3/ba8a3893f5f34779b1ea295f176a73c6";
    const apiKey = "UYOgFuneGdMBzgN1m2Fl4o2Pswc8WHwX";
    const chainId = ChainIDs.Optimism;
    const walletAddress = "0x41D22F2e55BD7B6bbb16f82e852a58c36C5D5Cf8";

    web3Context = new core.Web3Context("http://127.0.0.1:8545");
    oneInchPlugin = new OneInchPlugin(
      apiKey,
      chainId,
      web3RpcUrl,
      walletAddress
    );
    web3Context.registerPlugin(oneInchPlugin);
  });

  it("should register OneInchSwapPlugin on Web3Context instance", () => {
    expect(web3Context.OneInch).toBeDefined();
  });

  describe("OneInchSwapPlugin method tests", () => {
    let consoleSpy: jest.SpiedFunction<typeof global.console.log>;

    beforeAll(() => {
      consoleSpy = jest.spyOn(global.console, "log").mockImplementation();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it("should check allowance with expected parameters", async () => {
      const tokenAddress = "0x4200000000000000000000000000000000000042";
      const walletAddress = "0x41D22F2e55BD7B6bbb16f82e852a58c36C5D5Cf8";

      const allowance = await web3Context.OneInch.checkAllowance(
        tokenAddress,
        walletAddress
      );
      expect(allowance).toEqual("0");
      console.log("Allowance:", allowance);
    });

    it("should approve token with expected parameters", async () => {
      const privateKey = `0xa3fca102e683a3c210a99e85c81d5e8725e5845cf1ada682d7afe433a0e2b968`;
      const tokenAddress = "0x4200000000000000000000000000000000000042";
      const amount = "10";

      const approveTxHash = await web3Context.OneInch.approveToken(
        tokenAddress,
        amount,
        privateKey
      );
      expect(approveTxHash).toBeDefined();
      console.log("Approve tx hash:", approveTxHash); // You can remove or modify this line based on your needs
    });

    // it("should swap tokens with expected parameters", async () => {
    //   const swapParams = {
    //     src: "0x4200000000000000000000000000000000000042", // Replace with a valid source token address
    //     dst: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", // Replace with a valid destination token address
    //     amount: "1000000", // Replace with a valid amount
    //     from: "0x41D22F2e55BD7B6bbb16f82e852a58c36C5D5Cf8", // Replace with a valid wallet address
    //     slippage: 1,
    //     disableEstimate: false,
    //     allowPartialFill: false,
    //   };
    //   const privateKey =
    //     "a3fca102e683a3c210a99e85c81d5e8725e5845cf1ada682d7afe433a0e2b968"; // Replace with your actual private key

    //   const swapTxHash = await web3Context.OneInch.swapTokens(
    //     swapParams,
    //     privateKey
    //   );
    //   expect(swapTxHash).toBeDefined();
    //   console.log("Swap tx hash:", swapTxHash); // You can remove or modify this line based on your needs
    // });
  });
});
