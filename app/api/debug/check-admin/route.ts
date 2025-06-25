import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function GET() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({
        connected: false,
        adminExists: false,
        error: "Database not connected",
      })
    }

    const admins = await safeSQL`
      SELECT id, email, first_name, last_name, role 
      FROM administrators 
      LIMIT 5
    `

    const users = await safeSQL`
      SELECT id, email, first_name, last_name 
      FROM users 
      LIMIT 5
    `

    return NextResponse.json({
      connected: true,
      adminExists: admins && admins.length > 0,
      adminsCount: admins?.length || 0,
      usersCount: users?.length || 0,
      admins:
        admins?.map((admin: any) => ({
          id: admin.id,
          email: admin.email,
          name: `${admin.first_name} ${admin.last_name}`,
          role: admin.role,
        })) || [],
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      adminExists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
