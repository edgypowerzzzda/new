"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ModernProductCard from "@/components/modern-product-card"
import { getLocalProducts, type LocalProduct } from "@/lib/local-storage"

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<LocalProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const products = getLocalProducts()
    const featured = products.filter((product) => product.is_featured && product.is_active).slice(0, 8) // Показываем 8 товаров
    setFeaturedProducts(featured)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(0,0,0,0.2) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">Рекомендуемые товары</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Лучшие{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">предложения</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Тщательно отобранные нашими экспертами музыкальные инструменты для профессионалов и любителей
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ModernProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
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
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Смотреть все товары
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
