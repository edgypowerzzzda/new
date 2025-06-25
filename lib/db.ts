import { neon } from "@neondatabase/serverless"

// Try multiple possible environment variable names
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_URL_NO_SSL

let sql: any = null
let isConnected = false

if (databaseUrl) {
  try {
    sql = neon(databaseUrl, {
      disableWarningInBrowsers: true,
    })
    isConnected = true
    console.log("✅ Database connection initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize database connection:", error)
    isConnected = false
  }
} else {
  console.warn("⚠️ No database URL found. Running in demo mode with mock data.")
  isConnected = false
}

// Export a safe SQL function that handles missing connections
export const safeSQL = async (query: any, ...params: any[]) => {
  if (!sql || !isConnected) {
    console.warn("📊 Database not connected. Returning empty result.")
    return []
  }

  try {
    const result = await sql(query, ...params)
    return result
  } catch (error) {
    console.error("💥 Database query failed:", error)
    return []
  }
}

// Export the raw sql for cases where we know it's safe
export { sql }

// Database connection status
export const isDatabaseConnected = () => isConnected

// Типы для базы данных
export interface Brand {
  id: number
  name: string
  description?: string
  logo_url?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  parent_id?: number
  description?: string
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  short_description?: string
  price: number
  old_price?: number
  sku?: string
  stock_quantity: number
  brand_id?: number
  category_id?: number
  specifications?: any
  is_featured: boolean
  is_new: boolean
  is_recommended: boolean
  is_active: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
  brand?: Brand
  category?: Category
  images?: ProductImage[]
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Administrator {
  id: number
  email: string
  first_name?: string
  last_name?: string
  role: string
  permissions: string[]
  created_at: string
  updated_at: string
}
