import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

const demoCategories = [
  { id: 1, name: "Акустические гитары", slug: "acoustic-guitars", is_active: true, sort_order: 1 },
  { id: 2, name: "Электрогитары", slug: "electric-guitars", is_active: true, sort_order: 2 },
  { id: 3, name: "Микрофоны", slug: "microphones", is_active: true, sort_order: 3 },
  { id: 4, name: "Клавишные", slug: "keyboards", is_active: true, sort_order: 4 },
  { id: 5, name: "Ударные", slug: "drums", is_active: true, sort_order: 5 },
  { id: 6, name: "DJ оборудование", slug: "dj-equipment", is_active: true, sort_order: 6 },
]

export async function GET() {
  try {
    if (isDatabaseConnected()) {
      try {
        const categories = await safeSQL`
          SELECT * FROM categories 
          WHERE is_active = true
          ORDER BY sort_order ASC, name ASC
        `
        if (categories && categories.length > 0) {
          return NextResponse.json({ categories })
        }
      } catch (error) {
        console.log("Database query failed, using demo data:", error)
      }
    }

    return NextResponse.json({ categories: demoCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ categories: demoCategories })
  }
}
