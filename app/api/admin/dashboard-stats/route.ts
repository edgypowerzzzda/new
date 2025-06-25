import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function GET() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({
        connected: false,
        productsCount: 0,
        usersCount: 0,
        adminsCount: 0,
        ordersCount: 0,
      })
    }

    // Получаем статистику из базы данных
    const productsResult = await safeSQL`SELECT COUNT(*) as count FROM products WHERE is_active = true`
    const usersResult = await safeSQL`SELECT COUNT(*) as count FROM users`
    const adminsResult = await safeSQL`SELECT COUNT(*) as count FROM administrators`

    return NextResponse.json({
      connected: true,
      productsCount: Number.parseInt(productsResult[0]?.count || "0"),
      usersCount: Number.parseInt(usersResult[0]?.count || "0"),
      adminsCount: Number.parseInt(adminsResult[0]?.count || "0"),
      ordersCount: 0, // Пока нет таблицы заказов
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({
      connected: false,
      productsCount: 0,
      usersCount: 0,
      adminsCount: 0,
      ordersCount: 0,
    })
  }
}
