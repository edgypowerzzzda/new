"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ModernProductCard from "@/components/modern-product-card"
import { getLocalBrands, getLocalProducts, type LocalBrand, type LocalProduct } from "@/lib/local-storage"

export default function BrandPage() {
  const params = useParams()
  const [brand, setBrand] = useState<LocalBrand | null>(null)
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allBrands = getLocalBrands()
    const allProducts = getLocalProducts()

    const foundBrand = allBrands.find((b) => b.slug === params.slug)
    setBrand(foundBrand || null)

    if (foundBrand) {
      const brandProducts = allProducts.filter((product) => product.brand_id === foundBrand.id && product.is_active)
      setProducts(brandProducts)
    }

    setLoading(false)
  }, [params.slug])

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

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Бренд не найден</h1>
          <p className="text-gray-600 mb-8">Запрашиваемый бренд не существует</p>
          <Link href="/brands">
            <Button>Вернуться к брендам</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-red-600">
          Главная
        </Link>
        <span>/</span>
        <Link href="/brands" className="hover:text-red-600">
          Бренды
        </Link>
        <span>/</span>
        <span className="text-gray-900">{brand.name}</span>
      </nav>

      {/* Заголовок бренда */}
      <div className="mb-8">
        <Link href="/brands">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к брендам
          </Button>
        </Link>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{brand.name}</h1>
            <p className="text-xl text-gray-600 mt-2">{brand.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {products.length} товаров
          </Badge>
        </div>
      </div>

      {/* Товары бренда */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">Товары не найдены</h2>
          <p className="text-gray-400">У этого бренда пока нет товаров в каталоге</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ModernProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
