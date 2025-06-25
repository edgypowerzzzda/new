import { NextResponse } from "next/server"
import { safeSQL, isDatabaseConnected } from "@/lib/db"

export async function POST() {
  try {
    if (!isDatabaseConnected()) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 })
    }

    console.log("🌱 Seeding database with initial data...")

    // Add brands
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

    // Add categories
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

    // Add subcategories
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

    // Add sample products
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

    console.log("✅ Data seeded successfully")

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("💥 Seeding error:", error)
    return NextResponse.json(
      {
        error: "Seeding failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
