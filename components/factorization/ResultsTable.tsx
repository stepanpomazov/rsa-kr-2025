import React from 'react'
import { FactorizeResult } from '@/lib/types'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface ResultsTableProps {
    results: FactorizeResult[]
}

export default function ResultsTable({ results }: ResultsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Алгоритм
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Найденные множители
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Время (мс)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Сложность
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {result.algorithm}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                {result.success ? (
                                    <>
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-sm text-green-600 font-medium">Успех</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                        <span className="text-sm text-red-600 font-medium">Неудача</span>
                                    </>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono max-w-xs overflow-x-auto">
                                {result.factors.length > 0 ? (
                                    result.factors.join(' × ')
                                ) : (
                                    <span className="text-gray-400">Нет</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    {result.time.toFixed(2)}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <code className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded font-mono">
                                {result.complexity}
                            </code>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {results.some(r => r.success && r.factors.length > 0) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Разложение на простые множители:</h4>
                    <div className="font-mono text-lg text-gray-700">
                        {(() => {
                            const successfulResult = results.find(r => r.success && r.factors.length > 0)
                            if (!successfulResult) return null

                            const n = successfulResult.factors.reduce((a, b) => BigInt(a) * BigInt(b), 1n).toString()
                            const factors = successfulResult.factors.map(f => {
                                const num = BigInt(f)
                                return num.toString()
                            })

                            return (
                                <>
                                    <div className="mb-2">
                                        <span className="text-gray-500">Число:</span>{' '}
                                        <span className="font-bold">{n}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Множители:</span>{' '}
                                        <span className="font-bold">
                                            {factors.join(' × ')}
                                        </span>
                                    </div>
                                </>
                            )
                        })()}
                    </div>
                </div>
            )}
        </div>
    )
}