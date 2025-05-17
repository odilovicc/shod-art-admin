import { getConnection } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const conn = await getConnection();
  const [result] = await conn.query(
    'INSERT INTO users (login, role, canEditProducts, canManageLogistics) VALUES (?, ?, ?, ?)',
    [body.login, body.role, body.canEditProducts, body.canManageLogistics]
  );
  await conn.end();
  return { id: result.insertId };
}); 