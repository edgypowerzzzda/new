"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Minus, Plus, Trash2, ShoppingBag, User } from "lucide-react"
import { getCartItems, getLocalProducts, updateCartQuantity, removeFromCart, clearCart } from "@/lib/local-storage"
import type { LocalProduct, CartItem } from "@/lib/local-storage"
import { useAuth } from "@/components/auth/auth-provider"
import Image from "next/image"
import Link from "next/link"

interface CartItemWithProduct extends CartItem {
  product: LocalProduct
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [orderForm, setOrderForm] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
  })
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    // Автозаполнение формы для авторизованных пользователей
    if (user) {
      setOrderForm({
        user_name: `${user.firstName} ${user.lastName}`,
        user_email: user.email,
        user_phone: "",
      })
    }
  }, [user])

  const loadCart = () => {
    const cart = getCartItems()
    const products = getLocalProducts()

    const cartWithProducts = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id)
        return product ? { ...item, product } : null
      })
      .filter(Boolean) as CartItemWithProduct[]

    setCartItems(cartWithProducts)
    setLoading(false)
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateCartQuantity(productId, newQuantity)
    }
    loadCart()
  }

  const removeItem = (productId: number) => {
    removeFromCart(productId)
    loadCart()
  }

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверка авторизации
    if (!user) {
      alert("Для оформления заказа необходимо войти в аккаунт")
      return
    }

    setOrderLoading(true)

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderForm,
          items: orderItems,
        }),
      })

      if (response.ok) {
        clearCart()
        setCartItems([])
        setOrderSuccess(true)
        setOrderForm({ user_name: "", user_email: "", user_phone: "" })
      }
    } catch (error) {
      console.error("Order error:", error)
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка корзины...</div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 text-green-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl text-green-600">Заказ оформлен!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.</p>
            <Button onClick={() => setOrderSuccess(false)} className="bg-red-600 hover:bg-red-700">
              Продолжить покупки
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Корзина</h1>
        <p className="text-gray-600">Ваши выбранные товары</p>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Корзина пуста</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">В вашей корзине пока нет товаров. Перейдите в каталог для выбора товаров.</p>
            <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = "/catalog")}>
              Перейти к покупкам
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Товары в корзине */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product_id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.images[0]?.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600">{item.product.brand?.name}</p>
                      <p className="text-red-600 font-bold text-lg">{item.product.price.toLocaleString("ru-RU")} ₽</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Форма заказа */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Оформление заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого:</span>
                    <span className="text-red-600">{getTotalAmount().toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>

                {!user && (
                  <Alert className="mb-6">
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      Для оформления заказа необходимо{" "}
                      <Link href="/auth/login" className="text-red-600 hover:underline">
                        войти в аккаунт
                      </Link>{" "}
                      или{" "}
                      <Link href="/auth/register" className="text-red-600 hover:underline">
                        зарегистрироваться
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="user_name">Имя и фамилия *</Label>
                    <Input
                      id="user_name"
                      value={orderForm.user_name}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, user_name: e.target.value }))}
                      placeholder="Иван Петров"
                      required
                      disabled={!user}
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_email">Email *</Label>
                    <Input
                      id="user_email"
                      type="email"
                      value={orderForm.user_email}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, user_email: e.target.value }))}
                      placeholder="ivan@example.com"
                      required
                      disabled={!user}
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_phone">Телефон *</Label>
                    <Input
                      id="user_phone"
                      type="tel"
                      value={orderForm.user_phone}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, user_phone: e.target.value }))}
                      placeholder="+7 (999) 123-45-67"
                      required
                      disabled={!user}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={orderLoading || !user}>
                    {orderLoading ? "Оформление..." : "Оформить заказ"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
