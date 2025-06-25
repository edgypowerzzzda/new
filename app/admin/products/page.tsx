import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductsTable from "@/components/admin/products-table"

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-600">Управление каталогом товаров</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
        </Link>
      </div>

      <ProductsTable />
    </div>
  )
}
