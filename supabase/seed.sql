-- Создаем тестового пользователя root
INSERT INTO auth.users (
  id,
  login,
  encrypted_password,
  login_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'root@shod-art.com',
  crypt('root123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Добавляем пользователя в таблицу users
INSERT INTO public.users (
  id,
  login,
  role,
  can_edit_products,
  can_manage_logistics,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'root@shod-art.com',
  'root',
  true,
  true,
  now(),
  now()
); 