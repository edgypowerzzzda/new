"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Grid, List, SlidersHorizontal, X, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import ModernProductCard from "@/components/modern-product-card"
import ProductQuickView from "@/components/product-quick-view"
import {
  getLocalProducts,
  getLocalBrands,
  getLocalCategories,
  type LocalProduct,
  type LocalBrand,
  type LocalCategory,
} from "@/lib/local-storage"

const ITEMS_PER_PAGE = 12

export default function CatalogPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [brands, setBrands] = useState<LocalBrand[]>([])
  const [categories, setCategories] = useState<LocalCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Фильтры
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000])
  const [sortBy, setSortBy] = useState("name")
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  // UI состояние
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [quickViewProduct, setQuickViewProduct] = useState<LocalProduct | null>(null)

  useEffect(() => {
    const allProducts = getLocalProducts()
    const allBrands = getLocalBrands()
    const allCategories = getLocalCategories()

    setProducts(allProducts)
    setBrands(allBrands)
    setCategories(allCategories)

    // Установить максимальную цену на основе товаров
    const maxPrice = Math.max(...allProducts.map((p) => p.price))
    setPriceRange([0, maxPrice])

    setLoading(false)
  }, [])

  // Фильтрация и сортировка товаров
  const filteredProducts = useCallback(() => {
    let filtered = products.filter((product) => product.is_active)

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand?.name.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query),
      )
    }

    // Фильтр по брендам
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => product.brand_id && selectedBrands.includes(product.brand_id))
    }

    // Фильтр по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => product.category_id && selectedCategories.includes(product.category_id))
    }

    // Фильтр по цене
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Дополнительные фильтры
    if (showOnlyNew) {
      filtered = filtered.filter((product) => product.is_new)
    }
    if (showOnlyFeatured) {
      filtered = filtered.filter((product) => product.is_featured)
    }
    if (showOnlyInStock) {
      filtered = filtered.filter((product) => product.stock_quantity > 0)
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "popular":
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [
    products,
    searchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    sortBy,
    showOnlyNew,
    showOnlyFeatured,
    showOnlyInStock,
  ])

  const allFilteredProducts = filteredProducts()
  const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = allFilteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleBrandToggle = useCallback((brandId: number) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
    setCurrentPage(1)
  }, [])

  const handleCategoryToggle = useCallback((categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
    setCurrentPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedBrands([])
    setSelectedCategories([])
    setPriceRange([0, 300000])
    setShowOnlyNew(false)
    setShowOnlyFeatured(false)
    setShowOnlyInStock(false)
    setCurrentPage(1)
  }, [])

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Цена */}
      <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
          💰 Цена
          <span className="ml-auto text-sm text-gray-600 bg-gray-100/50 px-3 py-1 rounded-full">
            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
          </span>
        </h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value as [number, number])
            setCurrentPage(1)
          }}
          max={300000}
          step={1000}
          className="mb-4"
        />
      </div>

      {/* Бренды */}
      <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-gray-900">🏷️ Бренды</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {brands
            .filter((brand) => brand.is_active)
            .map((brand) => {
              const productCount = products.filter((p) => p.brand_id === brand.id && p.is_active).length
              return (
                <div key={brand.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => handleBrandToggle(brand.id)}
                      className="border-2"
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm cursor-pointer hover:text-red-600 transition-colors font-medium"
                    >
                      {brand.name}
                    </label>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100/50 text-xs">
                    {productCount}
                  </Badge>
                </div>
              )
            })}
        </div>
      </div>

      {/* Категории */}
      <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-gray-900">📂 Категории</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {categories
            .filter((category) => category.is_active)
            .map((category) => {
              const productCount = products.filter((p) => p.category_id === category.id && p.is_active).length
              return (
                <div key={category.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="border-2"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer hover:text-red-600 transition-colors font-medium"
                    >
                      {category.name}
                    </label>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100/50 text-xs">
                    {productCount}
                  </Badge>
                </div>
              )
            })}
        </div>
      </div>

      {/* Дополнительные фильтры */}
      <div className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-gray-900">✨ Дополнительно</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="new-products"
              checked={showOnlyNew}
              onCheckedChange={(checked) => {
                setShowOnlyNew(checked as boolean)
                setCurrentPage(1)
              }}
              className="border-2"
            />
            <label htmlFor="new-products" className="text-sm cursor-pointer font-medium">
              🆕 Только новинки
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="featured-products"
              checked={showOnlyFeatured}
              onCheckedChange={(checked) => {
                setShowOnlyFeatured(checked as boolean)
                setCurrentPage(1)
              }}
              className="border-2"
            />
            <label htmlFor="featured-products" className="text-sm cursor-pointer font-medium">
              ⭐ Рекомендуемые
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="in-stock"
              checked={showOnlyInStock}
              onCheckedChange={(checked) => {
                setShowOnlyInStock(checked as boolean)
                setCurrentPage(1)
              }}
              className="border-2"
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer font-medium">
              ✅ Только в наличии
            </label>
          </div>
        </div>
      </div>

      {/* Очистить фильтры */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full bg-white/50 backdrop-blur-xl border border-white/20 hover:bg-white/70 transition-all duration-300"
      >
        🗑️ Очистить все фильтры
      </Button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-700 font-medium">Загрузка каталога...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Каталог товаров
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <p className="text-lg">
                Найдено {allFilteredProducts.length} товаров из {products.length}
              </p>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl" />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
              <Input
                placeholder="🔍 Поиск товаров, брендов, категорий..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="relative z-10 pl-12 h-14 bg-transparent border-0 text-lg placeholder:text-gray-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-14 px-6 bg-white/50 backdrop-blur-xl border border-white/20 hover:bg-white/70"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl">
                  <SheetHeader>
                    <SheetTitle>Фильтры товаров</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar isMobile />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border border-white/20 rounded-xl" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="relative z-10 w-48 h-14 bg-transparent border-0">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20">
                    <SelectItem value="name">По названию</SelectItem>
                    <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                    <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                    <SelectItem value="newest">Сначала новые</SelectItem>
                    <SelectItem value="popular">Популярные</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex bg-white/50 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-14 px-4 bg-transparent hover:bg-white/50"
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-14 px-4 bg-transparent hover:bg-white/50"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {(selectedBrands.length > 0 ||
              selectedCategories.length > 0 ||
              showOnlyNew ||
              showOnlyFeatured ||
              showOnlyInStock) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700">🏷️ Активные фильтры:</span>
                  {selectedBrands.map((brandId) => {
                    const brand = brands.find((b) => b.id === brandId)
                    return brand ? (
                      <Badge
                        key={brandId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 bg-white/70 backdrop-blur-sm"
                        onClick={() => handleBrandToggle(brandId)}
                      >
                        {brand.name}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ) : null
                  })}
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId)
                    return category ? (
                      <Badge
                        key={categoryId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 bg-white/70 backdrop-blur-sm"
                        onClick={() => handleCategoryToggle(categoryId)}
                      >
                        {category.name}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ) : null
                  })}
                  {showOnlyNew && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 bg-white/70 backdrop-blur-sm"
                      onClick={() => setShowOnlyNew(false)}
                    >
                      Новинки
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {showOnlyFeatured && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 bg-white/70 backdrop-blur-sm"
                      onClick={() => setShowOnlyFeatured(false)}
                    >
                      Рекомендуемые
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {showOnlyInStock && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 bg-white/70 backdrop-blur-sm"
                      onClick={() => setShowOnlyInStock(false)}
                    >
                      В наличии
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="hover:bg-red-50">
                    Очистить все
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 h-fit sticky top-8">
            <FilterSidebar />
          </div>

          {/* Products */}
          <div className="flex-1">
            {allFilteredProducts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
                  <div className="text-8xl mb-6">🔍</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Товары не найдены</h3>
                  <p className="text-gray-600 mb-8 text-lg">Попробуйте изменить параметры поиска или фильтры</p>
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Products Grid */}
                <motion.div
                  layout
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-12"
                      : "space-y-6 mb-12"
                  }
                >
                  <AnimatePresence>
                    {paginatedProducts.map((product, index) => (
                      <ModernProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onQuickView={() => setQuickViewProduct(product)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        >
                          Назад
                        </Button>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                onClick={() => setCurrentPage(page)}
                                className={`w-12 h-12 ${
                                  currentPage === page
                                    ? "bg-gradient-to-r from-red-600 to-purple-600 text-white"
                                    : "bg-white/50 backdrop-blur-sm border-white/20"
                                }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                              <span key={page} className="px-2 text-gray-500">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}

                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="bg-white/50 backdrop-blur-sm border-white/20"
                        >
                          Вперед
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  )
}
