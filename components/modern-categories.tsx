"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLocalCategories, getLocalProducts, type LocalCategory } from "@/lib/local-storage"

const categoryIcons: Record<string, string> = {
  "acoustic-guitars": "🎸",
  "electric-guitars": "🎸",
  "bass-guitars": "🎸",
  keyboards: "🎹",
  drums: "🥁",
  microphones: "🎤",
  headphones: "🎧",
  "wind-instruments": "🎺",
  "string-instruments": "🎻",
  "dj-equipment": "🎛️",
}

export default function ModernCategories() {
  const [categories, setCategories] = useState<LocalCategory[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    const allCategories = getLocalCategories()
    const allProducts = getLocalProducts()

    // Подсчитываем количество товаров в каждой категории
    const counts: Record<number, number> = {}
    allCategories.forEach((category) => {
      counts[category.id] = allProducts.filter(
        (product) => product.category_id === category.id && product.is_active,
      ).length
    })

    setCategories(allCategories.filter((cat) => cat.is_active))
    setCategoryCounts(counts)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Выберите{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">категорию</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Широкий ассортимент музыкальных инструментов и оборудования для любого уровня мастерства
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Link href={`/catalog?category=${category.slug}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 relative overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon */}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[category.slug] || "🎵"}
                  </div>

                  {/* Category Name */}
                  <h3 className="text-white font-semibold mb-2 group-hover:text-red-200 transition-colors">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <p className="text-gray-300 text-sm">{categoryCounts[category.id] || 0} товаров</p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {/* Call to Action */};
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/catalog">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Смотреть все категории
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
