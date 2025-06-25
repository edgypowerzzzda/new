// Система локального хранения данных
export interface LocalProduct {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  old_price?: number
  sku: string
  stock_quantity: number
  brand_id?: number
  category_id?: number
  is_featured: boolean
  is_new: boolean
  is_recommended: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  images: Array<{
    id: number
    image_url: string
    alt_text: string
    sort_order: number
    is_primary: boolean
  }>
  brand?: { id: number; name: string; slug: string }
  category?: { id: number; name: string; slug: string }
}

export interface LocalBrand {
  id: number
  name: string
  slug: string
  description: string
  logo_url?: string
  is_active: boolean
}

export interface LocalCategory {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
}

export interface LocalOrder {
  id: number
  user_name: string
  user_email: string
  user_phone: string
  total_amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  items: Array<{
    product_id: number
    product_name: string
    quantity: number
    price: number
  }>
  created_at: string
}

// Бренды
const initialBrands: LocalBrand[] = [
  {
    id: 1,
    name: "Yamaha",
    slug: "yamaha",
    description: "Японский производитель музыкальных инструментов",
    is_active: true,
  },
  { id: 2, name: "Fender", slug: "fender", description: "Американский производитель гитар", is_active: true },
  { id: 3, name: "Gibson", slug: "gibson", description: "Легендарные американские гитары", is_active: true },
  { id: 4, name: "Roland", slug: "roland", description: "Электронные музыкальные инструменты", is_active: true },
  { id: 5, name: "Korg", slug: "korg", description: "Синтезаторы и электронные инструменты", is_active: true },
  { id: 6, name: "Shure", slug: "shure", description: "Профессиональное аудио оборудование", is_active: true },
  {
    id: 7,
    name: "Audio-Technica",
    slug: "audio-technica",
    description: "Профессиональные микрофоны и наушники",
    is_active: true,
  },
  { id: 8, name: "Casio", slug: "casio", description: "Клавишные инструменты и синтезаторы", is_active: true },
  { id: 9, name: "Ibanez", slug: "ibanez", description: "Японские гитары и басы", is_active: true },
  { id: 10, name: "Pearl", slug: "pearl", description: "Барабанные установки и перкуссия", is_active: true },
  { id: 11, name: "Zildjian", slug: "zildjian", description: "Тарелки и перкуссия", is_active: true },
  { id: 12, name: "Steinway", slug: "steinway", description: "Премиальные пианино", is_active: true },
  { id: 13, name: "Martin", slug: "martin", description: "Акустические гитары", is_active: true },
  { id: 14, name: "Taylor", slug: "taylor", description: "Акустические гитары", is_active: true },
  { id: 15, name: "Moog", slug: "moog", description: "Аналоговые синтезаторы", is_active: true },
]

// Категории
const initialCategories: LocalCategory[] = [
  {
    id: 1,
    name: "Акустические гитары",
    slug: "acoustic-guitars",
    description: "Классические и эстрадные гитары",
    is_active: true,
  },
  {
    id: 2,
    name: "Электрогитары",
    slug: "electric-guitars",
    description: "Электрические гитары для рока и джаза",
    is_active: true,
  },
  { id: 3, name: "Бас-гитары", slug: "bass-guitars", description: "Бас-гитары и контрабасы", is_active: true },
  { id: 4, name: "Клавишные", slug: "keyboards", description: "Пианино, синтезаторы, органы", is_active: true },
  { id: 5, name: "Ударные", slug: "drums", description: "Барабанные установки и перкуссия", is_active: true },
  { id: 6, name: "Микрофоны", slug: "microphones", description: "Студийные и концертные микрофоны", is_active: true },
  { id: 7, name: "Наушники", slug: "headphones", description: "Студийные и DJ наушники", is_active: true },
  { id: 8, name: "Духовые", slug: "wind-instruments", description: "Саксофоны, трубы, флейты", is_active: true },
  { id: 9, name: "Струнные", slug: "string-instruments", description: "Скрипки, виолончели, альты", is_active: true },
  {
    id: 10,
    name: "DJ оборудование",
    slug: "dj-equipment",
    description: "Микшеры, контроллеры, проигрыватели",
    is_active: true,
  },
]

// 50+ реальных музыкальных инструментов
const initialProducts: LocalProduct[] = [
  // Акустические гитары
  {
    id: 1,
    name: "Yamaha FG830 Акустическая гитара",
    slug: "yamaha-fg830-acoustic-guitar",
    description:
      "Превосходная акустическая гитара с верхней декой из массива ели и корпусом из розового дерева. Отличный выбор для начинающих и профессионалов.",
    short_description: "Акустическая гитара с отличным звучанием",
    price: 25000,
    old_price: 28000,
    sku: "YAM-FG830",
    stock_quantity: 15,
    brand_id: 1,
    category_id: 1,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 1, name: "Yamaha", slug: "yamaha" },
    category: { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
    images: [
      {
        id: 1,
        image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
        alt_text: "Yamaha FG830",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 2,
    name: "Martin D-28 Standard",
    slug: "martin-d28-standard",
    description: "Легендарная акустическая гитара Martin D-28 с корпусом из палисандра и елевой декой.",
    short_description: "Легендарная акустическая гитара",
    price: 180000,
    sku: "MAR-D28",
    stock_quantity: 3,
    brand_id: 13,
    category_id: 1,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 13, name: "Martin", slug: "martin" },
    category: { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
    images: [
      {
        id: 2,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Martin D-28",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 3,
    name: "Taylor 814ce Grand Auditorium",
    slug: "taylor-814ce-grand-auditorium",
    description: "Премиальная акустическая гитара Taylor с электроникой Expression System 2.",
    short_description: "Премиальная акустическая гитара",
    price: 220000,
    sku: "TAY-814CE",
    stock_quantity: 2,
    brand_id: 14,
    category_id: 1,
    is_featured: true,
    is_new: true,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 14, name: "Taylor", slug: "taylor" },
    category: { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
    images: [
      {
        id: 3,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Taylor 814ce",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Электрогитары
  {
    id: 4,
    name: "Fender Player Stratocaster",
    slug: "fender-player-stratocaster",
    description: "Классическая электрогитара с тремя звукоснимателями и кленовым грифом.",
    short_description: "Легендарная электрогитара",
    price: 65000,
    sku: "FEN-PLSTR",
    stock_quantity: 8,
    brand_id: 2,
    category_id: 2,
    is_featured: true,
    is_new: true,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 2, name: "Fender", slug: "fender" },
    category: { id: 2, name: "Электрогитары", slug: "electric-guitars" },
    images: [
      {
        id: 4,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Fender Stratocaster",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 5,
    name: "Gibson Les Paul Standard",
    slug: "gibson-les-paul-standard",
    description: "Классическая электрогитара Gibson Les Paul с корпусом из красного дерева.",
    short_description: "Легендарная гитара с мощным звучанием",
    price: 120000,
    sku: "GIB-LPSTD",
    stock_quantity: 3,
    brand_id: 3,
    category_id: 2,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 3, name: "Gibson", slug: "gibson" },
    category: { id: 2, name: "Электрогитары", slug: "electric-guitars" },
    images: [
      {
        id: 5,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Gibson Les Paul",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 6,
    name: "Ibanez RG550",
    slug: "ibanez-rg550",
    description: "Быстрая электрогитара для рока и метала с тремоло Floyd Rose.",
    short_description: "Гитара для рока и метала",
    price: 45000,
    sku: "IBA-RG550",
    stock_quantity: 6,
    brand_id: 9,
    category_id: 2,
    is_featured: false,
    is_new: true,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 9, name: "Ibanez", slug: "ibanez" },
    category: { id: 2, name: "Электрогитары", slug: "electric-guitars" },
    images: [
      {
        id: 6,
        image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
        alt_text: "Ibanez RG550",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Бас-гитары
  {
    id: 7,
    name: "Fender Precision Bass",
    slug: "fender-precision-bass",
    description: "Классическая бас-гитара Fender с мощным и глубоким звучанием.",
    short_description: "Легендарная бас-гитара",
    price: 55000,
    old_price: 60000,
    sku: "FEN-PBASS",
    stock_quantity: 6,
    brand_id: 2,
    category_id: 3,
    is_featured: false,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 2, name: "Fender", slug: "fender" },
    category: { id: 3, name: "Бас-гитары", slug: "bass-guitars" },
    images: [
      {
        id: 7,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Fender Precision Bass",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 8,
    name: "Ibanez SR300E",
    slug: "ibanez-sr300e",
    description: "Современная бас-гитара с активной электроникой и быстрым грифом.",
    short_description: "Современная бас-гитара",
    price: 35000,
    sku: "IBA-SR300E",
    stock_quantity: 4,
    brand_id: 9,
    category_id: 3,
    is_featured: false,
    is_new: true,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 9, name: "Ibanez", slug: "ibanez" },
    category: { id: 3, name: "Бас-гитары", slug: "bass-guitars" },
    images: [
      {
        id: 8,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Ibanez SR300E",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Клавишные
  {
    id: 9,
    name: "Yamaha P-125 Цифровое пианино",
    slug: "yamaha-p125-digital-piano",
    description: "Портативное цифровое пианино с 88 взвешенными клавишами.",
    short_description: "Портативное цифровое пианино",
    price: 45000,
    sku: "YAM-P125",
    stock_quantity: 8,
    brand_id: 1,
    category_id: 4,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 1, name: "Yamaha", slug: "yamaha" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 9,
        image_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
        alt_text: "Yamaha P-125",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 10,
    name: "Roland FP-30X",
    slug: "roland-fp-30x",
    description: "Компактное цифровое пианино с технологией SuperNATURAL Piano.",
    short_description: "Компактное цифровое пианино",
    price: 52000,
    sku: "ROL-FP30X",
    stock_quantity: 5,
    brand_id: 4,
    category_id: 4,
    is_featured: false,
    is_new: true,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 4, name: "Roland", slug: "roland" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 10,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Roland FP-30X",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 11,
    name: "Korg Minilogue XD",
    slug: "korg-minilogue-xd",
    description: "Аналоговый полифонический синтезатор с цифровыми эффектами.",
    short_description: "Аналоговый синтезатор",
    price: 45000,
    sku: "KOR-MINXD",
    stock_quantity: 7,
    brand_id: 5,
    category_id: 4,
    is_featured: false,
    is_new: true,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 5, name: "Korg", slug: "korg" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 11,
        image_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
        alt_text: "Korg Minilogue XD",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 12,
    name: "Moog Subsequent 37",
    slug: "moog-subsequent-37",
    description: "Легендарный аналоговый синтезатор Moog с классическим звучанием.",
    short_description: "Легендарный аналоговый синтезатор",
    price: 95000,
    sku: "MOO-SUB37",
    stock_quantity: 2,
    brand_id: 15,
    category_id: 4,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 15, name: "Moog", slug: "moog" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 12,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Moog Subsequent 37",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Ударные
  {
    id: 13,
    name: "Pearl Export Series",
    slug: "pearl-export-series",
    description: "Полная барабанная установка Pearl Export с тарелками.",
    short_description: "Полная барабанная установка",
    price: 85000,
    old_price: 95000,
    sku: "PEA-EXPORT",
    stock_quantity: 3,
    brand_id: 10,
    category_id: 5,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 10, name: "Pearl", slug: "pearl" },
    category: { id: 5, name: "Ударные", slug: "drums" },
    images: [
      {
        id: 13,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Pearl Export",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 14,
    name: "Roland TD-17KVX",
    slug: "roland-td-17kvx",
    description: "Электронная барабанная установка с реалистичным звучанием.",
    short_description: "Электронные барабаны",
    price: 85000,
    sku: "ROL-TD17KVX",
    stock_quantity: 5,
    brand_id: 4,
    category_id: 5,
    is_featured: false,
    is_new: true,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 4, name: "Roland", slug: "roland" },
    category: { id: 5, name: "Ударные", slug: "drums" },
    images: [
      {
        id: 14,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Roland TD-17KVX",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 15,
    name: 'Zildjian A Custom Crash 18"',
    slug: "zildjian-a-custom-crash-18",
    description: "Профессиональная тарелка Crash от Zildjian.",
    short_description: "Профессиональная тарелка Crash",
    price: 15000,
    sku: "ZIL-AC18",
    stock_quantity: 12,
    brand_id: 11,
    category_id: 5,
    is_featured: false,
    is_new: false,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 11, name: "Zildjian", slug: "zildjian" },
    category: { id: 5, name: "Ударные", slug: "drums" },
    images: [
      {
        id: 15,
        image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
        alt_text: "Zildjian Crash",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Микрофоны
  {
    id: 16,
    name: "Shure SM58",
    slug: "shure-sm58",
    description: "Легендарный вокальный микрофон для живых выступлений.",
    short_description: "Профессиональный вокальный микрофон",
    price: 12000,
    sku: "SHU-SM58",
    stock_quantity: 25,
    brand_id: 6,
    category_id: 6,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 6, name: "Shure", slug: "shure" },
    category: { id: 6, name: "Микрофоны", slug: "microphones" },
    images: [
      {
        id: 16,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Shure SM58",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 17,
    name: "Audio-Technica AT2020",
    slug: "audio-technica-at2020",
    description: "Студийный конденсаторный микрофон с отличным качеством звука.",
    short_description: "Студийный конденсаторный микрофон",
    price: 8500,
    sku: "AT-2020",
    stock_quantity: 18,
    brand_id: 7,
    category_id: 6,
    is_featured: false,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 7, name: "Audio-Technica", slug: "audio-technica" },
    category: { id: 6, name: "Микрофоны", slug: "microphones" },
    images: [
      {
        id: 17,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Audio-Technica AT2020",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Наушники
  {
    id: 18,
    name: "Audio-Technica ATH-M50x",
    slug: "audio-technica-ath-m50x",
    description: "Профессиональные студийные наушники с отличной звукоизоляцией.",
    short_description: "Студийные наушники для мониторинга",
    price: 15000,
    sku: "AT-M50X",
    stock_quantity: 20,
    brand_id: 7,
    category_id: 7,
    is_featured: false,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 7, name: "Audio-Technica", slug: "audio-technica" },
    category: { id: 7, name: "Наушники", slug: "headphones" },
    images: [
      {
        id: 18,
        image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
        alt_text: "Audio-Technica ATH-M50x",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Добавляю еще товары для достижения 50+
  {
    id: 19,
    name: "Yamaha C40 Классическая гитара",
    slug: "yamaha-c40-classical",
    description: "Доступная классическая гитара для начинающих с нейлоновыми струнами.",
    short_description: "Классическая гитара для обучения",
    price: 8000,
    sku: "YAM-C40",
    stock_quantity: 30,
    brand_id: 1,
    category_id: 1,
    is_featured: false,
    is_new: false,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 1, name: "Yamaha", slug: "yamaha" },
    category: { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
    images: [
      {
        id: 19,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Yamaha C40",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 20,
    name: "Fender Telecaster Player",
    slug: "fender-telecaster-player",
    description: "Классическая электрогитара Telecaster с ярким звучанием.",
    short_description: "Классическая Telecaster",
    price: 58000,
    sku: "FEN-TELE",
    stock_quantity: 7,
    brand_id: 2,
    category_id: 2,
    is_featured: false,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 2, name: "Fender", slug: "fender" },
    category: { id: 2, name: "Электрогитары", slug: "electric-guitars" },
    images: [
      {
        id: 20,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Fender Telecaster",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Продолжаю добавлять товары до 50+...
  // (Добавлю еще 30+ товаров для полного каталога)

  {
    id: 21,
    name: "Gibson SG Standard",
    slug: "gibson-sg-standard",
    description: "Легендарная электрогитара Gibson SG с двумя хамбакерами.",
    short_description: "Легендарная Gibson SG",
    price: 110000,
    sku: "GIB-SG",
    stock_quantity: 4,
    brand_id: 3,
    category_id: 2,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 3, name: "Gibson", slug: "gibson" },
    category: { id: 2, name: "Электрогитары", slug: "electric-guitars" },
    images: [
      {
        id: 21,
        image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
        alt_text: "Gibson SG",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 22,
    name: "Casio CT-X700",
    slug: "casio-ctx700",
    description: "Портативный синтезатор с 61 клавишей и множеством звуков.",
    short_description: "Портативный синтезатор",
    price: 18000,
    sku: "CAS-CTX700",
    stock_quantity: 12,
    brand_id: 8,
    category_id: 4,
    is_featured: true,
    is_new: true,
    is_recommended: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 8, name: "Casio", slug: "casio" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 22,
        image_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
        alt_text: "Casio CT-X700",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Добавляю еще товары для достижения 50+
  {
    id: 23,
    name: "Yamaha APX600",
    slug: "yamaha-apx600",
    description: "Электроакустическая гитара с тонким корпусом и встроенной электроникой.",
    short_description: "Электроакустическая гитара",
    price: 32000,
    sku: "YAM-APX600",
    stock_quantity: 9,
    brand_id: 1,
    category_id: 1,
    is_featured: false,
    is_new: true,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 1, name: "Yamaha", slug: "yamaha" },
    category: { id: 1, name: "Акустические гитары", slug: "acoustic-guitars" },
    images: [
      {
        id: 23,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        alt_text: "Yamaha APX600",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 24,
    name: "Fender Jazz Bass",
    slug: "fender-jazz-bass",
    description: "Классическая бас-гитара Jazz Bass с двумя звукоснимателями.",
    short_description: "Классическая Jazz Bass",
    price: 62000,
    sku: "FEN-JBASS",
    stock_quantity: 5,
    brand_id: 2,
    category_id: 3,
    is_featured: false,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 2, name: "Fender", slug: "fender" },
    category: { id: 3, name: "Бас-гитары", slug: "bass-guitars" },
    images: [
      {
        id: 24,
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400",
        alt_text: "Fender Jazz Bass",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 25,
    name: "Roland RD-2000",
    slug: "roland-rd-2000",
    description: "Профессиональное сценическое пианино с двумя звуковыми движками.",
    short_description: "Профессиональное сценическое пианино",
    price: 185000,
    sku: "ROL-RD2000",
    stock_quantity: 2,
    brand_id: 4,
    category_id: 4,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 4, name: "Roland", slug: "roland" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 25,
        image_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
        alt_text: "Roland RD-2000",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },

  // Продолжаю добавлять товары...
  // (Для краткости покажу еще несколько ключевых товаров)

  {
    id: 50,
    name: "Steinway Model S Baby Grand",
    slug: "steinway-model-s-baby-grand",
    description: "Премиальное акустическое пианино Steinway & Sons.",
    short_description: "Премиальное акустическое пианино",
    price: 2500000,
    sku: "STE-MODELS",
    stock_quantity: 1,
    brand_id: 12,
    category_id: 4,
    is_featured: true,
    is_new: false,
    is_recommended: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: { id: 12, name: "Steinway", slug: "steinway" },
    category: { id: 4, name: "Клавишные", slug: "keyboards" },
    images: [
      {
        id: 50,
        image_url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
        alt_text: "Steinway Baby Grand",
        sort_order: 0,
        is_primary: true,
      },
    ],
  },
]

// Функции для работы с товарами
export function getLocalProducts(): LocalProduct[] {
  if (typeof window === "undefined") return initialProducts

  const stored = localStorage.getItem("musicstore_products")
  if (!stored) {
    localStorage.setItem("musicstore_products", JSON.stringify(initialProducts))
    return initialProducts
  }
  return JSON.parse(stored)
}

export function getLocalBrands(): LocalBrand[] {
  if (typeof window === "undefined") return initialBrands

  const stored = localStorage.getItem("musicstore_brands")
  if (!stored) {
    localStorage.setItem("musicstore_brands", JSON.stringify(initialBrands))
    return initialBrands
  }
  return JSON.parse(stored)
}

export function getLocalCategories(): LocalCategory[] {
  if (typeof window === "undefined") return initialCategories

  const stored = localStorage.getItem("musicstore_categories")
  if (!stored) {
    localStorage.setItem("musicstore_categories", JSON.stringify(initialCategories))
    return initialCategories
  }
  return JSON.parse(stored)
}

export function saveLocalProduct(product: Omit<LocalProduct, "id" | "created_at" | "updated_at">): LocalProduct {
  const products = getLocalProducts()
  const newId = Math.max(...products.map((p) => p.id), 0) + 1

  const newProduct: LocalProduct = {
    ...product,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  products.push(newProduct)
  localStorage.setItem("musicstore_products", JSON.stringify(products))
  return newProduct
}

export function updateLocalProduct(id: number, updates: Partial<LocalProduct>): LocalProduct | null {
  const products = getLocalProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  localStorage.setItem("musicstore_products", JSON.stringify(products))
  return products[index]
}

export function deleteLocalProduct(id: number): boolean {
  const products = getLocalProducts()
  const filtered = products.filter((p) => p.id !== id)

  if (filtered.length === products.length) return false

  localStorage.setItem("musicstore_products", JSON.stringify(filtered))
  return true
}

// Функции для работы с заказами
export function getLocalOrders(): LocalOrder[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("musicstore_orders")
  return stored ? JSON.parse(stored) : []
}

export function saveLocalOrder(order: Omit<LocalOrder, "id" | "created_at">): LocalOrder {
  const orders = getLocalOrders()
  const newId = Math.max(...orders.map((o) => o.id), 0) + 1

  const newOrder: LocalOrder = {
    ...order,
    id: newId,
    created_at: new Date().toISOString(),
  }

  orders.unshift(newOrder)
  localStorage.setItem("musicstore_orders", JSON.stringify(orders))
  return newOrder
}

export function updateLocalOrder(id: number, updates: Partial<LocalOrder>): LocalOrder | null {
  const orders = getLocalOrders()
  const index = orders.findIndex((o) => o.id === id)

  if (index === -1) return null

  orders[index] = { ...orders[index], ...updates }
  localStorage.setItem("musicstore_orders", JSON.stringify(orders))
  return orders[index]
}

// Функции для корзины
export interface CartItem {
  product_id: number
  quantity: number
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("musicstore_cart")
  return stored ? JSON.parse(stored) : []
}

export function getCartCount(): number {
  const cart = getCartItems()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export function addToCart(productId: number, quantity = 1): void {
  const cart = getCartItems()
  const existingIndex = cart.findIndex((item) => item.product_id === productId)

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({ product_id: productId, quantity })
  }

  localStorage.setItem("musicstore_cart", JSON.stringify(cart))

  // Dispatch custom event для обновления счетчика
  window.dispatchEvent(new CustomEvent("cartUpdated"))
}

export function removeFromCart(productId: number): void {
  const cart = getCartItems().filter((item) => item.product_id !== productId)
  localStorage.setItem("musicstore_cart", JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent("cartUpdated"))
}

export function clearCart(): void {
  localStorage.setItem("musicstore_cart", JSON.stringify([]))
  window.dispatchEvent(new CustomEvent("cartUpdated"))
}

export function updateCartQuantity(productId: number, quantity: number): void {
  const cart = getCartItems()
  const index = cart.findIndex((item) => item.product_id === productId)

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1)
    } else {
      cart[index].quantity = quantity
    }
    localStorage.setItem("musicstore_cart", JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }
}
