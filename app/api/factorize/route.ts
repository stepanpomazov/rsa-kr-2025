// /app/api/factorize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { trialDivision } from '@/lib/algorithms/trialDivision'
import { fermatFactorization } from '@/lib/algorithms/fermat'
import { pollardRho } from '@/lib/algorithms/pollardRho'
import { pollardPMinus1 } from '@/lib/algorithms/pollardPMinus1'
import { FactorizeResult } from '@/lib/types'

// Helper to parse number (handles formats like "3^2")
const parseNumber = (input: string): bigint => {
    // Remove whitespace
    const cleanInput = input.trim()

    // Check for exponent format (e.g., "3^2" = 9)
    if (cleanInput.includes('^')) {
        const [base, exponent] = cleanInput.split('^').map(part => part.trim())
        const baseNum = BigInt(base)
        const expNum = BigInt(exponent)

        // Calculate power
        let result = 1n
        for (let i = 0n; i < expNum; i++) {
            result *= baseNum
        }
        return result
    }

    // Regular number
    return BigInt(cleanInput)
}

// Helper function to format factors with exponents
const formatFactors = (factors: bigint[]): string[] => {
    if (factors.length === 0) return []

    // Sort factors
    const sorted = [...factors].sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })

    const result: string[] = []
    let currentFactor = sorted[0]
    let count = 1

    for (let i = 1; i <= sorted.length; i++) {
        if (i < sorted.length && sorted[i] === currentFactor) {
            count++
        } else {
            if (count > 1) {
                result.push(`${currentFactor}^${count}`)
            } else {
                result.push(currentFactor.toString())
            }

            if (i < sorted.length) {
                currentFactor = sorted[i]
                count = 1
            }
        }
    }

    return result
}

// Recursive factorization for algorithms that return single factors
const recursiveFactorization = (n: bigint, algorithm: (n: bigint) => any): bigint[] => {
    if (n <= 1n) return []

    const result = algorithm(n)

    // For Pollard algorithms that return a single factor
    if (result.factor && result.factor !== n && result.factor !== 1n) {
        const factor1 = result.factor
        const factor2 = n / factor1

        return [
            ...recursiveFactorization(factor1, algorithm),
            ...recursiveFactorization(factor2, algorithm)
        ]
    }

    // If no factor found or algorithm failed, use trial division
    return trialDivision(n)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { number, algorithms = ['trialDivision'] } = body

        if (!number || number.trim() === '') {
            return NextResponse.json(
                { error: 'Number is required' },
                { status: 400 }
            )
        }

        // Parse the input number (handles formats like "3^2")
        const n = parseNumber(number)

        // Validate input
        if (n <= 1n) {
            return NextResponse.json(
                { error: 'Number must be greater than 1' },
                { status: 400 }
            )
        }

        const results: FactorizeResult[] = []

        // Execute selected algorithms
        for (const algorithm of algorithms) {
            const algorithmStartTime = performance.now()

            let factors: bigint[] = []
            let success = false
            let algorithmName = ''
            let complexity = ''

            switch (algorithm) {
                case 'trialDivision':
                    algorithmName = 'Trial Division'
                    complexity = 'O(√n)'
                    factors = trialDivision(n)
                    success = factors.length > 0
                    break

                case 'fermat':
                    algorithmName = "Fermat's Method"
                    complexity = 'O(n)'

                    const fermatResult = fermatFactorization(n)

                    if (fermatResult.factors) {
                        const [a, b] = fermatResult.factors

                        // Check if we got non-trivial factors (not 1 and n)
                        if (a > 1n && b > 1n && a !== n && b !== n) {
                            // Factorize both factors completely
                            factors = [
                                ...trialDivision(a),
                                ...trialDivision(b)
                            ]
                        } else {
                            // Use trial division as fallback
                            factors = trialDivision(n)
                        }
                    } else {
                        factors = trialDivision(n)
                    }

                    success = factors.length > 0
                    break

                case 'pollardRho':
                    algorithmName = "Pollard's Rho"
                    complexity = 'O(n^(1/4))'
                    factors = recursiveFactorization(n, pollardRho)
                    success = factors.length > 0
                    break

                case 'pollardPMinus1':
                    algorithmName = "Pollard's p-1"
                    complexity = 'O(B log B log²n)'
                    factors = recursiveFactorization(n, pollardPMinus1)
                    success = factors.length > 0
                    break

                default:
                    continue
            }

            const algorithmEndTime = performance.now()

            results.push({
                algorithm: algorithmName,
                success,
                factors: formatFactors(factors),
                time: algorithmEndTime - algorithmStartTime,
                complexity
            })
        }

        return NextResponse.json({
            number: number.toString(),
            originalNumber: n.toString(),
            results
        })

    } catch (error) {
        console.error('Factorization error:', error)

        let errorMessage = 'Internal server error'
        if (error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === 'string') {
            errorMessage = error
        }

        return NextResponse.json(
            {
                error: errorMessage,
                details: error instanceof RangeError ? 'Invalid number format' : undefined
            },
            { status: 500 }
        )
    }
}