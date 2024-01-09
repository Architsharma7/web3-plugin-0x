export enum Chains {
  Ethereum = "",
  Sepolia = "sepolia.",
  Polygon = "polygon.",
  PolygonMumbai = "mumbai.",
  Binance = "bsc.",
  Optimism = "optimism.",
  Fantom = "fantom.",
  Celo = "celo.",
  Avalanche = "avalanche.",
  Arbitrum = "arbitrum.",
  Base = "base.",
}

export type SwapParams = {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  takerAddress: string;
};
