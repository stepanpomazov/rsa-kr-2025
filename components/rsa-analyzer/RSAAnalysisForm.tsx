'use client'

import { useState } from 'react'
import { Lock, Loader2, Shield, AlertTriangle, CheckCircle, XCircle, Copy, Check } from 'lucide-react'

interface RSAAnalysisFormProps {
    keyPair: any
}

export default function RSAAnalysisForm({ keyPair }: RSAAnalysisFormProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResults, setAnalysisResults] = useState<any>(null)
    const [copied, setCopied] = useState({
        publicKey: false,
        privateKey: false,
        modulus: false,
        recommendation: false
    })

    const analyzeKey = async () => {
        if (!keyPair) return

        setIsAnalyzing(true)
        try {
            const response = await fetch('/api/analyze-rsa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    n: keyPair.publicKey.n,
                    e: keyPair.publicKey.e
                })
            })

            if (!response.ok) console.log('Ошибка анализа')

            const data = await response.json()
            setAnalysisResults(data)
        } catch (error) {
            console.error('Ошибка анализа:', error)
            alert('Не удалось проанализировать RSA ключ')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleCopy = (text: string, field: keyof typeof copied) => {
        navigator.clipboard.writeText(text)
        setCopied(prev => ({ ...prev, [field]: true }))
        setTimeout(() => {
            setCopied(prev => ({ ...prev, [field]: false }))
        }, 2000)
    }

    if (!keyPair) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    RSA ключ не сгенерирован
                </h3>
                <p className="text-gray-500">
                    Пожалуйста, сначала сгенерируйте пару RSA ключей для анализа безопасности
                </p>
            </div>
        )
    }

    const keyLength = keyPair.publicKey?.n
        ? Math.ceil(Math.log2(Number(keyPair.publicKey.n)))
        : 0

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
                <Lock className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Анализ безопасности RSA ключа</h2>
            </div>

            <div className="space-y-6">
                {/* Информация о ключе */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-700">Информация о ключе</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleCopy(`e=${keyPair.publicKey.e}\nn=${keyPair.publicKey.n}`, 'publicKey')}
                                className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                {copied.publicKey ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                Копировать открытый ключ
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-black mb-1 flex justify-between items-center">
                                <span>Открытый ключ (e, n)</span>
                                <button
                                    onClick={() => handleCopy(`e=${keyPair.publicKey.e}`, 'publicKey')}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    {copied.publicKey ? 'Скопировано!' : 'Копировать e'}
                                </button>
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="relative">
                                    <div className="font-mono bg-white text-black p-2 pr-10 rounded border break-all">
                                        e = {keyPair.publicKey.e}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(keyPair.publicKey.e, 'publicKey')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        {copied.publicKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="font-mono bg-white text-black p-2 pr-10 rounded border">
                                        n = {keyPair.publicKey.n.slice(0, 30)}...
                                        {keyPair.publicKey.n.length > 30 && (
                                            <span className="text-gray-500"> (ещё {keyPair.publicKey.n.length - 30} цифр)</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(keyPair.publicKey.n, 'modulus')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        {copied.modulus ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-black mb-1">Детали ключа</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-black">Длина ключа:</span>
                                    <span className={`font-medium ${keyLength >= 2048 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {keyLength} бит
                                    </span>
                                </div>
                                {keyPair.p && keyPair.q && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-black">Простое p:</span>
                                                <button
                                                    onClick={() => handleCopy(keyPair.p, 'privateKey')}
                                                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                                                >
                                                    {copied.privateKey ? '✓' : 'Копировать'}
                                                </button>
                                            </div>
                                            <span className="text-sm text-black font-mono">
                                                {keyPair.p.slice(0, 10)}...
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-black">Простое q:</span>
                                            <span className="text-sm text-black font-mono">
                                                {keyPair.q.slice(0, 10)}...
                                            </span>
                                        </div>
                                    </>
                                )}
                                {keyPair.privateKey?.d && (
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-black">Закрытая экспонента d:</span>
                                                <button
                                                    onClick={() => handleCopy(keyPair.privateKey.d, 'privateKey')}
                                                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                                                >
                                                    {copied.privateKey ? '✓' : 'Копировать'}
                                                </button>
                                            </div>
                                            <span className="text-sm text-black font-mono">
                                                {keyPair.privateKey.d.slice(0, 10)}...
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопка анализа */}
                <button
                    onClick={analyzeKey}
                    disabled={isAnalyzing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Анализ безопасности...
                        </>
                    ) : (
                        <>
                            <Lock className="mr-2 h-4 w-4" />
                            Проанализировать безопасность ключа
                        </>
                    )}
                </button>

                {/* Результаты анализа */}
                {analysisResults && (
                    <div className="mt-6 space-y-6">
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Результаты анализа безопасности</h3>
                                <button
                                    onClick={() => {
                                        const summary = `
Результаты анализа RSA ключа:
──────────────────────────────
Длина ключа: ${analysisResults.keyLength} бит
Статус безопасности: ${analysisResults.isVulnerable ? 'УЯЗВИМЫЙ' : 'БЕЗОПАСНЫЙ'}
Оценка: ${analysisResults.recommendations}

Результаты тестов:
${analysisResults.factorizationAttempts?.map((a: any) =>
                                            `• ${a.algorithm}: ${a.success ? 'УЯЗВИМЫЙ' : 'БЕЗОПАСНЫЙ'} (${a.time} мс)`
                                        ).join('\n')}

Рекомендации:
${keyLength < 2048 ? '• Используйте длину ключа не менее 2048 бит\n' : ''}
${analysisResults.isVulnerable ? '• Сгенерируйте новый RSA ключ с более сильными простыми числами\n' : ''}
• Убедитесь, что p и q случайные и примерно одинакового размера
• Используйте криптографически стойкий генератор случайных чисел
• Рассмотрите использование 3072 или 4096 бит для долгосрочной безопасности
                                        `.trim()
                                        handleCopy(summary, 'recommendation')
                                    }}
                                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    {copied.recommendation ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                    Копировать отчёт
                                </button>
                            </div>

                            {/* Тесты факторизации */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Тесты факторизации</h4>
                                <div className="space-y-3">
                                    {analysisResults.factorizationAttempts?.map((attempt: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                                            <div className="flex items-center">
                                                {attempt.success ? (
                                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-700">{attempt.algorithm}</div>
                                                    <div className="text-sm text-gray-500">Предел: {attempt.limit}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-medium ${attempt.success ? 'text-red-600' : 'text-green-600'}`}>
                                                    {attempt.success ? 'УЯЗВИМЫЙ' : 'БЕЗОПАСНЫЙ'}
                                                </div>
                                                <div className="text-sm text-gray-500">{attempt.time} мс</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Рекомендации */}
                            <div className={`p-4 rounded-lg border ${
                                analysisResults.isVulnerable || keyLength < 2048
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-green-50 border-green-200'
                            }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start flex-1">
                                        {analysisResults.isVulnerable || keyLength < 2048 ? (
                                            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                                        ) : (
                                            <Shield className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`font-semibold mb-2 ${
                                                    analysisResults.isVulnerable || keyLength < 2048
                                                        ? 'text-red-800'
                                                        : 'text-green-800'
                                                }`}>
                                                    Оценка безопасности
                                                </h4>
                                                <button
                                                    onClick={() => handleCopy(analysisResults.recommendations, 'recommendation')}
                                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                                >
                                                    {copied.recommendation ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <p className={`text-sm ${
                                                analysisResults.isVulnerable || keyLength < 2048
                                                    ? 'text-red-700'
                                                    : 'text-green-700'
                                            }`}>
                                                {analysisResults.recommendations}
                                            </p>
                                            {analysisResults.keyLength && (
                                                <div className="mt-2 text-sm">
                                                    <span className="font-medium">Длина ключа:</span>{' '}
                                                    <span className={keyLength >= 2048 ? 'text-green-600' : 'text-red-600'}>
                                                        {analysisResults.keyLength} бит
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Объяснение уязвимостей */}
                            {(analysisResults.isVulnerable || keyLength < 2048) && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-yellow-800">Рекомендации по безопасности</h4>
                                        <button
                                            onClick={() => {
                                                const recommendations = `
Рекомендации по безопасности RSA:
─────────────────────────────────
${keyLength < 2048 ? '• Используйте длину ключа не менее 2048 бит для производственных систем\n' : ''}
${analysisResults.isVulnerable ? '• Сгенерируйте новый RSA ключ с более сильными простыми числами\n' : ''}
• Убедитесь, что p и q случайные и примерно одинакового размера
• Используйте криптографически стойкий генератор случайных чисел
• Рассмотрите использование 3072 или 4096 бит для долгосрочной безопасности
                                                `.trim()
                                                handleCopy(recommendations, 'recommendation')
                                            }}
                                            className="text-yellow-600 hover:text-yellow-800"
                                        >
                                            {copied.recommendation ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        {keyLength < 2048 && (
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Используйте длину ключа не менее 2048 бит для производственных систем</span>
                                            </li>
                                        )}
                                        {analysisResults.isVulnerable && (
                                            <li className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>Сгенерируйте новый RSA ключ с более сильными простыми числами</span>
                                            </li>
                                        )}
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Убедитесь, что p и q случайные и примерно одинакового размера</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Используйте криптографически стойкий генератор случайных чисел</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Рассмотрите использование 3072 или 4096 бит для долгосрочной безопасности</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Подсказки */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-blue-800">Детали анализа</h4>
                        <button
                            onClick={() => handleCopy(`
Детали анализа RSA:
────────────────────
• Пробное деление: Проверяет делители до 1,000,000
• Метод Полларда Rho: Вероятностный алгоритм поиска делителей
• Время анализа зависит от размера ключа и алгоритма
                            `.trim(), 'recommendation')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            {copied.recommendation ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Пробное деление</strong>: Проверяет делители до 1,000,000</li>
                        <li>• <strong>Метод Полларда Rho</strong>: Вероятностный алгоритм поиска делителей</li>
                        <li>• Время анализа зависит от размера ключа и алгоритма</li>
                    </ul>
                </div>

                {/* Кнопки быстрых действий */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Быстрые действия</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                const keyInfo = `
Информация о RSA ключе:
────────────────────────
Открытый ключ:
e = ${keyPair.publicKey.e}
n = ${keyPair.publicKey.n}

Закрытый ключ:
d = ${keyPair.privateKey?.d || 'скрыто'}
n = ${keyPair.privateKey?.n || keyPair.publicKey.n}

Параметры:
Длина ключа: ${keyLength} бит
${keyPair.p ? `p = ${keyPair.p}` : ''}
${keyPair.q ? `q = ${keyPair.q}` : ''}
${keyPair.phi ? `φ(n) = ${keyPair.phi}` : ''}
                                `.trim()
                                handleCopy(keyInfo, 'publicKey')
                            }}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Копировать все данные ключа
                        </button>
                        <button
                            onClick={() => {
                                const analysis = analysisResults ? `
Результаты анализа:
───────────────────
${analysisResults.factorizationAttempts?.map((a: any) =>
                                    `${a.algorithm}: ${a.success ? 'УЯЗВИМ' : 'БЕЗОПАСЕН'} (${a.time} мс)`
                                ).join('\n')}

Итог: ${analysisResults.recommendations}
                                `.trim() : 'Анализ не выполнен'
                                handleCopy(analysis, 'recommendation')
                            }}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Копировать результаты анализа
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}