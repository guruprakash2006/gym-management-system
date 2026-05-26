import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {
    console.log("PostgreSQL connected ✅");
  })
  .catch((err) => {
    console.log("DB connection error ❌", err);
  });