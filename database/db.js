const { Pool } = require('pg');

// Configure the pool with your database connection details
const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'cse340',    // Replace with your PostgreSQL username
  password: 'ZqP0SdTeyiDLv8LLicE181LkUwAaqoe9', // Replace with your PostgreSQL password
  database: 'cse340mn_stxh', // Replace with your database name
  max: 10,                   // Optional: Max number of connections
  idleTimeoutMillis: 30000,  // Optional: Idle timeout for connections
});

// Export the pool to use it in other parts of your app
module.exports = pool;