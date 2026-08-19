require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cadastro_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
  dateStrings: true
});

// Testa a conexão ao subir a aplicação
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso.');
    conn.release();
  } catch (err) {
    console.error('❌ Falha ao conectar ao MySQL:', err.message);
  }
})();

module.exports = pool;
