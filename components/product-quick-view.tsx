"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { LocalProduct } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"
import { getProductImages } from "@/lib/image-utils"

interface ProductQuickViewProps {
  product: LocalProduct
  onClose: () => void
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // Добавление в корзину
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} (${quantity} шт.)`,
    })
  }

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    if (!favorites.includes(product.id)) {
      favorites.push(product.id)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      toast({
        title: "Добавлено в избранное",
        description: product.name,
      })
    }
  }

  // Исправляем логику изображений
  const images = getProductImages(product)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Быстрый просмотр товара</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-4 top-4 z-10">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.is_new && <Badge className="absolute top-4 left-4 bg-green-600">Новинка</Badge>}
              {product.is_featured && <Badge className="absolute top-4 right-4 bg-red-600">Хит</Badge>}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && <Badge variant="outline">{product.brand.name}</Badge>}
                {product.category && <Badge variant="outline">{product.category.name}</Badge>}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.0) • 12 отзывов</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.original_price.toLocaleString()} ₽
                  </span>
                )}
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="text-sm text-green-600 font-medium">
                  Скидка {Math.round((1 - product.price / product.original_price) * 100)}%
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock_quantity > 0 ? `В наличии (${product.stock_quantity} шт.)` : "Нет в наличии"}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Количество:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />В корзину
                </Button>
                <Button variant="outline" onClick={handleAddToFavorites}>
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/product/${product.slug}`}>Подробнее о товаре</Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Быстрая доставка</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Гарантия качества</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Возврат 14 дней</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
