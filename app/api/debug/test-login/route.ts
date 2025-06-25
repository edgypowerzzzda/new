import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 })
    }

    const { email, password } = await request.json()

    console.log("Testing login for:", email)

    // Проверяем в таблице администраторов
    const admin = await safeSQL`
      SELECT id, email, password_hash, first_name, last_name, role
      FROM administrators 
      WHERE email = ${email}
    `

    console.log("Admin found:", admin?.length > 0)

    if (admin && admin.length > 0) {
      const adminData = admin[0]
      console.log("Admin data:", {
        id: adminData.id,
        email: adminData.email,
        firstName: adminData.first_name,
        lastName: adminData.last_name,
        role: adminData.role,
        passwordHashLength: adminData.password_hash?.length,
        passwordHashStart: adminData.password_hash?.substring(0, 10),
      })

      const isValidPassword = await verifyPassword(password, adminData.password_hash)
      console.log("Password verification result:", isValidPassword)

      return NextResponse.json({
        userFound: true,
        userType: "admin",
        passwordValid: isValidPassword,
        userData: {
          id: adminData.id,
          email: adminData.email,
          firstName: adminData.first_name,
          lastName: adminData.last_name,
          role: adminData.role,
        },
      })
    }

    // Проверяем в таблице пользователей
    const user = await safeSQL`
      SELECT id, email, password_hash, first_name, last_name
      FROM users 
      WHERE email = ${email}
    `

    console.log("User found:", user?.length > 0)

    if (user && user.length > 0) {
      const userData = user[0]
      console.log("User data:", {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        passwordHashLength: userData.password_hash?.length,
        passwordHashStart: userData.password_hash?.substring(0, 10),
      })

      const isValidPassword = await verifyPassword(password, userData.password_hash)
      console.log("Password verification result:", isValidPassword)

      return NextResponse.json({
        userFound: true,
        userType: "user",
        passwordValid: isValidPassword,
        userData: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: "user",
        },
      })
    }

    return NextResponse.json({
      userFound: false,
      message: "User not found in either table",
    })
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
