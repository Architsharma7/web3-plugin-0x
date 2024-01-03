export enum ChainIDs {
  Ethereum = "1",
  BinanceSmartChain = "56",
  Polygon = "137",
  Avalanche = "43114",
  Fantom = "250",
  Optimism = "10",
  Arbitrum = "42161",
  Gnosis = "100",
  Aurora = "1313161554",
  ZkSync = "324",
  Base = "8453",
  Klatyn = "8217",
}

export type SwapParams = {
  src: string; // The address of the token you want to swap from (1INCH)
  dst: string; // The address of the token you want to swap to (DAI)
  amount: string; // The amount of the fromToken you want to swap (in wei)
  from: string; // Your wallet address from which the swap will be initiated
  slippage: number; // The maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
  disableEstimate: boolean; // Whether to disable estimation of swap details (set to true to disable)
  allowPartialFill: boolean; // Whether to allow partial filling of the swap order (set to true to allow)
};

export type Web3RpcUrl = string;
