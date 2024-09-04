import { PRIVATE_KEY, ARB_NETWORK, ARB_CHAIN_ID, ARB_RPC_URL, ARB_RPC_WSS, SECONDS_BETWEEN_CHECK, ARB_LENDING_POOLS, ARB_FLASH_CONTRACT, ARB_FLASHLOAN_TOKEN, ARB_FLASHLOAN_TOKEN_DECIMALS } from "./config"
import { getAccountGasBalance, sendTelegramNotif, wait, format } from "./utils"
import { getPrice, buildTX } from "./tx"
import { ethers } from "ethers"

import LP_ABI from './utils/abi/arbitrum.json'
import FLASH_ABI from '../contracts/abi/flash_liquidate_lamalend.json'

//const provider = new ethers.WebSocketProvider(ARB_RPC_WSS)
const provider = new ethers.JsonRpcProvider(ARB_RPC_URL)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
const contract = new ethers.Contract(ARB_FLASH_CONTRACT, FLASH_ABI, wallet)


async function checkIfProfitable(liq: any, pool_address: string, collateral_token: string, collateral_token_decimals: number, collateral_token_symbol: string, borrowed_token: string, borrowed_token_decimals: number, borrowed_token_symbol: string) {
    let user = liq[0]
    const lp_contract = new ethers.Contract(pool_address, LP_ABI, wallet)
    const borrowed_amount = await lp_contract.tokens_to_liquidate(user)
    const collateral_infos = await lp_contract.user_state(user)
    const collateral_amount = collateral_infos[0]
    console.log(`> IO | \u001b[1;32m${parseFloat(ethers.formatUnits(collateral_amount, collateral_token_decimals)).toFixed(2)} ${collateral_token_symbol}\u001b[0m IN for \u001b[1;31m${parseFloat(ethers.formatUnits(borrowed_amount, borrowed_token_decimals)).toFixed(2)} ${borrowed_token_symbol}\u001b[0m OUT`)
    const return_price = await getPrice(ARB_CHAIN_ID, ARB_FLASH_CONTRACT, collateral_token, collateral_amount.toString(), borrowed_token)
    const in_amount_bi = ethers.getBigInt(borrowed_amount.toString())
    const out_amount_bi = ethers.getBigInt(return_price.outAmounts[0])
    const profits_bi = out_amount_bi - in_amount_bi
    console.log(`> PL | ${profits_bi > 0 ? `\u001b[1;32m+${parseFloat(ethers.formatUnits(profits_bi, borrowed_token_decimals)).toFixed(2)}\u001b[0m ${borrowed_token_symbol} => \u001b[1;32mPROFITABLE\u001b[0m` : `\u001b[1;31m${parseFloat(ethers.formatUnits(profits_bi, borrowed_token_decimals)).toFixed(2)}\u001b[0m ${borrowed_token_symbol} => \u001b[1;31mNOT PROFITABLE\u001b[0m`}`)
    //@ts-ignore
    if (profits_bi > 0n) {
        await sendTelegramNotif(`*${ARB_NETWORK.toUpperCase()}* | LIQ PROFITABLE FOUND`)
        const flashloan_token = ARB_FLASHLOAN_TOKEN
        const flashloan_token_decimals = ARB_FLASHLOAN_TOKEN_DECIMALS
        const up_amount = borrowed_amount + borrowed_amount * ethers.getBigInt(25) / ethers.getBigInt(1000) // Flashloanning 2.5% more
        const flashloan_amount = format(up_amount, borrowed_token_decimals, flashloan_token_decimals)
        console.log(`> ⚡️ | \u001b[1;32mPREPARING TX\u001b[0m...`)
        const tx_0_gen = await getPrice(ARB_CHAIN_ID, ARB_FLASH_CONTRACT, flashloan_token, flashloan_amount.toString(), borrowed_token)
        const tx_1_gen = await getPrice(ARB_CHAIN_ID, ARB_FLASH_CONTRACT, collateral_token, collateral_amount.toString(), flashloan_token)
        console.log(`> ⚡️ | \u001b[1;32mBUILDING TX\u001b[0m...`)
        const tx_0 = await buildTX(ARB_FLASH_CONTRACT, tx_0_gen.pathId, false)
        const tx_1 = await buildTX(ARB_FLASH_CONTRACT, tx_1_gen.pathId, false)
        const gas_limit = await contract.executeFlashLiquidation.estimateGas(1, flashloan_token, flashloan_amount.toString(), tx_0.transaction.data, user, pool_address, borrowed_token, collateral_token, tx_1.transaction.data)
        //@ts-ignore
        const up_gas_limit = gas_limit * 125n / 100n // + 25%
        const tx = await contract.executeFlashLiquidation(
            1, flashloan_token, flashloan_amount.toString(), tx_0.transaction.data, user, pool_address, borrowed_token, collateral_token, tx_1.transaction.data,
            { gasLimit: up_gas_limit }
        )
        console.log("> ⚡️ | TX sent =>", tx.hash)
        const receipt = await tx.wait()
        console.log(`> ⚡️ | \u001b[1;32mSUCCESS\u001b[0m => Tx confirmed ✔ ${receipt.blockNumber}`)
        await sendTelegramNotif(`*${ARB_NETWORK.toUpperCase()}* | LIQ EXECUTED`)
    } else return
}

async function checkIfLiquidablePosition(key: string, pool_address: string, collateral_token: string, collateral_token_decimals: number, collateral_token_symbol: string, borrowed_token: string, borrowed_token_decimals: number, borrowed_token_symbol: string) {
    const lending_pool_contract = new ethers.Contract(pool_address, LP_ABI, wallet)
    console.log(`> LK | Liquidable positions for ${key}`)
    const liq = await lending_pool_contract.users_to_liquidate()
    // const liq = [["0x961993ff86a8fF9e10664a1f91dDB8C9EF17EA4F", "267573152792053727", "5358306281910816737631", "32339663720135099427877", "-923291403386832743"]]
    if (liq.length > 0) {
        console.log('> RT | \u001b[1;32mYES\u001b[0m', liq.length)
        for (let i = 0; i < liq.length; i++) {
            await checkIfProfitable(liq[i], pool_address, collateral_token, collateral_token_decimals, collateral_token_symbol, borrowed_token, borrowed_token_decimals, borrowed_token_symbol)
        }
    } else console.log(`> RT | \u001b[1;31mNO\u001b[0m`, liq.length)
    await wait(2.5)
}

async function iterate() {
    //let idx = 0
    while (true) {
        for (const [key, pool] of Object.entries(ARB_LENDING_POOLS)) {
            try { await checkIfLiquidablePosition(key, pool.pool_address, pool.collateral_token, pool.collateral_token_decimals, pool.collateral_token_symbol, pool.borrowed_token, pool.borrowed_token_decimals, pool.borrowed_token_symbol) }
            catch (e) {
                if (e instanceof Error) {
                    if (e.message.includes('execution reverted: "IVM"') || e.message.includes('execution reverted: IVM')) {
                        console.log('> \u001b[1;31mInvalid Method\u001b[0m')
                    } else if (e.message.includes('execution reverted: "FSTX"') || e.message.includes('execution reverted: FSTX')) {
                        console.log('> Reverted \u001b[1;31mFSTX\u001b[0m - Computation')
                    } else if (e.message.includes('execution reverted: "LTX"') || e.message.includes('execution reverted: LTX')) {
                        console.log('> Reverted \u001b[1;31mLTX\u001b[0m - Computation')
                    } else if (e.message.includes('execution reverted: "SSTX"') || e.message.includes('execution reverted: SSTX')) {
                        console.log('> Reverted \u001b[1;31mSSTX\u001b[0m - Computation')
                    } else if (e.message.includes('execution reverted: "IBR"') || e.message.includes('execution reverted: IBR')) {
                        console.log('> Reverted \u001b[1;31mIBR\u001b[0m - Computation')
                    } else if (e.message.includes('execution reverted: "Slippage"') || e.message.includes('execution reverted: Slippage')) {
                        console.log('> Reverted \u001b[1;31mSlippage Swap Back\u001b[0m - Computation')
                    } else if (e.message.includes('transaction execution reverted')) {
                        console.log('> \u001b[1;31mReverted TX\u001b[0m 😭')
                    } else console.error(e)
                }
            }
        }
        console.log('-----------------------------------------------------------')
        console.log(`> Waiting ${SECONDS_BETWEEN_CHECK}s...`)
        await wait(SECONDS_BETWEEN_CHECK)
        console.log('-----------------------------------------------------------')
    }
}

async function run() {
    try {
        await getAccountGasBalance(ARB_NETWORK, ARB_RPC_URL, 6)
        await iterate()
    } catch (e) {
        console.error(e)
        await sendTelegramNotif(`LIQ - LMLend | ${ARB_CHAIN_ID} | got error at root | ${e}`)
        console.log("Restarting...")
        await run()
    }
}

run()