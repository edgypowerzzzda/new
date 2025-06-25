import ProductForm from "@/components/admin/product-form"

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Создать товар</h1>
        <p className="text-gray-600">Добавьте новый товар в каталог</p>
      </div>

      <ProductForm />
    </div>
  )
}
