export function getSafeImageUrl(imageUrl: string | null | undefined, fallback?: string): string {
  const defaultFallback = "/placeholder.svg?height=400&width=400"

  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return fallback || defaultFallback
  }

  return imageUrl.trim()
}

export function getProductImageUrl(product: any, fallback?: string): string {
  // Попробуем найти primary изображение
  if (product.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img: any) => img.is_primary)
    if (primaryImage?.image_url) {
      return getSafeImageUrl(primaryImage.image_url, fallback)
    }

    // Если нет primary, берем первое доступное
    const firstImage = product.images.find((img: any) => img.image_url)
    if (firstImage?.image_url) {
      return getSafeImageUrl(firstImage.image_url, fallback)
    }
  }

  // Попробуем основное изображение продукта
  if (product.image_url) {
    return getSafeImageUrl(product.image_url, fallback)
  }

  return getSafeImageUrl(null, fallback)
}

export function getProductImages(product: any): string[] {
  const images: string[] = []

  // Добавляем изображения из массива images
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      const safeUrl = getSafeImageUrl(img.image_url)
      if (safeUrl !== "/placeholder.svg?height=400&width=400") {
        images.push(safeUrl)
      }
    })
  }

  // Добавляем основное изображение если есть
  if (product.image_url) {
    const safeUrl = getSafeImageUrl(product.image_url)
    if (safeUrl !== "/placeholder.svg?height=400&width=400" && !images.includes(safeUrl)) {
      images.push(safeUrl)
    }
  }

  // Если нет изображений, добавляем placeholder
  if (images.length === 0) {
    images.push("/placeholder.svg?height=400&width=400")
  }

  return images
}
