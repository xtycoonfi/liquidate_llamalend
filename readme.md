<h1 align="left" style="display: flex; align-items: center;">
  <img src="https://docs.curve.fi/assets/images/lama.png" alt="Curve LLamaLend" height="32px">
  &nbsp;<span>Curve LlamaLend Liquidation Bot</span>
</h1>

A concrete example of a liquidation bot designed for [Curve LlamaLend](https://lend.curve.fi/) showing how to identify & liquidate unhealthy positions, contributing to the platform stability while offering profit opportunities.

## How it works?

This bot iterates throught LlamaLend lending pools & check for unhealthy positions. When an unhealthy position is detected, it calculates if the liquidation is profitable by simulating a swap of `collateral_token` to `borrowed_token`. 

If the liquidation is profitable, it proccess the liquidation in an atomic transaction like this :
- Flashloan `USDC` (Balancer => 0% fee)
- Swap `USDC` to `crvUSD`
- Uses `crvUSD` to liquidate & get `collateral_token`
- Swap back `collateral_token` to `USDC`
- Repay flashloan & keep profit

Example TX: https://arbiscan.io/tx/0xc62dcb45c27344cad148ebe006ac827574b512adb276e85e048752ca48f66d8d

## How to test it?

**1. Install dependencies**

- Using npm: `npm i`

**2. Fill .env**

An example is available in the [`.env.example`](/.env.example) file.

```
PUBLIC_KEY=<public-key>
PRIVATE_KEY=<private-key>
ARB_RPC_URL=<arbitrum-rpc>
ARB_RPC_WSS=<arbitrum-rpc> //Not used in this demo
ETH_RPC_URL=<ethereum-rpc>
ETH_RPC_WSS=<ethereum-rpc> //Not used in this demo
TG_TOKEN='bot<api-key>' //Telegram notifications
TG_CHANNEL='-<channel-id>' //Telegram notifications
```

**3. Run**

- Arbitrum: `npm run start_arbitrum`
- Ethereum: `npm run start_mainnet`

## Additional informations

Instead of swapping `USDC` for `crvUSD` on Ethereum mainnet, you can also call flashloan method from [crvUSD FlashLender](https://etherscan.io/address/0xa7a4bb50af91f90b6feb3388e7f8286af45b299b) (0.01% fee)