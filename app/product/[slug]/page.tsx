"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addToCart, getLocalProducts, type LocalProduct } from "@/lib/local-storage"

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<LocalProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    const products = getLocalProducts()
    const foundProduct = products.find((p) => p.slug === params.slug)
    setProduct(foundProduct || null)
    setLoading(false)
  }, [params.slug])

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    try {
      addToCart(product.id, quantity)
      // Показать уведомление
      alert(`${product.name} добавлен в корзину!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h1>
          <p className="text-gray-600 mb-8">Запрашиваемый товар не существует или был удален</p>
          <Link href="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    )
  }

  const primaryImage = product.images?.[selectedImage] || product.images?.[0]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-red-600">
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-red-600">
          Каталог
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-red-600">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Изображения товара */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={primaryImage?.image_url || "/placeholder.svg?height=600&width=600"}
              alt={primaryImage?.alt_text || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && <Badge className="bg-green-500">Новинка</Badge>}
              {product.is_featured && <Badge className="bg-red-500">Хит</Badge>}
              {product.old_price && product.old_price > product.price && (
                <Badge className="bg-orange-500">
                  -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </Badge>
              )}
            </div>
          </div>

          {/* Миниатюры */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.alt_text}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6">
          {/* Бренд */}
          {product.brand && (
            <Link href={`/brands/${product.brand.slug}`} className="inline-block">
              <Badge variant="outline" className="hover:bg-red-50 hover:border-red-200">
                {product.brand.name}
              </Badge>
            </Link>
          )}

          {/* Название */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Рейтинг */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.0) • 12 отзывов</span>
          </div>

          {/* Цена */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-600">{product.price.toLocaleString()} ₽</span>
              {product.old_price && product.old_price > product.price && (
                <span className="text-xl text-gray-500 line-through">{product.old_price.toLocaleString()} ₽</span>
              )}
            </div>
            {product.old_price && product.old_price > product.price && (
              <p className="text-green-600 font-medium">
                Экономия: {(product.old_price - product.price).toLocaleString()} ₽
              </p>
            )}
          </div>

          {/* Наличие */}
          <div className="flex items-center space-x-2">
            {product.stock_quantity > 0 ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">В наличии ({product.stock_quantity} шт.)</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Нет в наличии</span>
              </>
            )}
          </div>

          {/* Краткое описание */}
          <p className="text-gray-600 text-lg">{product.short_description}</p>

          {/* Количество и кнопки */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Количество:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock_quantity === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Добавляем..." : "В корзину"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`px-4 ${isInWishlist ? "text-red-600 border-red-600" : ""}`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-green-600" />
              <span>Быстрая доставка</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Гарантия качества</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span>Возврат 14 дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Подробная информация */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы (12)</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Артикул:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Бренд:</span>
                  <span>{product.brand?.name || "Не указан"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Категория:</span>
                  <span>{product.category?.name || "Не указана"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">В наличии:</span>
                  <span>{product.stock_quantity} шт.</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Отзывы пока отсутствуют</p>
              <p className="text-sm text-gray-400 mt-2">Станьте первым, кто оставит отзыв о этом товаре</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
