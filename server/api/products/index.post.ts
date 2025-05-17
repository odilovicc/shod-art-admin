import { getConnection } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const conn = await getConnection();
  const [result] = await conn.query(
    'INSERT INTO products (title, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)',
    [body.title, body.description, body.price, body.quantity, body.image_url]
  );
  await conn.end();
  return { id: result.insertId };
}); 