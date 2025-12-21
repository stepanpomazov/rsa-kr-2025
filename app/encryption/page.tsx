'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Lock, Unlock, Upload, Download, FileText, Key, Copy, Check,
    Loader2, AlertCircle, ChevronRight, Calculator, Terminal, Code
} from 'lucide-react'

type EncryptionStep = {
    id: number
    title: string
    description: string
    formula?: string
    example?: string
    result?: string
    status: 'pending' | 'active' | 'completed'
}

export default function EncryptionPage() {
    const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt')
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [nValue, setNValue] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [copied, setCopied] = useState(false)
    const [fileName, setFileName] = useState<string>('')
    const [fileType, setFileType] = useState<'plain' | 'encrypted'>('plain')
    const [, setError] = useState<string>('')
    const [showSteps, setShowSteps] = useState(true)
    const [steps, setSteps] = useState<EncryptionStep[]>([])
    const [, setCurrentStep] = useState(0)
    const [showCalculation, setShowCalculation] = useState(false)
    const [calculationDetails, setCalculationDetails] = useState<string[]>([])
    const [selectedCharIndex, setSelectedCharIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Пример RSA ключей для демонстрации
    const exampleKeys = {
        publicKey: '65537',
        privateKey: '4130334913',
        n: '123456789' // Упрощенный модуль для демонстрации
    }

    // Пример текста для демонстрации
    const exampleText = "Hello RSA"
    const exampleEncryptedText = "123456 789012 345678 901234 567890"

    // Инициализация шагов при изменении режима
    useEffect(() => {
        initializeSteps()
        loadExampleKeys()
        if (activeTab === 'decrypt') {
            setInputText(exampleEncryptedText)
            setFileType('encrypted')
        } else {
            setInputText(exampleText)
            setFileType('plain')
        }
        setOutputText('')
        setError('')
        setCurrentStep(0)
        setCalculationDetails([])
    }, [activeTab])

    const initializeSteps = () => {
        if (activeTab === 'encrypt') {
            setSteps([
                {
                    id: 1,
                    title: "Подготовка сообщения",
                    description: "Преобразование текста в числовое представление (ASCII коды)",
                    formula: "M = charCode(text[i])",
                    status: 'pending'
                },
                {
                    id: 2,
                    title: "Проверка размера",
                    description: "Убедиться, что числовое значение меньше модуля n",
                    formula: "M < n",
                    status: 'pending'
                },
                {
                    id: 3,
                    title: "Применение открытого ключа",
                    description: "Возведение в степень e по модулю n",
                    formula: "C = Mᵉ mod n",
                    status: 'pending'
                },
                {
                    id: 4,
                    title: "Формирование результата",
                    description: "Объединение зашифрованных блоков в строку",
                    formula: "result = C₁ C₂ C₃ ...",
                    status: 'pending'
                }
            ])
        } else {
            setSteps([
                {
                    id: 1,
                    title: "Разбор зашифрованных данных",
                    description: "Разделение строки на числовые блоки",
                    formula: "C = split(text, ' ')",
                    status: 'pending'
                },
                {
                    id: 2,
                    title: "Применение закрытого ключа",
                    description: "Возведение каждого блока в степень d по модулю n",
                    formula: "M = Cᵈ mod n",
                    status: 'pending'
                },
                {
                    id: 3,
                    title: "Преобразование в текст",
                    description: "Преобразование числовых значений обратно в символы",
                    formula: "char = String.fromCharCode(M)",
                    status: 'pending'
                },
                {
                    id: 4,
                    title: "Восстановление сообщения",
                    description: "Объединение символов в исходное сообщение",
                    formula: "result = join(chars, '')",
                    status: 'pending'
                }
            ])
        }
    }

    // Проверяем готовность к операции
    const isReadyForEncryption = inputText.trim() !== '' && publicKey !== '' && nValue !== ''
    const isReadyForDecryption = inputText.trim() !== '' && privateKey !== '' && nValue !== ''

    const loadExampleKeys = () => {
        setPublicKey(exampleKeys.publicKey)
        setPrivateKey(exampleKeys.privateKey)
        setNValue(exampleKeys.n)
    }

    // ФУНКЦИЯ ЗАГРУЗКИ ФАЙЛА - ДОБАВЛЕНО
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setError('')

        // Проверяем тип файла
        if (!file.name.toLowerCase().endsWith('.txt')) {
            setError('Пожалуйста, загрузите файл в формате .txt')
            return
        }

        const reader = new FileReader()
        reader.onloadstart = () => {
            setIsProcessing(true)
        }
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string
                setInputText(text)

                // Автоматически определяем тип файла
                if (activeTab === 'encrypt') {
                    setFileType('plain')
                } else {
                    const lines = text.split('\n')
                    const firstLine = lines[0]?.trim() || ''
                    const looksLikeEncrypted = /^\d+(\s+\d+)*$/.test(firstLine)
                    setFileType(looksLikeEncrypted ? 'encrypted' : 'plain')
                    if (!looksLikeEncrypted) {
                        setError('Файл не похож на зашифрованный текст.')
                    }
                }
            } catch (err) {
                setError('Ошибка при чтении файла')
            } finally {
                setIsProcessing(false)
            }
        }
        reader.onerror = () => {
            setError('Ошибка при чтении файла')
            setIsProcessing(false)
        }
        reader.readAsText(file, 'UTF-8')
    }

    // Обновленная функция шифрования с демонстрацией шагов
    const encryptText = async () => {
        if (!isReadyForEncryption) {
            setError('Для шифрования нужны: текст, открытый ключ (e) и модуль (n)')
            return
        }

        setIsProcessing(true)
        setError('')
        setCalculationDetails([])
        setShowCalculation(true)

        try {
            // Шаг 1: Подготовка сообщения
            updateStepStatus(1, 'active')
            await delay(1000)

            const text = inputText
            const asciiCodes: number[] = []
            const step1Details: string[] = []

            for (let i = 0; i < text.length; i++) {
                const char = text[i]
                const code = char.charCodeAt(0)
                asciiCodes.push(code)
                step1Details.push(`'${char}' → ${code}`)
            }

            setCalculationDetails(prev => [...prev,
                "📝 Шаг 1: Преобразование символов в ASCII коды:",
                ...step1Details
            ])
            updateStepStatus(1, 'completed')

            // Шаг 2: Проверка размера
            updateStepStatus(2, 'active')
            await delay(500)

            const n = BigInt(nValue)
            const step2Details: string[] = []

            for (let i = 0; i < asciiCodes.length; i++) {
                const isValid = BigInt(asciiCodes[i]) < n
                step2Details.push(`${asciiCodes[i]} < ${nValue} = ${isValid ? '✓' : '✗'}`)
                if (!isValid) {
                    console.log(`Символ ${text[i]} слишком велик для модуля`)
                }
            }

            setCalculationDetails(prev => [...prev,
                "\n📏 Шаг 2: Проверка размера:",
                ...step2Details
            ])
            updateStepStatus(2, 'completed')

            // Шаг 3: Шифрование
            updateStepStatus(3, 'active')
            await delay(500)

            const e = BigInt(publicKey)
            const encrypted: bigint[] = []
            const step3Details: string[] = []

            for (let i = 0; i < asciiCodes.length; i++) {
                const M = BigInt(asciiCodes[i])
                const C = modPow(M, e, n)
                encrypted.push(C)
                step3Details.push(`${M}^${e} mod ${n} = ${C}`)
            }

            setCalculationDetails(prev => [...prev,
                "\n🔐 Шаг 3: Шифрование (C = Mᵉ mod n):",
                ...step3Details
            ])
            updateStepStatus(3, 'completed')

            // Шаг 4: Формирование результата
            updateStepStatus(4, 'active')
            await delay(500)

            const result = encrypted.map(c => c.toString()).join(' ')
            setOutputText(result)
            setFileType('encrypted')

            setCalculationDetails(prev => [...prev,
                "\n📦 Шаг 4: Формирование результата:",
                `Результат: ${result}`
            ])
            updateStepStatus(4, 'completed')

        } catch (error) {
            console.error('Ошибка шифрования:', error)
            setError(error instanceof Error ? error.message : 'Ошибка шифрования')
            resetSteps()
        } finally {
            setIsProcessing(false)
        }
    }

    // Обновленная функция расшифрования с демонстрацией шагов
    const decryptText = async () => {
        if (!isReadyForDecryption) {
            setError('Для расшифрования нужны: зашифрованный текст, закрытый ключ (d) и модуль (n)')
            return
        }

        const numbers = inputText.split(' ').filter(n => n.trim() !== '')
        const isValidEncryptedText = numbers.every(num => /^\d+$/.test(num))

        if (!isValidEncryptedText && numbers.length > 0) {
            setError('Некорректный формат зашифрованного текста.')
            return
        }

        setIsProcessing(true)
        setError('')
        setCalculationDetails([])
        setShowCalculation(true)

        try {
            // Шаг 1: Разбор данных
            updateStepStatus(1, 'active')
            await delay(1000)

            const encryptedBlocks = numbers // Обрабатываем ВСЕ блоки
            const step1Details = encryptedBlocks.slice(0, 10).map((block, i) =>
                `Блок ${i+1}: ${block.length > 30 ? block.slice(0, 30) + '...' : block}`
            )

            setCalculationDetails(prev => [...prev,
                "📊 Шаг 1: Разбор зашифрованных блоков:",
                `Найдено ${encryptedBlocks.length} блоков`,
                ...step1Details
            ])
            updateStepStatus(1, 'completed')

            // Шаг 2: Расшифрование
            updateStepStatus(2, 'active')
            await delay(500)

            const d = BigInt(privateKey)
            const n = BigInt(nValue)
            const decryptedCodes: number[] = []
            const step2Details: string[] = []

            const totalBlocks = encryptedBlocks.length

            for (let i = 0; i < encryptedBlocks.length; i++) {
                const block = encryptedBlocks[i]
                const C = BigInt(block)
                const M = modPow(C, d, n)
                const charCode = Number(M)
                decryptedCodes.push(charCode)

                // Показываем детали только для первых 5 блоков (для читаемости)
                if (i < 5) {
                    step2Details.push(`Блок ${i+1}: ${M} → ASCII ${charCode}`)
                }
            }

            setCalculationDetails(prev => [...prev,
                `\n🔓 Шаг 2: Расшифрование (M = Cᵈ mod n):`,
                `Обработано ${totalBlocks} блоков`,
                ...step2Details,
                totalBlocks > 5 ? `... и еще ${totalBlocks - 5} блоков` : ''
            ])
            updateStepStatus(2, 'completed')

            // Шаг 3: Преобразование в текст
            updateStepStatus(3, 'active')
            await delay(500)

            const chars: string[] = []
            const step3Details: string[] = []

            for (let i = 0; i < decryptedCodes.length; i++) {
                const code = decryptedCodes[i]
                const char = String.fromCharCode(code)
                chars.push(char)

                // Показываем детали только для первых 10 символов
                if (i < 10) {
                    step3Details.push(`${code} → '${char}'`)
                }
            }

            setCalculationDetails(prev => [...prev,
                `\n📝 Шаг 3: Преобразование чисел в символы:`,
                `Преобразовано ${chars.length} символов`,
                ...step3Details,
                chars.length > 10 ? `... и еще ${chars.length - 10} символов` : ''
            ])
            updateStepStatus(3, 'completed')

            // Шаг 4: Восстановление сообщения
            updateStepStatus(4, 'active')
            await delay(500)

            const result = chars.join('')
            setOutputText(result)
            setFileType('plain')

            setCalculationDetails(prev => [...prev,
                `\n🎯 Шаг 4: Восстановление сообщения:`,
                `Результат: "${result}"`,
                `Длина: ${result.length} символов`
            ])
            updateStepStatus(4, 'completed')

        } catch (error) {
            console.error('Ошибка расшифрования:', error)
            setError(error instanceof Error ? error.message : 'Ошибка расшифрования')
            resetSteps()
        } finally {
            setIsProcessing(false)
        }
    }

    // Быстрое возведение в степень по модулю
    const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
        let result = 1n
        let b = base % modulus
        let e = exponent

        while (e > 0n) {
            if (e % 2n === 1n) {
                result = (result * b) % modulus
            }
            e = e >> 1n
            b = (b * b) % modulus
        }

        return result
    }

    // Вспомогательные функции
    const updateStepStatus = (stepId: number, status: 'pending' | 'active' | 'completed') => {
        setSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, status } :
                step.id < stepId ? { ...step, status: 'completed' } : step
        ))
        setCurrentStep(stepId)
    }

    const resetSteps = () => {
        setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
        setCurrentStep(0)
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadAsFile = () => {
        if (!outputText) return

        const extension = fileType === 'encrypted' ? '.enc' : '.txt'
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeTab === 'encrypt' ? 'encrypted' : 'decrypted'}_${fileName || 'text'}${extension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const clearAll = () => {
        setInputText('')
        setOutputText('')
        setFileName('')
        setError('')
        setCalculationDetails([])
        resetSteps()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const loadExampleText = () => {
        if (activeTab === 'encrypt') {
            setInputText(exampleText)
            setFileName('demo_message.txt')
            setFileType('plain')
        } else {
            setInputText(exampleEncryptedText)
            setFileName('encrypted_data.enc')
            setFileType('encrypted')
        }
        setError('')
        resetSteps()
        setCalculationDetails([])
    }

    // Визуализация символа
    const renderCharVisualization = () => {
        if (!inputText || activeTab !== 'encrypt') return null

        const char = inputText[selectedCharIndex] || inputText[0]
        const code = char ? char.charCodeAt(0) : 0
        const binary = code.toString(2).padStart(8, '0')

        return (
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    Визуализация символа
                </h4>
                <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{char}</div>
                    <div className="text-sm text-gray-600">
                        ASCII код: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code}</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Двоичное представление:</div>
                        <div className="font-mono text-sm bg-gray-900 text-green-400 p-2 rounded">
                            {binary.split('').map((bit, i) => (
                                <span key={i} className={bit === '1' ? 'text-green-400' : 'text-gray-400'}>
                                    {bit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Визуализация модульной арифметики
    const renderModularArithmetic = () => {
        if (!publicKey || !nValue) return null

        const base = 65n // ASCII для 'A'
        const exponent = BigInt(publicKey)
        const modulus = BigInt(nValue)

        try {
            const result = modPow(base, exponent, modulus)

            return (
                <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        Пример вычисления
                    </h4>
                    <div className="text-sm">
                        <div className="mb-2">Для символа 'A' (ASCII 65):</div>
                        <div className="font-mono bg-gray-50 p-2 rounded">
                            <div>65^{publicKey} mod {nValue}</div>
                            <div className="text-purple-600 mt-1">= {result.toString()}</div>
                        </div>
                    </div>
                </div>
            )
        } catch {
            return null
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Lock className="h-10 w-10 text-purple-600 mr-3" />
                    <div>
                        <h1 className="text-4xl font-bold">
                            Шифрование и расшифрование RSA
                        </h1>
                        <p className="mt-2">
                            Интерактивная демонстрация алгоритма RSA с пошаговой визуализацией
                        </p>
                    </div>
                </div>
            </div>

            {/* Вкладки */}
            <div className="flex space-x-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('encrypt')}
                    className={`flex items-center px-4 py-2 font-medium ${activeTab === 'encrypt'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Шифрование
                </button>
                <button
                    onClick={() => setActiveTab('decrypt')}
                    className={`flex items-center px-4 py-2 font-medium ${activeTab === 'decrypt'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Unlock className="w-4 h-4 mr-2" />
                    Расшифрование
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Основная область */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Ключи RSA */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Key className="h-5 w-5 mr-2 text-yellow-600" />
                                Ключи RSA
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={loadExampleKeys}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                >
                                    Пример ключей
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {activeTab === 'encrypt' ? 'Открытая экспонента (e)' : 'Закрытая экспонента (d)'}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={activeTab === 'encrypt' ? publicKey : privateKey}
                                    onChange={(e) => {
                                        activeTab === 'encrypt'
                                            ? setPublicKey(e.target.value)
                                            : setPrivateKey(e.target.value)
                                        setError('')
                                    }}
                                    placeholder={activeTab === 'encrypt'
                                        ? 'Например: 65537'
                                        : 'Введите закрытую экспоненту d'}
                                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Модуль (n)
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={nValue}
                                    onChange={(e) => {
                                        setNValue(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Введите модуль n (произведение p × q)"
                                    rows={2}
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Шаги алгоритма */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <ChevronRight className="h-5 w-5 mr-2 text-blue-600" />
                                Шаги алгоритма RSA
                            </h3>
                            <button
                                onClick={() => setShowSteps(!showSteps)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showSteps ? 'Скрыть' : 'Показать'}
                            </button>
                        </div>

                        {showSteps && (
                            <div className="space-y-4">
                                {steps.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`p-4 rounded-lg border transition-all duration-300 ${
                                            step.status === 'active'
                                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                : step.status === 'completed'
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                                step.status === 'active'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : step.status === 'completed'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {step.status === 'completed' ? '✓' : step.id}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">
                                                            Шаг {step.id}: {step.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        step.status === 'active'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : step.status === 'completed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {step.status === 'active' ? 'Выполняется' :
                                                            step.status === 'completed' ? 'Завершено' : 'Ожидание'}
                                                    </span>
                                                </div>
                                                {step.formula && (
                                                    <div className="mt-3 p-2 bg-gray-900 text-green-400 rounded font-mono text-sm">
                                                        {step.formula}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Ввод текста */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                {activeTab === 'encrypt' ? 'Исходный текст' : 'Зашифрованный текст'}
                            </h3>
                            <div className="flex space-x-2">
                                {/* КНОПКА ЗАГРУЗКИ ФАЙЛА - ДОБАВЛЕНА */}
                                <div className="relative">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        ) : (
                                            <Upload className="h-4 w-4 mr-1" />
                                        )}
                                        {isProcessing ? 'Загрузка...' : 'Файл'}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".txt"
                                        className="hidden"
                                    />
                                </div>
                                <button
                                    onClick={loadExampleText}
                                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                >
                                    Пример
                                </button>
                                {/* КНОПКА ОЧИСТКИ - ДОБАВЛЕНА */}
                                <button
                                    onClick={clearAll}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Очистить
                                </button>
                            </div>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value)
                                setError('')
                                if (activeTab === 'encrypt') {
                                    setSelectedCharIndex(Math.min(e.target.value.length - 1, selectedCharIndex))
                                }
                            }}
                            placeholder={activeTab === 'encrypt'
                                ? 'Введите текст для шифрования...'
                                : 'Введите зашифрованные числа через пробел...'}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            disabled={isProcessing}
                        />

                        {/* Информация о загруженном файле */}
                        {fileName && (
                            <div className="mt-2 text-sm text-gray-500">
                                📁 Загружен файл: <span className="font-medium">{fileName}</span>
                            </div>
                        )}
                    </div>

                    {/* Кнопка обработки */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <button
                            onClick={activeTab === 'encrypt' ? encryptText : decryptText}
                            disabled={
                                isProcessing ||
                                (activeTab === 'encrypt' ? !isReadyForEncryption : !isReadyForDecryption)
                            }
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {isProcessing ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {activeTab === 'encrypt' ? 'Шифрование...' : 'Расшифрование...'}
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'encrypt' ? (
                                        <>
                                            <Lock className="mr-2 h-5 w-5" />
                                            Начать шифрование
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="mr-2 h-5 w-5" />
                                            Начать расшифрование
                                        </>
                                    )}
                                </>
                            )}
                        </button>

                        {/* Индикаторы готовности */}
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <div className={`p-3 rounded-lg text-center ${inputText.trim() !== '' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="text-xs text-gray-500 mb-1">Текст</div>
                                <div className={`text-lg font-bold ${inputText.trim() !== '' ? 'text-green-600' : 'text-gray-400'}`}>
                                    {inputText.trim() !== '' ? '✓' : '✗'}
                                </div>
                            </div>

                            <div className={`p-3 rounded-lg text-center ${nValue !== '' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="text-xs text-gray-500 mb-1">Модуль</div>
                                <div className={`text-lg font-bold ${nValue !== '' ? 'text-green-600' : 'text-gray-400'}`}>
                                    {nValue !== '' ? '✓' : '✗'}
                                </div>
                            </div>

                            <div className={`p-3 rounded-lg text-center ${(activeTab === 'encrypt' ? publicKey !== '' : privateKey !== '') ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <div className="text-xs text-gray-500 mb-1">Ключ</div>
                                <div className={`text-lg font-bold ${(activeTab === 'encrypt' ? publicKey !== '' : privateKey !== '') ? 'text-green-600' : 'text-gray-400'}`}>
                                    {(activeTab === 'encrypt' ? publicKey !== '' : privateKey !== '') ? '✓' : '✗'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Детали вычислений */}
                    {showCalculation && calculationDetails.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                                Детали вычислений
                            </h3>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                                {calculationDetails.map((detail, index) => (
                                    <div key={index} className="mb-1">
                                        {detail}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Результат */}
                    {outputText && (
                        <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    {activeTab === 'encrypt' ? (
                                        <>
                                            <Lock className="h-5 w-5 mr-2 text-purple-600" />
                                            Результат шифрования
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="h-5 w-5 mr-2 text-green-600" />
                                            Результат расшифрования
                                        </>
                                    )}
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCopy(outputText)}
                                        className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                    >
                                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                        {copied ? 'Скопировано!' : 'Копировать'}
                                    </button>
                                    <button
                                        onClick={downloadAsFile}
                                        className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Скачать
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border max-h-80 overflow-y-auto">
                                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-black leading-relaxed">
                                    {outputText}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Боковая панель */}
                <div className="space-y-6">
                    {/* Визуализация */}
                    {renderCharVisualization()}

                    {renderModularArithmetic()}

                    {/* Ключевые формулы */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Code className="h-5 w-5 mr-2" />
                            Формулы RSA
                        </h3>

                        <div className="space-y-4">
                            <div className="p-3 bg-white rounded-lg border">
                                <div className="text-sm text-gray-500 mb-1">Шифрование:</div>
                                <div className="font-mono bg-gray-900 text-green-400 p-2 rounded text-sm">
                                    C = Mᵉ mod n
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    C - зашифрованный текст<br/>
                                    M - исходное сообщение<br/>
                                    e - открытая экспонента<br/>
                                    n - модуль
                                </div>
                            </div>

                            <div className="p-3 bg-white rounded-lg border">
                                <div className="text-sm text-gray-500 mb-1">Расшифрование:</div>
                                <div className="font-mono bg-gray-900 text-green-400 p-2 rounded text-sm">
                                    M = Cᵈ mod n
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    M - расшифрованный текст<br/>
                                    C - зашифрованный текст<br/>
                                    d - закрытая экспонента<br/>
                                    n - модуль
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Пример работы */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Пример работы
                        </h3>

                        {activeTab === 'encrypt' ? (
                            <div className="space-y-3 text-sm">
                                <div className="p-2 bg-blue-50 rounded">
                                    <div className="font-medium">Исходный текст:</div>
                                    <div className="font-mono mt-1">"HELLO"</div>
                                </div>

                                <div className="flex items-center justify-center text-gray-400">
                                    <ChevronRight className="h-4 w-4" />
                                </div>

                                <div className="p-2 bg-purple-50 rounded">
                                    <div className="font-medium">ASCII коды:</div>
                                    <div className="font-mono mt-1">72 69 76 76 79</div>
                                </div>

                                <div className="flex items-center justify-center text-gray-400">
                                    <ChevronRight className="h-4 w-4" />
                                </div>

                                <div className="p-2 bg-green-50 rounded">
                                    <div className="font-medium">Шифрование:</div>
                                    <div className="font-mono mt-1 text-xs">
                                        72ᵉ mod n = C₁<br/>
                                        69ᵉ mod n = C₂<br/>
                                        ...
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="p-2 bg-purple-50 rounded">
                                    <div className="font-medium">Зашифрованный текст:</div>
                                    <div className="font-mono mt-1">C₁ C₂ C₃ C₄ C₅</div>
                                </div>

                                <div className="flex items-center justify-center text-gray-400">
                                    <ChevronRight className="h-4 w-4" />
                                </div>

                                <div className="p-2 bg-blue-50 rounded">
                                    <div className="font-medium">Расшифрование:</div>
                                    <div className="font-mono mt-1 text-xs">
                                        C₁ᵈ mod n = 72<br/>
                                        C₂ᵈ mod n = 69<br/>
                                        ...
                                    </div>
                                </div>

                                <div className="flex items-center justify-center text-gray-400">
                                    <ChevronRight className="h-4 w-4" />
                                </div>

                                <div className="p-2 bg-green-50 rounded">
                                    <div className="font-medium">Исходный текст:</div>
                                    <div className="font-mono mt-1">"HELLO"</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Памятка */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Важно помнить
                        </h3>
                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li>• RSA работает только с числами</li>
                            <li>• Текст должен быть короче модуля n</li>
                            <li>• Используйте разные ключи для разных сообщений</li>
                            <li>• Для больших текстов используется гибридное шифрование</li>
                            <li>• Эта демонстрация использует упрощенные параметры</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Информационная панель */}
            <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Математическая основа RSA
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Выбор простых чисел</h4>
                        <p className="text-gray-600 text-sm">
                            Выбираются два больших простых числа p и q
                        </p>
                        <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
                            n = p × q
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="text-3xl font-bold text-purple-600 mb-3">2</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Функция Эйлера</h4>
                        <p className="text-gray-600 text-sm">
                            Вычисляется φ(n) = (p-1)(q-1)
                        </p>
                        <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
                            φ(n) = (p-1)×(q-1)
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="text-3xl font-bold text-green-600 mb-3">3</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Выбор ключей</h4>
                        <p className="text-gray-600 text-sm">
                            Выбирается e взаимно простое с φ(n), затем вычисляется d
                        </p>
                        <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
                            e × d ≡ 1 mod φ(n)
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="text-3xl font-bold text-red-600 mb-3">4</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Шифрование</h4>
                        <p className="text-gray-600 text-sm">
                            Сообщение M шифруется: C = Mᵉ mod n
                        </p>
                        <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
                            C = Mᵉ mod n
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-block p-4 bg-white rounded-lg shadow">
                        <div className="text-lg font-mono mb-2">
                            {activeTab === 'encrypt'
                                ? 'M → Mᵉ mod n → C'
                                : 'C → Cᵈ mod n → M'
                            }
                        </div>
                        <div className="text-sm text-gray-600">
                            {activeTab === 'encrypt'
                                ? 'Сообщение → Шифрование → Шифротекст'
                                : 'Шифротекст → Расшифрование → Сообщение'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}