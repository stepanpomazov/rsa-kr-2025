export const generatePrime = (bits: number = 32): bigint => {
    const min = 1n << BigInt(bits - 1)
    const max = (1n << BigInt(bits)) - 1n

    while (true) {
        // Генерируем случайное число в диапазоне
        const randomNum = min + BigInt(Math.floor(Math.random() * Number(max - min)))

        // Проверяем, что число нечетное
        const candidate = randomNum | 1n

        // Простая проверка на простоту (для демо)
        if (isProbablePrime(candidate)) {
            return candidate
        }
    }
}

// Тест на простоту (вероятностный)
const isProbablePrime = (n: bigint, k: number = 5): boolean => {
    if (n <= 1n) return false
    if (n <= 3n) return true
    if (n % 2n === 0n) return false

    // Находим r и d такие, что n-1 = 2^r * d
    let d = n - 1n
    let r = 0n
    while (d % 2n === 0n) {
        d /= 2n
        r += 1n
    }

    // Проводим k тестов Миллера-Рабина
    for (let i = 0; i < k; i++) {
        const a = getRandomBigInt(2n, n - 2n)
        let x = modPow(a, d, n)

        if (x === 1n || x === n - 1n) {
            continue
        }

        let continueLoop = false
        for (let j = 0n; j < r - 1n; j++) {
            x = modPow(x, 2n, n)
            if (x === n - 1n) {
                continueLoop = true
                break
            }
        }

        if (!continueLoop) {
            return false
        }
    }

    return true
}

// Генерация случайного BigInt
const getRandomBigInt = (min: bigint, max: bigint): bigint => {
    const range = max - min
    const randomBytes = new Uint8Array(64)
    crypto.getRandomValues(randomBytes)

    let random = 0n
    for (let i = 0; i < randomBytes.length; i++) {
        random = (random << 8n) | BigInt(randomBytes[i])
    }

    return min + (random % (range + 1n))
}

// Возведение в степень по модулю
export const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
    if (modulus === 1n) return 0n

    let result = 1n
    base = base % modulus

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus
        }
        base = (base * base) % modulus
        exponent = exponent >> 1n
    }

    return result
}

// Расширенный алгоритм Евклида
const extendedEuclidean = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
    if (b === 0n) {
        return [a, 1n, 0n]
    }

    const [gcd, x1, y1] = extendedEuclidean(b, a % b)
    const x = y1
    const y = x1 - (a / b) * y1

    return [gcd, x, y]
}

// Нахождение обратного элемента по модулю
const modInverse = (a: bigint, m: bigint): bigint | null => {
    const [gcd, x, _] = extendedEuclidean(a, m)

    if (gcd !== 1n) {
        return null
    }

    return ((x % m) + m) % m
}

// Генерация ключей RSA
export interface RSAKeys {
    publicKey: {
        e: bigint
        n: bigint
    }
    privateKey: {
        d: bigint
        n: bigint
    }
    p?: bigint
    q?: bigint
    phi?: bigint
}

export const generateRSAKeys = (bits: number = 32): RSAKeys => {
    // Генерируем два простых числа
    let p = generatePrime(bits / 2)
    let q = generatePrime(bits / 2)

    // Убеждаемся, что p ≠ q
    while (q === p) {
        q = generatePrime(bits / 2)
    }

    const n = p * q
    const phi = (p - 1n) * (q - 1n)

    // Выбираем e (обычно 65537)
    let e = 65537n
    if (e >= phi) {
        e = 3n
    }

    // Находим d = e^(-1) mod phi
    const d = modInverse(e, phi)

    if (!d) {
        // Если не удалось найти обратный, пробуем другое e
        e = 3n
        const d2 = modInverse(e, phi)
        if (!d2) {
            // Если всё равно не получается, генерируем новые простые числа
            return generateRSAKeys(bits)
        }

        return {
            publicKey: { e, n },
            privateKey: { d: d2, n },
            p,
            q,
            phi
        }
    }

    return {
        publicKey: { e, n },
        privateKey: { d, n },
        p,
        q,
        phi
    }
}

// Преобразование строки в BigInt
export const stringToBigInt = (str: string): bigint => {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)

    let result = 0n
    for (let i = 0; i < bytes.length; i++) {
        result = (result << 8n) | BigInt(bytes[i])
    }

    return result
}

// Преобразование BigInt в строку
export const bigIntToString = (num: bigint): string => {
    if (num === 0n) return ''

    const bytes: number[] = []
    let temp = num

    while (temp > 0n) {
        bytes.unshift(Number(temp & 0xFFn))
        temp = temp >> 8n
    }

    const decoder = new TextDecoder()
    return decoder.decode(new Uint8Array(bytes))
}

// Создание цифровой подписи
export const signMessage = (message: string, privateKey: { d: bigint, n: bigint }): bigint => {
    const m = stringToBigInt(message)

    // Если сообщение слишком большое для модуля, хешируем его
    if (m >= privateKey.n) {
        const hash = hashMessage(message)
        const reducedHash = hash % privateKey.n
        return modPow(reducedHash, privateKey.d, privateKey.n)
    }

    // s = m^d mod n
    return modPow(m, privateKey.d, privateKey.n)
}

// Проверка цифровой подписи
export const verifySignature = (
    message: string,
    signature: bigint,
    publicKey: { e: bigint, n: bigint }
): boolean => {
    const m = stringToBigInt(message)

    // m' = s^e mod n
    const decrypted = modPow(signature, publicKey.e, publicKey.n)

    // Если сообщение было хешировано, проверяем хеш
    if (m >= publicKey.n) {
        const hash = hashMessage(message)
        const reducedHash = hash % publicKey.n
        return reducedHash === decrypted
    }

    return m === decrypted
}

// Хеширование сообщения (упрощенное)
export const hashMessage = (message: string): bigint => {
    let hash = 0n

    for (let i = 0; i < message.length; i++) {
        const char = BigInt(message.charCodeAt(i))
        hash = ((hash << 5n) - hash) + char
        hash = hash & 0xFFFFFFFFn // Преобразование в 32-битное целое
    }

    return hash
}

// Упрощенная версия для демонстрации (без криптографической стойкости)
export const generateSimpleRSAKeys = (): RSAKeys => {
    // Используем маленькие простые числа для демонстрации
    const p = 61n
    const q = 53n
    const n = p * q // 3233
    const phi = (p - 1n) * (q - 1n) // 3120

    let e = 17n
    const d = modInverse(e, phi)

    if (!d) {
        throw new Error('Не удалось сгенерировать ключи')
    }

    return {
        publicKey: { e, n },
        privateKey: { d, n },
        p,
        q,
        phi
    }
}

// Проверка, что число меньше модуля
export const validateMessageForRSA = (message: string, n: bigint): boolean => {
    const m = stringToBigInt(message)
    return m < n
}