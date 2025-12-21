export interface FactorizeResult {
    algorithm: string;
    success: boolean;
    factors: string[];  // Все простые множители
    time: number;
    complexity: string;
    steps?: number; // Опционально: количество шагов
}

export interface RSAKeyPair {
    publicKey: {
        e: string
        n: string
    }
    privateKey: {
        d: string
        n: string
    }
    p?: string
    q?: string
}

export interface PerformanceData {
    algorithm: string
    time: number
    factorsFound: number
    success: boolean
    numberSize: number
}

export interface AlgorithmInfo {
    id: string
    name: string
    description: string
    complexity: string
    bestFor: string
    limitations: string
}
export interface AlgorithmResult {
    factors?: bigint[];
    factor?: bigint;
    time: number;
    steps?: number;
}