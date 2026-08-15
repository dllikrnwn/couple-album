import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? {} : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

export default pool;
