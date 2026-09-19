# NXT DEX — Solana Devnet

NXT DEX will use an NXT-owned Solana program for pools, swaps, liquidity, and order state.

## Target

- Cluster: Solana Devnet
- Deployment wallet: `F4w9pUDNfjHZ3qVN1LY9L31cDcv4cmZgE7bLPzTaNrzF`
- Treasury: `8oJPc2N9UbbkZmtJ4AdLE3ygaHHDwNHT9Lk1imtBUE5V`
- Total swap fee: 60 bps / 0.60%
- Fee split: pending

## Program responsibilities

The NXT program is intended to own:

- pool creation and configuration
- token-pair reserves
- LP position accounting
- swaps with minimum-output protection
- protocol fee accounting
- pause/emergency controls
- limit-order state and execution conditions

The web application remains non-custodial. It builds instructions and asks the connected wallet to sign only after the transaction has been reviewed.

No program ID is claimed until the program is actually deployed and verified on Devnet.
