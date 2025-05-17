import { getConnection } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const conn = await getConnection();
  await conn.query('DELETE FROM products WHERE id = ?', [id]);
  await conn.end();
  return { success: true };
}); 