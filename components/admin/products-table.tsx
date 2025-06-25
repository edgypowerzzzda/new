"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/lib/db"

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Изображение</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Бренд</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Остаток</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={primaryImage?.image_url || "/placeholder.svg?height=48&width=48"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.brand?.name || "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.category?.name || "—"}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">₽{product.price.toLocaleString("ru-RU")}</p>
                    {product.old_price && (
                      <p className="text-sm text-gray-500 line-through">₽{product.old_price.toLocaleString("ru-RU")}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm ${
                      product.stock_quantity > 10
                        ? "text-green-600"
                        : product.stock_quantity > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {product.stock_quantity} шт.
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {product.is_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Активен
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Неактивен</Badge>
                    )}
                    {product.is_featured && <Badge className="bg-red-100 text-red-800">Рекомендуемый</Badge>}
                    {product.is_new && <Badge className="bg-blue-100 text-blue-800">Новинка</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/product/${product.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя отменить. Товар "{product.name}" будет удален навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProduct(product.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Товары не найдены</p>
          <Link href="/admin/products/create">
            <Button className="mt-4 bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый товар
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
