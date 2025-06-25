import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

const demoBrands = [
  { id: 1, name: "Yamaha", description: "Японский производитель" },
  { id: 2, name: "Fender", description: "Американский производитель" },
  { id: 3, name: "Shure", description: "Аудиооборудование" },
  { id: 4, name: "Casio", description: "Электронные инструменты" },
  { id: 5, name: "Korg", description: "Синтезаторы" },
  { id: 6, name: "Gibson", description: "Гитары премиум класса" },
]

export async function GET() {
  try {
    if (isDatabaseConnected()) {
      try {
        const brands = await safeSQL`SELECT * FROM brands ORDER BY name ASC`
        if (brands && brands.length > 0) {
          return NextResponse.json({ brands })
        }
      } catch (error) {
        console.log("Database query failed, using demo data:", error)
      }
    }

    return NextResponse.json({ brands: demoBrands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ brands: demoBrands })
  }
}
