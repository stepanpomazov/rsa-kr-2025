const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    let result = 1n
    base = base % mod

    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod
        }
        base = (base * base) % mod
        exp = exp / 2n
    }

    return result
}

const gcd = (a: bigint, b: bigint): bigint => {
    while (b !== 0n) {
        [a, b] = [b, a % b]
    }
    return a
}

export const pollardPMinus1 = (n: bigint, B: number = 10000): { factor: bigint | null, time: number } => {
    const startTime = performance.now()

    if (n % 2n === 0n) {
        return { factor: 2n, time: performance.now() - startTime }
    }

    let a = 2n

    for (let i = 2; i <= B; i++) {
        a = modPow(a, BigInt(i), n)

        const d = gcd(a - 1n, n)

        if (d > 1n && d < n) {
            return { factor: d, time: performance.now() - startTime }
        }

        if (d === n) {
            return { factor: null, time: performance.now() - startTime }
        }
    }

    return { factor: null, time: performance.now() - startTime }
}