import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Доставка</h1>
        <p className="text-gray-600">Информация о доставке товаров</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Способы доставки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Курьерская доставка</h3>
              <p className="text-gray-600">Доставка по Москве и МО в течение 1-2 дней</p>
              <p className="text-red-600 font-medium">От 500 ₽</p>
            </div>
            <div>
              <h3 className="font-semibold">Почта России</h3>
              <p className="text-gray-600">Доставка по всей России в течение 5-14 дней</p>
              <p className="text-red-600 font-medium">От 300 ₽</p>
            </div>
            <div>
              <h3 className="font-semibold">Транспортные компании</h3>
              <p className="text-gray-600">Доставка крупногабаритных товаров</p>
              <p className="text-red-600 font-medium">Рассчитывается индивидуально</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Условия доставки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Бесплатная доставка</h3>
              <p className="text-gray-600">При заказе от 10 000 ₽ по Москве</p>
            </div>
            <div>
              <h3 className="font-semibold">Самовывоз</h3>
              <p className="text-gray-600">Бесплатно из нашего магазина</p>
              <p className="text-sm text-gray-500">ул. Музыкальная, 1, Москва</p>
            </div>
            <div>
              <h3 className="font-semibold">Время работы</h3>
              <p className="text-gray-600">Пн-Пт: 10:00-20:00</p>
              <p className="text-gray-600">Сб-Вс: 11:00-18:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
