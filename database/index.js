const { Pool } = require('pg');
require("dotenv").config();
let pool;
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // This allows self-signed certificates for local development.
    },
  });
  // Added for troubleshooting queries during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text, error });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: true } : false, // This ensures SSL in production if set.
  });
  
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        return res;
      } catch (error) {
        console.error("Production query error", { text, error });
        throw error;
      }
    },
  };
};
