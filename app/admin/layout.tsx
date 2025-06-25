"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Если это страница логина, не проверяем авторизацию
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    // Проверяем простую авторизацию через localStorage
    const adminAuth = localStorage.getItem("adminAuth")

    if (adminAuth === "true") {
      setIsAuthenticated(true)
    } else {
      // Автоматически логиним для быстрого доступа
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: 1,
          email: "admin@musicstore.com",
          firstName: "Админ",
          lastName: "Системы",
          role: "admin",
        }),
      )
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [router, pathname])

  // Показываем страницу логина
  if (pathname === "/admin/login") {
    return <div className={inter.className}>{children}</div>
  }

  // Показываем загрузку
  if (loading) {
    return (
      <div className={`${inter.className} min-h-screen flex items-center justify-center bg-gray-50`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Загрузка админ-панели...</p>
        </div>
      </div>
    )
  }

  // Показываем админ-панель
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
