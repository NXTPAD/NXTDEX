export const TransactionState = Object.freeze({
  IDLE: "idle",
  PREPARING: "preparing",
  READY: "ready",
  SIGNING: "signing",
  SUBMITTED: "submitted",
  CONFIRMED: "confirmed",
  FAILED: "failed"
});

export function createTransactionPlan({ network, description, request, effects = [] }) {
  if (!network || !description || !request) throw new Error("Incomplete transaction plan.");
  return Object.freeze({
    network,
    description,
    request,
    effects: Object.freeze([...effects]),
    state: TransactionState.READY
  });
}

export function assertReadyForSigning(plan) {
  if (!plan || plan.state !== TransactionState.READY) {
    throw new Error("Transaction is not ready for signing.");
  }
}
