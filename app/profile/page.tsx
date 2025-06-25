"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/profile")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Профиль</h1>
        <p className="text-gray-600">Управление вашим аккаунтом</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Имя</label>
              <p className="text-gray-900">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Фамилия</label>
              <p className="text-gray-900">{user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Роль</label>
              <p className="text-gray-900">{user.role === "admin" ? "Администратор" : "Пользователь"}</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">Редактировать профиль</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Мои заказы
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Избранные товары
            </Button>
            <Button variant="outline" className="w-full justify-start">
              История просмотров
            </Button>
            {user.role === "admin" && (
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin")}>
                Панель администратора
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
