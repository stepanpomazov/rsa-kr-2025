'use client'

import { useState } from 'react'
import KeyGenerator from '@/components/rsa-analyzer/KeyGenerator'
import RSAAnalysisForm from '@/components/rsa-analyzer/RSAAnalysisForm'
import KeyInfo from '@/components/rsa-analyzer/KeyInfo'
import { Shield, Key, Lock } from 'lucide-react'

export default function AnalysisPage() {
    const [activeTab, setActiveTab] = useState<'generate' | 'analyze'>('generate')
    const [keyPair, setKeyPair] = useState<any>(null)

    const handleKeyGenerated = (keyPair: any) => {
        setKeyPair(keyPair)
        setActiveTab('analyze')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Shield className="h-10 w-10 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-4xl font-bold">
                            Анализ ключей RSA
                        </h1>
                        <p className=" mt-2">
                            Генерация ключей RSA и анализ их уязвимости к факторизационным атакам
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex items-center px-4 py-2 font-medium ${activeTab === 'generate'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Key className="w-4 h-4 mr-2" />
                    Генерация ключей
                </button>
                <button
                    onClick={() => setActiveTab('analyze')}
                    className={`flex items-center px-4 py-2 font-medium ${activeTab === 'analyze'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Анализ ключей
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {activeTab === 'generate' ? (
                        <KeyGenerator onKeyGenerated={handleKeyGenerated} />
                    ) : (
                        <RSAAnalysisForm keyPair={keyPair} />
                    )}
                </div>

                <div>
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                Заметки по безопасности RSA
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li>• Минимальный рекомендуемый размер ключа: 2048 бит</li>
                                <li>• Множители должны быть случайными и примерно одинакового размера</li>
                                <li>• p и q должны быть сильными простыми числами</li>
                                <li>• Общеиспользуемая открытая экспонента: 65537</li>
                            </ul>
                        </div>

                        {keyPair && (
                            <KeyInfo keyPair={keyPair} />
                        )}

                        <div className="bg-yellow-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                Распространённые уязвимости
                            </h3>
                            <ul className="space-y-2 text-sm text-yellow-700">
                                <li>• Близкие простые множители (атака Ферма)</li>
                                <li>• Малые делители p-1 (атака Полларда p-1)</li>
                                <li>• Слабый генератор случайных чисел</li>
                                <li>• Повторное использование простых чисел</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}