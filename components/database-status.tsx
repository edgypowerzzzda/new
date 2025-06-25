"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, AlertTriangle, UserPlus, Database, Settings } from "lucide-react"

interface HealthStatus {
  status: "ok" | "warning" | "error"
  message: string
  connected: boolean
  tables?: string[]
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | HealthStatus>("loading")
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)

  useEffect(() => {
    async function checkDatabase() {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()
        setStatus(data)
        console.log("📊 Database status:", data)
      } catch (err) {
        console.error("💥 Health check error:", err)
        setStatus({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
          connected: false,
        })
      }
    }

    checkDatabase()
  }, [])

  const createAdminUser = async () => {
    setCreatingAdmin(true)
    try {
      const response = await fetch("/api/auth/create-admin", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        setShowCredentials(true)
        setTimeout(() => setShowCredentials(false), 15000) // Hide after 15 seconds
      } else {
        alert("Ошибка при создании пользователей: " + data.error)
      }
    } catch (error) {
      alert("Ошибка: " + error)
    } finally {
      setCreatingAdmin(false)
    }
  }

  if (status === "loading") {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">Проверка подключения к базе данных...</AlertDescription>
      </Alert>
    )
  }

  if (status.status === "warning") {
    return (
      <Alert className="mb-4 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">⚠️ База данных не настроена</p>
              <p className="text-sm mt-1">
                Сайт работает в демо-режиме. Для полной функциональности настройте переменную DATABASE_URL.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (status.status === "error") {
    return (
      <Alert variant="destructive" className="mb-4 border-red-300 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-2">
            <p>
              <strong>❌ Ошибка базы данных:</strong> {status.message}
            </p>
            <p>Пожалуйста, выполните следующие шаги:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Убедитесь, что переменная DATABASE_URL настроена</li>
              <li>Запустите скрипты создания таблиц</li>
              <li>Проверьте подключение к Neon DB</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mb-4 space-y-4">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">✅ База данных подключена успешно!</p>
              {status.tables && (
                <p className="text-sm mt-1">
                  Найдено таблиц: {status.tables.length} ({status.tables.join(", ")})
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <Button
                onClick={createAdminUser}
                disabled={creatingAdmin}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {creatingAdmin ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {creatingAdmin ? "Создание..." : "Создать админа"}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {showCredentials && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-3">
              <p className="font-semibold">🎉 Тестовые пользователи созданы успешно!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="font-medium text-red-600 mb-2">👨‍💼 Администратор:</p>
                  <p className="text-sm">
                    <strong>Email:</strong> admin@musicstore.com
                  </p>
                  <p className="text-sm">
                    <strong>Пароль:</strong> admin123
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Доступ к админ-панели</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-600 mb-2">👤 Пользователь:</p>
                  <p className="text-sm">
                    <strong>Email:</strong> user@test.com
                  </p>
                  <p className="text-sm">
                    <strong>Пароль:</strong> user123
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Обычный пользователь</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Это сообщение исчезнет через 15 секунд</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
