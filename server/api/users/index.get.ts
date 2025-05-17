import { getConnection } from '~/server/utils/db';

export default defineEventHandler(async () => {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM users');
  await conn.end();
  return rows;
}); 