"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Package, Award, Truck } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 15000,
    label: "Довольных клиентов",
    suffix: "+",
  },
  {
    icon: Package,
    value: 5000,
    label: "Товаров в наличии",
    suffix: "+",
  },
  {
    icon: Award,
    value: 50,
    label: "Брендов-партнеров",
    suffix: "+",
  },
  {
    icon: Truck,
    value: 99,
    label: "Доставка по России",
    suffix: "%",
  },
]

function Counter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">
                <Counter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-red-100 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
