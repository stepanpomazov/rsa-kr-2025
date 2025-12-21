import React from 'react'

interface AlgorithmCardProps {
    name: string
    description: string
    complexity: string
    bestFor: string
}

export default function AlgorithmCard({
                                          name,
                                          description,
                                          complexity,
                                          bestFor
                                      }: AlgorithmCardProps) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
                {name}
            </h3>
            <p className="text-gray-600 mb-4">
                {description}
            </p>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Сложность:</span>
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                        {complexity}
                    </code>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Лучше для:</span>
                    <span className="text-sm text-gray-700 font-medium">{bestFor}</span>
                </div>
            </div>
        </div>
    )
}