"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle } from "lucide-react"
import { getLocalOrders, updateLocalOrder } from "@/lib/local-storage"
import type { LocalOrder } from "@/lib/local-storage"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const allOrders = getLocalOrders()
    setOrders(allOrders)
    setLoading(false)
  }

  const updateOrderStatus = (orderId: number, newStatus: LocalOrder["status"]) => {
    updateLocalOrder(orderId, { status: newStatus })
    loadOrders()
  }

  const getStatusBadge = (status: LocalOrder["status"]) => {
    const statusConfig = {
      pending: { label: "Ожидает", className: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Оплачен", className: "bg-green-100 text-green-800" },
      shipped: { label: "Отправлен", className: "bg-blue-100 text-blue-800" },
      delivered: { label: "Доставлен", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Отменен", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Загрузка заказов...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600">Управление заказами клиентов</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Заказов пока нет</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Когда клиенты начнут делать заказы, они появятся здесь.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
                    <p className="text-gray-600">
                      {order.user_name} • {order.user_email}
                    </p>
                    <p className="text-sm text-gray-500">{order.user_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{order.total_amount.toLocaleString("ru-RU")} ₽</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(order.status)}
                  <div className="flex space-x-2">
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "paid")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Оплачен
                      </Button>
                    )}
                    {order.status === "paid" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Отправить
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Доставлен
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Товары в заказе:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
