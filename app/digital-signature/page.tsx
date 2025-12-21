'use client'

import { useState, useEffect } from 'react'
import { generateRSAKeys, signMessage, verifySignature, RSAKeys } from '@/lib/crypto/rsa'
import { trialDivision } from '@/lib/algorithms/trialDivision'

export default function DigitalSignatureDemo() {
    const [keys, setKeys] = useState<RSAKeys | null>(null)
    const [message, setMessage] = useState('Hello, Digital World!')
    const [signature, setSignature] = useState<bigint | null>(null)
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)
    const [keyInfo, setKeyInfo] = useState({
        p: 0n,
        q: 0n,
        n: 0n,
        phi: 0n,
        e: 0n,
        d: 0n
    })
    const [isTampered, setIsTampered] = useState(false)

    // Генерация ключей при загрузке
    useEffect(() => {
        generateNewKeys()
    }, [])

    const generateNewKeys = () => {
        setLoading(true)
        try {
            const newKeys = generateRSAKeys(32) // 32 бита для демонстрации

            // Находим p и q факторизацией n (для демо)
            const n = newKeys.publicKey.n
            const factors = trialDivision(n)
            const p = factors[0]
            const q = factors[1]
            const phi = (p - 1n) * (q - 1n)

            setKeys(newKeys)
            setKeyInfo({
                p,
                q,
                n,
                phi,
                e: newKeys.publicKey.e,
                d: newKeys.privateKey.d
            })
            setSignature(null)
            setVerificationResult(null)
            setIsTampered(false)
        } catch (error) {
            console.error('Error generating keys:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSign = () => {
        if (!keys || !message.trim()) return

        setLoading(true)
        try {
            const sig = signMessage(message, keys.privateKey)
            setSignature(sig)
            setVerificationResult(null)
            setIsTampered(false)
        } catch (error) {
            console.error('Error signing message:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = () => {
        if (!keys || !signature) return

        setLoading(true)
        try {
            const result = verifySignature(message, signature, keys.publicKey)
            setVerificationResult(result)
        } catch (error) {
            console.error('Error verifying signature:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleTamper = () => {
        if (!signature) return

        // Искажаем подпись
        const tamperedSignature = signature + 1n
        setSignature(tamperedSignature)
        setIsTampered(true)
        setVerificationResult(null)
    }

    const handleTamperMessage = () => {
        setMessage(prev => prev + 'X')
        setIsTampered(true)
        setVerificationResult(null)
    }

    const formatBigInt = (num: bigint): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    const getStatusColor = (result: boolean | null) => {
        if (result === null) return 'bg-gray-100'
        return result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }

    const getStatusText = (result: boolean | null) => {
        if (result === null) return 'Не проверено'
        return result ? '✓ Подпись верна' : '✗ Подпись недействительна'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Заголовок */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        🔐 Демонстрация Цифровой Подписи RSA
                    </h1>
                    <p className="text-gray-600">
                        Иллюстрация работы асимметричного шифрования и электронной подписи
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Левая колонка - Генерация ключей */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">🔑</span> Генерация Ключей RSA
                        </h2>

                        <div className="mb-6">
                            <button
                                onClick={generateNewKeys}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Генерация...' : 'Сгенерировать новые ключи'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                * Используются 32-битные ключи для демонстрации
                            </p>
                        </div>

                        {keys && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-bold text-blue-700 mb-2">Публичный ключ (для проверки)</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Модуль (n):</span>
                                            <code className="text-sm bg-blue-100 text-gray-600 px-2 py-1 rounded">
                                                {formatBigInt(keyInfo.n)}
                                            </code>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Публичная экспонента (e):</span>
                                            <code className="text-sm bg-blue-100 text-gray-600 px-2 py-1 rounded">
                                                {formatBigInt(keyInfo.e)}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h3 className="font-bold text-purple-700 mb-2">Приватный ключ (для подписи)</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Секретная экспонента (d):</span>
                                            <code className="text-sm bg-purple-100 text-gray-600 px-2 py-1 rounded truncate">
                                                {formatBigInt(keyInfo.d)}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-bold text-gray-700 mb-2">Математические параметры</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-sm text-gray-500">p =</span>
                                            <div className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                                                {formatBigInt(keyInfo.p)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">q =</span>
                                            <div className="text-sm font-mono text-gray-600 bg-gray-100 p-2 rounded">
                                                {formatBigInt(keyInfo.q)}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-sm text-gray-500">φ(n) = (p-1)(q-1) =</span>
                                            <div className="text-sm font-mono bg-gray-100 text-gray-600 p-2 rounded">
                                                {formatBigInt(keyInfo.phi)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Правая колонка - Работа с подписью */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-500">📝</span> Создание и Проверка Подписи
                        </h2>

                        {/* Сообщение */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-medium">
                                Сообщение для подписи:
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Введите сообщение..."
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={handleTamperMessage}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                >
                                    Исказить сообщение
                                </button>
                                {isTampered && (
                                    <span className="text-sm text-red-600 flex items-center">
                                        ⚠ Сообщение изменено
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Кнопки действий */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={handleSign}
                                disabled={!keys || loading}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>✍️</span>
                                Создать цифровую подпись
                            </button>

                            <button
                                onClick={handleVerify}
                                disabled={!signature || loading}
                                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>🔍</span>
                                Проверить подпись
                            </button>
                        </div>

                        {/* Подпись */}
                        {signature && (
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-700 mb-2">Цифровая подпись:</h3>
                                <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                    {signature.toString(16).toUpperCase()}
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={handleTamper}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                                    >
                                        Исказить подпись
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        Длина: {signature.toString().length} цифр
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Результат проверки */}
                        <div className={`rounded-lg p-4 transition-all duration-300 ${getStatusColor(verificationResult)}`}>
                            <h3 className="font-bold text-gray-700 mb-2">Результат проверки:</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-lg text-gray-600 font-semibold">
                                    {getStatusText(verificationResult)}
                                </span>
                                {verificationResult !== null && (
                                    <span className="text-2xl">
                                        {verificationResult ? '✅' : '❌'}
                                    </span>
                                )}
                            </div>

                            {verificationResult === false && (
                                <div className="mt-3 p-3 bg-white rounded border border-red-200">
                                    <p className="text-sm text-red-700">
                                        Подпись не прошла проверку. Возможные причины:
                                    </p>
                                    <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                                        <li>Сообщение было изменено после подписания</li>
                                        <li>Подпись была повреждена или изменена</li>
                                        <li>Использован неверный публичный ключ</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Объяснение процесса */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-indigo-500">🎓</span> Как работает цифровая подпись RSA
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <h3 className="font-bold text-blue-700 mb-2">1. Подписание</h3>
                            <p className="text-sm text-gray-600">
                                s = hash(m)<sup>d</sup> mod n<br/>
                                Используется <strong>приватный ключ (d)</strong> отправителя
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <h3 className="font-bold text-green-700 mb-2">2. Проверка</h3>
                            <p className="text-sm text-gray-600">
                                m' = s<sup>e</sup> mod n<br/>
                                Используется <strong>публичный ключ (e)</strong> отправителя
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <h3 className="font-bold text-purple-700 mb-2">3. Гарантии</h3>
                            <p className="text-sm text-gray-600">
                                • Аутентичность отправителя<br/>
                                • Целостность сообщения<br/>
                                • Невозможность отказа
                            </p>
                        </div>
                    </div>
                </div>

                {/* Визуализация процесса */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-red-500">🔗</span> Визуализация процесса
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl">📄</span>
                            </div>
                            <p className="font-medium text-gray-600">Исходное сообщение</p>
                            <code className="text-xs text-gray-500 block mt-1">{message.substring(0, 20)}...</code>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl text-gray-600">↓</div>
                            <p className="text-sm text-gray-500">Подписание</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl">🔑</span>
                            </div>
                            <p className="font-medium text-gray-600">Приватный ключ</p>
                            <code className="text-xs text-gray-500 block mt-1">d = ...{keyInfo.d.toString().slice(-6)}</code>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl text-gray-600">↓</div>
                            <p className="text-sm text-gray-500">Вычисление</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl">✍️</span>
                            </div>
                            <p className="font-medium text-gray-600">Цифровая подпись</p>
                            <code className="text-xs text-gray-500 block mt-1">
                                {signature ? `${signature.toString(16).substring(0, 16)}...` : '—'}
                            </code>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl text-gray-600">↓</div>
                            <p className="text-sm text-gray-500">Проверка</p>
                        </div>

                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${verificationResult === true ? 'bg-green-100' : verificationResult === false ? 'bg-red-100' : 'bg-gray-100'}`}>
                                <span className="text-2xl">
                                    {verificationResult === true ? '✅' : verificationResult === false ? '❌' : '❓'}
                                </span>
                            </div>
                            <p className="font-medium text-gray-600">Результат</p>
                            <code className="text-xs text-gray-500 block mt-1">
                                {verificationResult !== null ? (verificationResult ? 'Верно' : 'Неверно') : '—'}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Подвал с информацией */}
                <footer className="mt-8 text-center text-gray-500 text-sm">
                    <p>
                        Демонстрация алгоритма RSA для цифровой подписи. Используются 32-битные ключи для наглядности.
                        В реальных системах используются ключи длиной 2048-4096 бит.
                    </p>
                    <p className="mt-2">
                        Технологии: TypeScript, Next.js, BigInt для работы с большими числами
                    </p>
                </footer>
            </div>
        </div>
    )
}