import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 })
    }

    console.log("Creating users with fresh password hashes...")

    // Создаем новые хеши паролей
    const adminPasswordHash = await hashPassword("admin123")
    const userPasswordHash = await hashPassword("user123")

    console.log("Admin password hash:", adminPasswordHash)
    console.log("User password hash:", userPasswordHash)

    // Удаляем старых пользователей
    await safeSQL`DELETE FROM administrators WHERE email = 'admin@musicstore.com'`
    await safeSQL`DELETE FROM users WHERE email = 'user@test.com'`

    console.log("Deleted existing users")

    // Создаем администратора
    const adminResult = await safeSQL`
      INSERT INTO administrators (email, password_hash, first_name, last_name, role, permissions)
      VALUES ('admin@musicstore.com', ${adminPasswordHash}, 'Админ', 'Системы', 'admin', ARRAY['all'])
      RETURNING id, email
    `

    console.log("Admin creation result:", adminResult)

    // Создаем тестового пользователя
    const userResult = await safeSQL`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ('user@test.com', ${userPasswordHash}, 'Тест', 'Пользователь')
      RETURNING id, email
    `

    console.log("User creation result:", userResult)

    // Проверяем что пользователи созданы
    const checkAdmin = await safeSQL`SELECT id, email FROM administrators WHERE email = 'admin@musicstore.com'`
    const checkUser = await safeSQL`SELECT id, email FROM users WHERE email = 'user@test.com'`

    console.log("Admin check:", checkAdmin)
    console.log("User check:", checkUser)

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
      adminCreated: adminResult?.length > 0,
      userCreated: userResult?.length > 0,
      adminPasswordHash: adminPasswordHash.substring(0, 20) + "...", // Показываем только начало для безопасности
      userPasswordHash: userPasswordHash.substring(0, 20) + "...",
      verification: {
        adminExists: checkAdmin?.length > 0,
        userExists: checkUser?.length > 0,
      },
    })
  } catch (error) {
    console.error("Error creating users:", error)
    return NextResponse.json(
      {
        error: "Failed to create users",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
