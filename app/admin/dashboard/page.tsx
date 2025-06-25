"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { getLocalProducts, getLocalOrders } from "@/lib/local-storage"

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const adminUserData = localStorage.getItem("adminUser")
    if (adminUserData) {
      setAdminUser(JSON.parse(adminUserData))
    }

    // Загружаем статистику
    const products = getLocalProducts()
    const orders = getLocalOrders()

    const totalRevenue = orders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .reduce((sum, order) => sum + order.total_amount, 0)

    const pendingOrders = orders.filter((order) => order.status === "pending").length

    setStats({
      productsCount: products.length,
      ordersCount: orders.length,
      totalRevenue,
      pendingOrders,
    })
  }, [])

  const statsCards = [
    {
      title: "Всего товаров",
      value: stats.productsCount.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Package,
    },
    {
      title: "Заказы",
      value: stats.ordersCount.toString(),
      change: "+8%",
      changeType: "positive",
      icon: ShoppingCart,
    },
    {
      title: "Ожидают обработки",
      value: stats.pendingOrders.toString(),
      change: "0%",
      changeType: "neutral",
      icon: Users,
    },
    {
      title: "Выручка",
      value: `₽${stats.totalRevenue.toLocaleString("ru-RU")}`,
      change: "+15%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Добро пожаловать, {adminUser?.firstName || "Админ"} {adminUser?.lastName || "Системы"}!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">{stat.change} от прошлого месяца</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLocalOrders()
                .slice(0, 5)
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Заказ #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.user_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₽{order.total_amount.toLocaleString("ru-RU")}</p>
                      <p className="text-sm text-green-600 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              {getLocalOrders().length === 0 && <p className="text-gray-500 text-center py-4">Заказов пока нет</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные товары</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLocalProducts()
                .slice(0, 5)
                .map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand?.name}</p>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
