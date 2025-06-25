"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLocalBrands, getLocalProducts, type LocalBrand } from "@/lib/local-storage"

interface BrandWithCount extends LocalBrand {
  productCount: number
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allBrands = getLocalBrands()
    const allProducts = getLocalProducts()

    const brandsWithCount = allBrands
      .filter((brand) => brand.is_active)
      .map((brand) => ({
        ...brand,
        productCount: allProducts.filter((product) => product.brand_id === brand.id && product.is_active).length,
      }))
      .sort((a, b) => b.productCount - a.productCount)

    setBrands(brandsWithCount)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <Building2 className="w-8 h-8 text-red-600" />
          <h1 className="text-4xl font-bold text-gray-900">Бренды</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ведущие производители музыкальных инструментов и оборудования
        </p>
        <div className="mt-4">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {brands.length} брендов
          </span>
        </div>
      </div>

      {/* Бренды */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-red-600 transition-colors">{brand.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <Badge variant="secondary">{brand.productCount} товаров</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
