import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function GET() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json(
        {
          status: "warning",
          message: "Database not configured. Using demo mode.",
          connected: false,
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      )
    }

    console.log("🔍 Checking database health...")

    // Test basic connection
    const result = await safeSQL`SELECT 1 as test`

    if (!result || result.length === 0) {
      throw new Error("Database query returned no results")
    }

    // Check if tables exist
    const tablesCheck = await safeSQL`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'administrators', 'products', 'brands', 'categories')
    `

    const existingTables = tablesCheck.map((row: any) => row.table_name)

    console.log("📊 Database health check:", {
      connected: true,
      tablesFound: existingTables,
      tablesCount: existingTables.length,
    })

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      connected: true,
      tables: existingTables,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
