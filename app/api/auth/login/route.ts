import { type NextRequest, NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected. Please configure DATABASE_URL." }, { status: 500 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("🔍 Attempting login for:", email)

    // Check in administrators table first
    let user = await safeSQL`
      SELECT id, email, password_hash, first_name, last_name, role
      FROM administrators 
      WHERE email = ${email}
    `

    let userRole = "admin"

    // If not found in administrators, check users table
    if (!user || user.length === 0) {
      console.log("👤 Not found in administrators, checking users table...")
      user = await safeSQL`
        SELECT id, email, password_hash, first_name, last_name
        FROM users 
        WHERE email = ${email}
      `
      userRole = "user"
    }

    console.log("📊 User search result:", {
      found: user?.length > 0,
      userType: user?.length > 0 ? userRole : "none",
      email: email,
    })

    if (!user || user.length === 0) {
      console.log("❌ User not found in database")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userData = user[0]
    console.log("👤 User data:", {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role || userRole,
      hasPasswordHash: !!userData.password_hash,
      passwordHashLength: userData.password_hash?.length,
    })

    console.log("🔐 Verifying password...")
    const isValidPassword = await verifyPassword(password, userData.password_hash)
    console.log("✅ Password verification result:", isValidPassword)

    if (!isValidPassword) {
      console.log("❌ Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const finalRole = userData.role || userRole
    await createSession(userData.id, userData.email, finalRole)

    console.log("🎉 Login successful for:", email, "with role:", finalRole)

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: finalRole,
      },
    })
  } catch (error) {
    console.error("💥 Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
