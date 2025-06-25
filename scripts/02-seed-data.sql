-- Добавление брендов
INSERT INTO brands (name, description, website) VALUES
('Yamaha', 'Японский производитель музыкальных инструментов', 'https://yamaha.com'),
('Shure', 'Американская компания, специализирующаяся на аудиооборудовании', 'https://shure.com'),
('Casio', 'Японская компания, производитель электронных инструментов', 'https://casio.com'),
('Korg', 'Японский производитель электронных музыкальных инструментов', 'https://korg.com'),
('Fender', 'Американский производитель гитар и усилителей', 'https://fender.com'),
('Gibson', 'Американский производитель гитар', 'https://gibson.com')
ON CONFLICT (name) DO NOTHING;

-- Добавление категорий
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Гитары', 'guitars', NULL, 'Акустические и электрогитары'),
('Клавишные инструменты', 'keyboards', NULL, 'Пианино, синтезаторы, MIDI-клавиатуры'),
('Ударные', 'drums', NULL, 'Барабанные установки и перкуссия'),
('Микрофоны', 'microphones', NULL, 'Студийные и концертные микрофоны'),
('DJ оборудование', 'dj-equipment', NULL, 'Микшеры, проигрыватели, контроллеры'),
('Коммутация', 'cables-connectors', NULL, 'Кабели, разъемы, адаптеры')
ON CONFLICT (slug) DO NOTHING;

-- Добавление подкатегорий для гитар
INSERT INTO categories (name, slug, parent_id, description) VALUES
('Акустические гитары', 'acoustic-guitars', (SELECT id FROM categories WHERE slug = 'guitars'), 'Классические и эстрадные акустические гитары'),
('Электрогитары', 'electric-guitars', (SELECT id FROM categories WHERE slug = 'guitars'), 'Электрогитары различных типов'),
('Усилители для гитары', 'guitar-amplifiers', (SELECT id FROM categories WHERE slug = 'guitars'), 'Ламповые и транзисторные усилители')
ON CONFLICT (slug) DO NOTHING;

-- Добавление примеров товаров
INSERT INTO products (name, slug, description, price, brand_id, category_id, sku, stock_quantity, is_featured, is_new) VALUES
(
  'Yamaha FG830 Акустическая гитара',
  'yamaha-fg830-acoustic-guitar',
  'Превосходная акустическая гитара с верхней декой из массива ели и корпусом из розового дерева',
  25000.00,
  (SELECT id FROM brands WHERE name = 'Yamaha'),
  (SELECT id FROM categories WHERE slug = 'acoustic-guitars'),
  'YAM-FG830',
  15,
  true,
  false
),
(
  'Fender Player Stratocaster',
  'fender-player-stratocaster',
  'Классическая электрогитара с тремя звукоснимателями и кленовым грифом',
  65000.00,
  (SELECT id FROM brands WHERE name = 'Fender'),
  (SELECT id FROM categories WHERE slug = 'electric-guitars'),
  'FEN-PLSTR',
  8,
  true,
  true
),
(
  'Shure SM58 Динамический микрофон',
  'shure-sm58-dynamic-microphone',
  'Легендарный вокальный микрофон для живых выступлений',
  12000.00,
  (SELECT id FROM brands WHERE name = 'Shure'),
  (SELECT id FROM categories WHERE slug = 'microphones'),
  'SHU-SM58',
  25,
  false,
  false
),
(
  'Casio CT-X700 Синтезатор',
  'casio-ctx700-synthesizer',
  'Портативный синтезатор с 61 клавишей и множеством встроенных звуков',
  18000.00,
  (SELECT id FROM brands WHERE name = 'Casio'),
  (SELECT id FROM categories WHERE slug = 'keyboards'),
  'CAS-CTX700',
  12,
  false,
  true
)
ON CONFLICT (slug) DO NOTHING;
