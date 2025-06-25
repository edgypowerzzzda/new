import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Оплата</h1>
        <p className="text-gray-600">Способы оплаты товаров</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Онлайн оплата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Банковские карты</h3>
              <p className="text-gray-600">Visa, MasterCard, МИР</p>
            </div>
            <div>
              <h3 className="font-semibold">Электронные кошельки</h3>
              <p className="text-gray-600">ЮMoney, QIWI, WebMoney</p>
            </div>
            <div>
              <h3 className="font-semibold">Интернет-банкинг</h3>
              <p className="text-gray-600">Сбербанк Онлайн, Альфа-Клик</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Другие способы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Наличными курьеру</h3>
              <p className="text-gray-600">При получении заказа</p>
            </div>
            <div>
              <h3 className="font-semibold">Банковский перевод</h3>
              <p className="text-gray-600">Для юридических лиц</p>
            </div>
            <div>
              <h3 className="font-semibold">Рассрочка</h3>
              <p className="text-gray-600">0% на 6-12 месяцев</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
