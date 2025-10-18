import pg from 'pg';

const isProd = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = !!process.env.DATABASE_URL;

export const db = hasDatabaseUrl
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProd ? { rejectUnauthorized: false } : false,
    })
  : new pg.Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'mishra@2004',
      port: 5432,
      ssl: false,
    });

export const query = (text, params) => db.query(text, params);

async function init() {
  try {
    await db.query('SELECT 1');
    console.log('Connected to the database');

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(50)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        book_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        book_name VARCHAR(100)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS notes (
        notes_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        books_id INTEGER REFERENCES books(book_id),
        text TEXT,
        shipment_date DATE
      );
    `);
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

await init();
