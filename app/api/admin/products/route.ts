import { NextResponse } from "next/server"
import { getLocalProducts, saveLocalProduct } from "@/lib/local-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const allProducts = getLocalProducts()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const products = allProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: allProducts.length,
        totalPages: Math.ceil(allProducts.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      name,
      slug,
      description,
      short_description,
      price,
      old_price,
      sku,
      stock_quantity,
      brand_id,
      category_id,
      is_featured,
      is_new,
      is_recommended,
      is_active,
      images,
    } = data

    // Получаем бренд и категорию для связи
    const brands = [
      { id: 1, name: "Yamaha" },
      { id: 2, name: "Fender" },
      { id: 3, name: "Shure" },
      { id: 4, name: "Casio" },
      { id: 5, name: "Korg" },
      { id: 6, name: "Gibson" },
    ]

    const categories = [
      { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
      { id: 2, name: "Электрогитары", slug: "electric-guitars" },
      { id: 3, name: "Микрофоны", slug: "microphones" },
      { id: 4, name: "Клавишные", slug: "keyboards" },
      { id: 5, name: "Ударные", slug: "drums" },
      { id: 6, name: "DJ оборудование", slug: "dj-equipment" },
    ]

    const brand = brands.find((b) => b.id === brand_id)
    const category = categories.find((c) => c.id === category_id)

    const newProduct = saveLocalProduct({
      name,
      slug,
      description,
      short_description,
      price: Number(price),
      old_price: old_price ? Number(old_price) : undefined,
      sku,
      stock_quantity: Number(stock_quantity),
      brand_id,
      category_id,
      is_featured: Boolean(is_featured),
      is_new: Boolean(is_new),
      is_recommended: Boolean(is_recommended),
      is_active: Boolean(is_active),
      images: images || [],
      brand,
      category,
    })

    return NextResponse.json({ success: true, id: newProduct.id, product: newProduct })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
