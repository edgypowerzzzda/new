"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import ModernProductCard from "@/components/modern-product-card"
import { getLocalProducts, type LocalProduct } from "@/lib/local-storage"

export default function NewProductsPage() {
  const [newProducts, setNewProducts] = useState<LocalProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const products = getLocalProducts()
    const filtered = products.filter((product) => product.is_new && product.is_active)
    setNewProducts(filtered)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-8 h-8 text-red-600" />
          <h1 className="text-4xl font-bold text-gray-900">Новинки</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Самые свежие поступления музыкальных инструментов и оборудования
        </p>
        <div className="mt-4">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {newProducts.length} новых товаров
          </span>
        </div>
      </div>

      {/* Товары */}
      {newProducts.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">Новинок пока нет</h2>
          <p className="text-gray-400">Следите за обновлениями - скоро появятся новые товары!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newProducts.map((product, index) => (
            <ModernProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
