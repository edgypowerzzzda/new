"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Grid, List, SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import ModernProductCard from "@/components/modern-product-card"
import ProductQuickView from "@/components/product-quick-view"
import type { LocalProduct } from "@/lib/local-storage"

interface Brand {
  id: number
  name: string
  productCount: number
}

interface Category {
  id: number
  name: string
  productCount: number
}

interface Filters {
  brands: Brand[]
  categories: Category[]
  priceRange: { min: number; max: number }
  totalProducts: number
}

interface ProductsResponse {
  products: LocalProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function CatalogPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [filters, setFilters] = useState<Filters | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)

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
  const [pagination, setPagination] = useState<ProductsResponse["pagination"] | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<LocalProduct | null>(null)

  // Загрузка фильтров
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await fetch("/api/filters")
        if (!response.ok) throw new Error("Failed to fetch filters")
        const filtersData = await response.json()
        setFilters(filtersData)
        setPriceRange([filtersData.priceRange.min, filtersData.priceRange.max])
      } catch (error) {
        console.error("Error loading filters:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить фильтры",
          variant: "destructive",
        })
      }
    }
    loadFilters()
  }, [toast])

  // Загрузка товаров
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
      })

      if (searchQuery) params.append("search", searchQuery)
      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brandId) => params.append("brand", brandId.toString()))
      }
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((categoryId) => params.append("category", categoryId.toString()))
      }
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString())
      if (priceRange[1] < 300000) params.append("maxPrice", priceRange[1].toString())
      if (showOnlyNew) params.append("isNew", "true")
      if (showOnlyFeatured) params.append("isFeatured", "true")
      if (showOnlyInStock) params.append("inStock", "true")

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error("Failed to fetch products")

      const data: ProductsResponse = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      })
    } finally {
      setLoadingProducts(false)
      setLoading(false)
    }
  }, [
    currentPage,
    searchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    sortBy,
    showOnlyNew,
    showOnlyFeatured,
    showOnlyInStock,
    toast,
  ])

  useEffect(() => {
    if (filters) {
      loadProducts()
    }
  }, [filters, loadProducts])

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
    setPriceRange(filters ? [filters.priceRange.min, filters.priceRange.max] : [0, 300000])
    setShowOnlyNew(false)
    setShowOnlyFeatured(false)
    setShowOnlyInStock(false)
    setCurrentPage(1)
  }, [filters])

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Цена */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center">
          Цена
          <span className="ml-2 text-sm text-gray-500">
            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
          </span>
        </h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value as [number, number])
            setCurrentPage(1)
          }}
          max={filters?.priceRange.max || 300000}
          min={filters?.priceRange.min || 0}
          step={1000}
          className="mb-4"
        />
      </div>

      <Separator />

      {/* Бренды */}
      {filters?.brands && filters.brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Бренды</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filters.brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => handleBrandToggle(brand.id)}
                  />
                  <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer hover:text-red-600">
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({brand.productCount})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Категории */}
      {filters?.categories && filters.categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Категории</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filters.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer hover:text-red-600">
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({category.productCount})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Дополнительные фильтры */}
      <div>
        <h3 className="font-semibold mb-4">Дополнительно</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-products"
              checked={showOnlyNew}
              onCheckedChange={(checked) => {
                setShowOnlyNew(checked as boolean)
                setCurrentPage(1)
              }}
            />
            <label htmlFor="new-products" className="text-sm cursor-pointer">
              Только новинки
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured-products"
              checked={showOnlyFeatured}
              onCheckedChange={(checked) => {
                setShowOnlyFeatured(checked as boolean)
                setCurrentPage(1)
              }}
            />
            <label htmlFor="featured-products" className="text-sm cursor-pointer">
              Рекомендуемые
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showOnlyInStock}
              onCheckedChange={(checked) => {
                setShowOnlyInStock(checked as boolean)
                setCurrentPage(1)
              }}
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              Только в наличии
            </label>
          </div>
        </div>
      </div>

      {/* Очистить фильтры */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Очистить все фильтры
      </Button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка каталога...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог товаров</h1>
          <p className="text-gray-600">{pagination ? `Найдено ${pagination.total} товаров` : "Загрузка..."}</p>
        </motion.div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск товаров, брендов, категорий..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 px-4">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar isMobile />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="popular">Популярные</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-12 px-4"
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-12 px-4"
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
                className="flex flex-wrap gap-2 items-center"
              >
                <span className="text-sm text-gray-600">Активные фильтры:</span>
                {selectedBrands.map((brandId) => {
                  const brand = filters?.brands.find((b) => b.id === brandId)
                  return brand ? (
                    <Badge
                      key={brandId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => handleBrandToggle(brandId)}
                    >
                      {brand.name}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ) : null
                })}
                {selectedCategories.map((categoryId) => {
                  const category = filters?.categories.find((c) => c.id === categoryId)
                  return category ? (
                    <Badge
                      key={categoryId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
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
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => setShowOnlyNew(false)}
                  >
                    Новинки
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {showOnlyFeatured && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => setShowOnlyFeatured(false)}
                  >
                    Рекомендуемые
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {showOnlyInStock && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => setShowOnlyInStock(false)}
                  >
                    В наличии
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Очистить все
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 bg-white rounded-2xl p-6 h-fit sticky top-8 shadow-sm border">
            <FilterSidebar />
          </div>

          {/* Products */}
          <div className="flex-1">
            {loadingProducts ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Загрузка товаров...</p>
              </div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Товары не найдены</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                <Button onClick={clearFilters}>Сбросить фильтры</Button>
              </motion.div>
            ) : (
              <>
                {/* Products Grid */}
                <motion.div
                  layout
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"
                  }
                >
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ModernProductCard
                          product={product}
                          index={index}
                          onQuickView={() => setQuickViewProduct(product)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrev}
                    >
                      Назад
                    </Button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasNext}
                    >
                      Вперед
                    </Button>
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
