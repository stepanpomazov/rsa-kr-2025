import React from 'react'

interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-gray-50">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    )
}