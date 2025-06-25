import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "MusicStore - Музыкальные инструменты",
  description:
    "Интернет-магазин музыкальных инструментов. Гитары, клавишные, ударные, микрофоны и аудиооборудование от ведущих брендов.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <footer className="bg-red-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">MusicStore</h3>
                  <p className="text-red-200">Ваш надежный партнер в мире музыки</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Каталог</h4>
                  <ul className="space-y-2 text-red-200">
                    <li>
                      <a href="/catalog/guitars" className="hover:text-white">
                        Гитары
                      </a>
                    </li>
                    <li>
                      <a href="/catalog/keyboards" className="hover:text-white">
                        Клавишные
                      </a>
                    </li>
                    <li>
                      <a href="/catalog/drums" className="hover:text-white">
                        Ударные
                      </a>
                    </li>
                    <li>
                      <a href="/catalog/microphones" className="hover:text-white">
                        Микрофоны
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Информация</h4>
                  <ul className="space-y-2 text-red-200">
                    <li>
                      <a href="/delivery" className="hover:text-white">
                        Доставка
                      </a>
                    </li>
                    <li>
                      <a href="/payment" className="hover:text-white">
                        Оплата
                      </a>
                    </li>
                    <li>
                      <a href="/warranty" className="hover:text-white">
                        Гарантия
                      </a>
                    </li>
                    <li>
                      <a href="/contacts" className="hover:text-white">
                        Контакты
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Контакты</h4>
                  <div className="space-y-2 text-red-200">
                    <p>📞 8 (800) 555-0123</p>
                    <p>📧 info@musicstore.ru</p>
                    <p>📍 Москва, ул. Музыкальная, 1</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-red-800 mt-8 pt-8 text-center text-red-200">
                <p>&copy; 2024 MusicStore. Все права защищены.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
