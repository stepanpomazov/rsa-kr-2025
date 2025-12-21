import { NextRequest, NextResponse } from 'next/server'
import { trialDivision } from '@/lib/algorithms/trialDivision'
import { fermatFactorization } from '@/lib/algorithms/fermat'
import { pollardRho } from '@/lib/algorithms/pollardRho'
import { pollardPMinus1 } from '@/lib/algorithms/pollardPMinus1'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { n, e } = body

        if (!n || !e) {
            return NextResponse.json(
                { error: 'Missing n or e parameters' },
                { status: 400 }
            )
        }

        const nBig = BigInt(n)
        const eBig = BigInt(e)

        // Вычисляем длину ключа в битах
        const bitLength = nBig.toString(2).length

        // Анализ безопасности ключа
        const analysisResults = []

        // 1. Проверка Trial Division
        const tdStart = performance.now()
        const tdFactors = trialDivision(nBig)
        const tdTime = performance.now() - tdStart

        analysisResults.push({
            algorithm: 'Trial Division',
            time: tdTime,
            factors: tdFactors.map(f => f.toString()),
            success: tdFactors.length > 1,
            vulnerability: tdFactors.length > 1 ? 'high' : 'low',
            details: `Найдено ${tdFactors.length} множителей за ${tdTime.toFixed(2)} мс`
        })

        // 2. Метод Ферма
        const fermatStart = performance.now()
        const fermatResult = fermatFactorization(nBig)
        const fermatTime = performance.now() - fermatStart

        analysisResults.push({
            algorithm: 'Fermat\'s Method',
            time: fermatTime,
            factors: fermatResult.factors
                ? [fermatResult.factors[0].toString(), fermatResult.factors[1].toString()]
                : [],
            success: fermatResult.factors !== null &&
                fermatResult.factors[0] !== 1n &&
                fermatResult.factors[1] !== nBig,
            vulnerability: (fermatResult.factors &&
                fermatResult.factors[0] !== 1n &&
                fermatResult.factors[1] !== nBig) ? 'high' : 'low',
            details: fermatResult.factors ? `Найдены множители: ${fermatResult.factors[0]} × ${fermatResult.factors[1]}` : 'Множители не найдены'
        })

        // 3. ρ-алгоритм Полларда
        const rhoStart = performance.now()
        const rhoResult = pollardRho(nBig)
        const rhoTime = performance.now() - rhoStart

        analysisResults.push({
            algorithm: 'Pollard\'s Rho',
            time: rhoTime,
            factors: rhoResult.factor ? [rhoResult.factor.toString()] : [],
            success: rhoResult.factor !== null && rhoResult.factor !== nBig,
            vulnerability: (rhoResult.factor && rhoResult.factor !== nBig) ? 'high' : 'low',
            details: rhoResult.factor ? `Найден множитель: ${rhoResult.factor}` : 'Множитель не найден'
        })

        // 4. p-1 алгоритм Полларда
        const pMinusStart = performance.now()
        const pMinusResult = pollardPMinus1(nBig)
        const pMinusTime = performance.now() - pMinusStart

        analysisResults.push({
            algorithm: 'Pollard\'s p-1',
            time: pMinusTime,
            factors: pMinusResult.factor ? [pMinusResult.factor.toString()] : [],
            success: pMinusResult.factor !== null && pMinusResult.factor !== nBig,
            vulnerability: (pMinusResult.factor && pMinusResult.factor !== nBig) ? 'high' : 'low',
            details: pMinusResult.factor ? `Найден множитель: ${pMinusResult.factor}` : 'Множитель не найден'
        })

        // Определяем общий уровень риска
        const hasHighRisk = analysisResults.some(r => r.vulnerability === 'high')
        const hasMediumRisk = analysisResults.some(r => r.vulnerability === 'medium')
        const overallRisk = hasHighRisk ? 'high' : hasMediumRisk ? 'medium' : 'low'

        // Вычисляем рекомендации
        let recommendations = []
        if (bitLength < 512) {
            recommendations.push('Ключ слишком короткий (< 512 бит)')
            recommendations.push('Используйте ключи длиной не менее 2048 бит')
        } else if (bitLength < 1024) {
            recommendations.push('Ключ недостаточной длины (512-1024 бит)')
            recommendations.push('Рекомендуется обновить до 2048 бит')
        } else if (bitLength < 2048) {
            recommendations.push('Минимальная допустимая длина (1024-2048 бит)')
            recommendations.push('Рассмотрите переход на 3072 бита для будущей безопасности')
        } else {
            recommendations.push('Длина ключа соответствует современным стандартам')
        }

        // Проверяем экспоненту e
        if (eBig === 3n) {
            recommendations.push('Экспонента e=3 может быть уязвима при неправильном использовании')
        }

        return NextResponse.json({
            success: true,
            bitLength,
            overallRisk,
            recommendations,
            results: analysisResults,
            summary: {
                totalTime: analysisResults.reduce((sum, r) => sum + r.time, 0),
                vulnerableAlgorithms: analysisResults.filter(r => r.success).length,
                totalAlgorithms: analysisResults.length
            }
        })

    } catch (error) {
        console.error('RSA analysis error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}