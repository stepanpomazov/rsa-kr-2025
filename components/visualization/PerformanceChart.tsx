'use client'

import { FactorizeResult } from '@/lib/types'

interface PerformanceChartProps {
    results: FactorizeResult[]
}

export default function PerformanceChart({ results }: PerformanceChartProps) {
    const maxTime = Math.max(...results.map(r => r.time))

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Сравнение времени выполнения</h3>
                <div className="space-y-4">
                    {results.map((result, index) => {
                        const percentage = maxTime > 0 ? (result.time / maxTime) * 100 : 0

                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        {result.algorithm}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {result.time.toFixed(2)} мс
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Производительность алгоритмов</h4>
                    <div className="space-y-3">
                        {results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    {result.algorithm}
                                </span>
                                <div className="flex items-center space-x-4">
                                    <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.success ? '✓' : '✗'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {result.factors.length} множителей
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Сводка</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Самый быстрый алгоритм:</span>
                            <span className="font-medium text-gray-600">
                                {results.reduce((fastest, current) =>
                                    current.time < fastest.time ? current : fastest
                                ).algorithm}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Самый успешный:</span>
                            <span className="font-medium text-gray-600">
                                {results.reduce((best, current) =>
                                    current.success ? (best.success ?
                                            (current.factors?.length || 0) > (best.factors?.length || 0) ? current : best
                                            : current)
                                        : best
                                ).algorithm}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Общее время:</span>
                            <span className="font-medium text-gray-600">
                                {results.reduce((sum, r) => sum + r.time, 0).toFixed(2)} мс
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-blue-800 font-semibold mb-2">Сложность алгоритмов</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">{result.algorithm}</span>
                            <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {result.complexity}
                            </code>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}