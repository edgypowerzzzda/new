import { NextResponse } from "next/server"
import { saveLocalOrder, getLocalProducts } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { user_name, user_email, user_phone, items } = data

    // Получаем товары для расчета суммы
    const products = getLocalProducts()
    let total_amount = 0
    const orderItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)
      if (product) {
        const itemTotal = product.price * item.quantity
        total_amount += itemTotal
        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          quantity: item.quantity,
          price: product.price,
        })
      }
    }

    const newOrder = saveLocalOrder({
      user_name,
      user_email,
      user_phone,
      total_amount,
      status: "pending",
      items: orderItems,
    })

    return NextResponse.json({ success: true, order: newOrder })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
