import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RSA Factorization Analyzer',
    description: 'Web application for analyzing RSA encryption through integer factorization algorithms',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-50`}>
        <Navbar />
        <main className="min-h-screen pt-16">
            {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
            <p>RSA Factorization Analyzer © 2025 - by stpomazoff</p>
        </footer>
        </body>
        </html>
    )
}