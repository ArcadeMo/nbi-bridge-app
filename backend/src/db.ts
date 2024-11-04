import { Pool } from 'pg';
import dotenv from 'dotenv';

// Configure dotenv to read environment variables from a .env file and set them in process.env
dotenv.config();

// Create a new Pool instance for managing database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;