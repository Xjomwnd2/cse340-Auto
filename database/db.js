const { Pool } = require('pg');

// Configure the pool with your database connection details
const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'cse340mn_stxh',    // Replace with your PostgreSQL username
  password: 'https://api.render.com/deploy/srv-csei81lsvqrc73f46uv0?key=zrqNkhKYUYY', // Replace with your PostgreSQL password
  database: 'cse340mn_stxh', // Replace with your database name
  max: 10,                   // Optional: Max number of connections
  idleTimeoutMillis: 30000,  // Optional: Idle timeout for connections
});

// Export the pool to use it in other parts of your app
module.exports = pool;