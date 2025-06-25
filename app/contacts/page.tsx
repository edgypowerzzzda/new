import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Контакты</h1>
        <p className="text-gray-600">Свяжитесь с нами любым удобным способом</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Телефон</h3>
              <p className="text-gray-600">8 (800) 555-0123</p>
              <p className="text-sm text-gray-500">Бесплатно по России</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">info@musicstore.ru</p>
            </div>
            <div>
              <h3 className="font-semibold">Адрес магазина</h3>
              <p className="text-gray-600">г. Москва, ул. Музыкальная, д. 1</p>
            </div>
            <div>
              <h3 className="font-semibold">Время работы</h3>
              <p className="text-gray-600">Пн-Пт: 10:00-20:00</p>
              <p className="text-gray-600">Сб-Вс: 11:00-18:00</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Обратная связь</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Форма обратной связи находится в разработке. Пока вы можете связаться с нами по телефону или email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
