# NXT DEX Chain Adapter Layer

The frontend and protocol tooling use a common transaction lifecycle while keeping chain-specific serialization isolated.

## Shared lifecycle

1. Detect wallet.
2. Detect actual connected network.
3. Load token metadata and balances.
4. Discover NXT pools/markets.
5. Build a quote.
6. Calculate minimum received from user slippage.
7. Build an unsigned transaction.
8. Simulate or validate when supported.
9. Display exact transaction effects.
10. Ask the wallet to sign only the prepared transaction.
11. Submit the signed transaction.
12. Track confirmation and surface the explorer result.

## Ethereum Sepolia

- Target chain ID: 11155111.
- Wallet adapter: EIP-1193 provider.
- Transaction layer: ABI calldata + transaction request.
- Before signing: verify eth_chainId, destination contract, calldata, value, and deadline.
- Never use arbitrary message signing as a substitute for transaction signing.

## Solana Devnet

- Cluster: devnet.
- Wallet adapter: standard Solana wallet provider.
- Transaction layer: serialized Solana transaction or message.
- Before signing: verify recent blockhash, fee payer, program IDs, accounts, and instruction data.
- Use simulation before requesting the wallet signature where supported.

## Sui Testnet

- Network: testnet.
- Wallet adapter: Sui wallet standard.
- Transaction layer: serialized transaction block.
- Before signing: verify sender, package/module/function, object inputs, amounts, and gas budget.
- Use dry-run/dev-inspect style validation where supported.

## Security invariant

A wallet connection is not a transaction authorization. The UI must never request a signature merely to connect or to discover an address.
