-- Удаляем всех существующих пользователей для чистого старта
DELETE FROM administrators;
DELETE FROM users;

-- Создаем администратора с правильным хешем пароля "admin123"
INSERT INTO administrators (email, password_hash, first_name, last_name, role, permissions) VALUES
('admin@musicstore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Админ', 'Системы', 'admin', ARRAY['all']);

-- Создаем тестового пользователя с паролем "user123"  
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('user@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Тест', 'Пользователь');
