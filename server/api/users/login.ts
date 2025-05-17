import { getConnection } from '~/server/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM users WHERE login = ?', [body.login]);
  await conn.end();
  const user = rows[0];
  if (!user) {
    return { error: 'Пользователь не найден' };
  }
  const valid = await bcrypt.compare(body.password, user.password_hash);
  if (!valid) {
    return { error: 'Неверный пароль' };
  }
  const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { token };
}); 