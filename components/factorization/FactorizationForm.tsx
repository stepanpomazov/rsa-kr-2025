'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Calculator, Loader2 } from 'lucide-react'

interface FactorizationFormProps {
    onSubmit: (number: string, algorithms: string[]) => void
    isLoading: boolean
}

export default function FactorizationForm({ onSubmit, isLoading }: FactorizationFormProps) {
    const [number, setNumber] = useState('123456789')
    const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
        'trialDivision',
        'fermat',
        'pollardRho',
        'pollardPMinus1'
    ])

    const algorithms = [
        { id: 'trialDivision', name: 'Пробное деление', description: 'Перебор делителей до √n' },
        { id: 'fermat', name: "Метод Ферма", description: 'Метод разности квадратов' },
        { id: 'pollardRho', name: "Алгоритм Полларда Rho", description: 'Алгоритм обнаружения циклов' },
        { id: 'pollardPMinus1', name: "Метод Полларда p-1", description: 'Метод гладких чисел' }
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(number, selectedAlgorithms)
    }

    const handleAlgorithmToggle = (algorithmId: string) => {
        setSelectedAlgorithms(prev =>
            prev.includes(algorithmId)
                ? prev.filter(id => id !== algorithmId)
                : [...prev, algorithmId]
        )
    }

    const presetNumbers = [
        { value: '123456789', label: 'Маленькое (123 456 789)' },
        { value: '1000000007', label: 'Простое (1 000 000 007)' },
        { value: '8051', label: 'Пример Ферма (8 051)' },
        { value: '1522605027922533360535618378132637429718068114961380688657908494580122963258952897654000350692006139', label: 'RSA-100' }
    ]

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
                <Calculator className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Факторизация целых чисел</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Число для факторизации
                        </label>
                        <Input
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Введите число для факторизации..."
                            className="text-lg text-gray-700 font-mono"
                        />

                        <div className="mt-3">
                            <p className="text-sm text-black mb-2">Попробуйте эти примеры:</p>
                            <div className="flex flex-wrap gap-2">
                                {presetNumbers.map((preset) => (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => setNumber(preset.value)}
                                        className="px-3 py-1 text-sm text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Выберите алгоритмы
                        </label>
                        <div className="space-y-3">
                            {algorithms.map((algo) => (
                                <div key={algo.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        id={algo.id}
                                        checked={selectedAlgorithms.includes(algo.id)}
                                        onChange={() => handleAlgorithmToggle(algo.id)}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <label
                                            htmlFor={algo.id}
                                            className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {algo.name}
                                        </label>
                                        <p className="text-sm text-black">{algo.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={isLoading || selectedAlgorithms.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Факторизация...
                                </>
                            ) : (
                                <>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    Запустить факторизацию
                                </>
                            )}
                        </Button>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Выбрано алгоритмов: {selectedAlgorithms.length}
                        </p>
                    </div>
                </div>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    <strong>Примечание:</strong> Для больших чисел (&gt; 20 цифр) некоторые алгоритмы могут превысить время ожидания.
                    Используйте меньшие числа для тестирования всех алгоритмов.
                </p>
            </div>
        </div>
    )
}