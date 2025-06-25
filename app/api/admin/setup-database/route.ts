import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    console.log("🔧 Starting complete database setup...")

    // Проверяем подключение
    if (!isDatabaseConnected()) {
      console.error("❌ Database not connected")
      return NextResponse.json(
        {
          error: "Database not connected. Please check DATABASE_URL environment variable.",
        },
        { status: 500 },
      )
    }

    console.log("✅ Database connection confirmed")

    // 1. Создаем таблицы
    console.log("📋 Creating tables...")

    await safeSQL`
      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        logo_url VARCHAR(500),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS administrators (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'admin',
        permissions TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        parent_id INTEGER REFERENCES categories(id),
        description TEXT,
        image_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        old_price DECIMAL(10,2),
        sku VARCHAR(100) UNIQUE,
        stock_quantity INTEGER DEFAULT 0,
        brand_id INTEGER REFERENCES brands(id),
        category_id INTEGER REFERENCES categories(id),
        specifications JSONB,
        is_featured BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        is_recommended BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `

    await safeSQL`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `

    console.log("✅ Tables created successfully")

    // 2. Добавляем начальные данные
    console.log("🌱 Seeding initial data...")

    await safeSQL`
      INSERT INTO brands (name, description, website) VALUES
      ('Yamaha', 'Японский производитель музыкальных инструментов', 'https://yamaha.com'),
      ('Shure', 'Американская компания, специализирующаяся на аудиооборудовании', 'https://shure.com'),
      ('Casio', 'Японская компания, производитель электронных инструментов', 'https://casio.com'),
      ('Korg', 'Японский производитель электронных музыкальных инструментов', 'https://korg.com'),
      ('Fender', 'Американский производитель гитар и усилителей', 'https://fender.com'),
      ('Gibson', 'Американский производитель гитар', 'https://gibson.com')
      ON CONFLICT (name) DO NOTHING
    `

    await safeSQL`
      INSERT INTO categories (name, slug, parent_id, description) VALUES
      ('Гитары', 'guitars', NULL, 'Акустические и электрогитары'),
      ('Клавишные инструменты', 'keyboards', NULL, 'Пианино, синтезаторы, MIDI-клавиатуры'),
      ('Ударные', 'drums', NULL, 'Барабанные установки и перкуссия'),
      ('Микрофоны', 'microphones', NULL, 'Студийные и концертные микрофоны'),
      ('DJ оборудование', 'dj-equipment', NULL, 'Микшеры, проигрыватели, контроллеры'),
      ('Коммутация', 'cables-connectors', NULL, 'Кабели, разъемы, адаптеры')
      ON CONFLICT (slug) DO NOTHING
    `

    // Добавляем подкатегории
    const guitarsCategoryResult = await safeSQL`SELECT id FROM categories WHERE slug = 'guitars'`
    if (guitarsCategoryResult && guitarsCategoryResult.length > 0) {
      const guitarsId = guitarsCategoryResult[0].id
      await safeSQL`
        INSERT INTO categories (name, slug, parent_id, description) VALUES
        ('Акустические гитары', 'acoustic-guitars', ${guitarsId}, 'Классические и эстрадные акустические гитары'),
        ('Электрогитары', 'electric-guitars', ${guitarsId}, 'Электрогитары различных типов'),
        ('Усилители для гитары', 'guitar-amplifiers', ${guitarsId}, 'Ламповые и транзисторные усилители')
        ON CONFLICT (slug) DO NOTHING
      `
    }

    console.log("✅ Categories seeded successfully")

    // 3. Создаем администратора
    console.log("👨‍💼 Creating admin user...")

    const adminPassword = await hashPassword("admin123")
    const userPassword = await hashPassword("user123")

    // Удаляем старых пользователей если есть
    await safeSQL`DELETE FROM administrators WHERE email = 'admin@musicstore.com'`
    await safeSQL`DELETE FROM users WHERE email = 'user@test.com'`

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

    console.log("✅ Users created successfully")

    // 4. Добавляем примеры товаров
    console.log("🛍️ Adding sample products...")

    const yamahaResult = await safeSQL`SELECT id FROM brands WHERE name = 'Yamaha'`
    const fenderResult = await safeSQL`SELECT id FROM brands WHERE name = 'Fender'`
    const shureResult = await safeSQL`SELECT id FROM brands WHERE name = 'Shure'`
    const casioResult = await safeSQL`SELECT id FROM brands WHERE name = 'Casio'`

    const acousticResult = await safeSQL`SELECT id FROM categories WHERE slug = 'acoustic-guitars'`
    const electricResult = await safeSQL`SELECT id FROM categories WHERE slug = 'electric-guitars'`
    const microphonesResult = await safeSQL`SELECT id FROM categories WHERE slug = 'microphones'`
    const keyboardsResult = await safeSQL`SELECT id FROM categories WHERE slug = 'keyboards'`

    if (yamahaResult?.length > 0 && acousticResult?.length > 0) {
      await safeSQL`
        INSERT INTO products (name, slug, description, price, brand_id, category_id, sku, stock_quantity, is_featured, is_new) VALUES
        (
          'Yamaha FG830 Акустическая гитара',
          'yamaha-fg830-acoustic-guitar',
          'Превосходная акустическая гитара с верхней декой из массива ели и корпусом из розового дерева',
          25000.00,
          ${yamahaResult[0].id},
          ${acousticResult[0].id},
          'YAM-FG830',
          15,
          true,
          false
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    if (fenderResult?.length > 0 && electricResult?.length > 0) {
      await safeSQL`
        INSERT INTO products (name, slug, description, price, brand_id, category_id, sku, stock_quantity, is_featured, is_new) VALUES
        (
          'Fender Player Stratocaster',
          'fender-player-stratocaster',
          'Классическая электрогитара с тремя звукоснимателями и кленовым грифом',
          65000.00,
          ${fenderResult[0].id},
          ${electricResult[0].id},
          'FEN-PLSTR',
          8,
          true,
          true
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    if (shureResult?.length > 0 && microphonesResult?.length > 0) {
      await safeSQL`
        INSERT INTO products (name, slug, description, price, brand_id, category_id, sku, stock_quantity, is_featured, is_new) VALUES
        (
          'Shure SM58 Динамический микрофон',
          'shure-sm58-dynamic-microphone',
          'Легендарный вокальный микрофон для живых выступлений',
          12000.00,
          ${shureResult[0].id},
          ${microphonesResult[0].id},
          'SHU-SM58',
          25,
          false,
          false
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    if (casioResult?.length > 0 && keyboardsResult?.length > 0) {
      await safeSQL`
        INSERT INTO products (name, slug, description, price, brand_id, category_id, sku, stock_quantity, is_featured, is_new) VALUES
        (
          'Casio CT-X700 Синтезатор',
          'casio-ctx700-synthesizer',
          'Портативный синтезатор с 61 клавишей и множеством встроенных звуков',
          18000.00,
          ${casioResult[0].id},
          ${keyboardsResult[0].id},
          'CAS-CTX700',
          12,
          false,
          true
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    console.log("✅ Sample products added successfully")

    // 5. Проверяем результат
    const finalCheck = await safeSQL`
      SELECT 
        (SELECT COUNT(*) FROM brands) as brands_count,
        (SELECT COUNT(*) FROM categories) as categories_count,
        (SELECT COUNT(*) FROM products) as products_count,
        (SELECT COUNT(*) FROM administrators) as admins_count,
        (SELECT COUNT(*) FROM users) as users_count
    `

    const stats = finalCheck[0]

    console.log("🎉 Database setup completed successfully!")
    console.log("📊 Final stats:", stats)

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      stats: {
        brands: Number.parseInt(stats.brands_count),
        categories: Number.parseInt(stats.categories_count),
        products: Number.parseInt(stats.products_count),
        admins: Number.parseInt(stats.admins_count),
        users: Number.parseInt(stats.users_count),
      },
      credentials: {
        admin: {
          email: "admin@musicstore.com",
          password: "admin123",
        },
        user: {
          email: "user@test.com",
          password: "user123",
        },
      },
    })
  } catch (error) {
    console.error("💥 Database setup failed:", error)
    return NextResponse.json(
      {
        error: "Database setup failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
