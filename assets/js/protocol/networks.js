export const NXT_NETWORKS = {
  ethereumSepolia: {
    key: "ethereumSepolia",
    label: "Ethereum Sepolia",
    chainId: 11155111,
    kind: "evm"
  },
  solanaDevnet: {
    key: "solanaDevnet",
    label: "Solana Devnet",
    cluster: "devnet",
    kind: "solana"
  },
  suiTestnet: {
    key: "suiTestnet",
    label: "Sui Testnet",
    network: "testnet",
    kind: "sui"
  }
};

export function getNetwork(key) {
  const network = NXT_NETWORKS[key];
  if (!network) throw new Error("Unsupported NXT network.");
  return network;
}
