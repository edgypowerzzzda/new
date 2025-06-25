"use client"

import { useEffect, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, AlertTriangle, Database, Play, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  step: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function DatabaseDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [runningScripts, setRunningScripts] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    setResults([])

    const diagnostics: DiagnosticResult[] = []

    // 1. Check environment variables
    try {
      const envResponse = await fetch("/api/debug/check-env")
      const envData = await envResponse.json()
      diagnostics.push({
        step: "Переменные окружения",
        status: envData.hasDatabase ? "success" : "error",
        message: envData.hasDatabase ? "DATABASE_URL найден" : "DATABASE_URL не найден",
        details: envData,
      })
    } catch (error) {
      diagnostics.push({
        step: "Переменные окружения",
        status: "error",
        message: "Ошибка проверки переменных",
        details: error,
      })
    }

    // 2. Check database connection
    try {
      const healthResponse = await fetch("/api/health")
      const healthData = await healthResponse.json()
      diagnostics.push({
        step: "Подключение к БД",
        status: healthData.connected ? "success" : "error",
        message: healthData.message,
        details: healthData,
      })
    } catch (error) {
      diagnostics.push({
        step: "Подключение к БД",
        status: "error",
        message: "Не удается подключиться к базе данных",
        details: error,
      })
    }

    // 3. Check tables
    try {
      const tablesResponse = await fetch("/api/debug/check-tables")
      const tablesData = await tablesResponse.json()
      diagnostics.push({
        step: "Проверка таблиц",
        status: tablesData.allTablesExist ? "success" : "warning",
        message: `Найдено таблиц: ${tablesData.existingTables?.length || 0}/8`,
        details: tablesData,
      })
    } catch (error) {
      diagnostics.push({
        step: "Проверка таблиц",
        status: "error",
        message: "Ошибка проверки таблиц",
        details: error,
      })
    }

    // 4. Check admin user
    try {
      const adminResponse = await fetch("/api/debug/check-admin")
      const adminData = await adminResponse.json()
      diagnostics.push({
        step: "Администратор",
        status: adminData.adminExists ? "success" : "warning",
        message: adminData.adminExists ? "Администратор найден" : "Администратор не найден",
        details: adminData,
      })
    } catch (error) {
      diagnostics.push({
        step: "Администратор",
        status: "error",
        message: "Ошибка проверки администратора",
        details: error,
      })
    }

    setResults(diagnostics)
    setLoading(false)
  }

  const runSetupScripts = async () => {
    setRunningScripts(true)
    try {
      // Run setup scripts in sequence
      const scripts = [
        { name: "Создание таблиц", endpoint: "/api/debug/run-setup" },
        { name: "Добавление данных", endpoint: "/api/debug/seed-data" },
        { name: "Создание админа", endpoint: "/api/auth/create-admin" },
      ]

      for (const script of scripts) {
        const response = await fetch(script.endpoint, { method: "POST" })
        const data = await response.json()
        console.log(`${script.name}:`, data)
      }

      // Re-run diagnostics
      await runDiagnostics()
    } catch (error) {
      console.error("Setup error:", error)
    } finally {
      setRunningScripts(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <span>Диагностика базы данных</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Button onClick={runDiagnostics} disabled={loading} variant="outline">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Проверить снова
          </Button>

          <Button onClick={runSetupScripts} disabled={runningScripts} className="bg-red-600 hover:bg-red-700">
            {runningScripts ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Настроить БД
          </Button>
        </div>

        <div className="space-y-3">
          {results.map((result, index) => (
            <Alert key={index} className={getStatusColor(result.status)}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{result.step}</h4>
                  </div>
                  <p className="text-sm mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer">Подробности</summary>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>

        {results.length === 0 && loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Выполняется диагностика...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
