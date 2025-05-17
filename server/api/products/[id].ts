import { getConnection } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };
  const method = event.node.req.method;
  const conn = await getConnection();

  if (method === 'GET') {
    const [rows] = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    await conn.end();
    return rows[0] || null;
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    await conn.query(
      'UPDATE products SET title=?, description=?, price=?, quantity=?, image_url=? WHERE id=?',
      [body.title, body.description, body.price, body.quantity, body.image_url, id]
    );
    await conn.end();
    return { success: true };
  }

  if (method === 'DELETE') {
    await conn.query('DELETE FROM products WHERE id = ?', [id]);
    await conn.end();
    return { success: true };
  }

  await conn.end();
  return { error: 'Метод не поддерживается' };
}); 