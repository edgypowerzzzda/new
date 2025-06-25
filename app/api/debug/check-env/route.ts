import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
  }

  const availableVars = Object.entries(envVars)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({ key, value: value?.substring(0, 50) + "..." }))

  return NextResponse.json({
    hasDatabase: availableVars.length > 0,
    availableVars,
    totalVars: availableVars.length,
    recommendedVar: "DATABASE_URL",
  })
}
