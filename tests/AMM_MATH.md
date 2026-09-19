# NXT AMM Test Vectors

These are deterministic math cases for the constant-product quote formula.

For fee f in basis points:

netIn = amountIn * (10000 - f)

amountOut = netIn * reserveOut / (reserveIn * 10000 + netIn)

## Case 1

- fee: 60 bps
- reserveIn: 1,000,000
- reserveOut: 2,000,000
- amountIn: 10,000
- netIn: 9,940
- expected amountOut: 19,683

## Case 2

- fee: 60 bps
- reserveIn: 500,000
- reserveOut: 500,000
- amountIn: 50,000
- netIn: 49,700
- expected amountOut: 45,186

## Required invariants

- zero input produces zero output.
- output is always less than reserveOut.
- larger input cannot reduce the quote for fixed reserves.
- minimum received must be enforced at execution.
- deadline must be enforced at execution.
- reserves must remain solvent after a successful swap.
- liquidity accounting must not create or destroy provider shares unexpectedly.
