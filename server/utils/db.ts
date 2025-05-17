import mysql from 'mysql2/promise';

export function getConnection() {
  return mysql.createConnection({
    host: 'uz01.ahost.uz',
    port: 3306,
    user: 'shodart1_root',
    password: 'ASDASD123123',
    database: 'shodart1_db',
  });
} 