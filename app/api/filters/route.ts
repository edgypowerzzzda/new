import { NextResponse } from "next/server"
import { getLocalProducts, getLocalBrands, getLocalCategories } from "@/lib/local-storage"

export async function GET() {
  try {
    const products = getLocalProducts().filter((product) => product.is_active)
    const brands = getLocalBrands().filter((brand) => brand.is_active)
    const categories = getLocalCategories().filter((category) => category.is_active)

    // Подсчет товаров по брендам
    const brandsWithCount = brands
      .map((brand) => ({
        ...brand,
        productCount: products.filter((product) => product.brand_id === brand.id).length,
      }))
      .filter((brand) => brand.productCount > 0)

    // Подсчет товаров по категориям
    const categoriesWithCount = categories
      .map((category) => ({
        ...category,
        productCount: products.filter((product) => product.category_id === category.id).length,
      }))
      .filter((category) => category.productCount > 0)

    // Диапазон цен
    const prices = products.map((product) => product.price)
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }

    return NextResponse.json({
      brands: brandsWithCount,
      categories: categoriesWithCount,
      priceRange,
      totalProducts: products.length,
    })
  } catch (error) {
    console.error("Error fetching filters:", error)
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 })
  }
}
