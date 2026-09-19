module nxt_dex::protocol;

use sui::object::{Self, UID};
use sui::tx_context::TxContext;

public struct Config has key {
    id: UID,
    fee_bps: u64,
    paused: bool,
    treasury: address,
}

public struct Pool<phantom A, phantom B> has key {
    id: UID,
    reserve_a: u64,
    reserve_b: u64,
    total_liquidity: u128,
}

public fun create_config(fee_bps: u64, treasury: address, ctx: &mut TxContext): Config {
    assert!(fee_bps == 60, 0);
    Config { id: object::new(ctx), fee_bps, paused: false, treasury }
}

public fun set_paused(config: &mut Config, paused: bool) {
    config.paused = paused;
}
