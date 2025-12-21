import HeroSection from '@/components/ui/HeroSection'
import FeatureCard from '@/components/ui/FeatureCard'
import { Calculator, Shield, Zap, BarChart3 } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Calculator className="h-10 w-10 text-blue-600" />,
      title: "Множество алгоритмов факторизации",
      description: "Реализованы пробное деление, метод Ферма, алгоритм Полларда Rho и метод Полларда p-1"
    },
    {
      icon: <Shield className="h-10 w-10 text-green-600" />,
      title: "Анализ RSA",
      description: "Генерация ключей RSA и анализ их уязвимости к факторизационным атакам"
    },
    {
      icon: <Zap className="h-10 w-10 text-yellow-600" />,
      title: "Сравнение производительности",
      description: "Сравнение времени выполнения и эффективности различных методов факторизации"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-purple-600" />,
      title: "Визуальная аналитика",
      description: "Интерактивные графики и диаграммы для визуализации процесса и результатов факторизации"
    }
  ]

  return (
      <div className="container mx-auto px-4 py-8">
        <HeroSection
            title="Анализатор факторизации RSA"
            subtitle="Комплексный инструмент для анализа безопасности шифрования RSA через алгоритмы факторизации целых чисел"
            ctaText="Начать факторизацию"
            ctaLink="/factorization"
        />

        <section className="my-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-300">
            Возможности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        <section className="my-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">О проекте</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Это веб-приложение реализует различные алгоритмы факторизации целых чисел для анализа
              безопасности шифрования RSA. Проект служит как образовательным инструментом, так и
              исследовательской платформой для понимания криптографических уязвимостей.
            </p>
            <p>
              Реализованные алгоритмы включают:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Пробное деление:</strong> Простой метод перебора</li>
              <li><strong>Метод Ферма:</strong> Эффективен для чисел с близкими простыми множителями</li>
              <li><strong>Алгоритм Полларда Rho:</strong> Вероятностный алгоритм с обнаружением циклов</li>
              <li><strong>Метод Полларда p-1:</strong> Эффективен, когда p-1 имеет только малые простые делители</li>
            </ul>
            <p>
              Приложение также включает инструменты для генерации ключей RSA и их анализа, чтобы продемонстрировать
              практические последствия факторизации для криптографической безопасности.
            </p>
          </div>
        </section>
      </div>
  )
}