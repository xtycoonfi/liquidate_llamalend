import axios from "axios"

export async function getPrice(chainId: number, flashContract: string, token0: string, amount: string, token1: string) {
    const body = { chainId: chainId, inputTokens: [{ tokenAddress: token0, amount: amount }], outputTokens: [{ tokenAddress: token1, proportion: 100 }], userAddr: flashContract, slippageLimitPercent: 10, referralCode: 0, disableRFQs: true, compact: true }
    const res = await axios.post('https://api.odos.xyz/sor/quote/v2', body, { headers: { 'Content-Type': 'application/json' } })
    if (res.status === 200) return res.data
    else return null
}