import { NextRequest, NextResponse } from 'next/server'

// Простая реализация RSA генерации для демонстрации
// В реальном приложении используйте криптографически безопасные библиотеки

function isProbablePrime(n: bigint, k: number = 5): boolean {
    if (n < 2n) return false
    if (n === 2n || n === 3n) return true
    if (n % 2n === 0n) return false

    // Write n as 2^s·d + 1
    let d = n - 1n
    let s = 0n
    while (d % 2n === 0n) {
        d /= 2n
        s += 1n
    }

    for (let i = 0; i < k; i++) {
        const a = BigInt(Math.floor(Math.random() * 100)) % (n - 4n) + 2n
        let x = modPow(a, d, n)

        if (x === 1n || x === n - 1n) continue

        let continueLoop = false
        for (let r = 0n; r < s - 1n; r++) {
            x = modPow(x, 2n, n)
            if (x === n - 1n) {
                continueLoop = true
                break
            }
        }

        if (!continueLoop) return false
    }

    return true
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    let result = 1n
    base = base % modulus

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus
        }
        exponent = exponent >> 1n
        base = (base * base) % modulus
    }

    return result
}

function gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        [a, b] = [b, a % b]
    }
    return a
}

function modInverse(a: bigint, m: bigint): bigint {
    let [oldR, r] = [a, m]
    let [oldS, s] = [1n, 0n]
    let [oldT, t] = [0n, 1n]

    while (r !== 0n) {
        const quotient = oldR / r
        ;[oldR, r] = [r, oldR - quotient * r]
        ;[oldS, s] = [s, oldS - quotient * s]
        ;[oldT, t] = [t, oldT - quotient * t]
    }

    return oldS < 0n ? oldS + m : oldS
}

function generatePrime(bits: number): bigint {
    while (true) {
        // Generate random number with specified bits
        const min = 1n << BigInt(bits - 1)
        const max = (1n << BigInt(bits)) - 1n

        // Generate random number
        const randomBytes = new Uint8Array(Math.ceil(bits / 8))
        crypto.getRandomValues(randomBytes)

        let n = 0n
        for (let i = 0; i < randomBytes.length; i++) {
            n = (n << 8n) | BigInt(randomBytes[i])
        }

        // Ensure it's in range and odd
        n = (n % (max - min + 1n)) + min
        n |= 1n

        if (isProbablePrime(n, 10)) {
            return n
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { bits = 1024, vulnerability } = body

        let p: bigint, q: bigint

        if (vulnerability === 'close_primes') {
            // Generate close primes for testing Fermat
            p = generatePrime(bits / 2)
            q = p + 2n
            while (!isProbablePrime(q, 10)) {
                q += 2n
            }
        } else if (vulnerability === 'small_factor') {
            // Small p for testing trial division
            p = generatePrime(20)
            q = generatePrime(bits - 20)
        } else if (vulnerability === 'smooth_p_minus_1') {
            // Generate p such that p-1 has small factors
            while (true) {
                p = generatePrime(bits / 2)
                let temp = p - 1n
                let maxFactor = 1n

                // Check small factors
                for (let f = 2n; f < 1000n; f++) {
                    while (temp % f === 0n) {
                        temp /= f
                        if (f > maxFactor) maxFactor = f
                    }
                }

                if (maxFactor < 10000n) {
                    break
                }
            }
            q = generatePrime(bits / 2)
        } else {
            // Standard generation
            p = generatePrime(bits / 2)
            q = generatePrime(bits / 2)
            while (p === q) {
                q = generatePrime(bits / 2)
            }
        }

        const n = p * q
        const phi = (p - 1n) * (q - 1n)

        // Common public exponent
        let e = 65537n
        if (gcd(e, phi) !== 1n) {
            e = 17n
        }

        const d = modInverse(e, phi)

        const keyPair = {
            publicKey: {
                e: e.toString(),
                n: n.toString()
            },
            privateKey: {
                d: d.toString(),
                n: n.toString()
            },
            p: p.toString(),
            q: q.toString(),
            phi: phi.toString(),
            bits: bits
        }

        return NextResponse.json({
            success: true,
            keyPair,
            vulnerability: vulnerability || 'none'
        })

    } catch (error) {
        console.error('RSA generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate RSA keys' },
            { status: 500 }
        )
    }
}