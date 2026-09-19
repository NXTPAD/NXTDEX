import fs from "node:fs";

const config = JSON.parse(fs.readFileSync("config/protocol.json", "utf8"));
const required = [
  ["treasury.ethereumSepolia", config.treasury?.ethereumSepolia],
  ["treasury.solanaDevnet", config.treasury?.solanaDevnet],
  ["treasury.suiTestnet", config.treasury?.suiTestnet],
  ["deployment.ethereumSepolia", config.deployment?.ethereumSepolia],
  ["deployment.solanaDevnet", config.deployment?.solanaDevnet],
  ["deployment.suiTestnet", config.deployment?.suiTestnet]
];
if (config.feeBps !== 60) throw new Error("NXT DEX fee must remain 60 bps / 0.60%.");
for (const [name, value] of required) if (!value || typeof value !== "string") throw new Error("Missing " + name);
if (config.networks?.ethereumSepolia?.chainId !== 11155111) throw new Error("Ethereum target must be Sepolia (chain ID 11155111).");
if (config.feeSplit?.status !== "pending") {
  const split = Number(config.feeSplit?.lpBps) + Number(config.feeSplit?.treasuryBps);
  if (split !== config.feeBps) throw new Error("Configured fee split must equal total fee.");
}
console.log("NXT DEX configuration OK");
console.log("Mode:", config.mode);
console.log("Swap fee:", config.feePercent + "% (" + config.feeBps + " bps)");
console.log("Fee split:", config.feeSplit.status);
