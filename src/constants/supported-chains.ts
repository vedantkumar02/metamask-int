export type SupportedChain = {
  id: string;
  blockExplorer: string;
  token: string;
  label: string;
  rpcUrl: string;
};

export const Supported_Chains = [
  {
    id: "0x1",
    blockExplorer: "https://etherscan.io/",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: "https://rpc.ankr.com/eth",
  },
  {
    id: "0x2105",
    blockExplorer: "https://basescan.org/",
    token: "ETH",
    label: "Base Mainnet",
    rpcUrl: "https://mainnet.base.org",
  },
  {
    id: "0x9aff0d0668760",
    blockExplorer: "https://dkloud-2726723613788000-1.sagaexplorer.io/",
    label: "Dkloud",
    rpcUrl: "https://dkloud-2726723613788000-1.jsonrpc.sagarpc.io",
    token: "dkt",
  },
] as const satisfies Array<SupportedChain>;
