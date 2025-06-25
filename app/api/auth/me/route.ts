import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !isDatabaseConnected()) {
      return NextResponse.json({ user: null })
    }

    // Get user details
    let user = await safeSQL`
      SELECT id, email, first_name, last_name, 'user' as role
      FROM users 
      WHERE id = ${session.userId}
    `

    if (!user || user.length === 0) {
      user = await safeSQL`
        SELECT id, email, first_name, last_name, role
        FROM administrators 
        WHERE id = ${session.userId}
      `
    }

    if (!user || user.length === 0) {
      return NextResponse.json({ user: null })
    }

    const userData = user[0]

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ user: null })
  }
}
