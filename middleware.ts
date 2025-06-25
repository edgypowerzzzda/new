import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Временно отключаем проверку для быстрого доступа
  // Просто пропускаем все запросы к админке
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
