import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function GET() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({
        connected: false,
        error: "Database not connected",
      })
    }

    const requiredTables = [
      "users",
      "administrators",
      "brands",
      "categories",
      "products",
      "product_images",
      "favorites",
      "cart_items",
    ]

    const existingTables = await safeSQL`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY(${requiredTables})
    `

    const tableNames = existingTables.map((row: any) => row.table_name)
    const missingTables = requiredTables.filter((table) => !tableNames.includes(table))

    return NextResponse.json({
      connected: true,
      requiredTables,
      existingTables: tableNames,
      missingTables,
      allTablesExist: missingTables.length === 0,
      tablesCount: tableNames.length,
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
