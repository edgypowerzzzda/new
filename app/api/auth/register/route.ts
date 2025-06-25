import { type NextRequest, NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected. Please configure DATABASE_URL." }, { status: 500 })
    }

    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("🔍 Attempting registration for:", email)

    // Check if user already exists in users table
    const existingUser = await safeSQL`
      SELECT id FROM users WHERE email = ${email}
    `

    // Check if user already exists in administrators table
    const existingAdmin = await safeSQL`
      SELECT id FROM administrators WHERE email = ${email}
    `

    console.log("📊 Existing user check:", {
      userExists: existingUser?.length > 0,
      adminExists: existingAdmin?.length > 0,
    })

    if ((existingUser && existingUser.length > 0) || (existingAdmin && existingAdmin.length > 0)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    console.log("🔐 Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Create user
    console.log("👤 Creating user...")
    const result = await safeSQL`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName})
      RETURNING id, email, first_name, last_name
    `

    console.log("✅ User creation result:", result?.length > 0 ? "Success" : "Failed")

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const newUser = result[0]

    // Create session
    await createSession(newUser.id, newUser.email, "user")

    console.log("🎉 Registration successful for:", email)

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: "user",
      },
    })
  } catch (error) {
    console.error("💥 Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
