import Link from 'next/link'
import { Button } from './Button'

interface HeroSectionProps {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
}

export default function HeroSection({
                                        title,
                                        subtitle,
                                        ctaText,
                                        ctaLink
                                    }: HeroSectionProps) {
    return (
        <div className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                {subtitle}
            </p>
            <Link href={ctaLink}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {ctaText}
                </Button>
            </Link>
        </div>
    )
}