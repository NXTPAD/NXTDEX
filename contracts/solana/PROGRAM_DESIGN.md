# Solana Program Design

## Accounts

A pool state account contains the canonical pair mints, vault addresses, fee configuration, pause state, and reserve accounting.

A user position account tracks LP ownership. Order accounts contain maker, input/output mints, amount, limit price, expiry, and execution state.

## Instructions

1. initialize_config
2. create_pool
3. add_liquidity
4. remove_liquidity
5. swap
6. create_limit_order
7. cancel_limit_order
8. execute_limit_order
9. pause
10. update_treasury

## Swap invariants

- both mints belong to the selected pool.
- amount in is non-zero.
- minimum output is enforced.
- expiry/deadline is enforced where applicable.
- output vault remains solvent.
- reserve accounting matches vault balances.
- fee is exactly 60 bps until protocol governance changes the configured total fee.
- the LP/treasury fee split remains unset until finalized.

## Signing boundary

The frontend must never ask for a generic signature to connect a wallet. It prepares a specific transaction containing these instructions, displays the important effects, and only then calls the wallet transaction-signing method.
