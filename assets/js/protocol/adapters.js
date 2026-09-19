import { getNetwork } from "./networks.js";
import { createTransactionPlan } from "./transaction-lifecycle.js";

export function prepareEvmSwap({ contract, tokenIn, amountIn, minOut, deadline, account }) {
  if (!contract || !/^0x[0-9a-fA-F]{40}$/.test(contract)) throw new Error("Verified NXT pair address required.");
  if (!account) throw new Error("Connected EVM account required.");
  return createTransactionPlan({
    network: getNetwork("ethereumSepolia"),
    description: "NXT DEX swap",
    request: { to: contract, method: "swap", args: [amountIn, tokenIn, minOut, deadline] },
    effects: ["Spend " + amountIn + " of the selected input token", "Receive at least " + minOut + " output tokens"]
  });
}

export function prepareSolanaSwap({ programId, instructions, account }) {
  if (!programId || !account || !Array.isArray(instructions) || instructions.length === 0) {
    throw new Error("Verified Solana program, account, and instructions required.");
  }
  return createTransactionPlan({
    network: getNetwork("solanaDevnet"),
    description: "NXT DEX swap",
    request: { programId, instructions },
    effects: ["Transaction will be simulated before signing"]
  });
}

export function prepareSuiSwap({ packageId, transaction, account }) {
  if (!packageId || !account || !transaction) {
    throw new Error("Verified Sui package, account, and transaction block required.");
  }
  return createTransactionPlan({
    network: getNetwork("suiTestnet"),
    description: "NXT DEX swap",
    request: { packageId, transaction },
    effects: ["Transaction block must be dry-run before signing"]
  });
}
