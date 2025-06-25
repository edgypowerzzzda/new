import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/db"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:border-red-200">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.is_new && <Badge className="bg-green-500 hover:bg-green-600">Новинка</Badge>}
        {product.is_featured && <Badge className="bg-red-500 hover:bg-red-600">Хит</Badge>}
        {product.is_recommended && <Badge className="bg-orange-500 hover:bg-orange-600">Рекомендуем</Badge>}
        {product.old_price && (
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
          </Badge>
        )}
      </div>

      {/* Favorite button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
      >
        <Heart className="h-4 w-4" />
      </Button>

      {/* Product image */}
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={primaryImage?.image_url || "/placeholder.svg?height=300&width=300"}
            alt={primaryImage?.alt_text || product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && <p className="text-xs text-red-600 mb-1 font-medium">{product.brand.name}</p>}

        {/* Product name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        {product.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.short_description}</p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600">{product.price.toLocaleString("ru-RU")} ₽</span>
            {product.old_price && (
              <span className="text-sm text-gray-500 line-through">{product.old_price.toLocaleString("ru-RU")} ₽</span>
            )}
          </div>
        </div>

        {/* Stock status */}
        <div className="mb-3">
          {product.stock_quantity > 0 ? (
            <span className="text-sm text-green-600">✓ В наличии ({product.stock_quantity} шт.)</span>
          ) : (
            <span className="text-sm text-red-600">Нет в наличии</span>
          )}
        </div>

        {/* Add to cart button */}
        <Button className="w-full bg-red-600 hover:bg-red-700" disabled={product.stock_quantity === 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />В корзину
        </Button>
      </div>
    </div>
  )
}
