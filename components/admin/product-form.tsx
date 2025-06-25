"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product, Brand, Category } from "@/lib/db"

interface ProductFormProps {
  product?: Product
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  old_price?: number
  sku: string
  stock_quantity: number
  brand_id?: number
  category_id?: number
  is_featured: boolean
  is_new: boolean
  is_recommended: boolean
  is_active: boolean
  meta_title: string
  meta_description: string
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    price: product?.price || 0,
    old_price: product?.old_price || undefined,
    sku: product?.sku || "",
    stock_quantity: product?.stock_quantity || 0,
    brand_id: product?.brand_id || undefined,
    category_id: product?.category_id || undefined,
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
    is_recommended: product?.is_recommended || false,
    is_active: product?.is_active ?? true,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  })

  useEffect(() => {
    fetchBrands()
    fetchCategories()
    if (product?.images) {
      setImages(product.images.map((img) => img.image_url))
    }
  }, [product])

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/admin/brands")
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands || [])
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const map: { [key: string]: string } = {
          а: "a",
          б: "b",
          в: "v",
          г: "g",
          д: "d",
          е: "e",
          ё: "yo",
          ж: "zh",
          з: "z",
          и: "i",
          й: "y",
          к: "k",
          л: "l",
          м: "m",
          н: "n",
          о: "o",
          п: "p",
          р: "r",
          с: "s",
          т: "t",
          у: "u",
          ф: "f",
          х: "h",
          ц: "ts",
          ч: "ch",
          ш: "sh",
          щ: "sch",
          ъ: "",
          ы: "y",
          ь: "",
          э: "e",
          ю: "yu",
          я: "ya",
        }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from name
    if (field === "name" && !product) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImages((prev) => [...prev, data.url])
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: images.map((url, index) => ({
            image_url: url,
            alt_text: formData.name,
            sort_order: index,
            is_primary: index === 0,
          })),
        }),
      })

      if (response.ok) {
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Название товара *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Введите название товара"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL (slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="url-tovara"
                  required
                />
              </div>

              <div>
                <Label htmlFor="short_description">Краткое описание</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange("short_description", e.target.value)}
                  placeholder="Краткое описание товара"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Полное описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Подробное описание товара"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Изображения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Главное
                      </div>
                    )}
                  </div>
                ))}

                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">Добавить фото</span>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-500">Первое изображение будет использоваться как главное</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Цена и остатки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number(e.target.value))}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="old_price">Старая цена</Label>
                <Input
                  id="old_price"
                  type="number"
                  value={formData.old_price || ""}
                  onChange={(e) => handleInputChange("old_price", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="sku">Артикул</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="SKU-123"
                />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Количество на складе</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Категория и бренд</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand_id">Бренд</Label>
                <Select
                  value={formData.brand_id?.toString()}
                  onValueChange={(value) => handleInputChange("brand_id", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите бренд" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category_id">Категория</Label>
                <Select
                  value={formData.category_id?.toString()}
                  onValueChange={(value) => handleInputChange("category_id", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Статус товара</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Активен</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Рекомендуемый</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_new">Новинка</Label>
                <Switch
                  id="is_new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => handleInputChange("is_new", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_recommended">Рекомендуем</Label>
                <Switch
                  id="is_recommended"
                  checked={formData.is_recommended}
                  onCheckedChange={(checked) => handleInputChange("is_recommended", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange("meta_title", e.target.value)}
                  placeholder="SEO заголовок"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange("meta_description", e.target.value)}
                  placeholder="SEO описание"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
          {loading ? "Сохранение..." : product ? "Обновить товар" : "Создать товар"}
        </Button>
      </div>
    </form>
  )
}
