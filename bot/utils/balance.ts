import { PUBLIC_KEY } from "../config"
import { ethers } from "ethers"

export async function getAccountGasBalance(NETWORK: string, RPC: string, fixed?: number) {
    const provider = new ethers.JsonRpcProvider(RPC)
    const chaintoken = getChainPrefix(NETWORK)
    const balanceWei = await provider.getBalance(PUBLIC_KEY)
    const balance = Number(ethers.formatEther(balanceWei))
    if (fixed !== undefined) console.log(`-----------------------------------------------------------\n> ⛽️ ${balance.toFixed(fixed)} ${chaintoken}\n-----------------------------------------------------------`)
    else console.log(`${balance} ${chaintoken}`)
    return balance
}

function getChainPrefix(NETWORK: string) {
    if (NETWORK == 'Ethereum' || NETWORK == 'Arbitrum' || NETWORK == 'Optimism' || NETWORK == 'Base' || NETWORK == 'Mode' || NETWORK == 'Blast') {
        return 'ETH'
    } else if (NETWORK == 'Gnosis') {
        return 'xDAI'
    } else if (NETWORK == 'Polygon') {
        return 'MATIC'
    } else if (NETWORK == 'Bsc') {
        return 'BNB'
    } else if (NETWORK == 'Avalanche') {
        return 'AVAX'
    } else if (NETWORK == 'Fantom') {
        return 'FTM'
    } else if (NETWORK == 'Core') {
        return 'CORE'
    } else (
        console.log('NETWORK not defined => /utils/balance.ts')
    )
}