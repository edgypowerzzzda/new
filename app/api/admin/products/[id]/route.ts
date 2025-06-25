import { NextResponse } from "next/server"
import { deleteLocalProduct, updateLocalProduct, getLocalProducts } from "@/lib/local-storage"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = deleteLocalProduct(id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const updatedProduct = updateLocalProduct(id, data)

    if (updatedProduct) {
      return NextResponse.json({ success: true, product: updatedProduct })
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const products = getLocalProducts()
    const product = products.find((p) => p.id === id)

    if (product) {
      return NextResponse.json({ product })
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
