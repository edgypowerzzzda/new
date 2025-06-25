"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { getCartCount, getLocalCategories, type LocalCategory } from "@/lib/local-storage"
import { useAuth } from "@/components/auth/auth-provider"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [categories, setCategories] = useState<LocalCategory[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    // Загружаем категории
    setCategories(getLocalCategories())

    // Загружаем количество товаров в корзине
    setCartCount(getCartCount())

    // Слушаем обновления корзины
    const handleCartUpdate = () => {
      setCartCount(getCartCount())
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Верхняя строка */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">📞 8 (800) 555-0123</span>
              <span className="text-gray-600">📧 info@musicstore.ru</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/delivery" className="text-gray-600 hover:text-red-600">
                Доставка
              </Link>
              <Link href="/payment" className="text-gray-600 hover:text-red-600">
                Оплата
              </Link>
              <Link href="/contacts" className="text-gray-600 hover:text-red-600">
                Контакты
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="text-red-600 hover:text-red-700 font-medium">
                  Админ-панель
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Основная строка */}
        <div className="flex items-center justify-between py-4">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎵</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MusicStore</h1>
              <p className="text-xs text-gray-500">Музыкальные инструменты</p>
            </div>
          </Link>

          {/* Поиск */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-2 border-gray-200 focus:border-red-500"
              />
            </div>
          </form>

          {/* Действия */}
          <div className="flex items-center space-x-4">
            {/* Пользователь */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user.firstName} {user.lastName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Мои заказы</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Админ-панель</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Войти</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">Регистрация</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Избранное */}
            <Link href="/favorites">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Корзина */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Мобильное меню */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Навигация */}
        <nav className="hidden md:flex items-center py-4 border-t">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              {/* Каталог с выпадающим меню */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-red-600 text-white hover:bg-red-700 data-[state=open]:bg-red-700">
                  Каталог товаров
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-4 p-6">
                    {categories
                      .filter((cat) => cat.is_active)
                      .map((category) => (
                        <NavigationMenuLink key={category.id} asChild>
                          <Link
                            href={`/catalog?category=${category.slug}`}
                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Все товары */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/catalog"
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Все товары
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Новинки */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/new"
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Новинки
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Бренды */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/brands"
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Бренды
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Мобильный поиск */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Мобильная навигация */}
            <div className="space-y-2">
              <Link
                href="/catalog"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link
                href="/new"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Новинки
              </Link>
              <Link
                href="/brands"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Бренды
              </Link>
              <Link
                href="/favorites"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Избранное
              </Link>

              {/* Категории в мобильном меню */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Категории:</p>
                {categories
                  .filter((cat) => cat.is_active)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/catalog?category=${category.slug}`}
                      className="block py-1 pl-4 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
