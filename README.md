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
