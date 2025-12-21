'use client'

import { Calculator, Key, Lock, Shield, Cpu, Fingerprint } from 'lucide-react'
import { useState } from 'react'

export default function TheoryPage() {
    const [activeSection, setActiveSection] = useState('basics')

    const sections = [
        { id: 'basics', name: 'Основы RSA', icon: <Shield className="h-5 w-5" /> },
        { id: 'math', name: 'Математика', icon: <Calculator className="h-5 w-5" /> },
        { id: 'keys', name: 'Генерация ключей', icon: <Key className="h-5 w-5" /> },
        { id: 'encryption', name: 'Шифрование', icon: <Lock className="h-5 w-5" /> },
        { id: 'security', name: 'Безопасность', icon: <Fingerprint className="h-5 w-5" /> },
        { id: 'attacks', name: 'Атаки', icon: <Cpu className="h-5 w-5" /> },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Теория криптосистемы RSA
                </h1>
                <p className="text-xl">
                    Подробное объяснение алгоритма RSA, его математических основ и методов защиты
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Навигация */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-4 sticky top-24">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Разделы</h3>
                        <nav className="space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {section.icon}
                                    <span className="font-medium">{section.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Контент */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-lg p-8">

                        {activeSection === 'basics' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Shield className="h-10 w-10 text-blue-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Основы криптосистемы RSA</h2>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-700">
                                        RSA (Rivest, Shamir, Adleman) — одна из первых и наиболее широко используемых криптосистем с открытым ключом,
                                        предложенная в 1977 году Рональдом Ривестом, Ади Шамиром и Леонардом Адлеманом.
                                    </p>

                                    <div className="bg-blue-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-blue-800 mb-3">Ключевые принципы</h3>
                                        <ul className="space-y-3 text-blue-700">
                                            <li className="flex items-start">
                                                <div className="bg-blue-100 p-1 rounded mr-3 mt-1">
                                                    <Key className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span><strong>Асимметричное шифрование:</strong> Использует пару ключей — открытый и закрытый</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="bg-blue-100 p-1 rounded mr-3 mt-1">
                                                    <Lock className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span><strong>Односторонняя функция с лазейкой:</strong> Легко вычислить, трудно обратить без секретной информации</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="bg-blue-100 p-1 rounded mr-3 mt-1">
                                                    <Calculator className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span><strong>Основа — задача факторизации:</strong> Стойкость основана на сложности разложения больших чисел на множители</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'math' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Calculator className="h-10 w-10 text-green-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Математические основы</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Теоремы</h3>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-lg text-blue-700 mb-2">Малая теорема Ферма</h4>
                                                <div className="bg-white p-4 rounded border">
                                                    <p className="text-gray-700 mb-2">
                                                        Если p — простое число, и a не делится на p, то:
                                                    </p>
                                                    <div className="text-center text-xl font-mono text-blue-600 mb-3">
                                                        a<sup>p-1</sup> ≡ 1 (mod p)
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Это основа для многих алгоритмов проверки простоты чисел
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-lg text-blue-700 mb-2">Теорема Эйлера</h4>
                                                <div className="bg-white p-4 rounded border">
                                                    <p className="text-gray-700 mb-2">
                                                        Для любых взаимно простых чисел a и n:
                                                    </p>
                                                    <div className="text-center text-xl font-mono text-blue-600 mb-3">
                                                        a<sup>φ(n)</sup> ≡ 1 (mod n)
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        где φ(n) — функция Эйлера (количество чисел от 1 до n, взаимно простых с n)
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-lg text-blue-700 mb-2">Функция Эйлера для RSA</h4>
                                                <div className="bg-white p-4 rounded border">
                                                    <p className="text-gray-700 mb-2">
                                                        Если n = p × q, где p и q — простые числа, то:
                                                    </p>
                                                    <div className="text-center text-xl font-mono text-blue-600">
                                                        φ(n) = (p - 1)(q - 1)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'keys' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Key className="h-10 w-10 text-yellow-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Генерация ключей RSA</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-yellow-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Процесс генерации ключей</h3>

                                        <ol className="space-y-4">
                                            <li className="flex items-start">
                                                <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                    1
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Выбор простых чисел</h4>
                                                    <p className="text-gray-700">
                                                        Выбираются два больших случайных простых числа p и q
                                                        <br />
                                                        <span className="text-sm text-gray-600">
                              Рекомендуемый размер: не менее 1024 бит каждое (2048+ для современных систем)
                            </span>
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="flex items-start">
                                                <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                    2
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Вычисление модуля</h4>
                                                    <div className="text-lg font-mono text-blue-600">
                                                        n = p × q
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Модуль n является частью как открытого, так и закрытого ключа
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="flex items-start">
                                                <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                    3
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Вычисление функции Эйлера</h4>
                                                    <div className="text-lg font-mono text-blue-600">
                                                        φ(n) = (p - 1)(q - 1)
                                                    </div>
                                                </div>
                                            </li>

                                            <li className="flex items-start">
                                                <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                    4
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Выбор открытой экспоненты</h4>
                                                    <p className="text-gray-700">
                                                        Выбирается число e такое, что:
                                                    </p>
                                                    <ul className="list-disc pl-5 text-gray-700 mt-1">
                                                        <li>1 &lt; e &lt; φ(n)</li>
                                                        <li>НОД(e, φ(n)) = 1 (e и φ(n) взаимно просты)</li>
                                                    </ul>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Часто используются: 3, 17, 65537 (2¹⁶ + 1)
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="flex items-start">
                                                <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">
                                                    5
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Вычисление закрытой экспоненты</h4>
                                                    <div className="text-lg font-mono text-blue-600 mb-2">
                                                        d ≡ e⁻¹ (mod φ(n))
                                                    </div>
                                                    <p className="text-gray-700">
                                                        Число d вычисляется как мультипликативно обратное к e по модулю φ(n)
                                                        <br />
                                                        <span className="text-sm text-gray-600">
                              Используется расширенный алгоритм Евклида
                            </span>
                                                    </p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-3">Итоговые ключи</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded border border-green-200">
                                                <h5 className="font-semibold text-green-700 mb-2">Открытый ключ</h5>
                                                <div className="font-mono text-sm">
                                                    (e, n)
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Может свободно распространяться
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded border border-red-200">
                                                <h5 className="font-semibold text-red-700 mb-2">Закрытый ключ</h5>
                                                <div className="font-mono text-sm">
                                                    (d, n)
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Должен храниться в секрете
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'encryption' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Lock className="h-10 w-10 text-red-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Процессы шифрования и расшифрования</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-red-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-red-800 mb-4">Шифрование сообщения M</h3>

                                        <div className="text-center text-2xl font-mono text-red-600 mb-6">
                                            C ≡ M<sup>e</sup> (mod n)
                                        </div>

                                        <div className="bg-white p-4 rounded border">
                                            <h4 className="font-semibold text-gray-800 mb-2">Где:</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li><strong>M</strong> — исходное сообщение (представленное как число)</li>
                                                <li><strong>C</strong> — зашифрованное сообщение</li>
                                                <li><strong>e, n</strong> — компоненты открытого ключа</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-green-800 mb-4">Расшифрование сообщения C</h3>

                                        <div className="text-center text-2xl font-mono text-green-600 mb-6">
                                            M ≡ C<sup>d</sup> (mod n)
                                        </div>

                                        <div className="bg-white p-4 rounded border">
                                            <h4 className="font-semibold text-gray-800 mb-2">Где:</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li><strong>C</strong> — зашифрованное сообщение</li>
                                                <li><strong>M</strong> — расшифрованное сообщение</li>
                                                <li><strong>d</strong> — секретная экспонента (часть закрытого ключа)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-blue-800 mb-4">Доказательство корректности</h3>

                                        <div className="space-y-4">
                                            <p className="text-gray-700">
                                                Из теоремы Эйлера и свойств модульной арифметики:
                                            </p>

                                            <div className="bg-white p-4 rounded border font-mono text-sm text-gray-800 overflow-x-auto">
                                                <div className="mb-2">C<sup>d</sup> ≡ (M<sup>e</sup>)<sup>d</sup> (mod n)</div>
                                                <div className="mb-2">≡ M<sup>ed</sup> (mod n)</div>
                                                <div className="mb-2">Поскольку ed ≡ 1 (mod φ(n)), то ed = 1 + kφ(n)</div>
                                                <div className="mb-2">≡ M<sup>1 + kφ(n)</sup> (mod n)</div>
                                                <div className="mb-2">≡ M × M<sup>kφ(n)</sup> (mod n)</div>
                                                <div>≡ M × 1<sup>k</sup> (mod n) = M (mod n)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Fingerprint className="h-10 w-10 text-purple-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Безопасность RSA</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-purple-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-purple-800 mb-4">Основная задача взлома</h3>

                                        <p className="text-gray-700 mb-4">
                                            Если злоумышленник может факторизовать модуль n на простые множители p и q,
                                            то он может вычислить:
                                        </p>

                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start">
                                                <div className="bg-purple-100 p-1 rounded mr-3 mt-1">
                                                    <Calculator className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span>φ(n) = (p - 1)(q - 1)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="bg-purple-100 p-1 rounded mr-3 mt-1">
                                                    <Key className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span>Закрытую экспоненту d ≡ e⁻¹ (mod φ(n))</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="bg-purple-100 p-1 rounded mr-3 mt-1">
                                                    <Lock className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span>Таким образом, полностью восстановить закрытый ключ</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-6 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-3">Рекомендации по безопасности</h4>
                                            <ul className="space-y-2 text-green-700">
                                                <li>• Длина ключа не менее 2048 бит</li>
                                                <li>• Использование криптографически стойких ГПСЧ</li>
                                                <li>• p и q должны быть случайными и примерно одинакового размера</li>
                                                <li>• |p - q| должно быть достаточно большим</li>
                                                <li>• p-1 и q-1 должны иметь большие простые делители</li>
                                            </ul>
                                        </div>

                                        <div className="bg-yellow-50 p-6 rounded-lg">
                                            <h4 className="font-semibold text-yellow-800 mb-3">Исторические факторизации</h4>
                                            <ul className="space-y-2 text-yellow-700">
                                                <li>• 1991: RSA-100 (330 бит) — факторизован</li>
                                                <li>• 1994: RSA-129 (426 бит) — факторизован</li>
                                                <li>• 2003: RSA-576 (576 бит) — факторизован</li>
                                                <li>• 2009: RSA-768 (768 бит) — факторизован</li>
                                                <li>• RSA-2048 (2048 бит) — пока не факторизован</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'attacks' && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <Cpu className="h-10 w-10 text-orange-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-gray-800">Атаки на RSA</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-orange-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-orange-800 mb-4">Основные методы атак</h3>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-800 mb-2">Факторизация модуля</h4>
                                                <div className="bg-white p-4 rounded border">
                                                    <p className="text-gray-700 mb-3">
                                                        Наиболее прямой метод атаки — разложение модуля n на простые множители p и q
                                                    </p>
                                                    <div className="text-center text-lg font-mono text-orange-600 mb-3">
                                                        n = p × q
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Современные алгоритмы: Общее решето числового поля (GNFS), Метод эллиптических кривых (ECM)
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-800 mb-2">Уязвимости в генерации ключей</h4>
                                                <div className="bg-white p-4 rounded border">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h5 className="font-medium text-red-600 mb-1">Близкие простые числа</h5>
                                                            <p className="text-sm text-gray-700">
                                                                Если |p - q| мало, эффективен метод Ферма
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-red-600 mb-1">Гладкие p-1</h5>
                                                            <p className="text-sm text-gray-700">
                                                                Если p-1 состоит из малых простых множителей, работает метод p-1 Полларда
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-red-600 mb-1">Маленькие простые числа</h5>
                                                            <p className="text-sm text-gray-700">
                                                                Если p или q малы, их легко найти пробным делением
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-4">Имплементационные атаки</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded border">
                                                <h5 className="font-semibold text-gray-800 mb-2">Атака по времени</h5>
                                                <p className="text-sm text-gray-700">
                                                    Измерение времени выполнения операций для получения информации о ключе
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded border">
                                                <h5 className="font-semibold text-gray-800 mb-2">Атака по энергопотреблению</h5>
                                                <p className="text-sm text-gray-700">
                                                    Анализ потребления энергии при выполнении криптографических операций
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Практическое применение</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h4 className="font-semibold text-blue-700 mb-3">Веб-безопасность</h4>
                        <p className="text-gray-700">
                            HTTPS/SSL/TLS используют RSA для установления безопасных соединений
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h4 className="font-semibold text-green-700 mb-3">Цифровые подписи</h4>
                        <p className="text-gray-700">
                            RSA используется для создания и проверки цифровых подписей документов
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h4 className="font-semibold text-purple-700 mb-3">Защищённые сообщения</h4>
                        <p className="text-gray-700">
                            Приложения для защищённой переписки используют RSA для шифрования
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}