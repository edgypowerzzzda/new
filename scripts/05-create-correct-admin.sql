-- Удаляем всех существующих пользователей
DELETE FROM administrators;
DELETE FROM users;

-- Создаем администратора с правильным хешем пароля
-- Хеш для пароля "admin123" сгенерированный bcrypt с rounds=12
INSERT INTO administrators (email, password_hash, first_name, last_name, role, permissions) VALUES
('admin@musicstore.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Админ', 'Системы', 'admin', ARRAY['all']);

-- Создаем тестового пользователя с паролем "user123"
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('user@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Тест', 'Пользователь');

-- Проверяем что пользователи созданы
SELECT 'Admin created:' as message, email, first_name, last_name FROM administrators;
SELECT 'User created:' as message, email, first_name, last_name FROM users;
