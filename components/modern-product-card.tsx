"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { addToCart, type LocalProduct } from "@/lib/local-storage"
import { useToast } from "@/hooks/use-toast"

interface ModernProductCardProps {
  product: LocalProduct
  index: number
  onQuickView?: () => void
}

export default function ModernProductCard({ product, index, onQuickView }: ModernProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAddingToCart(true)
    try {
      addToCart(product.id, 1)

      // Dispatch custom event for cart update
      window.dispatchEvent(new Event("cartUpdated"))

      toast({
        title: "Товар добавлен в корзину!",
        description: product.name,
        duration: 2000,
      })

      setTimeout(() => {
        setIsAddingToCart(false)
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setIsAddingToCart(false)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      })
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsInWishlist(!isInWishlist)

    toast({
      title: isInWishlist ? "Удалено из избранного" : "Добавлено в избранное",
      description: product.name,
      duration: 2000,
    })
  }

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]
  const imageUrl = primaryImage?.image_url || "/placeholder.svg?height=400&width=400"

  const discountPercentage =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-emerald-500/90 backdrop-blur-sm hover:bg-emerald-600 text-white border-0 shadow-lg">
              Новинка
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white border-0 shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-purple-500/90 backdrop-blur-sm hover:bg-purple-600 text-white border-0 shadow-lg">
              Хит
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg group/heart"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 group-hover/heart:scale-110 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={primaryImage?.alt_text || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2"
          >
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock_quantity === 0}
              className="flex-1 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAddingToCart ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                  <span>Добавляем...</span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />В корзину
                </>
              )}
            </Button>

            {onQuickView && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickView()
                }}
                variant="outline"
                className="bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200/50">
                {product.brand.name}
              </Badge>
            )}
            {product.category && (
              <span className="text-xs text-gray-500 bg-gray-100/50 px-2 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.short_description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.0)</span>
            <span className="text-xs text-gray-400">• 12 отзывов</span>
          </div>

          {/* Price & Stock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} ₽</span>
                {product.old_price && product.old_price > product.price && (
                  <span className="text-lg text-gray-500 line-through">{product.old_price.toLocaleString()} ₽</span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
                <span
                  className={`text-sm font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {product.stock_quantity > 0 ? "В наличии" : "Нет в наличии"}
                </span>
              </div>

              {product.stock_quantity > 0 && (
                <span className="text-xs text-gray-500">{product.stock_quantity} шт.</span>
              )}
            </div>

            {/* Savings */}
            {product.old_price && product.old_price > product.price && (
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-lg p-2">
                <p className="text-sm text-green-700 font-medium">
                  Экономия: {(product.old_price - product.price).toLocaleString()} ₽
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Glassmorphism Border Effect */}
        <div className="absolute inset-0 rounded-3xl border border-white/30 pointer-events-none" />
      </div>
    </motion.div>
  )
}
