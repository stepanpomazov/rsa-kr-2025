import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'RSA Шифрование - Анализатор факторизации',
    description: 'Шифруйте и расшифровывайте тексты и файлы с использованием алгоритма RSA',
}

export default function EncryptionLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    return children
}