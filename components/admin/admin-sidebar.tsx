"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tags, Building2, Users, Settings, BarChart3, ShoppingCart } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Товары", href: "/admin/products", icon: Package },
  { name: "Категории", href: "/admin/categories", icon: Tags },
  { name: "Бренды", href: "/admin/brands", icon: Building2 },
  { name: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  { name: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <span className="text-lg font-bold">🎵</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-red-600">MusicStore</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700 border-r-2 border-red-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? "text-red-600" : "text-gray-400 group-hover:text-red-500"}`}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
