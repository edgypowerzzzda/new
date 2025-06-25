"use client"

import type { LocalProduct } from "@/types"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Image from "next/image"
import { getProductImageUrl } from "@/lib/image-utils"

interface ModernProductCardProps {
  product: LocalProduct
  index: number
  onQuickView?: () => void
}

const ModernProductCard = ({ product, index, onQuickView }: ModernProductCardProps) => {
  const imageUrl = getProductImageUrl(product)

  return (
    <div key={index} className="group relative">
      <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden rounded-md bg-gray-200">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={product.href}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
      {onQuickView && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Quick View Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              onQuickView?.()
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4 mr-1" />
            Быстрый просмотр
          </Button>
        </div>
      )}
    </div>
  )
}

export default ModernProductCard
