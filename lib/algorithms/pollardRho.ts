const gcd = (a: bigint, b: bigint): bigint => {
    while (b !== 0n) {
        [a, b] = [b, a % b]
    }
    return a
}

const f = (x: bigint, c: bigint, n: bigint): bigint => {
    return (x * x + c) % n
}

export const pollardRho = (n: bigint): { factor: bigint | null, time: number } => {
    const startTime = performance.now()

    if (n === 1n) return { factor: null, time: performance.now() - startTime }
    if (n % 2n === 0n) return { factor: 2n, time: performance.now() - startTime }

    let x = 2n
    let y = 2n
    let d = 1n
    const c = 1n

    while (d === 1n) {
        x = f(x, c, n)
        y = f(f(y, c, n), c, n)
        d = gcd(BigInt(Math.abs(Number(x - y))), n)
    }

    return {
        factor: d === n ? null : d,
        time: performance.now() - startTime
    }
}