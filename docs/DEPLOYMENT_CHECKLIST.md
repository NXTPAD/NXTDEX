# NXT DEX Testnet Deployment Checklist

Deployment is intentionally blocked until every item below is satisfied.

## Ethereum Sepolia

- [ ] Compile with a pinned Solidity toolchain.
- [ ] Unit tests for factory, pair, liquidity, swaps, fee math, slippage, and deadlines.
- [ ] Invariant/fuzz tests.
- [ ] Verify deployment wallet is the configured deployment address.
- [ ] Deploy using the configured deployment wallet.
- [ ] Record verified factory and pair addresses.
- [ ] Confirm treasury matches the configured treasury address.
- [ ] Create NXT-owned test tokens and record their addresses.
- [ ] Execute a real wallet-to-wallet test swap.
- [ ] Verify events and reserve balances.

## Solana Devnet

- [ ] Build the program from the committed source.
- [ ] Run program tests and invariant tests.
- [ ] Verify deployment signer.
- [ ] Deploy to Devnet.
- [ ] Record the program ID.
- [ ] Create and seed test pools.
- [ ] Simulate and execute a real Devnet swap.
- [ ] Verify token-account and reserve invariants.

## Sui Testnet

- [ ] Build the Move package against the selected Sui framework revision.
- [ ] Run Move tests and invariant tests.
- [ ] Verify deployment signer.
- [ ] Publish to Testnet.
- [ ] Record package ID.
- [ ] Create and seed test pools.
- [ ] Dry-run and execute a real Testnet swap.
- [ ] Verify object and balance invariants.

## Frontend release gate

- [ ] Only show a network as executable after its verified deployment metadata exists.
- [ ] Verify the wallet's actual network, not only the UI selection.
- [ ] Quote from live NXT pool state.
- [ ] Calculate minimum received from the selected slippage.
- [ ] Prepare the exact transaction.
- [ ] Simulate/dry-run it where supported.
- [ ] Display transaction effects.
- [ ] Request wallet signing.
- [ ] Track confirmation.
- [ ] Never request a generic signature for connection.
