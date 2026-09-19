# NXT DEX

NXT DEX is the swap interface for the NXT CLOUD ecosystem, designed to visually pair with NXT PAD.

## Current build

- NXT PAD-inspired dark / cyan visual system
- Responsive swap interface
- SUI, USDC, SOL, and ETH test assets
- Token-selection modal with search
- Slippage and transaction-deadline settings
- Transaction review flow with minimum-received calculation
- Sui Testnet, Solana Devnet, and Ethereum Sepolia network selector
- Browser wallet detection and connection adapters for Sui, Solana/Phantom, and EVM wallets
- Connection flow does **not** request an arbitrary signature
- Local quote simulation for prototype testing

## Prototype completion status

The front-end prototype is complete for testnet UI validation: token selection, quote simulation, settings, wallet detection, review, simulated confirmation, activity feedback, responsive layout, and network targeting are implemented.

## Current limitation

This repository is still a **testnet prototype**. The live routing engine, liquidity pools, serialized on-chain swap transactions, RPC configuration, token lists, and production wallet transaction signing are not enabled yet.

The review flow intentionally stops before sending a transaction. This avoids the signature-format/address-mismatch problems previously encountered while the transaction layer is still being built.

**Test assets have no value.**

## Next production layer

1. Add canonical token metadata and per-network addresses.
2. Add audited router/pool contracts or a defined routing backend.
3. Add network-specific transaction builders.
4. Simulate transactions before prompting the wallet to sign.
5. Add confirmation tracking and failure/retry states.
6. Add real pool and market data.
7. Add security, slippage, deadline, and RPC error handling.
8. Test independently with Sui Testnet, Solana Devnet, and Ethereum Sepolia before any mainnet deployment.


## NXT protocol foundation

The repository now contains the initial NXT-owned protocol configuration and Ethereum AMM foundation.

- 60 bps / 0.60% protocol fee configuration
- Separate deployment and treasury addresses for each testnet
- Ethereum Sepolia factory/pair foundation
- Chain-specific architecture documents for Solana Devnet and Sui Testnet
- Limit-order architecture defined separately from the AMM
- No private keys, seed phrases, or wallet exports are stored here

### Deployment status

**Do not deploy the current Solidity contracts to a public testnet yet.** The protocol still requires comprehensive unit/invariant/security testing, a finalized fee split, real test-token metadata, limit-order execution logic, and the Solana/Sui implementations before the NXT DEX protocol is considered deployable.
