"use client"

import { motion } from "framer-motion"
import { Truck, Shield, Headphones, Award, CreditCard, Clock } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставка по всей России за 1-3 дня",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Официальная гарантия на все товары",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Консультации экспертов круглосуточно",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Award,
    title: "Лучшие бренды",
    description: "Только оригинальные инструменты",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: CreditCard,
    title: "Удобная оплата",
    description: "Рассрочка и различные способы оплаты",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Clock,
    title: "Быстрый возврат",
    description: "14 дней на возврат без вопросов",
    color: "from-teal-500 to-teal-600",
  },
]

export default function ModernFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Почему выбирают{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">нас</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы предоставляем лучший сервис и качество для наших клиентов
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
