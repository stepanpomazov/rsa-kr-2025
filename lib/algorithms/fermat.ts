// /lib/algorithms/fermat.ts
export const fermatFactorization = (n: bigint): { factors: [bigint, bigint] | null, time: number } => {
    const startTime = performance.now()

    // Basic cases
    if (n <= 1n) {
        return {
            factors: null,
            time: performance.now() - startTime
        }
    }

    if (n % 2n === 0n) {
        return {
            factors: [2n, n / 2n],
            time: performance.now() - startTime
        }
    }

    const sqrt = (num: bigint): bigint => {
        if (num < 2n) return num

        let x = num
        let nextX = (x + 1n) / 2n

        while (nextX < x) {
            const temp = x        // Сохраняем текущее x
            x = nextX            // Обновляем x
            nextX = (x + num / temp) / 2n  // Используем сохраненное значение!
        }

        return x
    }

    // Check if n is a perfect square
    const rootN = sqrt(n)
    if (rootN * rootN === n) {
        return {
            factors: [rootN, rootN],
            time: performance.now() - startTime
        }
    }

    let a = rootN + 1n
    const maxIterations = 100000

    for (let i = 0; i < maxIterations; i++) {
        const b2 = a * a - n

        // If b2 is negative, skip
        if (b2 < 0n) {
            a += 1n
            continue
        }

        // Calculate integer square root of b2
        const b = sqrt(b2)

        // Check if b2 is a perfect square
        if (b * b === b2) {
            return {
                factors: [a - b, a + b],
                time: performance.now() - startTime
            }
        }

        a += 1n

        // Stop if a gets too large
        if (a > (n + 1n) / 2n) {
            break
        }
    }

    // No nontrivial factors found
    return {
        factors: [1n, n],
        time: performance.now() - startTime
    }
}