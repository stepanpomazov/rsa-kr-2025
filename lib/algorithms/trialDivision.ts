export const trialDivision = (n: bigint): bigint[] => {
    const factors: bigint[] = []
    let temp = n

    if (n <= 1n) return factors

    // Check for 2
    while (temp % 2n === 0n) {
        factors.push(2n)
        temp = temp / 2n
    }

    // Check odd factors
    let divisor = 3n
    while (divisor * divisor <= temp) {
        while (temp % divisor === 0n) {
            factors.push(divisor)
            temp = temp / divisor
        }
        divisor += 2n
    }

    // If anything remains, it's prime
    if (temp > 1n) {
        factors.push(temp)
    }

    return factors
}