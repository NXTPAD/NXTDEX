# NXT DEX Protocol Architecture

NXT DEX is an NXT-owned multi-chain DEX targeting Ethereum Sepolia, Solana Devnet, and Sui Testnet during development.

## Design
- Users retain custody; private keys never enter the frontend or repository.
- Wallet connection does not request arbitrary signatures.
- Transactions are prepared, validated/simulated, shown to the user, then signed.
- Wallet/network identity is verified before transaction submission.
- Testnet and mainnet configurations are separated.

## Core protocol
- Constant-product AMM pools.
- 60 bps (0.60%) configured swap fee.
- Pool creation, LP positions, swaps, slippage and deadlines.
- Limit orders with expiry, price and liquidity checks.
- Observable token/market evaluation metrics.

## Chain adapters
- Ethereum: Solidity contracts + EVM transaction builder.
- Solana: program + instruction builder.
- Sui: Move package + transaction builder.

Deployment and treasury addresses are stored in config/protocol.json. Private keys and seed phrases are never stored in the repository.
