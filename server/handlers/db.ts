import { configDotenv } from "dotenv";
import { Pool } from "pg";

configDotenv();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export const query = async (text: string, params: string[]) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error occured while querying on DB: ", error?.message);
    throw error;
  }
}
