import { NextResponse } from "next/server"
import { getLocalProducts } from "@/lib/local-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "name"
    const isNew = searchParams.get("isNew") === "true"
    const isFeatured = searchParams.get("isFeatured") === "true"
    const inStock = searchParams.get("inStock") === "true"

    let products = getLocalProducts().filter((product) => product.is_active)

    // Фильтрация
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand?.name.toLowerCase().includes(searchLower) ||
          product.category?.name.toLowerCase().includes(searchLower),
      )
    }

    if (category) {
      products = products.filter((product) => product.category_id === Number.parseInt(category))
    }

    if (brand) {
      products = products.filter((product) => product.brand_id === Number.parseInt(brand))
    }

    if (minPrice) {
      products = products.filter((product) => product.price >= Number.parseInt(minPrice))
    }

    if (maxPrice) {
      products = products.filter((product) => product.price <= Number.parseInt(maxPrice))
    }

    if (isNew) {
      products = products.filter((product) => product.is_new)
    }

    if (isFeatured) {
      products = products.filter((product) => product.is_featured)
    }

    if (inStock) {
      products = products.filter((product) => product.stock_quantity > 0)
    }

    // Сортировка
    products.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "popular":
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
        default:
          return 0
      }
    })

    // Пагинация
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedProducts = products.slice(offset, offset + limit)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
