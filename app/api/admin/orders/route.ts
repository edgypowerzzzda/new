import { NextResponse } from "next/server"
import { getLocalOrders } from "@/lib/local-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const allOrders = getLocalOrders()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const orders = allOrders.slice(startIndex, endIndex)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: allOrders.length,
        totalPages: Math.ceil(allOrders.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
