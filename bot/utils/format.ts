export function format(amount: any, from: number, to: number) {
    if (from === to) return amount
    const range = from - to
    if (range > 0) return amount / BigInt(10 ** range)
    else return amount * BigInt(10 ** Math.abs(range))
}