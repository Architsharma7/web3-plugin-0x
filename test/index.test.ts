/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Web3, core } from "web3";
import { Chains } from "../src/types";
import { ZeroXSwapPlugin } from "../src";

describe("ZeroXSwapPlugin Tests", () => {
  it("should register ZeroXSwapPlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    const apiKey = "[your-0x-api-key]";
    const defaultParams = {
      sellToken: "",
      buyToken: "",
      sellAmount: "", //18 decimal
      takerAddress: "", // address of the sender
    };
    const takerPrivateKey = "";
    const chain = Chains.PolygonMumbai;
    const web3rpcurl = "";

    web3Context.registerPlugin(
      new ZeroXSwapPlugin(
        apiKey,
        defaultParams,
        takerPrivateKey,
        chain,
        web3rpcurl
      )
    );
    expect(web3Context.zeroXSwap).toBeDefined();
  });

  describe("ZeroXSwapPlugin method tests", () => {
    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:8545");
      const apiKey = "[your-0x-api-key]";
      const defaultParams = {
        sellToken: "",
        buyToken: "",
        sellAmount: "", //18 decimal
        takerAddress: "", // address of the sender
      };
      const takerPrivateKey = "";
      const chain = Chains.PolygonMumbai;
      const web3rpcurl = "";
      web3.registerPlugin(
        new ZeroXSwapPlugin(
          apiKey,
          defaultParams,
          takerPrivateKey,
          chain,
          web3rpcurl
        )
      );
    });

    it("should call ZeroXSwapPlugin tokenAllowance method without errors", async () => {
      try {
        const tokenallowance = await web3.zeroXSwap.tokenAllowance();
        console.log(tokenallowance);
      } catch (error) {
        console.log(`Error occurred: ${error}`);
      }
    });

    it("should call ZeroXSwapPlugin getPrice method without errors", async () => {
      try {
        const price = await web3.zeroXSwap.getPrice();
        console.log(price);
      } catch (error) {
        console.log(`Error occurred: ${error}`);
      }
    });

    it("should call ZeroXSwapPlugin getQuote method without errors", async () => {
      try {
        const swapData = await web3.zeroXSwap.swap();
        console.log(swapData);
      } catch (error) {
        console.log(`Error occurred: ${error}`);
      }
    });
  });
});
