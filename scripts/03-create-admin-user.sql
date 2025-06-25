-- Удаляем старого администратора если есть
DELETE FROM administrators WHERE email = 'admin@musicstore.com';

-- Создаем администратора с реальным хешированным паролем
-- Пароль: admin123
INSERT INTO administrators (email, password_hash, first_name, last_name, role, permissions) VALUES
('admin@musicstore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Админ', 'Системы', 'admin', ARRAY['all'])
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
  first_name = 'Админ',
  last_name = 'Системы',
  role = 'admin',
  permissions = ARRAY['all'];

-- Создаем тестового пользователя
-- Пароль: user123
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('user@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Тест', 'Пользователь')
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS',
  first_name = 'Тест',
  last_name = 'Пользователь';
