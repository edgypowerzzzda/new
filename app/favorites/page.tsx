import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Избранное</h1>
        <p className="text-gray-600">Ваши любимые товары</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список избранного пуст</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            У вас пока нет избранных товаров. Добавляйте товары в избранное, нажимая на сердечко.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
