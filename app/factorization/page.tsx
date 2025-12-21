'use client'

import { useState } from 'react'
import FactorizationForm from '@/components/factorization/FactorizationForm'
import AlgorithmCard from '@/components/factorization/AlgorithmCard'
import ResultsTable from '@/components/factorization/ResultsTable'
import PerformanceChart from '@/components/visualization/PerformanceChart'
import { FactorizeResult } from '@/lib/types'
import { PlayCircle, RefreshCw, BarChart3 } from 'lucide-react'

export default function FactorizationPage() {
    const [results, setResults] = useState<FactorizeResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'form' | 'results' | 'charts'>('form')

    const handleFactorization = async (number: string, algorithms: string[]) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/factorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number, algorithms })
            })

            if (!response.ok) {
                console.log('Ошибка факторизации')
            }

            const data = await response.json()
            setResults(data.results)
            setActiveTab('results')
        } catch (error) {
            console.error('Ошибка факторизации:', error)
            alert('Факторизация не удалась. Пожалуйста, попробуйте снова.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Факторизация целых чисел
                </h1>
                <p>
                    Факторизация целых чисел с использованием различных алгоритмов и сравнение их производительности
                </p>
            </div>

            <div className="flex space-x-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('form')}
                    className={`px-4 py-2 font-medium ${activeTab === 'form'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <PlayCircle className="inline-block w-4 h-4 mr-2" />
                    Факторизация
                </button>
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 font-medium ${activeTab === 'results'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <RefreshCw className="inline-block w-4 h-4 mr-2" />
                    Результаты
                </button>
                <button
                    onClick={() => setActiveTab('charts')}
                    className={`px-4 py-2 font-medium ${activeTab === 'charts'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <BarChart3 className="inline-block w-4 h-4 mr-2" />
                    Графики
                </button>
            </div>

            {activeTab === 'form' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <FactorizationForm
                            onSubmit={handleFactorization}
                            isLoading={isLoading}
                        />
                    </div>
                    <div>
                        <div className="sticky top-24">
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                Доступные алгоритмы
                            </h3>
                            <div className="space-y-4">
                                <AlgorithmCard
                                    name="Пробное деление"
                                    description="Простой метод перебора делителей до √n"
                                    complexity="O(√n)"
                                    bestFor="Малые числа (< 10^6)"
                                />
                                <AlgorithmCard
                                    name="Метод Ферма"
                                    description="Использует разность квадратов для близких множителей"
                                    complexity="O(n)"
                                    bestFor="Числа с близкими простыми множителями"
                                />
                                <AlgorithmCard
                                    name="Алгоритм Полларда Rho"
                                    description="Вероятностный алгоритм с обнаружением циклов"
                                    complexity="O(n^(1/4))"
                                    bestFor="Числа с малыми простыми множителями"
                                />
                                <AlgorithmCard
                                    name="Метод Полларда p-1"
                                    description="Эффективен, когда p-1 имеет только малые простые делители"
                                    complexity="O(B log B log²n)"
                                    bestFor="Гладкие числа p-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'results' && results.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Результаты факторизации</h2>
                    <ResultsTable results={results} />

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Сводка анализа</h3>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Самый быстрый алгоритм: {
                                results.reduce((fastest, current) =>
                                    current.time < fastest.time ? current : fastest
                                ).algorithm
                            }</li>
                            <li>• Самый эффективный: {
                                results.reduce((best, current) =>
                                    (current.success && current.factors?.length || 0) >
                                    (best.success && best.factors?.length || 0) ? current : best
                                ).algorithm
                            }</li>
                            <li>• Общее время: {results.reduce((sum, r) => sum + r.time, 0).toFixed(3)} секунд</li>
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'charts' && results.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Визуализация производительности</h2>
                    <PerformanceChart results={results} />
                </div>
            )}

            {results.length === 0 && activeTab !== 'form' && (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <RefreshCw className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                        Пока нет результатов факторизации. Начните с факторизации числа!
                    </p>
                </div>
            )}
        </div>
    )
}