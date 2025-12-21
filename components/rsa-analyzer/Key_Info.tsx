'use client'

import { Key, Shield, AlertTriangle } from 'lucide-react'

interface KeyInfoProps {
    keyPair: any
}

export default function Key_Info({ keyPair }: KeyInfoProps) {
    if (!keyPair) return null

    // Вычисляем длину ключа в битах
    const keyLength = keyPair.publicKey?.n
        ? Math.ceil(Math.log2(Number(keyPair.publicKey.n)))
        : 0

    const isSecure = keyLength >= 2048
    const n = keyPair.publicKey?.n || ''
    const e = keyPair.publicKey?.e || ''
    const d = keyPair.privateKey?.d || ''

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
                <Key className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Детали сгенерированного ключа</h3>
            </div>

            <div className="space-y-4">
                <div className={`p-3 rounded-lg ${isSecure ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center">
                        {isSecure ? (
                            <Shield className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        )}
                        <span className={`font-medium ${isSecure ? 'text-green-700' : 'text-yellow-700'}`}>
              RSA ключ на {keyLength} бит
            </span>
                    </div>
                    <p className={`text-sm mt-1 ${isSecure ? 'text-green-600' : 'text-yellow-600'}`}>
                        {isSecure
                            ? '✓ Безопасен для большинства приложений'
                            : '⚠️ Небезопасен для производственного использования (только для демонстрации)'}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Компоненты открытого ключа</h4>
                    <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded border">
                            <div className="text-xs text-gray-500 mb-1">Открытая экспонента (e)</div>
                            <div className="text-sm font-mono text-gray-800 break-all">
                                {e}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border">
                            <div className="text-xs text-gray-500 mb-1">Модуль (n)</div>
                            <div className="text-sm font-mono text-gray-800 break-all">
                                {n.length > 50 ? `${n.slice(0, 50)}...` : n}
                                <div className="text-xs text-gray-500 mt-1">
                                    {n.length} цифр
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Компонент закрытого ключа</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                        <div className="text-xs text-gray-500 mb-1">Закрытая экспонента (d)</div>
                        <div className="text-sm font-mono text-gray-800 break-all">
                            {d.length > 50 ? `${d.slice(0, 50)}...` : d}
                            <div className="text-xs text-gray-500 mt-1">
                                Храните в секрете!
                            </div>
                        </div>
                    </div>
                </div>

                {keyPair.p && keyPair.q && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Простые множители</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-3 rounded border">
                                <div className="text-xs text-gray-500 mb-1">p</div>
                                <div className="text-xs font-mono text-gray-800 break-all">
                                    {keyPair.p.length > 20 ? `${keyPair.p.slice(0, 20)}...` : keyPair.p}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border">
                                <div className="text-xs text-gray-500 mb-1">q</div>
                                <div className="text-xs font-mono text-gray-800 break-all">
                                    {keyPair.q.length > 20 ? `${keyPair.q.slice(0, 20)}...` : keyPair.q}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {keyPair.phi && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Функция Эйлера φ(n)</h4>
                        <div className="bg-gray-50 p-3 rounded border">
                            <div className="text-xs font-mono text-gray-800 break-all">
                                {keyPair.phi.length > 50 ? `${keyPair.phi.slice(0, 50)}...` : keyPair.phi}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}