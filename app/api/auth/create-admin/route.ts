import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected. Please configure DATABASE_URL." }, { status: 500 })
    }

    console.log("🔧 Creating admin and test users...")

    // Создаем новые хеши паролей
    const adminPassword = await hashPassword("admin123")
    const userPassword = await hashPassword("user123")

    console.log("🔐 Password hashes generated")

    // Удаляем старых пользователей если есть
    await safeSQL`DELETE FROM administrators WHERE email = 'admin@musicstore.com'`
    await safeSQL`DELETE FROM users WHERE email = 'user@test.com'`

    console.log("🗑️ Deleted existing users")

    // Создаем администратора
    const adminResult = await safeSQL`
      INSERT INTO administrators (email, password_hash, first_name, last_name, role, permissions)
      VALUES ('admin@musicstore.com', ${adminPassword}, 'Админ', 'Системы', 'admin', ARRAY['all'])
      RETURNING id, email
    `

    // Создаем тестового пользователя
    const userResult = await safeSQL`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ('user@test.com', ${userPassword}, 'Тест', 'Пользователь')
      RETURNING id, email
    `

    console.log("✅ Users created:", {
      admin: adminResult?.length > 0,
      user: userResult?.length > 0,
    })

    // Проверяем что пользователи созданы
    const checkAdmin = await safeSQL`SELECT id, email FROM administrators WHERE email = 'admin@musicstore.com'`
    const checkUser = await safeSQL`SELECT id, email FROM users WHERE email = 'user@test.com'`

    console.log("🔍 Verification:", {
      adminExists: checkAdmin?.length > 0,
      userExists: checkUser?.length > 0,
    })

    return NextResponse.json({
      success: true,
      message: "Admin and test user created successfully",
      adminCreated: adminResult?.length > 0,
      userCreated: userResult?.length > 0,
      verification: {
        adminExists: checkAdmin?.length > 0,
        userExists: checkUser?.length > 0,
      },
    })
  } catch (error) {
    console.error("💥 Error creating admin:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
