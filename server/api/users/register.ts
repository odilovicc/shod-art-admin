import { getConnection } from '~/server/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const conn = await getConnection();
  const [exists] = await conn.query('SELECT id FROM users WHERE login = ?', [body.login]);
  if (exists.length > 0) {
    await conn.end();
    return { error: 'Пользователь уже существует' };
  }
  const hash = await bcrypt.hash(body.password, 10);
  const [result] = await conn.query(
    'INSERT INTO users (login, password_hash, role, canEditProducts, canManageLogistics) VALUES (?, ?, ?, ?, ?)',
    [body.login, hash, body.role || 'worker', !!body.canEditProducts, !!body.canManageLogistics]
  );
  const userId = result.insertId;
  await conn.end();
  const token = jwt.sign({ id: userId, login: body.login, role: body.role || 'worker' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { token };
}); 