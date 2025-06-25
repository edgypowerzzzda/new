"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@musicstore.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Простая проверка - любой email/пароль проходит
    if (email && password) {
      // Сохраняем авторизацию
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: 1,
          email: email,
          firstName: "Админ",
          lastName: "Системы",
          role: "admin",
        }),
      )

      console.log("✅ Admin login successful")
      router.push("/admin/dashboard")
    } else {
      setError("Введите email и пароль")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-600 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <CardTitle className="text-2xl font-bold">Вход в админ-панель</CardTitle>
          <CardDescription>Быстрый доступ к панели управления</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-200 bg-green-50 mb-4">
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-semibold">🚀 Быстрый доступ активен!</p>
                <p className="text-sm">Любые данные подойдут для входа</p>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@musicstore.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Вход..." : "Войти в админ-панель"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700 block">
              ← Вернуться на главную
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
