import axios from "axios"

export async function buildTX(flashContract: string, pathId: string, simulate: boolean) {
    const body = { userAddr: flashContract, pathId: pathId, simulate: simulate }
    const res = await axios.post('https://api.odos.xyz/sor/assemble', body, { headers: { 'Content-Type': 'application/json' } })
    if (res.status === 200) return res.data
    else return null
}