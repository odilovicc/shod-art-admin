import { getConnection } from '~/server/utils/db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization');
  if (!auth) return { error: 'Нет токена' };
  try {
    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    const conn = await getConnection();
    const [rows] = await conn.query(
      'SELECT id, login, role, canEditProducts, canManageLogistics, created_at, updated_at FROM users WHERE id = ?',
      [payload.id]
    );
    await conn.end();
    if (!rows[0]) return { error: 'Пользователь не найден' };
    return rows[0];
  } catch (e) {
    return { error: 'Неверный токен' };
  }
}); 