const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200, cache = 20) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${cache}, s-maxage=${cache}`,
      ...CORS
    }
  });
}

async function fetchCoinGecko(path, env) {
  const headers = { accept: "application/json" };
  if (env.COINGECKO_API_KEY) headers["x-cg-demo-api-key"] = env.COINGECKO_API_KEY;
  return fetch("https://api.coingecko.com/api/v3" + path, {
    headers,
    cf: { cacheTtl: 20, cacheEverything: true }
  });
}

async function markets(request, env) {
  const u = new URL(request.url);
  const page = Math.max(1, Number(u.searchParams.get("page") || 1));
  const perPage = Math.min(250, Math.max(25, Number(u.searchParams.get("per_page") || 250)));
  const order = u.searchParams.get("order") || "market_cap_desc";

  const qs = new URLSearchParams({
    vs_currency: "usd",
    order,
    per_page: String(perPage),
    page: String(page),
    sparkline: "false",
    price_change_percentage: "1h,24h,7d,30d"
  });

  const response = await fetchCoinGecko("/coins/markets?" + qs, env);
  if (!response.ok) {
    return json({
      error: "MARKET_DATA_UNAVAILABLE",
      providerStatus: response.status,
      message: response.status === 401 || response.status === 10002
        ? "Add COINGECKO_API_KEY to the Cloudflare Worker secrets."
        : "The market-data provider did not return market data."
    }, 502, 5);
  }

  const coins = await response.json();
  return json({
    provider: "CoinGecko",
    updatedAt: new Date().toISOString(),
    page,
    perPage,
    coins: coins.map((c) => ({
      id: c.id,
      symbol: c.symbol?.toUpperCase() || "",
      name: c.name,
      image: c.image || null,
      price: c.current_price,
      change1h: c.price_change_percentage_1h_in_currency ?? null,
      change24h: c.price_change_percentage_24h ?? c.price_change_percentage_24h_in_currency ?? null,
      change7d: c.price_change_percentage_7d_in_currency ?? null,
      change30d: c.price_change_percentage_30d_in_currency ?? null,
      marketCap: c.market_cap ?? null,
      marketCapRank: c.market_cap_rank ?? null,
      volume24h: c.total_volume ?? null,
      fdv: c.fully_diluted_valuation ?? null,
      high24h: c.high_24h ?? null,
      low24h: c.low_24h ?? null,
      circulatingSupply: c.circulating_supply ?? null,
      totalSupply: c.total_supply ?? null,
      lastUpdated: c.last_updated ?? null,
      chain: c.id === "solana" ? "Solana" : c.id === "ethereum" ? "Ethereum" : c.id === "sui" ? "Sui" : "Multi-market",
      ageDays: null,
      source: "coingecko"
    }))
  });
}

async function dexSearch(request) {
  const u = new URL(request.url);
  const q = (u.searchParams.get("q") || "").trim();
  if (!q) return json({ pairs: [] });

  const response = await fetch("https://api.dexscreener.com/latest/dex/search?q=" + encodeURIComponent(q), {
    headers: { accept: "application/json" },
    cf: { cacheTtl: 10, cacheEverything: true }
  });

  if (!response.ok) return json({ error: "DEX_SEARCH_UNAVAILABLE", pairs: [] }, 502, 5);

  const body = await response.json();
  const pairs = Array.isArray(body.pairs) ? body.pairs : [];

  const best = new Map();
  for (const p of pairs) {
    if (!p?.baseToken?.address) continue;
    const key = String(p.chainId || "") + ":" + String(p.baseToken.address).toLowerCase();
    const current = best.get(key);
    const score = Number(p.liquidity?.usd || 0) + Number(p.volume?.h24 || 0);
    const currentScore = current ? Number(current.liquidity?.usd || 0) + Number(current.volume?.h24 || 0) : -1;
    if (!current || score > currentScore) best.set(key, p);
  }

  return json({
    provider: "DEXScreener",
    pairs: [...best.values()].slice(0, 50).map((p) => ({
      id: p.chainId + ":" + p.baseToken.address,
      symbol: p.baseToken.symbol || "",
      name: p.baseToken.name || p.baseToken.symbol || "Unknown token",
      image: p.info?.imageUrl || null,
      price: p.priceUsd ? Number(p.priceUsd) : null,
      change1h: p.priceChange?.h1 ?? null,
      change24h: p.priceChange?.h24 ?? null,
      change7d: null,
      marketCap: p.marketCap ?? p.fdv ?? null,
      marketCapRank: null,
      volume24h: p.volume?.h24 ?? null,
      liquidity: p.liquidity?.usd ?? null,
      ageDays: p.pairCreatedAt ? Math.max(0, (Date.now() - p.pairCreatedAt) / 86400000) : null,
      chain: p.chainId || "Unknown",
      address: p.baseToken.address,
      pairAddress: p.pairAddress,
      dexId: p.dexId,
      url: p.url,
      source: "dexscreener"
    }))
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const path = new URL(request.url).pathname;

    if (path === "/api/markets") return markets(request, env);
    if (path === "/api/dex-search") return dexSearch(request);

    return env.ASSETS.fetch(request);
  }
};
