import dotenv from 'dotenv'
dotenv.config()
const getEnv = (vardotenv: string) => {
    const variable = process.env[vardotenv] || ''
    return variable
}

/* ================== GLOBAL CONFIG ====================== */
export const SECONDS_BETWEEN_CHECK = 45
export const ARB_FLASH_CONTRACT = '0x4Ad709799D53A540076ED66cf398C8B5510892B2'
export const ARB_FLASHLOAN_TOKEN = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' // USDC - Arbitrum
export const ARB_FLASHLOAN_TOKEN_DECIMALS = 6 // USDC - Arbitrum
export const ETH_FLASH_CONTRACT = '0x4a8138D95503A50776373386b71054Fc18672053'
export const ETH_FLASHLOAN_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC - Ethereum
export const ETH_FLASHLOAN_TOKEN_DECIMALS = 6 // USDC - Ethereum

/* ================== ACCOUNT CONFIG ===================== */
export const PUBLIC_KEY = getEnv('PUBLIC_KEY')
export const PRIVATE_KEY = getEnv('PRIVATE_KEY')

/* ================== TELEGRAM CONFIG ==================== */
export const TG_TOKEN = getEnv('TG_TOKEN')
export const TG_CHANNEL = getEnv('TG_CHANNEL')

/* ================== NETWORK CONFIG ===================== */
/** @arbitrum **/
export const ARB_NETWORK = 'Arbitrum'
export const ARB_CHAIN_ID = 42161
export const ARB_RPC_URL = getEnv('ARB_RPC_URL')
export const ARB_RPC_WSS = getEnv('ARB_RPC_WSS')
//export const ARB_RPC_URL = 'https://arbitrum.llamarpc.com'
//export const ARB_RPC_WSS = ''
/** @mainnet **/
export const ETH_NETWORK = 'Ethereum'
export const ETH_CHAIN_ID = 1
export const ETH_RPC_URL = getEnv('ETH_RPC_URL')
export const ETH_RPC_WSS = getEnv('ETH_RPC_WSS')
// export const ETH_RPC_URL = 'https://eth.llamarpc.com'
// export const ETH_RPC_WSS = ''
