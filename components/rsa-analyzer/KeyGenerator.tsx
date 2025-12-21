'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Key, Loader2 } from 'lucide-react'

interface KeyGeneratorProps {
    onKeyGenerated: (keyPair: any) => void
}

export default function KeyGenerator({ onKeyGenerated }: KeyGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [keySize, setKeySize] = useState('1024')

    const generateKeys = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/generate-rsa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bits: parseInt(keySize) })
            })

            if (!response.ok) console.log('Ошибка генерации ключей')

            const data = await response.json()
            onKeyGenerated(data.keyPair)
        } catch (error) {
            console.error('Ошибка генерации ключей:', error)
            alert('Не удалось сгенерировать RSA ключи')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
                <Key className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Генерация ключей RSA</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Размер ключа (бит)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['512', '1024', '2048', '4096'].map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setKeySize(size)}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    keySize === size
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {size} бит
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {keySize === '512' && '⚠️ 512-битные ключи небезопасны и только для демонстрации'}
                        {keySize === '1024' && '⚠️ 1024-битные ключи считаются слабыми для современных приложений'}
                        {keySize === '2048' && '✓ 2048-битные ключи рекомендуются для большинства приложений'}
                        {keySize === '4096' && '✓ 4096-битные ключи обеспечивают высокую безопасность, но медленнее'}
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Тестирование уязвимостей</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Сгенерировать уязвимые ключи для тестирования различных факторизационных атак:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                setIsLoading(true)
                                const res = await fetch('/api/generate-rsa', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        bits: 64,
                                        vulnerability: 'close_primes'
                                    })
                                })
                                const data = await res.json()
                                onKeyGenerated(data.keyPair)
                                setIsLoading(false)
                            }}
                        >
                            Близкие простые
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                setIsLoading(true)
                                const res = await fetch('/api/generate-rsa', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        bits: 64,
                                        vulnerability: 'smooth_p_minus_1'
                                    })
                                })
                                const data = await res.json()
                                onKeyGenerated(data.keyPair)
                                setIsLoading(false)
                            }}
                        >
                            Гладкое p-1
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                setIsLoading(true)
                                const res = await fetch('/api/generate-rsa', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        bits: 64,
                                        vulnerability: 'small_factor'
                                    })
                                })
                                const data = await res.json()
                                onKeyGenerated(data.keyPair)
                                setIsLoading(false)
                            }}
                        >
                            Малый множитель
                        </Button>
                    </div>
                </div>

                <Button
                    onClick={generateKeys}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Генерация ключей...
                        </>
                    ) : (
                        <>
                            <Key className="mr-2 h-4 w-4" />
                            Сгенерировать пару RSA ключей
                        </>
                    )}
                </Button>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Как работает RSA</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-5">
                        <li>Сгенерировать два больших случайных простых числа: p и q</li>
                        <li>Вычислить n = p × q</li>
                        <li>Вычислить φ(n) = (p-1)(q-1)</li>
                        <li>Выбрать e такое, что 1 &lt; e &lt; φ(n) и НОД(e, φ(n)) = 1</li>
                        <li>Вычислить d = e⁻¹ mod φ(n)</li>
                        <li>Открытый ключ: (e, n), Закрытый ключ: (d, n)</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}